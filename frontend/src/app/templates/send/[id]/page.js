'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import Layout from '../../../components/Layout';
import EmailSender from '../../../components/EmailSender';
import { authService } from '../../../services/auth';

export default function SendTemplate() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, []);

  if (!id) {
    return (
      <Layout>
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-4">
        <h1>Send Email Template</h1>
      </div>
      <EmailSender templateId={id} />
    </Layout>
  );
}