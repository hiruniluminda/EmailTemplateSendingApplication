'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../app/components/Layout';
import { authService } from '../app/services/auth';

export default function Home() {
  const router = useRouter();
  const isAuthenticated = authService.isAuthenticated();

  useEffect(() => {
    // If user is already logged in, redirect to templates page
    if (isAuthenticated) {
      router.push('/templates');
    }
  }, []);

  return (
    <Layout>
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h1 className="display-4 mb-4">Email Template System</h1>
            <p className="lead mb-4">
              Create, manage, and send email templates to multiple recipients with ease.
              Streamline your email communications with our simple template system.
            </p>
            <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mb-5">
              {!isAuthenticated ? (
                <>
                  <Link href="/login" className="btn btn-primary btn-lg px-4">
                    Login
                  </Link>
                  <Link href="/register" className="btn btn-outline-secondary btn-lg px-4">
                    Register
                  </Link>
                </>
              ) : (
                <Link href="/templates" className="btn btn-primary btn-lg px-4">
                  My Templates
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Create Templates</h3>
                <p className="card-text">
                  Design email templates with customizable variables for personalized messaging.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Manage Library</h3>
                <p className="card-text">
                  Organize and manage your template library with easy editing and deletion.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <h3 className="card-title">Send to Multiple</h3>
                <p className="card-text">
                  Send your templates to multiple recipients at once with a simple interface.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}