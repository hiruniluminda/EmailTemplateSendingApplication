'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '../../components/Layout';
import TemplateForm from '../../components/TemplateForm';
import { authService } from '../../services/auth';

export default function NewTemplate() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      router.push('/login');
    }
  }, []);

  return (
    <Layout>
      <div className="mb-4">
        <h1>Create New Template</h1>
      </div>
      <TemplateForm />
    </Layout>
  );
}