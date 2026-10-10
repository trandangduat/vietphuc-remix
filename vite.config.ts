import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function devSaveAlignmentsPlugin(): Plugin {
  return {
    name: 'dev-save-alignments',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/dev/save-alignments', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const alignments = parsed.alignments || parsed;

              if (!alignments || typeof alignments !== 'object') {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, message: 'Dữ liệu alignments không hợp lệ' }));
                return;
              }

              const filePath = path.resolve(process.cwd(), 'src/data/pieceAlignments.ts');
              let content = fs.readFileSync(filePath, 'utf-8');
              const regex = /export const DEFAULT_PIECE_ALIGNMENTS: AlignmentMap = \{[\s\S]*?\n\};/;

              if (!regex.test(content)) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    success: false,
                    message: 'Không tìm thấy block DEFAULT_PIECE_ALIGNMENTS trong src/data/pieceAlignments.ts',
                  })
                );
                return;
              }

              const entries = Object.entries(alignments)
                .filter(([id]) => /^[a-zA-Z0-9_\-\.]+$/.test(id))
                .map(([id, val]: [string, any]) => {
                  const x = Number(Number(val?.x || 0).toFixed(2));
                  const y = Number(Number(val?.y || 0).toFixed(2));
                  const scale = Number(Number(val?.scale || 1).toFixed(3));
                  const scaleX = Number(Number(val?.scaleX || 1).toFixed(3));
                  const scaleY = Number(Number(val?.scaleY || 1).toFixed(3));
                  const rotate = Number(Number(val?.rotate || 0).toFixed(1));
                  return `  '${id}': {\n    x: ${x},\n    y: ${y},\n    scale: ${scale},\n    scaleX: ${scaleX},\n    scaleY: ${scaleY},\n    rotate: ${rotate},\n  },`;
                });

              const replacement = `export const DEFAULT_PIECE_ALIGNMENTS: AlignmentMap = {\n${entries.join('\n')}\n};`;
              content = content.replace(regex, replacement);
              fs.writeFileSync(filePath, content, 'utf-8');

              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  savedToFile: true,
                  message: 'Đã tự động ghi cấu hình tọa độ vào src/data/pieceAlignments.ts thành công!',
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, message: err.message || 'Lỗi server khi ghi file' }));
            }
          });
        } else {
          next();
        }
      });
    },
  };
}

function devPollinationsProxyPlugin(): Plugin {
  return {
    name: 'dev-pollinations-proxy',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/pollinations-proxy', async (req, res, next) => {
        try {
          const urlObj = new URL(req.url || '', 'http://localhost:3000');
          const targetUrl = urlObj.searchParams.get('url');
          if (!targetUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Missing target url parameter' }));
            return;
          }

          const response = await fetch(targetUrl, {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            },
          });

          res.statusCode = response.status;
          res.setHeader('Content-Type', response.headers.get('content-type') || 'image/jpeg');
          res.setHeader('Access-Control-Allow-Origin', '*');

          if (!response.ok) {
            const errText = await response.text();
            res.end(errText);
            return;
          }

          const arrayBuffer = await response.arrayBuffer();
          res.end(Buffer.from(arrayBuffer));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Internal Proxy Error' }));
        }
      });
    },
  };
}

function devGroqAppraisePlugin(): Plugin {
  return {
    name: 'dev-groq-appraise',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api/appraise', (req, res, next) => {
        if (req.method !== 'POST') {
          next();
          return;
        }

        const chunks: Buffer[] = [];
        let size = 0;
        let rejected = false;

        req.on('data', (chunk: Buffer) => {
          size += chunk.length;
          if (size > 2_000_000) {
            rejected = true;
            res.statusCode = 413;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'payload_too_large' }));
            req.destroy();
            return;
          }
          chunks.push(chunk);
        });

        req.on('end', async () => {
          if (rejected) return;
          try {
            const env = loadEnv(server.config.mode, server.config.envDir, '');
            const apiKey = (env.GROQ_API_KEY || '').trim();
            const model = (env.GROQ_MODEL || 'qwen/qwen3.8-27b').trim();
            if (!apiKey) {
              res.statusCode = 503;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'missing_key' }));
              return;
            }

            const payload = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
            payload.model = model;
            const upstream = await fetch('https://api.groq.com/openai/v1/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
              },
              body: JSON.stringify(payload),
            });
            const text = await upstream.text();
            if (!upstream.ok) {
              console.warn('[appraise]', upstream.status, text.slice(0, 240));
            }
            res.statusCode = upstream.status;
            res.setHeader('Content-Type', 'application/json');
            res.end(text);
          } catch (err: any) {
            if (res.writableEnded) return;
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err?.message || 'groq_proxy_failed' }));
          }
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), devSaveAlignmentsPlugin(), devPollinationsProxyPlugin(), devGroqAppraisePlugin()],
  server: {
    port: 3000,
    open: false,
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        calibrator: path.resolve(__dirname, 'calibrator.html'),
      },
    },
  },
});

