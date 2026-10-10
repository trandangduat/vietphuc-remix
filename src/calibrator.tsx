import React from 'react';
import ReactDOM from 'react-dom/client';
import { DevCalibratorScreen } from './screens/DevCalibratorScreen';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="min-h-screen bg-[#000000] text-[#f5f5f7]">
      <DevCalibratorScreen />
    </div>
  </React.StrictMode>
);
