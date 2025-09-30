import React, { useState } from 'react';

const Subject = () => {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "DAA",
      code: "DR2345",
      department: "Civil Engineering",
      credits: 4,
      type: "Core",
      description: "Design and Analysis of Algorithms is a fundamental area in computer science that focuses on understanding how to solve problems efficiently using algorithms."
    },
    {
      id: 2,
      name: "Introduction to Programming",
      code: "CS101",
      department: "Computer Science",
      credits: 3,
      type: "Core",
      description: "Fundamentals of computer programming using Python, covering data structures, algorithms, and problem-solving."
    },
    {
      id: 3,
      name: "Calculus I",
      code: "MA101",
      department: "Mathematics",
      credits: 4,
      type: "Core",
      description: "First course in differential and integral calculus, including limits, derivatives, integrals, and their applications."
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedType, setSelectedType] = useState('All Types');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  
  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    department: 'Computer Science',
    credits: '',
    type: 'Core',
    description: '',
    status: true
  });

  // Departments and types for dropdowns
  const departments = ['Civil Engineering', 'Computer Science', 'Mathematics', 'Electrical Engineering', 'Mechanical Engineering', 'Physics'];
  const types = ['Core', 'Elective', 'Lab', 'Project', 'Workshop', 'Seminar'];

  // Get unique departments for filters
  const departmentOptions = ['All Departments', ...new Set(subjects.map(subject => subject.department))];
  const typeOptions = ['All Types', ...new Set(subjects.map(subject => subject.type))];

  // Filter subjects
  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || subject.department === selectedDepartment;
    const matchesType = selectedType === 'All Types' || subject.type === selectedType;
    
    return matchesSearch && matchesDepartment && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All Departments');
    setSelectedType('All Types');
  };

  const deleteSubject = (id) => {
    if (window.confirm('Are you sure you want to delete this subject?')) {
      setSubjects(subjects.filter(subject => subject.id !== id));
    }
  };

  // Edit subject function
  const handleEditClick = (subject) => {
    setEditingSubject(subject);
    setNewSubject({
      name: subject.name,
      code: subject.code,
      department: subject.department,
      credits: subject.credits.toString(),
      type: subject.type,
      description: subject.description,
      status: true
    });
    setShowEditModal(true);
  };

  // Update subject function
  const handleUpdateSubject = () => {
    if (!newSubject.name || !newSubject.code || !newSubject.credits || !newSubject.department || !newSubject.type) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedSubject = {
      ...editingSubject,
      name: newSubject.name,
      code: newSubject.code,
      department: newSubject.department,
      credits: parseInt(newSubject.credits),
      type: newSubject.type,
      description: newSubject.description
    };

    setSubjects(subjects.map(subject => 
      subject.id === editingSubject.id ? updatedSubject : subject
    ));
    setShowEditModal(false);
    setEditingSubject(null);
    setNewSubject({
      name: '',
      code: '',
      department: 'Computer Science',
      credits: '',
      type: 'Core',
      description: '',
      status: true
    });
  };

  const handleAddSubject = () => {
    if (!newSubject.name || !newSubject.code || !newSubject.credits || !newSubject.department || !newSubject.type) {
      alert('Please fill in all required fields');
      return;
    }

    const subject = {
      id: subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1,
      name: newSubject.name,
      code: newSubject.code,
      department: newSubject.department,
      credits: parseInt(newSubject.credits),
      type: newSubject.type,
      description: newSubject.description
    };

    setSubjects([...subjects, subject]);
    setShowAddModal(false);
    setNewSubject({
      name: '',
      code: '',
      department: 'Computer Science',
      credits: '',
      type: 'Core',
      description: '',
      status: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewSubject(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content with extra top padding */}
      <div className="pt-24 p-4 md:p-6">
        
        {/* Header Section - Exact Classroom jaisa */}
        <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               Subject Management
            </h1>
            <p className="text-lg text-gray-600">
                Manage course subjects and curriculum information
            </p>
        </div>

        {/* Search and Filters Section - Exact Classroom jaisa */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search subjects...
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {departmentOptions.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Subject Type
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {typeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Subject Grid - Exact Classroom cards jaisa */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{subject.code}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}>
                    {subject.type}
                  </span>
                </div>
                <p className="text-blue-100 mt-1">{subject.name}</p>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-graduation-cap text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">
                      <strong>Credits:</strong> {subject.credits}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-building text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">{subject.department}</span>
                  </div>

                  {subject.description && (
                    <div className="flex items-start">
                      <i className="fas fa-file-alt text-gray-400 w-5 mt-1"></i>
                      <div className="ml-2">
                        <strong className="text-gray-700">Description:</strong>
                        <p className="text-gray-600 text-sm mt-1">{subject.description}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleEditClick(subject)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteSubject(subject.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State - Exact Classroom jaisa */}
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-book text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">No subjects found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add New Subject Modal - Exact Classroom jaisa */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Add New Subject</h2>
              <p className="text-blue-100 mt-1">Enter subject details</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newSubject.code}
                      onChange={handleInputChange}
                      placeholder="e.g., CS101, MA201"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credits *
                    </label>
                    <input
                      type="number"
                      name="credits"
                      value={newSubject.credits}
                      onChange={handleInputChange}
                      placeholder="e.g., 3, 4"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newSubject.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to Programming"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={newSubject.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Type *
                    </label>
                    <select
                      name="type"
                      value={newSubject.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select type</option>
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newSubject.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Enter subject description..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={newSubject.status}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active subject
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subject Modal - Exact Classroom jaisa */}
      {showEditModal && editingSubject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Edit Subject</h2>
              <p className="text-blue-100 mt-1">Update subject information</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newSubject.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Credits *
                    </label>
                    <input
                      type="number"
                      name="credits"
                      value={newSubject.credits}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newSubject.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={newSubject.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject Type *
                    </label>
                    <select
                      name="type"
                      value={newSubject.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={newSubject.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={newSubject.status}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Active subject
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSubject}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Subject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Subject Button - Exact Classroom jaisa position */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Subject;


