import React from "react"
import "./globals.css"
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""></link>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400&display=swap" rel="stylesheet"></link>
      </head>
      <body>
        <div className="flex justify-center">
          <div className="artboard artboard-horizontal phone-4 mt-10">{children}</div>
        </div>
        <Analytics />
      </body>
    </html>
  )
}