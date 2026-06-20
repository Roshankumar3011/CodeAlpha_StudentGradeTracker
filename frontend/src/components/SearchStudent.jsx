import React, { useState } from 'react';
import axios from 'axios';
import LoadingSpinner from './LoadingSpinner';

/**
 * SearchStudent component to perform specific individual student lookups by ID.
 */
export default function SearchStudent({ onAddToast }) {
  const [searchId, setSearchId] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) {
      onAddToast('Please enter a Student ID.', 'error');
      return;
    }

    setLoading(true);
    setSearched(true);
    setStudent(null);

    try {
      const response = await axios.get(`http://localhost:8080/api/students/${searchId.trim()}`);
      setStudent(response.data);
      onAddToast('Student record found!', 'success');
    } catch (err) {
      if (err.response && err.response.status === 404) {
        onAddToast(`No student found with ID '${searchId.trim()}'`, 'error');
      } else {
        onAddToast('Error fetching student record. Make sure backend is running.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-student-view">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Student Record Lookup</h1>
        <p style={{ color: 'var(--text-muted)' }}>Query the backend database for a specific student's report card.</p>
      </div>

      {/* Query Form */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ margin: 0, flex: 1, minWidth: '240px' }}>
            <label className="form-label">Query Student ID</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter exact ID (e.g. S101)"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ height: '48px' }} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Search Database
          </button>
        </form>
      </div>

      {/* Results Container */}
      {loading && <LoadingSpinner />}

      {!loading && searched && student && (
        <div style={{
          background: 'radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.1) 0%, rgba(17, 24, 39, 0.8) 60%)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-glow-cyan)',
          maxWidth: '550px',
          margin: '0 auto',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Report Card</span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>{student.studentName}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.1rem' }}>ID: <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{student.studentId}</span></p>
            </div>
            <div className={`badge badge-${student.grade.toLowerCase()}`} style={{ fontSize: '1.25rem', padding: '0.5rem 1rem', borderRadius: '10px' }}>
              Grade {student.grade}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Radial score gauge */}
            <div style={{ position: 'relative', width: '120px', height: '120px' }}>
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="transparent" 
                  stroke="var(--primary)" 
                  strokeWidth="8" 
                  strokeDasharray="314.16"
                  strokeDashoffset={314.16 - (314.16 * student.marks) / 100}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  style={{ transition: 'stroke-dashoffset 1s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '120px', height: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>{student.marks.toFixed(1)}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Score (%)</span>
              </div>
            </div>

            {/* Performance status details */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status</span>
                <span style={{ fontWeight: 600, color: student.marks >= 60.0 ? 'var(--success)' : 'var(--error)' }}>
                  {student.marks >= 60.0 ? 'Passed' : 'Failed'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Performance Rating</span>
                <span style={{ fontWeight: 600 }}>
                  {student.marks >= 90.0 ? 'Excellent' : student.marks >= 80.0 ? 'Very Good' : student.marks >= 70.0 ? 'Good' : student.marks >= 60.0 ? 'Satisfactory' : 'Needs Improvement'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {!loading && searched && !student && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          borderRadius: '16px',
          padding: '2.5rem',
          textAlign: 'center',
          maxWidth: '500px',
          margin: '0 auto',
          animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem' }}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Record Not Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>We searched the database but could not find a student registered with ID <strong>"{searchId}"</strong>. Double check the spelling or format and try again.</p>
        </div>
      )}
    </div>
  );
}
