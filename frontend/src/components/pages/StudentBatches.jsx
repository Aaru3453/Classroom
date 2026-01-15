import React, { useState, useEffect } from 'react';
import { batchService } from '../../services/dataService';

const StudentBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'Computer Science',
    academicYear: '2024-2025',
    startYear: 2024,
    endYear: 2028,
    totalStudents: 0
  });

  // Fetch batches on component mount
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      setLoading(true);
      const response = await batchService.getAll();
      setBatches(response.data.data || []);
      setError('');
    } catch (error) {
      console.error('Error fetching batches:', error);
      setError('Failed to load batches. Please try again.');
      setBatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'startYear' || name === 'endYear' || name === 'totalStudents' 
        ? parseInt(value) 
        : value
    });
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await batchService.create(formData);
      
      if (response.data.success) {
        setBatches([...batches, response.data.data]);
        setIsAddModalOpen(false);
        resetForm();
        alert('Batch created successfully!');
      }
    } catch (error) {
      console.error('Error adding batch:', error);
      alert(error.response?.data?.message || 'Failed to create batch');
    }
  };

  const handleUpdateBatch = async (e) => {
    e.preventDefault();
    try {
      const response = await batchService.update(editingBatch._id, formData);
      
      if (response.data.success) {
        const updatedBatches = batches.map(b => 
          b._id === editingBatch._id ? response.data.data : b
        );
        setBatches(updatedBatches);
        setIsEditModalOpen(false);
        setEditingBatch(null);
        resetForm();
        alert('Batch updated successfully!');
      }
    } catch (error) {
      console.error('Error updating batch:', error);
      alert(error.response?.data?.message || 'Failed to update batch');
    }
  };

  const handleDeleteBatch = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        const response = await batchService.delete(id);
        
        if (response.data.success) {
          setBatches(batches.filter(b => b._id !== id));
          if (selectedBatch?._id === id) {
            setSelectedBatch(null);
            setSelectedSemester('');
          }
          alert('Batch deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting batch:', error);
        alert(error.response?.data?.message || 'Failed to delete batch');
      }
    }
  };

  const openEditModal = (batch = null) => {
    if (batch) {
      setEditingBatch(batch);
      setFormData({
        name: batch.name,
        code: batch.code,
        department: batch.department,
        academicYear: batch.academicYear,
        startYear: batch.startYear,
        endYear: batch.endYear,
        totalStudents: batch.totalStudents || 0
      });
    } else {
      resetForm();
      setEditingBatch(null);
    }
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      department: 'Computer Science',
      academicYear: '2024-2025',
      startYear: 2024,
      endYear: 2028,
      totalStudents: 0
    });
  };

  const departments = [
    "Computer Science",
    "Electrical Engineering", 
    "Mechanical Engineering",
    "Civil Engineering",
    "Mathematics"
  ];

  const academicYears = [
    "2023-2024",
    "2024-2025", 
    "2025-2026",
    "2026-2027"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-blue-500 text-4xl mb-4"></i>
          <p className="text-gray-600">Loading batches...</p>
        </div>
      </div>
    );
  }

  // Semester View
  if (selectedBatch && selectedSemester) {
    const selectedBatchData = batches.find(b => b._id === selectedBatch);
    const semesterData = selectedBatchData?.semesters?.find(s => 
      s.semesterNumber === parseInt(selectedSemester)
    );

    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedBatchData?.name} - Semester {selectedSemester}
              </h1>
              <p className="text-gray-600 mt-1">
                Department: {selectedBatchData?.department}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedBatch(null);
                setSelectedSemester('');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back to Batches
            </button>
          </div>

          {/* Subjects List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Subjects</h3>
            {semesterData?.subjects && semesterData.subjects.length > 0 ? (
              <div className="space-y-3">
                {semesterData.subjects.map((subject, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          Subject {index + 1}
                        </h4>
                        {subject.subject?.name && (
                          <p className="text-gray-600">{subject.subject.name}</p>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subject.faculty?.user?.name || 'No faculty assigned'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No subjects assigned to this semester yet.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Batch Selection View
  if (selectedBatch) {
    const selectedBatchData = batches.find(b => b._id === selectedBatch);
    
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Select Semester - {selectedBatchData?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Department: {selectedBatchData?.department}
              </p>
            </div>
            <button
              onClick={() => setSelectedBatch(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              ← Back to Batches
            </button>
          </div>

          {/* Semester Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Choose a semester...</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
                <option key={semester} value={semester}>
                  Semester {semester}
                </option>
              ))}
            </select>
            
            {selectedSemester && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700">
                  Selected: <strong>Semester {selectedSemester}</strong>
                </p>
                <button
                  onClick={() => {}}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  View Subjects
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Batches List View
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Batches
          </h1>
          <p className="text-gray-600">
            Manage departments, batches, and semesters
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Add Batch Button */}
        <div className="mb-6">
          <button
            onClick={() => openEditModal()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add New Batch
          </button>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {batches.map((batch) => (
            <div key={batch._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{batch.name}</h2>
                  <p className="text-gray-600 mt-1">{batch.code} • {batch.department}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    {batch.academicYear} • {batch.totalStudents || 0} students
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(batch)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteBatch(batch._id)}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {batch.department}
                </span>
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full ml-2">
                  {batch.startYear}-{batch.endYear}
                </span>
              </div>

              <button
                onClick={() => setSelectedBatch(batch._id)}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                View Semesters →
              </button>
            </div>
          ))}
        </div>

        {/* No batches message */}
        {batches.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <i className="fas fa-graduation-cap text-gray-300 text-5xl mb-4"></i>
              <p className="text-gray-500 text-lg">No batches found.</p>
              <button
                onClick={() => openEditModal()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + Add First Batch
              </button>
            </div>
          </div>
        )}

        {/* Add/Edit Batch Modal */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingBatch ? 'Edit Batch' : 'Add New Batch'}
                </h3>
                <form onSubmit={editingBatch ? handleUpdateBatch : handleAddBatch}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter batch name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Batch Code *</label>
                      <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter batch code"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                      <select
                        name="academicYear"
                        value={formData.academicYear}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        {academicYears.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Year *</label>
                        <input
                          type="number"
                          name="startYear"
                          value={formData.startYear}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="2000"
                          max="2100"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Year *</label>
                        <input
                          type="number"
                          name="endYear"
                          value={formData.endYear}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          min="2000"
                          max="2100"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
                      <input
                        type="number"
                        name="totalStudents"
                        value={formData.totalStudents}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false);
                        setEditingBatch(null);
                        resetForm();
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {editingBatch ? 'Update Batch' : 'Add Batch'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentBatches;