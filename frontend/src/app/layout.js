import '../app/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ClientWrapper from './ClientWrapper';

export const metadata = {
  title: 'EmailTemplater - Professional Email Template System',
  description: 'Create, manage, and send professional email templates to multiple recipients with ease.',
  keywords: 'email templates, email marketing, email automation, email template system',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="d-flex flex-column min-vh-100 bg-dark">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}