'use client';

import { Suspense, useEffect } from 'react';

export default function ClientWrapper({ children }) {
  useEffect(() => {
    console.log('Client-side loaded');
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>
    </>
  );
}
