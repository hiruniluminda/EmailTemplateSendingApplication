'use client';

import React, { useEffect } from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;