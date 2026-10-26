import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { MedicationProvider } from './context/MedicationContext';
import { applyTextSize, getSavedTextSize } from './utils/textSize';


applyTextSize(getSavedTextSize());
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MedicationProvider>
        <App />
      </MedicationProvider>
    </BrowserRouter>
  </StrictMode>
);