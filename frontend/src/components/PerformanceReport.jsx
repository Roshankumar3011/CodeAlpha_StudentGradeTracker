import React, { useMemo } from 'react';

/**
 * PerformanceReport component displaying SVG analytics and class-wide trends.
 */
export default function PerformanceReport({ report, students }) {
  const {
    totalStudents = 0,
    averageMarks = 0.0,
    highestMarks = 0.0,
    lowestMarks = 0.0,
    passRate = 0.0,
    passCount = 0,
    failCount = 0,
    gradeACount = 0,
    gradeBCount = 0,
    gradeCCount = 0,
    gradeDCount = 0,
    gradeFCount = 0
  } = report || {};

  // Compute highest and lowest scoring student names locally
  const { topScorers, bottomScorers } = useMemo(() => {
    if (students.length === 0) {
      return { topScorers: [], bottomScorers: [] };
    }
    const maxVal = Math.max(...students.map(s => s.marks));
    const minVal = Math.min(...students.map(s => s.marks));

    const tops = students.filter(s => s.marks === maxVal);
    const bottoms = students.filter(s => s.marks === minVal);

    return { topScorers: tops, bottomScorers: bottoms };
  }, [students]);

  // Compute SVG Bar heights dynamically
  const gradeCounts = [gradeACount, gradeBCount, gradeCCount, gradeDCount, gradeFCount];
  const maxGradeCount = Math.max(...gradeCounts, 1); // Avoid division by zero
  const barChartData = [
    { label: 'Grade A', count: gradeACount, color: 'var(--success)' },
    { label: 'Grade B', count: gradeBCount, color: 'var(--primary)' },
    { label: 'Grade C', count: gradeCCount, color: 'var(--secondary)' },
    { label: 'Grade D', count: gradeDCount, color: 'var(--warning)' },
    { label: 'Grade F', count: gradeFCount, color: 'var(--error)' }
  ];

  // Animated Donut calculation (R = 50, C = 314.159)
  const circumference = 314.159;
  const passOffset = circumference - (circumference * passRate) / 100;

  const handlePrint = () => {
    window.print();
  };

  if (students.length === 0) {
    return (
      <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '16px' }}>
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
          <path d="M12 20h9M3 20v-8a2 2 0 0 1 2-2h4l2 3h4a2 2 0 0 1 2 2v5" />
          <circle cx="12" cy="5" r="3" />
        </svg>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Data Available</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>
          Please add student records to populate classroom performance metrics and analytical charts.
        </p>
      </div>
    );
  }

  return (
    <div className="performance-report-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Classroom Analytics</h1>
          <p style={{ color: 'var(--text-muted)' }}>Analytical models, grade clusters, and performance trends.</p>
        </div>
        <button className="btn btn-secondary" onClick={handlePrint}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9" />
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
            <rect x="6" y="14" width="12" height="8" />
          </svg>
          Print Report Sheet
        </button>
      </div>

      {/* Grid of charts */}
      <div className="report-grid">
        {/* SVG Grade Distribution Bar Chart */}
        <div className="report-card">
          <h3 className="chart-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Grade Frequency Distribution
          </h3>
          <div className="svg-chart-container">
            <svg width="100%" height="220" viewBox="0 0 400 220" style={{ overflow: 'visible' }}>
              {/* Axes */}
              <line x1="40" y1="180" x2="380" y2="180" stroke="var(--border-glass)" strokeWidth="2" />
              <line x1="40" y1="20" x2="40" y2="180" stroke="var(--border-glass)" strokeWidth="2" />

              {/* Bars */}
              {barChartData.map((data, index) => {
                const x = 60 + index * 65;
                const barHeight = (data.count / maxGradeCount) * 130;
                const y = 180 - barHeight;

                return (
                  <g key={data.label} style={{ cursor: 'pointer' }}>
                    {/* Shadow Backing */}
                    <rect 
                      x={x} 
                      y={20} 
                      width="35" 
                      height="160" 
                      fill="rgba(255,255,255,0.01)" 
                      rx="4"
                    />
                    {/* Glowing Filled Bar */}
                    <rect
                      x={x}
                      y={y}
                      width="35"
                      height={barHeight}
                      fill={data.color}
                      opacity="0.85"
                      rx="4"
                      style={{ transition: 'all 0.5s ease-in-out' }}
                    />
                    {/* Top value badge */}
                    <text
                      x={x + 17.5}
                      y={y - 8}
                      fill="var(--text-main)"
                      fontSize="11.5"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {data.count}
                    </text>
                    {/* Label */}
                    <text
                      x={x + 17.5}
                      y="198"
                      fill="var(--text-muted)"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {data.label.replace('Grade ', '')}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* SVG Pass vs Fail Donut Chart */}
        <div className="report-card">
          <h3 className="chart-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 10 10" />
            </svg>
            Pass vs Fail Ratio
          </h3>
          <div className="svg-chart-container" style={{ position: 'relative' }}>
            <svg width="180" height="180" viewBox="0 0 120 120">
              {/* Backing Fail Track */}
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                fill="transparent" 
                stroke="var(--error)" 
                strokeWidth="10" 
                opacity="0.2"
              />
              {/* Overlay Pass Track */}
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                fill="transparent" 
                stroke="var(--success)" 
                strokeWidth="10" 
                strokeDasharray={circumference}
                strokeDashoffset={passOffset}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{passRate.toFixed(0)}%</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pass Rate</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '4px', background: 'var(--success)' }}></span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Passed: <strong>{passCount}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '4px', background: 'var(--error)' }}></span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Failed: <strong>{failCount}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Extreme Scorers Summary */}
      <div className="report-card" style={{ marginTop: '2rem' }}>
        <h3 className="chart-title">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Academic Superlatives
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {/* Top Performers Card */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '1.5rem' }}>
            <span style={{ color: 'var(--success)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Top Performer(s)</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
              {topScorers.map(s => (
                <div key={s.studentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{s.studentName}</span>
                  <span className="badge badge-a">{s.marks.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Performers Card */}
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '1.5rem' }}>
            <span style={{ color: 'var(--error)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>Lowest Performer(s)</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem' }}>
              {bottomScorers.map(s => (
                <div key={s.studentId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>{s.studentName}</span>
                  <span className={`badge badge-${s.grade.toLowerCase()}`}>{s.marks.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
