import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { SupabaseProvider } from './context/SupabaseProvider'
import { Toaster } from 'react-hot-toast'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')

createRoot(rootElement).render(
	<StrictMode>
		<SupabaseProvider>
			<App />
			<Toaster position='top-right' />
		</SupabaseProvider>
	</StrictMode>
)
