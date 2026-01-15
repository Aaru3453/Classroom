// classroom/frontend/src/components/pages/Classroom.jsx
import React, { useState, useEffect } from "react";
import { classroomAPI } from '../../services/api';

const Classroom = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterBuilding, setFilterBuilding] = useState("All");

  const [newClassroom, setNewClassroom] = useState({
    name: "",
    building: "",
    capacity: "",
    type: "Lecture Hall",
    equipment: [],
    availability: "Available"
  });

  const equipmentOptions = ["Projector", "Smart Board", "Computers", "Sound System", "Lab Equipment", "Whiteboard", "Video Conference", "Air Conditioning", "Network"];
  const buildingOptions = [
    "IT Building",
    "Main Academic Building",
    "Science Building",
    "Engineering Building",
    "Humanities Block",
    "Library Building"
  ];

  const typeOptions = ["Lecture Hall", "Lab", "Seminar Room", "Auditorium", "Tutorial Room"];

  // Fetch classrooms from API
  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const response = await classroomAPI.getAll();
      setClassrooms(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch classrooms. Please try again.');
      console.error('Error fetching classrooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);


  const handleAddClassroom = async () => {
    const payload = {
      name: newClassroom.name.trim(),
      building: newClassroom.building,
      type: newClassroom.type,
      availability: newClassroom.availability,
      equipment: newClassroom.equipment || [],
      capacity: Number(newClassroom.capacity),
    };

    if (Number.isNaN(payload.capacity)) {
      alert("Capacity must be a valid number");
      return;
    }

    try {
      if (editingClassroom) {
        await classroomAPI.update(editingClassroom._id, payload);
      } else {
        await classroomAPI.create(payload);
      }

      await fetchClassrooms();   // 🔥 THIS UPDATES UI

      setShowAddModal(false);
      setEditingClassroom(null);

      setSearchTerm("");
      setFilterType("All");
      setFilterBuilding("All");

      setNewClassroom({
        name: "",
        building: "",
        capacity: "",
        type: "Lecture Hall",
        equipment: [],
        availability: "Available",
      });

    } catch (err) {
      console.error(err);
      alert("Failed to save classroom");
    }
  };



  const handleDeleteClassroom = async (id) => {
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      try {
        await classroomAPI.delete(id);
        await fetchClassrooms(); // Refresh the list
      } catch (err) {
        alert('Failed to delete classroom. Please try again.');
        console.error('Error deleting classroom:', err);
      }
    }
  };

  const handleEditClassroom = (classroom) => {
    if (!classroom) return;

    setEditingClassroom(classroom);

    setNewClassroom({
      name: classroom.name || "",
      building: classroom.building || "",
      capacity: classroom.capacity ? classroom.capacity.toString() : "",
      type: classroom.type || "Lecture Hall",
      equipment: classroom.equipment || [],
      availability: classroom.availability || "Available",
    });

    setShowAddModal(true);
  };


  const toggleEquipment = (equipment) => {
    setNewClassroom(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipment)
        ? prev.equipment.filter(e => e !== equipment)
        : [...prev.equipment, equipment]
    }));
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "Available": return "bg-green-100 text-green-800";
      case "In Use": return "bg-yellow-100 text-yellow-800";
      case "Under Maintenance": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredClassrooms = classrooms.filter(classroom => {
    const matchesSearch =
      classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classroom.building.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      filterType === "All" || classroom.type === filterType;

    const matchesBuilding =
      filterBuilding === "All" || classroom.building === filterBuilding;

    return matchesSearch && matchesType && matchesBuilding;
  });


  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading classrooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={fetchClassrooms}
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
            Classrooms
          </h1>
          <p className="text-lg text-gray-600">
            Manage classrooms, labs, and facilities
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search classrooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Types</option>
                {typeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={filterBuilding}
                onChange={(e) => setFilterBuilding(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="All">All Buildings</option>
                {buildingOptions.map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setEditingClassroom(null);
                setNewClassroom({
                  name: "",
                  building: "",
                  capacity: "",
                  type: "Lecture Hall",
                  equipment: [],
                  availability: "Available"
                });
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Classroom
            </button>
          </div>
        </div>

        {/* Classrooms Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClassrooms.map(classroom => (
            <div key={`${classroom._id}-${classroom.updatedAt}`} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                {/* Classroom Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{classroom.name}</h3>
                    <p className="text-gray-600 text-sm">{classroom.building}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(classroom.availability)}`}>
                    {classroom.availability}
                  </span>
                </div>

                {/* Classroom Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-users mr-3 text-gray-400"></i>
                    <span>Capacity: <strong>{classroom.capacity} students</strong></span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-building mr-3 text-gray-400"></i>
                    <span>Type: <strong>{classroom.type}</strong></span>
                  </div>

                  {/* Equipment */}
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {classroom.equipment.map(item => (
                        <span key={item} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4 border-t border-gray-100 relative z-10">
                  <button
                    type="button"
                    onClick={() => {
                      console.log("EDIT CLICKED:", classroom);
                      handleEditClassroom(classroom);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 text-sm font-medium cursor-pointer"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteClassroom(classroom._id)}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 text-sm font-medium cursor-pointer"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Classroom Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingClassroom ? "Edit Classroom" : "Add New Classroom"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Classroom Name *
                    </label>
                    <input
                      type="text"
                      value={newClassroom.name}
                      onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Lecture Hall A101"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Building *
                    </label>
                    <select
                      value={newClassroom.building}
                      onChange={(e) => setNewClassroom({ ...newClassroom, building: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Building</option>
                      {buildingOptions.map(building => (
                        <option key={building} value={building}>{building}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity *
                    </label>
                    <input
                      type="number"
                      value={newClassroom.capacity}
                      onChange={(e) => setNewClassroom({ ...newClassroom, capacity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={newClassroom.type}
                      onChange={(e) => setNewClassroom({ ...newClassroom, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {typeOptions.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Availability
                    </label>
                    <select
                      value={newClassroom.availability}
                      onChange={(e) => setNewClassroom({ ...newClassroom, availability: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Available">Available</option>
                      <option value="In Use">In Use</option>
                      <option value="Under Maintenance">Under Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Equipment
                    </label>
                    <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-md p-3 max-h-32 overflow-y-auto">
                      {equipmentOptions.map(item => (
                        <label key={item} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newClassroom.equipment.includes(item)}
                            onChange={() => toggleEquipment(item)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingClassroom(null);
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleAddClassroom}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingClassroom ? "Update" : "Add Classroom"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Classroom;