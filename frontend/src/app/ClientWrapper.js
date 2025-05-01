'use client';

import { Suspense, useEffect } from 'react';

export default function ClientWrapper({ children }) {
  useEffect(() => {
    // You can add custom client-side logic here
    console.log('Client-side loaded');
  }, []);

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        {children}
      </Suspense>

      {/* Load Bootstrap JS */}
      <script
        async
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4"
        crossOrigin="anonymous"
      />
    </>
  );
}
