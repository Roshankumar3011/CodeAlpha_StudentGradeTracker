import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import SearchStudent from './components/SearchStudent';
import PerformanceReport from './components/PerformanceReport';
import Toast from './components/Toast';
import LoadingSpinner from './components/LoadingSpinner';

const API_BASE = 'http://localhost:8080/api/students';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [report, setReport] = useState({});
  const [loading, setLoading] = useState(false);
  
  // Modal & Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Toast Alerts State
  const [toasts, setToasts] = useState([]);

  // Add floating toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto dismiss after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Fetch all records & report stats from backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [studentsRes, reportRes] = await Promise.all([
        axios.get(API_BASE),
        axios.get(`${API_BASE}/report`)
      ]);
      setStudents(studentsRes.data);
      setReport(reportRes.data);
    } catch (err) {
      console.error(err);
      addToast('Could not fetch data from server. Please verify the backend is running on port 8080.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  // Run on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Form Submit (Add or Edit)
  const handleFormSubmit = async (formData) => {
    setIsFormOpen(false);
    setLoading(true);
    try {
      if (selectedStudent) {
        // Edit Mode: update marks
        await axios.put(`${API_BASE}/${formData.studentId}/marks`, formData.marks, {
          headers: { 'Content-Type': 'application/json' }
        });
        addToast(`Successfully updated marks for ${formData.studentName}!`, 'success');
      } else {
        // Add Mode
        await axios.post(API_BASE, formData);
        addToast(`Successfully registered ${formData.studentName}!`, 'success');
      }
      fetchData(); // Reload stats and directory
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Transaction failed. Please try again.';
      addToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Trigger edit modal
  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  // Trigger add modal
  const handleAddClick = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  // Handle student delete
  const handleDeleteClick = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_BASE}/${id}`);
      addToast('Student record deleted successfully.', 'success');
      fetchData();
    } catch (err) {
      console.error(err);
      addToast('Failed to delete student record.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Toast toasts={toasts} onDismiss={dismissToast} />

      <main className="main-content">
        {loading && students.length === 0 ? (
          <LoadingSpinner />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard 
                report={report} 
                onNavigateToTab={setActiveTab} 
                onOpenAddModal={handleAddClick} 
              />
            )}
            {activeTab === 'list' && (
              <StudentList 
                students={students} 
                onEdit={handleEditClick} 
                onDelete={handleDeleteClick} 
              />
            )}
            {activeTab === 'search' && (
              <SearchStudent onAddToast={addToast} />
            )}
            {activeTab === 'report' && (
              <PerformanceReport report={report} students={students} />
            )}
          </>
        )}
      </main>

      {/* Global Add/Edit Modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
        existingIds={students.map(s => s.studentId)}
      />
    </div>
  );
}
