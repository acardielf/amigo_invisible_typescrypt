import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './locales/i18n'
import App from './App.tsx'
import { initializeEmailJS } from './utils/emailService'
import { useSecretSantaStore } from './stores/useSecretSantaStore'

const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
}

if (emailConfig.publicKey) {
  initializeEmailJS(emailConfig.publicKey)
  useSecretSantaStore.getState().setEmailConfig(emailConfig)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
