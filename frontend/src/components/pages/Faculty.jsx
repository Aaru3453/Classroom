import React, { useState } from 'react';

const Faculty = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  
  // Initial faculty data
  const initialFaculty = [
    {
      id: 1,
      name: 'Dr. John Smith',
      email: 'john.smith@university.edu',
      department: 'Computer Science',
      subjects: ['Data Structures', 'Algorithms'],
      workload: 12,
      building: 'IT Building',
      officeHours: 'Mon-Wed 2-4 PM',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Prof. Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      department: 'Mathematics',
      subjects: ['Calculus', 'Linear Algebra'],
      workload: 15,
      building: 'Main Academic Building',
      officeHours: 'Tue-Thu 10-12 PM',
      phone: '+1 (555) 123-4568'
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      email: 'michael.brown@university.edu',
      department: 'Physics',
      subjects: ['Quantum Mechanics', 'Thermodynamics'],
      workload: 10,
      building: 'Science Building',
      officeHours: 'Mon-Fri 3-5 PM',
      phone: '+1 (555) 123-4569'
    },
    {
      id: 4,
      name: 'Prof. Emily Davis',
      email: 'emily.davis@university.edu',
      department: 'Computer Science',
      subjects: ['Database Systems', 'Web Development'],
      workload: 14,
      building: 'IT Building',
      officeHours: 'Wed-Fri 1-3 PM',
      phone: '+1 (555) 123-4570'
    }
  ];

  const [facultyMembers, setFacultyMembers] = useState(initialFaculty);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    department: 'Computer Science',
    subjects: '',
    workload: '',
    building: '',
    officeHours: '',
    phone: ''
  });

  const departments = ['Computer Science', 'Mathematics', 'Physics', 'Chemistry'];
  const buildings = ['IT Building', 'Main Academic Building', 'Science Building', 'Engineering Building'];

  // Filter faculty based on search and department
  const filteredFaculty = facultyMembers.filter(faculty => {
    const matchesSearch = faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faculty.subjects.some(subject => 
                           subject.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesDepartment = selectedDepartment === 'All Departments' || 
                             faculty.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('All Departments');
  };

  // Add Faculty Functionality
  const handleAddFaculty = () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.workload) {
      alert('Please fill in all required fields');
      return;
    }

    const facultyToAdd = {
      id: Math.max(...facultyMembers.map(f => f.id)) + 1,
      name: newFaculty.name,
      email: newFaculty.email,
      department: newFaculty.department,
      subjects: newFaculty.subjects.split(',').map(s => s.trim()).filter(s => s),
      workload: parseInt(newFaculty.workload),
      building: newFaculty.building,
      officeHours: newFaculty.officeHours,
      phone: newFaculty.phone
    };

    setFacultyMembers([...facultyMembers, facultyToAdd]);
    setNewFaculty({
      name: '',
      email: '',
      department: 'Computer Science',
      subjects: '',
      workload: '',
      building: '',
      officeHours: '',
      phone: ''
    });
    setIsAddModalOpen(false);
  };

  // Edit Faculty Functionality
  const handleEditFaculty = () => {
    if (!editingFaculty.name || !editingFaculty.email || !editingFaculty.workload) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedFaculty = facultyMembers.map(faculty =>
      faculty.id === editingFaculty.id 
        ? {
            ...editingFaculty,
            subjects: typeof editingFaculty.subjects === 'string' 
              ? editingFaculty.subjects.split(',').map(s => s.trim()).filter(s => s)
              : editingFaculty.subjects,
            workload: parseInt(editingFaculty.workload)
          }
        : faculty
    );

    setFacultyMembers(updatedFaculty);
    setIsEditModalOpen(false);
    setEditingFaculty(null);
  };

  // Delete Faculty Functionality
  const handleDeleteFaculty = (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      setFacultyMembers(facultyMembers.filter(faculty => faculty.id !== id));
    }
  };

  // Open Edit Modal
  const openEditModal = (faculty) => {
    setEditingFaculty({
      ...faculty,
      subjects: Array.isArray(faculty.subjects) ? faculty.subjects.join(', ') : faculty.subjects
    });
    setIsEditModalOpen(true);
  };

  // Close Modals
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingFaculty(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFaculty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingFaculty(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content with extra top padding to avoid navbar overlap */}
      <div className="pt-24 p-4 md:p-6">
        {/* Header Section */}
        <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Faculty Management
            </h1>
            <p className="text-lg text-gray-600">
              Manage faculty members, workloads, and teaching assignments
            </p>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search faculty...
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, email, or subject..."
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
                <option value="All Departments">All Departments</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Faculty Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredFaculty.map((faculty) => (
            <div key={faculty.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{faculty.name}</h3>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {faculty.department}
                  </span>
                </div>
                <p className="text-blue-100 mt-1">{faculty.building}</p>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">{faculty.email}</span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-phone text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">{faculty.phone}</span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-clock text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">
                      <strong>Workload:</strong> {faculty.workload} hours/week
                    </span>
                  </div>

                  <div className="flex items-start">
                    <i className="fas fa-book text-gray-400 w-5 mt-1"></i>
                    <div className="ml-2">
                      <strong className="text-gray-700">Subjects:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {faculty.subjects.map((subject, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-door-open text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">
                      <strong>Office Hours:</strong> {faculty.officeHours}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => openEditModal(faculty)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteFaculty(faculty.id)}
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

        {/* Empty State */}
        {filteredFaculty.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-user-graduate text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">No faculty members found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add New Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Add New Faculty</h2>
              <p className="text-blue-100 mt-1">Enter faculty member details</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newFaculty.name}
                      onChange={handleInputChange}
                      placeholder="Dr. John Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={newFaculty.email}
                      onChange={handleInputChange}
                      placeholder="john.smith@university.edu"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={newFaculty.department}
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
                      Workload (hours/week) *
                    </label>
                    <input
                      type="number"
                      name="workload"
                      value={newFaculty.workload}
                      onChange={handleInputChange}
                      placeholder="12"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects
                  </label>
                  <input
                    type="text"
                    name="subjects"
                    value={newFaculty.subjects}
                    onChange={handleInputChange}
                    placeholder="Data Structures, Algorithms, Web Development"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate subjects with commas</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building
                    </label>
                    <select
                      name="building"
                      value={newFaculty.building}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Building</option>
                      {buildings.map(building => (
                        <option key={building} value={building}>{building}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={newFaculty.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    value={newFaculty.officeHours}
                    onChange={handleInputChange}
                    placeholder="Mon-Wed 2-4 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFaculty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {isEditModalOpen && editingFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Edit Faculty</h2>
              <p className="text-blue-100 mt-1">Update faculty information</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editingFaculty.name}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editingFaculty.email}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={editingFaculty.department}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Workload (hours/week) *
                    </label>
                    <input
                      type="number"
                      name="workload"
                      value={editingFaculty.workload}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subjects
                  </label>
                  <input
                    type="text"
                    name="subjects"
                    value={editingFaculty.subjects}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building
                    </label>
                    <select
                      name="building"
                      value={editingFaculty.building}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Building</option>
                      {buildings.map(building => (
                        <option key={building} value={building}>{building}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={editingFaculty.phone}
                      onChange={handleEditInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Office Hours
                  </label>
                  <input
                    type="text"
                    name="officeHours"
                    value={editingFaculty.officeHours}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFaculty}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Faculty Button */}
      <div className="fixed bottom-6 right-6">
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <i className="fas fa-plus text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Faculty;