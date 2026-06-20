import React, { useState, useEffect } from 'react';

/**
 * Modal form component to Add or Edit a student record.
 */
export default function StudentForm({ isOpen, onClose, onSubmit, student, existingIds }) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [marks, setMarks] = useState('');
  const [errors, setErrors] = useState({});

  const isEditMode = !!student;

  useEffect(() => {
    if (isOpen) {
      if (student) {
        setStudentId(student.studentId);
        setStudentName(student.studentName);
        setMarks(student.marks.toString());
      } else {
        setStudentId('');
        setStudentName('');
        setMarks('');
      }
      setErrors({});
    }
  }, [isOpen, student]);

  if (!isOpen) return null;

  const validate = () => {
    const tempErrors = {};
    if (!studentId.trim()) {
      tempErrors.studentId = 'Student ID is required.';
    } else if (!isEditMode && existingIds.some(id => id.toLowerCase() === studentId.trim().toLowerCase())) {
      tempErrors.studentId = 'Student ID already exists.';
    }

    if (!studentName.trim()) {
      tempErrors.studentName = 'Student Name is required.';
    } else if (!/^[a-zA-Z\s'-]+$/.test(studentName.trim())) {
      tempErrors.studentName = 'Name can only contain letters, spaces, hyphens, and apostrophes.';
    }

    const marksNum = parseFloat(marks);
    if (marks.trim() === '') {
      tempErrors.marks = 'Marks are required.';
    } else if (isNaN(marksNum) || marksNum < 0.0 || marksNum > 100.0) {
      tempErrors.marks = 'Marks must be a number between 0.0 and 100.0.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        studentId: studentId.trim(),
        studentName: studentName.trim(),
        marks: parseFloat(marks)
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <h2 className="modal-title">
          {isEditMode ? (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--primary)' }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Update Student Marks
            </>
          ) : (
            <>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: 'var(--primary)' }}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
              </svg>
              Add New Student
            </>
          )}
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Student ID */}
          <div className="form-group">
            <label className="form-label">Student ID</label>
            <input
              type="text"
              className="form-input"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={isEditMode}
              placeholder="e.g. S101"
              autoFocus={!isEditMode}
            />
            {errors.studentId && (
              <span className="form-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.studentId}
              </span>
            )}
          </div>

          {/* Student Name */}
          <div className="form-group">
            <label className="form-label">Student Name</label>
            <input
              type="text"
              className="form-input"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              disabled={isEditMode}
              placeholder="e.g. Jane Doe"
            />
            {errors.studentName && (
              <span className="form-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.studentName}
              </span>
            )}
          </div>

          {/* Marks */}
          <div className="form-group">
            <label className="form-label">Marks (0.0 - 100.0)</label>
            <input
              type="number"
              step="0.1"
              className="form-input"
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
              placeholder="e.g. 85.5"
              autoFocus={isEditMode}
            />
            {errors.marks && (
              <span className="form-error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {errors.marks}
              </span>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Save Changes' : 'Register Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
