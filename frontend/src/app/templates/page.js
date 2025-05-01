'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../components/Layout';
import TemplateList from '../components/TemplateList';
import Link from 'next/link';
import { authService } from '../services/auth';

export default function Templates() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, []);

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Templates</h1>
        <Link href="/templates/new" className="btn btn-primary">
          Create New Template
        </Link>
      </div>
      <TemplateList />
    </Layout>
  );
}