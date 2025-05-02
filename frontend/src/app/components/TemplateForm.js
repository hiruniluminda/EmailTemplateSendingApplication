import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { templateService } from '../services/api';
import { Envelope, FileText, Save, X, ArrowLeft } from 'react-bootstrap-icons';

const TemplateForm = ({ templateId }) => {
  const router = useRouter();
  const [template, setTemplate] = useState({
    name: '',
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const isEditMode = !!templateId;

  useEffect(() => {
    if (isEditMode) {
      fetchTemplate();
    }
  }, [templateId]);

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await templateService.getTemplateById(templateId);
      setTemplate(response.data);
    } catch (err) {
      setError('Failed to load template. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplate({ ...template, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditMode) {
        await templateService.updateTemplate(templateId, template);
      } else {
        await templateService.createTemplate(template);
      }
      setSuccess(true);
      setTimeout(() => {
        router.push('/templates');
      }, 1500);
    } catch (err) {
      setError('Failed to save template. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-grow text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow border-0 rounded-lg">
      <div className="card-header bg-gradient bg-black text-white py-3">
        <div className="d-flex align-items-center">
          <FileText size={24} className="me-2" />
          <h3 className="mb-0 fw-bold">
            {isEditMode ? 'Edit Template' : 'Create New Template'}
          </h3>
        </div>
      </div>
      <div className="card-body p-4">
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            <div className="me-2">
              <X size={24} />
            </div>
            <div>{error}</div>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success d-flex align-items-center" role="alert">
            <div className="me-2">
              <Save size={24} />
            </div>
            <div>
              Template successfully {isEditMode ? 'updated' : 'created'}!
              <div className="spinner-border spinner-border-sm ms-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-2">Redirecting...</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="form-label fw-bold">
              <FileText size={18} className="me-2" />
              Template Name
            </label>
            <input
              type="text"
              className="form-control form-control-lg border-primary-subtle"
              id="name"
              name="name"
              value={template.name}
              onChange={handleChange}
              placeholder="Enter template name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="subject" className="form-label fw-bold">
              <Envelope size={18} className="me-2" />
              Email Subject
            </label>
            <input
              type="text"
              className="form-control form-control-lg border-primary-subtle"
              id="subject"
              name="subject"
              value={template.subject}
              onChange={handleChange}
              placeholder="Enter email subject line"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="content" className="form-label fw-bold">
              <FileText size={18} className="me-2" />
              Email Content
            </label>
            <div className="content-editor-wrapper position-relative mb-2">
              <textarea
                className="form-control border-primary-subtle"
                id="content"
                name="content"
                rows="12"
                value={template.content}
                onChange={handleChange}
                placeholder="Compose your email template here..."
                required
              ></textarea>
            </div>
            
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            <button 
              type="button" 
              className="btn btn-outline-secondary btn-lg d-flex align-items-center"
              onClick={() => router.push('/templates')}
            >
              <ArrowLeft className="me-2" />
              Back to Templates
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg px-4 d-flex align-items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="me-2" />
                  {isEditMode ? 'Update Template' : 'Create Template'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="card-footer bg-light py-3 text-center text-muted">
        <small>
          Templates are saved automatically to your account and can be used across all campaigns
        </small>
      </div>
    </div>
  );
};

export default TemplateForm;