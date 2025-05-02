import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { templateService } from '../services/api';

const EmailSender = ({ templateId }) => {
  const router = useRouter();
  const [template, setTemplate] = useState(null);
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingTemplate, setFetchingTemplate] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (templateId) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setFetchingTemplate(true);
      setError(null);
      
      // Use the getTemplateWithFallback method to try both services
      const response = await templateService.getTemplateWithFallback(templateId);
      
      if (response && response.data) {
        setTemplate(response.data);
        setSubject(response.data.subject || '');
        setContent(response.data.content || '');
      } else {
        throw new Error('Template data not found');
      }
    } catch (err) {
      console.error('Error fetching template:', err);
      setError(`Failed to load template: ${err.response?.data?.message || err.message}`);
    } finally {
      setFetchingTemplate(false);
    }
  };

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!recipients.trim()) {
      setError('Please enter at least one recipient email address');
      return;
    }

    // Split recipient emails by comma and trim whitespace
    const recipientList = recipients.split(',').map(email => email.trim()).filter(email => email);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = recipientList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      setError(`Invalid email addresses: ${invalidEmails.join(', ')}`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create email data object
      const emailData = {
        recipients: recipientList,
        subject,
        content
      };
      
      console.log('Sending email with data:', emailData);
      
      // Send actual API request to send emails
      const response = await templateService.sendEmail(templateId, emailData);
      
      console.log('Email send response:', response);
      
      if (response.data && (response.data.success || response.status === 200)) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/templates');
        }, 2000);
      } else {
        setError(response.data?.message || 'Failed to send emails');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      setError(err.response?.data?.message || 'Failed to send emails. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingTemplate) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="alert alert-danger">
        <h4>Template not found</h4>
        <p>The template with ID {templateId} could not be found.</p>
        <hr />
        <p className="mb-0">Please check the following:</p>
        <ul>
          <li>Ensure the template exists in the database</li>
          <li>Verify that your authentication token is valid</li>
          <li>Check that both services are running properly</li>
        </ul>
        <div className="mt-3">
          <button 
            className="btn btn-primary me-2" 
            onClick={fetchTemplate}
          >
            Retry
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => router.push('/templates')}
          >
            Back to Templates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header bg-dark border-0 text-light">
        <h3>Send Email Template: {template.name}</h3>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Emails sent successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSendEmail}>
          <div className="mb-3">
            <label htmlFor="recipients" className="form-label">
              Recipients (comma separated)
            </label>
            <textarea
              className="form-control"
              id="recipients"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
              placeholder="example1@email.com, example2@email.com"
              rows="3"
              required
            ></textarea>
            <small className="form-text text-muted">
              Enter multiple email addresses separated by commas
            </small>
          </div>

          <div className="mb-3">
            <label htmlFor="subject" className="form-label">
              Email Subject
            </label>
            <input
              type="text"
              className="form-control"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              Email Content
            </label>
            <textarea
              className="form-control"
              id="content"
              rows="10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => router.push('/templates')}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                'Send Emails'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailSender;