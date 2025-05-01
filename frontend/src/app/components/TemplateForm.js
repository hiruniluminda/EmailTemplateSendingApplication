import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { templateService } from '../services/api';

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
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <h3>{isEditMode ? 'Edit Template' : 'Create New Template'}</h3>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        {success && (
          <div className="alert alert-success">
            Template successfully {isEditMode ? 'updated' : 'created'}! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Template Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={template.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="subject" className="form-label">
              Email Subject
            </label>
            <input
              type="text"
              className="form-control"
              id="subject"
              name="subject"
              value={template.subject}
              onChange={handleChange}
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
              name="content"
              rows="10"
              value={template.content}
              onChange={handleChange}
              required
            ></textarea>
            <small className="form-text text-muted">
              You can use variables like {'{name}'}, {'{company}'}, etc. in your template.
            </small>
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
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : (
                isEditMode ? 'Update Template' : 'Create Template'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateForm;