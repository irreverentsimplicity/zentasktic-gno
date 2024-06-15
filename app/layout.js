import './globals.css'
import { Inter } from 'next/font/google'
import { Providers } from './providers/ChakraProvider';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ZenTasktic on Gno',
  description: 'UI for the gno implementation of ZenTasktic',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  )
}
