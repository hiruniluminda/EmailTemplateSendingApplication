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
      
      <TemplateList />
    </Layout>
  );
}