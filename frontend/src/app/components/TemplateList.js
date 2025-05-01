import React, { useState, useEffect } from 'react';
import { templateService } from '../services/api';
import TemplateCard from './TemplateCard';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateService.getAllTemplates();
      setTemplates(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load templates. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if (searchTerm.trim() === '') {
        await fetchTemplates();
      } else {
        const response = await templateService.searchTemplates(searchTerm);
        setTemplates(response.data);
      }
      setError(null);
    } catch (err) {
      setError('Error searching templates');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      try {
        await templateService.deleteTemplate(id);
        setTemplates(templates.filter(template => template.id !== id));
      } catch (err) {
        setError('Failed to delete template');
        console.error(err);
      }
    }
  };

  return (
    <div className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Email Templates</h2>
        <div className="d-flex">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-primary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : templates.length === 0 ? (
        <div className="alert alert-info">
          No templates found. Create your first template!
        </div>
      ) : (
        <div className="row">
          {templates.map((template) => (
            <div className="col-md-4 mb-4" key={template.id}>
              <TemplateCard template={template} onDelete={handleDelete} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplateList;