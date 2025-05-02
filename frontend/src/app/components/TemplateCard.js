import React from 'react';
import Link from 'next/link';

const TemplateCard = ({ template, onDelete }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="card shadow-sm mb-4 border-0 bg-black">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title text-primary mb-0">{template.name}</h5>
          <span className="badge bg-light text-secondary">
            <i className="bi bi-calendar-date me-1"></i>
            {formatDate(template.createdAt)}
            {template.updatedAt && (
              <span className="ms-1">
                <i className="bi bi-pencil-square ms-2 me-1"></i>
                {formatDate(template.updatedAt)}
              </span>
            )}
          </span>
        </div>
        
        <h6 className="card-subtitle mb-2 text-light">
          <i className="bi bi-envelope me-1"></i>
          Subject: {template.subject}
        </h6>
        
        <p className="card-text mt-3 mb-3 text-light">
          {template.content.substring(0, 100)}
          {template.content.length > 100 && (
            <span className="text-light">...</span>
          )}
        </p>
        
        <div className="d-flex justify-content-end mt-3">
          <div className="btn-group" role="group">
            <Link href={`/templates/${template.id}`} className="btn btn-warning">
              <i className="bi bi-pencil me-1"></i>
              Edit
            </Link>
            <Link href={`/templates/send/${template.id}`} className="btn btn-success">
              <i className="bi bi-send me-1"></i>
              Send
            </Link>
            <button
              onClick={() => onDelete(template.id)}
              className="btn btn-danger"
              aria-label="Delete template"
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;