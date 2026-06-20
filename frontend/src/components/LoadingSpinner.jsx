import React from 'react';

/**
 * LoadingSpinner component to indicate asynchronous server requests.
 */
export default function LoadingSpinner() {
  return (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  );
}
