import React, { useState, useMemo } from 'react';

/**
 * Component displaying the table of student records with filtering, searching, and sorting capabilities.
 */
export default function StudentList({ students, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('studentId');
  const [sortAsc, setSortAsc] = useState(true);

  // Handle Sort Header Click
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Perform search, filter, and sort operations locally
  const processedStudents = useMemo(() => {
    let result = [...students];

    // 1. Search Query filter (checks ID and Name case-insensitively)
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (s) =>
          s.studentId.toLowerCase().includes(q) ||
          s.studentName.toLowerCase().includes(q)
      );
    }

    // 2. Letter Grade filter
    if (gradeFilter !== 'All') {
      result = result.filter((s) => s.grade === gradeFilter);
    }

    // 3. Status filter (Pass is >= 60, Fail is < 60)
    if (statusFilter !== 'All') {
      if (statusFilter === 'Pass') {
        result = result.filter((s) => s.marks >= 60.0);
      } else if (statusFilter === 'Fail') {
        result = result.filter((s) => s.marks < 60.0);
      }
    }

    // 4. Sorting
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      // Handle numerical sorting
      if (typeof valA === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }

      // Handle string sorting
      valA = valA.toString().toLowerCase();
      valB = valB.toString().toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return result;
  }, [students, searchTerm, gradeFilter, statusFilter, sortField, sortAsc]);

  const confirmDelete = (student) => {
    if (window.confirm(`Are you sure you want to delete ${student.studentName}'s record? This cannot be undone.`)) {
      onDelete(student.studentId);
    }
  };

  return (
    <div className="student-list-view">
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>Student Directory</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage, edit, or filter registered student records.</p>
      </div>

      {/* Control Actions Row (Search & Filters) */}
      <div className="controls-row">
        {/* Search */}
        <div className="search-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="filters-wrapper">
          <select 
            className="select-filter"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="All">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
            <option value="D">Grade D</option>
            <option value="F">Grade F</option>
          </select>

          <select 
            className="select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pass">Passed</option>
            <option value="Fail">Failed</option>
          </select>
        </div>
      </div>

      {/* Glassmorphic Table */}
      <div className="table-container">
        {processedStudents.length > 0 ? (
          <table className="modern-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('studentId')}>
                  Student ID {sortField === 'studentId' && (sortAsc ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('studentName')}>
                  Student Name {sortField === 'studentName' && (sortAsc ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('marks')}>
                  Marks (%) {sortField === 'marks' && (sortAsc ? '▲' : '▼')}
                </th>
                <th onClick={() => handleSort('grade')}>
                  Grade {sortField === 'grade' && (sortAsc ? '▲' : '▼')}
                </th>
                <th style={{ textAlign: 'right', cursor: 'default' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedStudents.map((s) => (
                <tr key={s.studentId}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{s.studentId}</td>
                  <td>{s.studentName}</td>
                  <td style={{ fontWeight: 500 }}>{s.marks.toFixed(2)}%</td>
                  <td>
                    <span className={`badge badge-${s.grade.toLowerCase()}`}>
                      {s.grade}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        className="btn-icon btn-edit" 
                        title="Edit Marks"
                        onClick={() => onEdit(s)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      <button 
                        className="btn-icon btn-delete" 
                        title="Delete Record"
                        onClick={() => confirmDelete(s)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          <line x1="10" y1="11" x2="10" y2="17" />
                          <line x1="14" y1="11" x2="14" y2="17" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.1)' }}>
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
            <p style={{ fontSize: '1.05rem', fontWeight: 500 }}>No matching student records found.</p>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Try clearing filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
