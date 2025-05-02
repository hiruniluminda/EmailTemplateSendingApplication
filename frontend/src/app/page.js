'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Layout from '../app/components/Layout';
import { authService } from '../app/services/auth';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authStatus = authService.isAuthenticated();
    setIsAuthenticated(authStatus);
    setIsLoading(false);

    if (authStatus) {
      router.push('/templates');
    }
  }, []);

  if (isLoading) {
    return <div className="text-center p-5"><span className="spinner-border text-primary"></span></div>;
  }

  return (
    <Layout>
      <div className="bg-dark text-white py-5 mb-5">
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h1 className="display-3 fw-bold mb-4" data-aos="fade-up">Email Template System</h1>
              <p className="lead fs-4 mb-5" data-aos="fade-up" data-aos-delay="100">
                Create, manage and send email templates to multiple recipients with ease.
                Streamline your email communications with our powerful template system.
              </p>
              <div className="d-grid gap-3 d-sm-flex justify-content-sm-center mb-4" data-aos="fade-up" data-aos-delay="200">
                {!isAuthenticated ? (
                  <>
                    <Link href="/login" passHref>
                      <Button variant="light" size="lg" className="px-4 py-2 shadow-sm">
                        Login
                      </Button>
                    </Link>
                    <Link href="/register" passHref>
                      <Button variant="outline-light" size="lg" className="px-4 py-2">
                        Register
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/templates" passHref>
                    <Button variant="light" size="lg" className="px-4 py-2 shadow-sm">
                      My Templates
                    </Button>
                  </Link>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  );
}