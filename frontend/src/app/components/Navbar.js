'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '../services/auth';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status when component mounts
    setIsLoggedIn(authService.isAuthenticated());
  }, []);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    router.push('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Email Templates
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link href="/templates" className="nav-link">
                    My Templates
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/templates/new" className="nav-link">
                    Create Template
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {isLoggedIn ? (
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link btn btn-link">
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link href="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/register" className="nav-link">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;