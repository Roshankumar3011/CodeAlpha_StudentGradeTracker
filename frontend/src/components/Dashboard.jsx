import React from 'react';

/**
 * Dashboard component displaying the statistics overview.
 */
export default function Dashboard({ report, onNavigateToTab, onOpenAddModal }) {
  const {
    totalStudents = 0,
    averageMarks = 0.0,
    highestMarks = 0.0,
    lowestMarks = 0.0,
    passRate = 0.0,
    passCount = 0,
    failCount = 0
  } = report || {};

  return (
    <div className="dashboard-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Classroom statistics and quick management utilities.</p>
        </div>
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Student
        </button>
      </div>

      {/* Metrics Cards Grid */}
      <div className="metrics-grid">
        {/* Total Students Card */}
        <div className="metric-card cyan">
          <div className="metric-header">
            <span className="metric-title">Total Students</span>
            <div className="metric-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="metric-value">{totalStudents}</div>
          <div className="metric-footer">
            Active class size
          </div>
        </div>

        {/* Class Average Marks Card */}
        <div className="metric-card purple">
          <div className="metric-header">
            <span className="metric-title">Average Marks</span>
            <div className="metric-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="6" x2="12" y2="12" />
                <line x1="12" y1="12" x2="16" y2="14" />
              </svg>
            </div>
          </div>
          <div className="metric-value">{averageMarks.toFixed(1)}%</div>
          <div className="metric-footer">
            Overall class score
          </div>
        </div>

        {/* Overall Pass Rate Card */}
        <div className="metric-card emerald">
          <div className="metric-header">
            <span className="metric-title">Overall Pass Rate</span>
            <div className="metric-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
          </div>
          <div className="metric-value">{passRate.toFixed(1)}%</div>
          <div className="metric-footer">
            Passed: <span>{passCount}</span> | Failed: <span>{failCount}</span>
          </div>
        </div>

        {/* Highest Marks Card */}
        <div className="metric-card cyan">
          <div className="metric-header">
            <span className="metric-title">Highest Score</span>
            <div className="metric-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                <path d="M4 22h16" />
                <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
              </svg>
            </div>
          </div>
          <div className="metric-value">{highestMarks.toFixed(1)}%</div>
          <div className="metric-footer">
            Class top scorer peak
          </div>
        </div>
      </div>

      {/* Quick Navigation Area */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '1.75rem', marginTop: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '1rem' }}>Quick Actions</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary" onClick={() => onNavigateToTab('list')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
              <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
            </svg>
            Manage Records
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigateToTab('report')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
              <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            View Charts
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigateToTab('search')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.25rem' }}>
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Lookup by ID
          </button>
        </div>
      </div>
    </div>
  );
}
