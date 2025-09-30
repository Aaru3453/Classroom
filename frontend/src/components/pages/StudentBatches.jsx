import React, { useState } from 'react';

const StudentBatches = () => {
  const [batches, setBatches] = useState([
    {
      id: 1,
      name: "Computer Science 2024",
      code: "CS2024",
      department: "Computer Science",
      semesters: [
        {
          semester: 1,
          name: "First Semester",
          subjects: [
            { id: 1, name: "Programming Fundamentals" },
            { id: 2, name: "Data Structures" },
            { id: 3, name: "Discrete Mathematics" },
            { id: 4, name: "Digital Electronics" },
            { id: 5, name: "Computer Organization" },
            { id: 6, name: "Operating Systems" },
            { id: 7, name: "Database Management" },
            { id: 8, name: "Web Technologies" }
          ]
        },
        {
          semester: 2,
          name: "Second Semester",
          subjects: [
            { id: 1, name: "Algorithms Analysis" },
            { id: 2, name: "Object Oriented Programming" },
            { id: 3, name: "Computer Networks" },
            { id: 4, name: "Software Engineering" },
            { id: 5, name: "Theory of Computation" },
            { id: 6, name: "Artificial Intelligence" },
            { id: 7, name: "Machine Learning" },
            { id: 8, name: "Cloud Computing" }
          ]
        },
        {
          semester: 3,
          name: "Third Semester",
          subjects: [
            { id: 1, name: "Algorithms Analysis" },
            { id: 2, name: "Object Oriented Programming" },
            { id: 3, name: "Computer Networks" },
            { id: 4, name: "Software Engineering" },
            { id: 5, name: "Theory of Computation" },
            { id: 6, name: "Artificial Intelligence" },
            { id: 7, name: "Machine Learning" },
            { id: 8, name: "Cloud Computing" }
          ]
        },
        {
          semester: 4,
          name: "Fourth Semester",
          subjects: [
            { id: 1, name: "Algorithms Analysis" },
            { id: 2, name: "Object Oriented Programming" },
            { id: 3, name: "Computer Networks" },
            { id: 4, name: "Software Engineering" },
            { id: 5, name: "Theory of Computation" },
            { id: 6, name: "Artificial Intelligence" },
            { id: 7, name: "Machine Learning" },
            { id: 8, name: "Cloud Computing" }
          ]
        },
        {
          semester: 5,
          name: "Fifth Semester",
          subjects: [
            { id: 1, name: "Algorithms Analysis" },
            { id: 2, name: "Object Oriented Programming" },
            { id: 3, name: "Computer Networks" },
            { id: 4, name: "Software Engineering" },
            { id: 5, name: "Theory of Computation" },
            { id: 6, name: "Artificial Intelligence" },
            { id: 7, name: "Machine Learning" },
            { id: 8, name: "Cloud Computing" }
          ]
        },
        {
          semester: 6,
          name: "Sixth Semester",
          subjects: [
            { id: 1, name: "Algorithms Analysis" },
            { id: 2, name: "Object Oriented Programming" },
            { id: 3, name: "Computer Networks" },
            { id: 4, name: "Software Engineering" },
            { id: 5, name: "Theory of Computation" },
            { id: 6, name: "Artificial Intelligence" },
            { id: 7, name: "Machine Learning" },
            { id: 8, name: "Cloud Computing" }
          ]
        },
        {
          semester: 7,
          name: "Seventh Semester",
          subjects: [
            { id: 1, name: "Algorithms Analysis" },
            { id: 2, name: "Object Oriented Programming" },
            { id: 3, name: "Computer Networks" },
            { id: 4, name: "Software Engineering" },
            { id: 5, name: "Theory of Computation" },
            { id: 6, name: "Artificial Intelligence" },
            { id: 7, name: "Machine Learning" },
            { id: 8, name: "Cloud Computing" }
          ]
        },
        {
          semester: 8,
          name: "Eighth Semester",
          subjects: [
            { id: 1, name: "Algorithms Analysis" },
            { id: 2, name: "Object Oriented Programming" },
            { id: 3, name: "Computer Networks" },
            { id: 4, name: "Software Engineering" },
            { id: 5, name: "Theory of Computation" },
            { id: 6, name: "Artificial Intelligence" },
            { id: 7, name: "Machine Learning" },
            { id: 8, name: "Cloud Computing" }
          ]
        },
        // ... other semesters remain the same
      ]
    }
  ]);

  const [departments, setDepartments] = useState([
    "Computer Science", 
    "Electrical Engineering", 
    "Mechanical Engineering", 
    "Civil Engineering",
    "Mathematics"
  ]);

  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] = useState(false);
  const [isEditBatchModalOpen, setIsEditBatchModalOpen] = useState(false);
  const [isEditSubjectModalOpen, setIsEditSubjectModalOpen] = useState(false);
  const [newDepartment, setNewDepartment] = useState("");
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({ name: "" });
  const [batchForm, setBatchForm] = useState({
    name: "",
    code: "",
    department: "Computer Science"
  });
  const [editingBatchId, setEditingBatchId] = useState(null); // New state to track which batch is being edited

  // Filter batches by department
  const filteredBatches = selectedDepartment === "All Departments" 
    ? batches 
    : batches.filter(batch => batch.department === selectedDepartment);

  // Get selected batch data
  const selectedBatchData = batches.find(batch => batch.id === selectedBatch);

  // Get selected semester data
  const selectedSemesterData = selectedBatchData?.semesters.find(sem => sem.name === selectedSemester);

  // Add new department
  const addNewDepartment = () => {
    if (newDepartment.trim() && !departments.includes(newDepartment.trim())) {
      setDepartments([...departments, newDepartment.trim()]);
      setNewDepartment("");
      setIsAddDepartmentModalOpen(false);
    }
  };

  // Open edit batch modal - FIXED FUNCTION
  const openEditBatchModal = (batch = null) => {
    if (batch) {
      // Editing existing batch
      setBatchForm({
        name: batch.name,
        code: batch.code,
        department: batch.department
      });
      setEditingBatchId(batch.id); // Set the batch ID being edited
    } else {
      // Adding new batch
      setBatchForm({
        name: "",
        code: "",
        department: departments[0]
      });
      setEditingBatchId(null); // Reset for new batch
    }
    setIsEditBatchModalOpen(true);
  };

  // Save batch (add or edit) - FIXED FUNCTION
  const saveBatch = () => {
    if (batchForm.name.trim() && batchForm.code.trim()) {
      if (editingBatchId) {
        // Update existing batch - FIXED LOGIC
        const updatedBatches = batches.map(batch =>
          batch.id === editingBatchId
            ? { 
                ...batch, 
                name: batchForm.name.trim(),
                code: batchForm.code.trim(),
                department: batchForm.department
              }
            : batch
        );
        setBatches(updatedBatches);
        
        // If we're editing the currently selected batch, update the selection
        if (selectedBatch === editingBatchId) {
          setSelectedBatch(editingBatchId);
        }
      } else {
        // Add new batch with 8 semesters
        const newBatch = {
          id: Math.max(...batches.map(b => b.id), 0) + 1,
          name: batchForm.name.trim(),
          code: batchForm.code.trim(),
          department: batchForm.department,
          semesters: Array.from({ length: 8 }, (_, index) => ({
            semester: index + 1,
            name: `${getOrdinalNumber(index + 1)} Semester`,
            subjects: Array.from({ length: 8 }, (_, subIndex) => ({
              id: subIndex + 1,
              name: `Subject ${subIndex + 1}`
            }))
          }))
        };
        setBatches([...batches, newBatch]);
      }
      setIsEditBatchModalOpen(false);
      setBatchForm({ name: "", code: "", department: departments[0] });
      setEditingBatchId(null); // Reset editing ID
    }
  };

  // Helper function to get ordinal numbers
  const getOrdinalNumber = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  // Edit subject
  const editSubject = (subject) => {
    setEditingSubject(subject);
    setSubjectForm({ name: subject.name });
    setIsEditSubjectModalOpen(true);
  };

  // Save subject changes
  const saveSubject = () => {
    if (subjectForm.name.trim() && selectedBatchData && selectedSemesterData) {
      const updatedBatches = batches.map(batch => {
        if (batch.id === selectedBatch) {
          const updatedSemesters = batch.semesters.map(semester => {
            if (semester.name === selectedSemester) {
              const updatedSubjects = semester.subjects.map(subject =>
                subject.id === editingSubject.id 
                  ? { ...subject, name: subjectForm.name.trim() }
                  : subject
              );
              return { ...semester, subjects: updatedSubjects };
            }
            return semester;
          });
          return { ...batch, semesters: updatedSemesters };
        }
        return batch;
      });

      setBatches(updatedBatches);
      setIsEditSubjectModalOpen(false);
      setEditingSubject(null);
      setSubjectForm({ name: "" });
    }
  };

  // Delete subject
  const deleteSubject = (subjectId) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      const updatedBatches = batches.map(batch => {
        if (batch.id === selectedBatch) {
          const updatedSemesters = batch.semesters.map(semester => {
            if (semester.name === selectedSemester) {
              const updatedSubjects = semester.subjects.filter(subject => subject.id !== subjectId);
              if (updatedSubjects.length < 8) {
                updatedSubjects.push({ id: Date.now(), name: "New Subject" });
              }
              return { ...semester, subjects: updatedSubjects };
            }
            return semester;
          });
          return { ...batch, semesters: updatedSemesters };
        }
        return batch;
      });

      setBatches(updatedBatches);
    }
  };

  // Delete batch
  const deleteBatch = (batchId) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      setBatches(batches.filter(batch => batch.id !== batchId));
      if (selectedBatch === batchId) {
        setSelectedBatch(null);
        setSelectedSemester("");
      }
    }
  };

  // Handle semester selection
  const handleSemesterSelect = (semesterName) => {
    setSelectedSemester(semesterName);
  };

  // Reset selections
  const resetSelections = () => {
    setSelectedBatch(null);
    setSelectedSemester("");
  };

  // Semester View - Shows all 8 subjects
  if (selectedBatch && selectedSemester && selectedSemesterData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {selectedBatchData.name} - {selectedSemesterData.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Department: {selectedBatchData.department}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={resetSelections}
                className="px-4 py-2  bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Back to Batches
              </button>
            </div>
          </div>

          {/* Subjects Grid - 8 subjects */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedSemesterData.subjects.map((subject, index) => (
              <div key={subject.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow relative">
                {/* Edit/Delete Buttons */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => editSubject(subject)}
                    className="w-6 h-6 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex items-center justify-center"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="w-6 h-6 bg-red-500 text-white rounded text-xs hover:bg-red-600 flex items-center justify-center"
                  >
                    🗑️
                  </button>
                </div>
                
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{subject.name}</h3>
                <p className="text-gray-500 text-sm">Subject {index + 1}</p>
              </div>
            ))}
          </div>

          {/* Add Subject Button */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                const newSubject = { id: Date.now(), name: "New Subject" };
                editSubject(newSubject);
              }}
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              + Add New Subject
            </button>
          </div>
        </div>

        {/* Edit Subject Modal */}
        {isEditSubjectModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingSubject.id > 8 ? 'Add New Subject' : 'Edit Subject'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                    <input
                      type="text"
                      value={subjectForm.name}
                      onChange={(e) => setSubjectForm({ name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter subject name"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsEditSubjectModalOpen(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveSubject}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingSubject.id > 8 ? 'Add Subject' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Semester Selection View
  if (selectedBatch && selectedBatchData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Select Semester - {selectedBatchData.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Department: {selectedBatchData.department}
              </p>
            </div>
            <div className="flex gap-2">
              {/* Edit Batch button REMOVED from here */}
              <button
                onClick={resetSelections}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                ← Back to Batches
              </button>
            </div>
          </div>

          {/* Semester Dropdown */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Semester
            </label>
            <select
              value={selectedSemester}
              onChange={(e) => handleSemesterSelect(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            >
              <option value="">Choose a semester...</option>
              {selectedBatchData.semesters.map((semester) => (
                <option key={semester.semester} value={semester.name}>
                  {semester.name}
                </option>
              ))}
            </select>
            
            {selectedSemester && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-700">
                  Selected: <strong>{selectedSemester}</strong>
                </p>
                <button
                  onClick={() => handleSemesterSelect(selectedSemester)}
                  className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  View Subjects
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Batch Modal - MOVED HERE to fix z-index issues */}
        {isEditBatchModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingBatchId ? 'Edit Batch' : 'Add New Batch'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                    <input
                      type="text"
                      value={batchForm.name}
                      onChange={(e) => setBatchForm({...batchForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter batch name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Code</label>
                    <input
                      type="text"
                      value={batchForm.code}
                      onChange={(e) => setBatchForm({...batchForm, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter batch code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={batchForm.department}
                      onChange={(e) => setBatchForm({...batchForm, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsEditBatchModalOpen(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveBatch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingBatchId ? 'Update Batch' : 'Add Batch'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Batches List View
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
         <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               Student Batches
            </h1>
            <p className="text-lg text-gray-600">
                Manage departments, batches, and semesters
            </p>
        </div>

        {/* Department Filter with Add Button */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Department
              </label>
              <div className="flex gap-4">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All Departments">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                <button
                  onClick={() => setIsAddDepartmentModalOpen(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  + Add Department
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Add Batch Button - ADDED BACK */}
        <div className="mb-6">
          <button
            onClick={() => openEditBatchModal()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            + Add New Batch
          </button>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredBatches.map((batch) => (
            <div key={batch.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{batch.name}</h2>
                  <p className="text-gray-600 mt-1">{batch.code} • {batch.department}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditBatchModal(batch)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBatch(batch.id)}
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
              </div>

              <button
                onClick={() => setSelectedBatch(batch.id)}
                className="w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                View Semesters →
              </button>
            </div>
          ))}
        </div>

        {/* No batches message */}
        {filteredBatches.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <p className="text-gray-500 text-lg">No batches found for {selectedDepartment}.</p>
              {/* Add New Batch button - ADDED BACK */}
              <button
                onClick={() => openEditBatchModal()}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                + Add New Batch
              </button>
            </div>
          </div>
        )}

        {/* Add Department Modal */}
        {isAddDepartmentModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Department</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                    <input
                      type="text"
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter department name"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsAddDepartmentModalOpen(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addNewDepartment}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Department
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Add Batch Modal */}
        {isEditBatchModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {editingBatchId ? 'Edit Batch' : 'Add New Batch'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
                    <input
                      type="text"
                      value={batchForm.name}
                      onChange={(e) => setBatchForm({...batchForm, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter batch name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Code</label>
                    <input
                      type="text"
                      value={batchForm.code}
                      onChange={(e) => setBatchForm({...batchForm, code: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter batch code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={batchForm.department}
                      onChange={(e) => setBatchForm({...batchForm, department: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setIsEditBatchModalOpen(false)}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveBatch}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingBatchId ? 'Update Batch' : 'Add Batch'}
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

export default StudentBatches;