import React from 'react';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="text-center">
      <img
        src="https://static-00.iconduck.com/assets.00/404-page-not-found-illustration-2048x998-yjzeuy4v.png"
        alt=""
        style={{ width: '90%', height: '90%' }}
      />
      <Link className="mt-2 d-block" to="/">
        <i className="fas fa-arrow-left me-1"></i>
        Return to Dashboard
      </Link>
    </div>
  );
};

export default PageNotFound;
