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
    <div className="card h-100">
      <div className="card-body">
        <h5 className="card-title">{template.name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Subject: {template.subject}
        </h6>
        <p className="card-text small text-truncate">
          {template.content.substring(0, 100)}...
        </p>
        <div className="small text-muted mb-3">
          Created: {formatDate(template.createdAt)}
          {template.updatedAt && (
            <span> | Updated: {formatDate(template.updatedAt)}</span>
          )}
        </div>
      </div>
      <div className="card-footer bg-transparent">
        <div className="d-flex justify-content-between">
          <Link href={`/templates/${template.id}`} className="btn btn-sm btn-outline-primary">
            Edit
          </Link>
          <Link href={`/templates/send/${template.id}`} className="btn btn-sm btn-success">
            Send
          </Link>
          <button
            onClick={() => onDelete(template.id)}
            className="btn btn-sm btn-outline-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;