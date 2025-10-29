import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Members',
  description: 'Hutterite Colony Directory',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="MobileOptimized" content="width" />
        <meta name="HandheldFriendly" content="true" />
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="bg-gray-50">
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}