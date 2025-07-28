import './globals.css'
import { Inter } from 'next/font/google'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import AuthProvider from '@/components/AuthProvider'

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
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider session={session}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
} 