// 🚫 No 'use client'
import '../app/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientWrapper from './ClientWrapper'; // Client component for useEffect or JS logic

export const metadata = {
  title: 'Email Template System',
  description: 'Create and send email templates',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
