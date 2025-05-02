import React, { useState, useEffect } from 'react';
import { templateService } from '../services/api';
import TemplateCard from './TemplateCard';
import { Search, PlusCircle, RefreshCw } from 'lucide-react';
import Link from 'next/link';

const TemplateList = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [filteredCount, setFilteredCount] = useState(0);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await templateService.getAllTemplates();
      setTemplates(response.data);
      setFilteredCount(response.data.length);
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
        setFilteredCount(response.data.length);
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
        setFilteredCount(filteredCount - 1);
      } catch (err) {
        setError('Failed to delete template');
        console.error(err);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container py-1">
      <div className="row mb-4">
        <div className="col-md-8">
          <h2 className="text-primary fw-bold mb-0">Template Library</h2>
          <p className="text-light">Browse, search and manage your templates</p>
        </div>
        <div className="col-md-4 text-md-end">
          <Link href="/templates/new" className="btn btn-primary">
            <PlusCircle className="me-2" size={18} />
            Create Template
          </Link>
        </div>
      </div>

      <div className="card shadow-sm mb-4 bg-black bg-gradient">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-8">
              <div className="input-group">
                <span className="input-group-text bg-secondary border-0">
                  <Search size={18} />
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-secondary bg-gradient"
                  placeholder="Search templates by name, category or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  className="btn btn-primary" 
                  type="button" 
                  onClick={handleSearch}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="col-md-4 text-md-end">
              <button
                className="btn btn-outline-secondary"
                onClick={fetchTemplates}
                disabled={loading}
              >
                <RefreshCw 
                  size={18} 
                  className={`me-1 ${loading ? "animate-spin" : ""}`} 
                />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <div>{error}</div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading templates...</p>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-5 bg-black bg-gradient rounded-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" className="bi bi-file-earmark-text text-secondary mb-3" viewBox="0 0 16 16">
            <path d="M5.5 7a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zM5 9.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z"/>
            <path d="M9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.5L9.5 0zm0 1v2A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
          </svg>
          <h4>No templates found</h4>
          <p className="text-muted">Create your first template to get started</p>
          <a href="/templates/new" className="btn btn-primary mt-2">
            <PlusCircle className="me-2" size={18} />
            Create Template
          </a>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <p className="text-light mb-0">Showing {templates.length} template{templates.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {templates.map((template) => (
              <div className="col" key={template.id}>
                <TemplateCard 
                  template={template} 
                  onDelete={() => handleDelete(template.id)} 
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateList;