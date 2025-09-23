import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker, requestNotificationPermission } from './utils/serviceWorker'

// Register service worker for offline functionality
registerServiceWorker();

// Request notification permission for emergency alerts
requestNotificationPermission();

createRoot(document.getElementById("root")!).render(<App />);
