import './globals.css'
import { Inter } from 'next/font/google'
import { supabaseAdmin } from '@/lib/supabase'
import AuthProvider from '@/components/AuthProvider'
import PerformanceMonitor from '@/components/PerformanceMonitor'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ContentSync - AI-Powered Content Repurposing',
  description: 'Sync and repurpose your content across all platforms with AI',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: { session } } = await supabaseAdmin.auth.getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <PerformanceMonitor />
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 