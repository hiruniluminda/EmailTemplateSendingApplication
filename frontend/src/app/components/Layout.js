'use client';

import React, { useEffect } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    
    <html lang="en">
          <head>
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          </head>
          <body className="bg-dark text-light">
          <Navbar />
      <div className="container mt-4">
        <main>{children}</main>
      </div>
          </body>
        </html>
  );
};

export default Layout;