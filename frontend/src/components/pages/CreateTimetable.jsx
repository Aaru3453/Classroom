import React, { useState, useEffect } from 'react';
import { timetableAPI } from "../../services/api";

const CreateTimetable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [departmentFilter, setDepartmentFilter] = useState('All Departments');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showGridView, setShowGridView] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [timetableData, setTimetableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const statusOptions = ['All Statuses', 'Draft', 'Approved', 'Pending Review'];
  const departmentOptions = ['All Departments', 'Computer Science', 'Electrical Engineering', 'Mechanical Engineering'];

  // Fetch timetables on component mount and when filters change
  const fetchTimetables = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (searchTerm && searchTerm !== '') params.search = searchTerm;
      if (statusFilter && statusFilter !== 'All Statuses') params.status = statusFilter;
      if (departmentFilter && departmentFilter !== 'All Departments') params.department = departmentFilter;
      
      const res = await timetableAPI.getAll(params);
      setTimetableData(res.data.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch timetables", err);
      setError('Failed to load timetables. Please try again.');
      setTimetableData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetables();
  }, []);

  // Filter timetables based on search and filters
  const filteredTimetables = timetableData.filter(timetable => {
    const matchesSearch = searchTerm === '' || 
      (timetable.title && timetable.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (timetable.department && timetable.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'All Statuses' || 
      timetable.status === statusFilter;
    const matchesDepartment = departmentFilter === 'All Departments' || 
      (timetable.department && timetable.department.includes(departmentFilter));
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All Statuses');
    setDepartmentFilter('All Departments');
    fetchTimetables(); // Refresh with cleared filters
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending Review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Draft': return 'fa-edit';
      case 'Approved': return 'fa-check-circle';
      case 'Pending Review': return 'fa-clock';
      default: return 'fa-file';
    }
  };

  // Handle viewing timetable grid
  const handleViewGrid = (timetable) => {
    setSelectedTimetable(timetable);
    setShowGridView(true);
  };

  // Handle downloading timetable as PDF
  const handleDownloadPDF = async (timetable) => {
    try {
      // Call API to generate/download PDF
      const response = await timetableAPI.downloadPDF(timetable._id);
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${timetable.title.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download timetable. Please try again.');
    }
  };

  // Handle editing a timetable
  const handleEditTimetable = (timetable) => {
    setEditingTimetable(timetable);
    setShowGenerateModal(true);
  };

  // Handle deleting a timetable
  const handleDeleteTimetable = async (timetableId) => {
    if (window.confirm('Are you sure you want to delete this timetable? This action cannot be undone.')) {
      try {
        await timetableAPI.delete(timetableId);
        await fetchTimetables(); // Refresh the list
      } catch (err) {
        console.error('Error deleting timetable:', err);
        alert('Failed to delete timetable. Please try again.');
      }
    }
  };

  // Handle saving edited timetable
  const handleSaveTimetable = async (updatedTimetable) => {
    try {
      if (editingTimetable) {
        // Update existing timetable
        await timetableAPI.update(editingTimetable._id, updatedTimetable);
      } else {
        // Add new timetable
        await timetableAPI.create(updatedTimetable);
      }
      
      await fetchTimetables(); // Refresh the list
      setShowGenerateModal(false);
      setEditingTimetable(null);
    } catch (err) {
      console.error('Error saving timetable:', err);
      alert('Failed to save timetable. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading timetables...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchTimetables}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="pt-24 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Timetables
          </h1>
          <p className="text-lg text-gray-600">
            Manage and generate academic schedules
          </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search timetables..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchTimetables()}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <select 
                value={departmentFilter} 
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                {departmentOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <div className="flex gap-2">
              <button 
                onClick={handleClearFilters}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
              <button 
                onClick={fetchTimetables}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <i className="fas fa-sync-alt mr-2"></i>
                Refresh
              </button>
            </div>
            
            <button 
              onClick={() => {
                setEditingTimetable(null);
                setShowGenerateModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Generate New Timetable
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Timetable Cards */}
        <div className="space-y-6">
          {filteredTimetables.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <i className="fas fa-calendar-times text-4xl text-gray-300 mb-4"></i>
              <h3 className="text-xl font-semibold text-gray-600">No timetables found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredTimetables.map(timetable => (
              <div key={timetable._id || timetable.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="p-6">
                  {/* Header Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="text-xl font-semibold text-gray-900">{timetable.title}</h3>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(timetable.status)}`}>
                      <i className={`fas ${getStatusIcon(timetable.status)} mr-2`}></i>
                      {timetable.status}
                    </span>
                  </div>

                  {/* Department and Date */}
                  <div className="mb-4">
                    <p className="text-gray-700 flex items-center">
                      <i className="fas fa-university mr-2 text-gray-400"></i>
                      {timetable.department}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <i className="fas fa-calendar-alt mr-2"></i>
                      {timetable.generatedDate ? `Generated: ${timetable.generatedDate}` : 'No date specified'}
                    </p>
                  </div>

                  {/* Notes */}
                  {timetable.notes && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-md">
                      <p className="text-gray-700 text-sm">
                        <strong className="flex items-center">
                          <i className="fas fa-sticky-note mr-2"></i>
                          Notes:
                        </strong> 
                        <span className="ml-6">{timetable.notes}</span>
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleViewGrid(timetable)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <i className="fas fa-th mr-2"></i>
                      View Grid
                    </button>
                    
                    {timetable.hasDownload && (
                      <button 
                        onClick={() => handleDownloadPDF(timetable)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <i className="fas fa-download mr-2"></i>
                        Download
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleEditTimetable(timetable)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <i className="fas fa-edit mr-2"></i>
                      Edit
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteTimetable(timetable._id || timetable.id)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <i className="fas fa-trash mr-2"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Generate New Timetable Modal */}
      {showGenerateModal && (
        <GenerateTimetableModal 
          onClose={() => {
            setShowGenerateModal(false);
            setEditingTimetable(null);
          }}
          onSave={handleSaveTimetable}
          editingTimetable={editingTimetable}
        />
      )}

      {/* Timetable Grid View Modal */}
      {showGridView && selectedTimetable && (
        <TimetableGridView 
          timetable={selectedTimetable}
          onClose={() => {
            setShowGridView(false);
            setSelectedTimetable(null);
          }}
        />
      )}
    </div>
  );
};

// Generate Timetable Modal Component with API integration
const GenerateTimetableModal = ({ onClose, onSave, editingTimetable }) => {
  const [currentStep, setCurrentStep] = useState('basic-info');
  const [timetableInfo, setTimetableInfo] = useState(editingTimetable ? {
    title: editingTimetable.title || '',
    department: editingTimetable.department || '',
    status: editingTimetable.status || 'Draft',
    notes: editingTimetable.notes || '',
    generatedDate: editingTimetable.generatedDate || new Date().toLocaleDateString()
  } : {
    title: '',
    department: '',
    status: 'Draft',
    notes: '',
    generatedDate: new Date().toLocaleDateString()
  });

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [selectedClassrooms, setSelectedClassrooms] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState([]);
  const [selectedBatches, setSelectedBatches] = useState([]);
  const [loadingResources, setLoadingResources] = useState(false);
  const [resourcesError, setResourcesError] = useState(null);

  const [subjectsData, setSubjectsData] = useState([]);
  const [facultyData, setFacultyData] = useState([]);
  const [classroomsData, setClassroomsData] = useState([]);
  const [batchesData, setBatchesData] = useState([]);

  const [preferences, setPreferences] = useState({
    maxHoursPerDay: 6,
    breakDuration: 60,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    optimizationOptions: ['Avoid back-to-back lab sessions', 'Balance faculty workload', 'Prioritize core courses in prime time slots'],
    startTime: '09:00',
    endTime: '17:00'
  });

  const [constraints, setConstraints] = useState({
    facultyUnavailability: '',
    roomRestrictions: '',
    specialRequirements: ''
  });

  const steps = ['basic-info', 'resources', 'preferences', 'constraints'];

  // Fetch resources data
  useEffect(() => {
    if (currentStep === 'resources' && subjectsData.length === 0) {
      fetchResources();
    }
  }, [currentStep]);

  const fetchResources = async () => {
    try {
      setLoadingResources(true);
      setResourcesError(null);
      
      // Fetch all resources concurrently
      const [subjectsRes, facultyRes, classroomsRes, batchesRes] = await Promise.all([
        // You'll need to create these API endpoints or use existing ones
        // For now, we'll use empty arrays as placeholders
        Promise.resolve({ data: [] }),
        Promise.resolve({ data: [] }),
        Promise.resolve({ data: [] }),
        Promise.resolve({ data: [] })
      ]);
      
      setSubjectsData(subjectsRes.data || []);
      setFacultyData(facultyRes.data || []);
      setClassroomsData(classroomsRes.data || []);
      setBatchesData(batchesRes.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setResourcesError('Failed to load resources. Please try again.');
    } finally {
      setLoadingResources(false);
    }
  };

  const handleInputChange = (field, value) => {
    setTimetableInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferencesChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConstraintsChange = (field, value) => {
    setConstraints(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSelection = (type, id) => {
    switch (type) {
      case 'subject':
        setSelectedSubjects(prev => 
          prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
        break;
      case 'classroom':
        setSelectedClassrooms(prev => 
          prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
        break;
      case 'faculty':
        setSelectedFaculty(prev => 
          prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
        break;
      case 'batch':
        setSelectedBatches(prev => 
          prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
        break;
      default:
        break;
    }
  };

  const toggleWorkingDay = (day) => {
    setPreferences(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
  };

  const toggleOptimizationOption = (option) => {
    setPreferences(prev => ({
      ...prev,
      optimizationOptions: prev.optimizationOptions.includes(option)
        ? prev.optimizationOptions.filter(o => o !== option)
        : [...prev.optimizationOptions, option]
    }));
  };

  const handleSave = () => {
    // Prepare data for API
    const timetableData = {
      ...timetableInfo,
      preferences,
      constraints,
      selectedSubjects,
      selectedClassrooms,
      selectedFaculty,
      selectedBatches
    };
    
    onSave(timetableData);
  };

  const getSelectedCount = (type) => {
    switch (type) {
      case 'subjects': return selectedSubjects.length;
      case 'classrooms': return selectedClassrooms.length;
      case 'faculty': return selectedFaculty.length;
      case 'batches': return selectedBatches.length;
      default: return 0;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {editingTimetable ? 'Edit Timetable' : 'Generate New Timetable'}
              </h2>
              <p className="text-blue-100 mt-1">
                {editingTimetable ? 'Update timetable details' : 'Configure settings and generate optimized schedules'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-blue-200 text-xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="mt-4 flex space-x-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full ${
                  currentStep === step ? 'bg-white' : 'bg-blue-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Basic Info Step */}
          {currentStep === 'basic-info' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Timetable Information</h3>
              <p className="text-gray-600 mb-6">Basic details about the timetable</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Timetable Name *
                  </label>
                  <input
                    type="text"
                    value={timetableInfo.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., CS Department Fall 2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={timetableInfo.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={timetableInfo.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={timetableInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Add any notes about this timetable..."
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Resources Step */}
          {currentStep === 'resources' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Resources</h3>
              
              {loadingResources ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading resources...</p>
                </div>
              ) : resourcesError ? (
                <div className="text-center py-8 text-red-600">
                  <p>{resourcesError}</p>
                  <button 
                    onClick={fetchResources}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  {/* Subjects */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Subjects ({getSelectedCount('subjects')} selected)
                    </h4>
                    <p className="text-gray-600 mb-3">Select subjects to include in the timetable</p>
                    {subjectsData.length === 0 ? (
                      <p className="text-gray-500 italic">No subjects available. Add subjects first.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {subjectsData.map(subject => (
                          <label key={subject._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedSubjects.includes(subject._id)}
                              onChange={() => toggleSelection('subject', subject._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="flex-1">
                              <span className="block font-medium">{subject.name || subject.title}</span>
                              <span className="block text-sm text-gray-500">
                                {subject.code} - {subject.department} - {subject.credits || 0} credits
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Classrooms */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Classrooms ({getSelectedCount('classrooms')} selected)
                    </h4>
                    {classroomsData.length === 0 ? (
                      <p className="text-gray-500 italic">No classrooms available. Add classrooms first.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {classroomsData.map(classroom => (
                          <label key={classroom._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedClassrooms.includes(classroom._id)}
                              onChange={() => toggleSelection('classroom', classroom._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="flex-1">
                              <span className="block font-medium">{classroom.name || classroom.title}</span>
                              <span className="block text-sm text-gray-500">
                                {classroom.code} - Capacity: {classroom.capacity || 'N/A'}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Faculty */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">
                      Faculty ({getSelectedCount('faculty')} selected)
                    </h4>
                    <p className="text-gray-600 mb-3">Select faculty members to assign</p>
                    {facultyData.length === 0 ? (
                      <p className="text-gray-500 italic">No faculty available. Add faculty first.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {facultyData.map(faculty => (
                          <label key={faculty._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedFaculty.includes(faculty._id)}
                              onChange={() => toggleSelection('faculty', faculty._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="flex-1">
                              <span className="block font-medium">{faculty.name}</span>
                              <span className="block text-sm text-gray-500">
                                {faculty.department || 'No department'}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Student Batches */}
                  <div>
                    <h4 className="font-medium text-gray-700 mb-3">
                      Student Batches ({getSelectedCount('batches')} selected)
                    </h4>
                    {batchesData.length === 0 ? (
                      <p className="text-gray-500 italic">No batches available. Add batches first.</p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
                        {batchesData.map(batch => (
                          <label key={batch._id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedBatches.includes(batch._id)}
                              onChange={() => toggleSelection('batch', batch._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="flex-1">
                              <span className="block font-medium">{batch.name || batch.title}</span>
                              <span className="block text-sm text-gray-500">
                                {batch.code} - {batch.department}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Preferences Step */}
          {currentStep === 'preferences' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling Preferences</h3>
              <p className="text-gray-600 mb-6">Configure how the timetable should be generated</p>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Hours Per Day
                  </label>
                  <input
                    type="number"
                    value={preferences.maxHoursPerDay}
                    onChange={(e) => handlePreferencesChange('maxHoursPerDay', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={preferences.breakDuration}
                    onChange={(e) => handlePreferencesChange('breakDuration', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Working Days</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <label key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.workingDays.includes(day)}
                        onChange={() => toggleWorkingDay(day)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Optimization Options</label>
                <div className="space-y-2">
                  {['Avoid back-to-back lab sessions', 'Balance faculty workload', 'Prioritize core courses in prime time slots'].map(option => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={preferences.optimizationOptions.includes(option)}
                        onChange={() => toggleOptimizationOption(option)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={preferences.startTime}
                    onChange={(e) => handlePreferencesChange('startTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={preferences.endTime}
                    onChange={(e) => handlePreferencesChange('endTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Constraints Step */}
          {currentStep === 'constraints' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling Constraints</h3>
              <p className="text-gray-600 mb-6">Specify any restrictions or special requirements</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Faculty Unavailability
                  </label>
                  <textarea
                    value={constraints.facultyUnavailability}
                    onChange={(e) => handleConstraintsChange('facultyUnavailability', e.target.value)}
                    placeholder="e.g., Dr. Smith unavailable on Mondays, Prof. Johnson only available in mornings"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Restrictions
                  </label>
                  <textarea
                    value={constraints.roomRestrictions}
                    onChange={(e) => handleConstraintsChange('roomRestrictions', e.target.value)}
                    placeholder="e.g., Lab A101 only for computer science courses, Room B205 under maintenance on Fridays"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={constraints.specialRequirements}
                    onChange={(e) => handleConstraintsChange('specialRequirements', e.target.value)}
                    placeholder="e.g., Physics lab requires 2-hour continuous slots, Mathematics tutorials should follow lectures"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between">
          <div>
            {currentStep !== 'basic-info' && (
              <button
                onClick={() => {
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex > 0) setCurrentStep(steps[currentIndex - 1]);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Previous
              </button>
            )}
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            
            {currentStep === 'constraints' ? (
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <i className="fas fa-save mr-2"></i>
                {editingTimetable ? 'Update Timetable' : 'Generate Timetable'}
              </button>
            ) : (
              <button
                onClick={() => {
                  const currentIndex = steps.indexOf(currentStep);
                  if (currentIndex < steps.length - 1) setCurrentStep(steps[currentIndex + 1]);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Timetable Grid View Component
const TimetableGridView = ({ timetable, onClose }) => {
  const [gridData, setGridData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timetable) {
      fetchGridData();
    }
  }, [timetable]);

  const fetchGridData = async () => {
    try {
      setLoading(true);
      // Fetch timetable grid data from API
      // This would be a separate API endpoint like timetableAPI.getGrid(timetable._id)
      // For now, use the data from timetable or show placeholder
      
      if (timetable.gridData) {
        setGridData(timetable.gridData);
      } else {
        // Create default grid structure
        setGridData({
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          timeSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00'],
          schedule: Array(5).fill().map(() => Array(6).fill('No schedule data'))
        });
      }
    } catch (err) {
      console.error('Error fetching grid data:', err);
      setGridData({
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        timeSlots: ['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00'],
        schedule: Array(5).fill().map(() => Array(6).fill('Error loading data'))
      });
    } finally {
      setLoading(false);
    }
  };

  if (!gridData) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl">
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading timetable grid...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-white">{timetable.title}</h2>
              <p className="text-blue-100 mt-1">{timetable.department}</p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:text-blue-200 text-xl"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading schedule...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 p-3 font-semibold">Time/Day</th>
                    {gridData.days.map(day => (
                      <th key={day} className="border border-gray-300 bg-gray-100 p-3 font-semibold">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {gridData.timeSlots.map((timeSlot, timeIndex) => (
                    <tr key={timeSlot}>
                      <td className="border border-gray-300 bg-gray-50 p-3 font-medium">{timeSlot}</td>
                      {gridData.days.map((day, dayIndex) => (
                        <td key={day} className="border border-gray-300 p-3">
                          {gridData.schedule[dayIndex]?.[timeIndex] || 'Free'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTimetable;