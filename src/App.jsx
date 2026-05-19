import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from './components/ui/sonner'
import AppRoutes from './router/AppRoutes'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <AppRoutes />
          <Toaster position="top-center" />
          <Analytics />
          <SpeedInsights />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
