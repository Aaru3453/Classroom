import React, { useState } from 'react';

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      code: "ADER2353",
      name: "Workshop - A wing",
      capacity: 20,
      building: "A wing",
      equipment: ["Projector"],
      status: "Available",
      type: "Workshop"
    },
    {
      id: 2,
      code: "A101",
      name: "Lecture Hall - Main Academic Building",
      capacity: 60,
      building: "Main Academic Building",
      equipment: ["Projector", "Whiteboard", "Sound System"],
      status: "Available",
      type: "Lecture Hall"
    },
    {
      id: 3,
      code: "B205",
      name: "Seminar Room - Humanities Block",
      capacity: 30,
      building: "Humanities Block",
      equipment: ["Projector", "Smart Board"],
      status: "Available",
      type: "Seminar Room"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBuilding, setSelectedBuilding] = useState('All Buildings');
  const [selectedType, setSelectedType] = useState('All Room Types');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  
  const [newClassroom, setNewClassroom] = useState({
    code: '',
    name: '',
    capacity: '',
    building: '',
    type: '',
    equipment: '',
    status: true
  });

  // Room types for dropdown
  const roomTypes = [
    'Lecture Hall',
    'Seminar Room',
    'Workshop',
    'Lab',
    'Computer Lab',
    'Conference Room'
  ];

  // Get unique buildings for filters
  const buildings = ['All Buildings', ...new Set(classrooms.map(room => room.building))];

  // Filter classrooms
  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch = classroom.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classroom.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBuilding = selectedBuilding === 'All Buildings' || classroom.building === selectedBuilding;
    const matchesType = selectedType === 'All Room Types' || classroom.type === selectedType;
    
    return matchesSearch && matchesBuilding && matchesType;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedBuilding('All Buildings');
    setSelectedType('All Room Types');
  };

  const deleteClassroom = (id) => {
    setClassrooms(classrooms.filter(room => room.id !== id));
  };

  // Edit classroom function
  const handleEditClick = (classroom) => {
    setEditingClassroom(classroom);
    setNewClassroom({
      code: classroom.code,
      name: classroom.name,
      capacity: classroom.capacity.toString(),
      building: classroom.building,
      type: classroom.type,
      equipment: classroom.equipment.join(', '),
      status: classroom.status === 'Available'
    });
    setShowEditModal(true);
  };

  // Update classroom function
  const handleUpdateClassroom = () => {
    if (!newClassroom.code || !newClassroom.capacity || !newClassroom.building || !newClassroom.type) {
      alert('Please fill in all required fields');
      return;
    }

    const updatedClassroom = {
      ...editingClassroom,
      code: newClassroom.code,
      name: `${newClassroom.type} - ${newClassroom.building}`,
      capacity: parseInt(newClassroom.capacity),
      building: newClassroom.building,
      equipment: newClassroom.equipment.split(',').map(item => item.trim()).filter(item => item),
      status: newClassroom.status ? 'Available' : 'Unavailable',
      type: newClassroom.type
    };

    setClassrooms(classrooms.map(room => 
      room.id === editingClassroom.id ? updatedClassroom : room
    ));
    setShowEditModal(false);
    setEditingClassroom(null);
    setNewClassroom({
      code: '',
      name: '',
      capacity: '',
      building: '',
      type: '',
      equipment: '',
      status: true
    });
  };

  const handleAddClassroom = () => {
    if (!newClassroom.code || !newClassroom.capacity || !newClassroom.building || !newClassroom.type) {
      alert('Please fill in all required fields');
      return;
    }

    const classroom = {
      id: classrooms.length + 1,
      code: newClassroom.code,
      name: `${newClassroom.type} - ${newClassroom.building}`,
      capacity: parseInt(newClassroom.capacity),
      building: newClassroom.building,
      equipment: newClassroom.equipment.split(',').map(item => item.trim()).filter(item => item),
      status: newClassroom.status ? 'Available' : 'Unavailable',
      type: newClassroom.type
    };

    setClassrooms([...classrooms, classroom]);
    setShowAddModal(false);
    setNewClassroom({
      code: '',
      name: '',
      capacity: '',
      building: '',
      type: '',
      equipment: '',
      status: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewClassroom(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content with extra top padding to avoid navbar overlap */}
      <div className="pt-24 p-4 md:p-6"> {/* <-- Changed from pt-16 to pt-24 */}
        {/* Header Section */}
        <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               Classroom Management
            </h1>
            <p className="text-lg text-gray-600">
                Manage classroom information and availability
            </p>
        </div>
        


        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search classrooms...
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
              <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                Building
              </label>
              <select
                id="building"
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {buildings.map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Room Type
              </label>
              <select
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {['All Room Types', ...roomTypes].map(type => (
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

        {/* Classroom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredClassrooms.map((classroom) => (
            <div key={classroom.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold text-white">{classroom.code}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    classroom.status === 'Available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {classroom.status}
                  </span>
                </div>
                <p className="text-blue-100 mt-1">{classroom.name}</p>
              </div>

              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-users text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">
                      <strong>Capacity:</strong> {classroom.capacity} students
                    </span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-building text-gray-400 w-5"></i>
                    <span className="ml-2 text-gray-700">{classroom.building}</span>
                  </div>

                  <div className="flex items-start">
                    <i className="fas fa-tools text-gray-400 w-5 mt-1"></i>
                    <div className="ml-2">
                      <strong className="text-gray-700">Equipment:</strong>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {classroom.equipment.map((item, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => handleEditClick(classroom)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit
                  </button>
                  <button 
                    onClick={() => deleteClassroom(classroom.id)}
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
        {filteredClassrooms.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-door-open text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">No classrooms found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add New Classroom Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Add New Classroom</h2>
              <p className="text-blue-100 mt-1">Enter classroom details</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newClassroom.code}
                      onChange={handleInputChange}
                      placeholder="e.g., A101, B205"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={newClassroom.capacity}
                      onChange={handleInputChange}
                      placeholder="e.g., 30, 50"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building *
                    </label>
                    <input
                      type="text"
                      name="building"
                      value={newClassroom.building}
                      onChange={handleInputChange}
                      placeholder="e.g., Main Building, Science Block"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <select
                      name="type"
                      value={newClassroom.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select room type</option>
                      {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Equipment
                  </label>
                  <input
                    type="text"
                    name="equipment"
                    value={newClassroom.equipment}
                    onChange={handleInputChange}
                    placeholder="e.g., Projector, Whiteboard, Audio System, Computers"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate equipment with commas</p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={newClassroom.status}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Available for booking
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
                onClick={handleAddClassroom}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Classroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Classroom Modal */}
      {showEditModal && editingClassroom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Edit Classroom</h2>
              <p className="text-blue-100 mt-1">Update classroom information</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Number *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newClassroom.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      name="capacity"
                      value={newClassroom.capacity}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building *
                    </label>
                    <input
                      type="text"
                      name="building"
                      value={newClassroom.building}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Room Type *
                    </label>
                    <select
                      name="type"
                      value={newClassroom.type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select room type</option>
                      {roomTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Equipment
                  </label>
                  <input
                    type="text"
                    name="equipment"
                    value={newClassroom.equipment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={newClassroom.status}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-700">
                    Available for booking
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
                onClick={handleUpdateClassroom}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Update Classroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Classroom Button */}
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

export default Classroom;
