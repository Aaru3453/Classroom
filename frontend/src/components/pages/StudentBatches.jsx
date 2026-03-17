// import React, { useState, useEffect } from "react";
// import batchService from '../../services/batchService';
// import subjectService from '../../services/subjectService';

// const StudentBatches = () => {
//   const [batches, setBatches] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
//   const [selectedSemester, setSelectedSemester] = useState("All Semesters");
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editingBatch, setEditingBatch] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [apiError, setApiError] = useState(null);
//   const [selectedBatch, setSelectedBatch] = useState(null);
//   const [showSubjectsModal, setShowSubjectsModal] = useState(false);
//   const [realSubjects, setRealSubjects] = useState([]);
//   const [batchSubjects, setBatchSubjects] = useState([]);
//   const [loadingSubjects, setLoadingSubjects] = useState(false);

//   // Get current year
//   const currentYear = new Date().getFullYear();

//   const [newBatch, setNewBatch] = useState({
//     name: "",
//     code: "",
//     department: "Computer Science Engineering",
//     academicYear: currentYear,
//     currentSemester: 1, 
//     startYear: currentYear,
//     endYear: currentYear + 4,
//     totalStudents: 0,
//     status: "Active"
//   });

//   // Departments and semesters for dropdowns
//   const departments = [
//     "Computer Science Engineering",
//     "Information Technology",
//     "Computer Technology",
//     "Industrial-IOT",
//     "Artificial Intelligence",
//     "Civil Engineering",
//     "Electrical Engineering",
//     "Mechanical Engineering",
//     "Robotics"
//   ];

//   const statusOptions = ["Active", "Graduated", "Inactive"];
  
//   const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

//   // Convert semester number to text for display
//   const getSemesterText = (semesterNumber) => {
//     return `Semester ${semesterNumber}`;
//   };

//   // Fetch batches from API
//   const fetchBatches = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await batchService.getAll();

//       // Handle different response structures
//       let batchesData = [];
//       if (response.data) {
//         if (Array.isArray(response.data.data)) {
//           batchesData = response.data.data;
//         } else if (Array.isArray(response.data)) {
//           batchesData = response.data;
//         }
//       }

//       // ✅ FIXED: Fetch subjects and count them properly
//       const allSubjects = await fetchAllSubjects();
      
//       const batchesWithDefaults = batchesData.map(batch => {
//         // Count subjects for this batch
//         let subjectCount = 0;
//         if (allSubjects.length > 0) {
//           subjectCount = allSubjects.filter(subject => 
//             subject.department === batch.department && 
//             subject.semester === getSemesterText(batch.currentSemester)
//           ).length;
//         }
        
//         return {
//           ...batch,
//           semesterText: getSemesterText(batch.currentSemester || 1),
//           subjectCount: subjectCount
//         };
//       });

//       setBatches(batchesWithDefaults);
//     } catch (err) {
//       const errorMessage = 
//         err.response?.data?.message || 
//         "Failed to fetch batches. Please try again.";
//       setError(errorMessage);
//       console.error("Error fetching batches:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all subjects from the subject API
//   const fetchAllSubjects = async () => {
//     try {
//       const response = await subjectService.getAll();
//       const subjects = response.data?.data || [];
//       setRealSubjects(subjects);
//       return subjects;
//     } catch (err) {
//       console.error('Error fetching all subjects:', err);
//       return [];
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   // Handle view subjects for a batch
//   const handleViewSubjects = async (batch) => {
//     setSelectedBatch(batch);
//     setLoadingSubjects(true);
    
//     try {
//       // Fetch all subjects
//       const allSubjects = await fetchAllSubjects();
      
//       if (allSubjects.length > 0 && batch) {
//         // Filter subjects by batch department and current semester
//         const filteredSubjects = allSubjects.filter(subject => 
//           subject.department === batch.department && 
//           subject.semester === getSemesterText(batch.currentSemester)
//         );
        
//         setBatchSubjects(filteredSubjects);
//       } else {
//         setBatchSubjects([]);
//       }
//     } catch (err) {
//       console.error('Error fetching subjects:', err);
//       setBatchSubjects([]);
//     } finally {
//       setLoadingSubjects(false);
//     }
    
//     setShowSubjectsModal(true);
//   };

//   // When academic year changes, update start and end years automatically
//   const handleAcademicYearChange = (e) => {
//     const { name, value } = e.target;
//     const yearValue = parseInt(value) || currentYear;
    
//     setNewBatch(prev => ({
//       ...prev,
//       [name]: yearValue,
//       startYear: yearValue,
//       endYear: yearValue + 4
//     }));
//   };

//   // Filter batches - ✅ FIXED: Ensure safe access
//   const filteredBatches = (batches || []).filter((batch) => {
//     if (!batch || typeof batch !== "object") return false;
    
//     const name = batch.name || "";
//     const code = batch.code || "";
//     const batchDepartment = batch.department || "";
//     const batchSemester = batch.currentSemester || 1;

//     const matchesSearch =
//       name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       code.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       batchDepartment.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesDepartment =
//       selectedDepartment === "All Departments" ||
//       batchDepartment === selectedDepartment;

//     // Convert filter to number for comparison
//     const filterSemesterNumber = selectedSemester === "All Semesters" 
//       ? null 
//       : parseInt(selectedSemester.replace("Semester ", ""));
    
//     const matchesSemester =
//       selectedSemester === "All Semesters" || 
//       batchSemester === filterSemesterNumber;

//     return matchesSearch && matchesDepartment && matchesSemester;
//   });

//   // Clear filters function
//   const clearFilters = () => {
//     setSearchTerm("");
//     setSelectedDepartment("All Departments");
//     setSelectedSemester("All Semesters");
//   };

//   // Delete batch function with confirmation
//   const handleDeleteBatch = async (id) => {
//     if (!id) {
//       alert("Invalid batch ID");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this batch?")) {
//       return;
//     }

//     try {
//       console.log("Deleting batch with ID:", id);
//       const response = await batchService.delete(id);
//       console.log("Batch deleted successfully:", response.data);

//       // Refresh the list
//       await fetchBatches();
//       alert("Batch deleted successfully!");
//     } catch (err) {
//       console.error("Error deleting batch:", err);

//       let errorMessage = "Failed to delete batch. Please try again.";
//       if (err.response?.data?.message) {
//         errorMessage = err.response.data.message;
//       }

//       alert(`Error: ${errorMessage}`);
//     }
//   };

//   // Open Edit Modal
//   const openEditModal = (batch) => {
//     if (!batch || !batch._id) {
//       alert("Invalid batch data");
//       return;
//     }

//     setEditingBatch(batch);
//     setNewBatch({
//       name: batch.name || "",
//       code: batch.code || "",
//       department: batch.department || "Computer Science Engineering",
//       academicYear: batch.academicYear || currentYear,
//       currentSemester: batch.currentSemester || 1,
//       startYear: batch.startYear || currentYear,
//       endYear: batch.endYear || currentYear + 4,
//       totalStudents: batch.totalStudents || 0,
//       status: batch.status || "Active"
//     });
//     setIsEditModalOpen(true);
//     setApiError(null);
//   };

//   // Close Modals
//   const closeModals = () => {
//     setIsAddModalOpen(false);
//     setIsEditModalOpen(false);
//     setEditingBatch(null);
//     setApiError(null);
//   };

//   // Handle input changes
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === "academicYear") {
//       handleAcademicYearChange(e);
//     } else {
//       setNewBatch((prev) => ({
//         ...prev,
//         [name]: name === "currentSemester" ? parseInt(value) : value,
//       }));
//     }
//   };

//   // ✅ FIXED: Add Batch Functionality
//   const handleAddBatch = async () => {
//     // Validate required fields
//     if (!newBatch.name.trim()) {
//       alert("Please enter batch name");
//       return;
//     }
//     if (!newBatch.code.trim()) {
//       alert("Please enter batch code");
//       return;
//     }
//     if (!newBatch.academicYear || isNaN(parseInt(newBatch.academicYear))) {
//       alert("Please enter valid academic year");
//       return;
//     }

//     setIsSubmitting(true);
//     setApiError(null);

//     try {
//       // Prepare data for API - ✅ currentSemester is already a number
//       const batchData = {
//         name: newBatch.name.trim(),
//         code: newBatch.code.trim(),
//         department: newBatch.department,
//         academicYear: parseInt(newBatch.academicYear),
//         currentSemester: newBatch.currentSemester,
//         startYear: parseInt(newBatch.startYear),
//         endYear: parseInt(newBatch.endYear),
//         totalStudents: parseInt(newBatch.totalStudents) || 0,
//         status: newBatch.status,
//       };

//       console.log("Adding batch with data:", batchData);

//       const response = await batchService.create(batchData);
//       console.log("Batch added successfully:", response.data);

//       // Refresh the list
//       await fetchBatches();

//       // Reset form
//       setNewBatch({
//         name: "",
//         code: "",
//         department: "Computer Science Engineering",
//         academicYear: currentYear,
//         currentSemester: 1,
//         startYear: currentYear,
//         endYear: currentYear + 4,
//         totalStudents: 0,
//         status: "Active"
//       });

//       setIsAddModalOpen(false);
//       alert("Batch added successfully!");
//     } catch (err) {
//       console.error("Error adding batch:", err);

//       // Extract error message
//       let errorMessage = "Failed to add batch. Please try again.";

//       if (err.response?.data) {
//         // Handle validation errors
//         if (err.response.data.errors) {
//           const errors = err.response.data.errors;
//           errorMessage = Object.values(errors)
//             .map((error) => error.message || error)
//             .join("\n");
//         } else if (err.response.data.message) {
//           errorMessage = err.response.data.message;
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }

//       setApiError(errorMessage);
//       alert(`Error: ${errorMessage}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // ✅ FIXED: Edit Batch Functionality
//   const handleEditBatch = async () => {
//     if (!editingBatch) return;

//     // Validate required fields
//     if (!newBatch.name.trim()) {
//       alert("Please enter batch name");
//       return;
//     }
//     if (!newBatch.code.trim()) {
//       alert("Please enter batch code");
//       return;
//     }
//     if (!newBatch.academicYear || isNaN(parseInt(newBatch.academicYear))) {
//       alert("Please enter valid academic year");
//       return;
//     }

//     setIsSubmitting(true);
//     setApiError(null);

//     try {
//       // Prepare data for API
//       const batchData = {
//         name: newBatch.name.trim(),
//         code: newBatch.code.trim(),
//         department: newBatch.department,
//         academicYear: parseInt(newBatch.academicYear),
//         currentSemester: newBatch.currentSemester,
//         startYear: parseInt(newBatch.startYear),
//         endYear: parseInt(newBatch.endYear),
//         totalStudents: parseInt(newBatch.totalStudents) || 0,
//         status: newBatch.status,
//       };

//       console.log("Updating batch with data:", batchData);

//       const response = await batchService.update(editingBatch._id, batchData);
//       console.log("Batch updated successfully:", response.data);

//       // Refresh the list
//       await fetchBatches();

//       setIsEditModalOpen(false);
//       setEditingBatch(null);
//       alert("Batch updated successfully!");
//     } catch (err) {
//       console.error("Error updating batch:", err);

//       // Extract error message
//       let errorMessage = "Failed to update batch. Please try again.";

//       if (err.response?.data) {
//         if (err.response.data.errors) {
//           const errors = err.response.data.errors;
//           errorMessage = Object.values(errors)
//             .map((error) => error.message || error)
//             .join("\n");
//         } else if (err.response.data.message) {
//           errorMessage = err.response.data.message;
//         }
//       } else if (err.message) {
//         errorMessage = err.message;
//       }

//       setApiError(errorMessage);
//       alert(`Error: ${errorMessage}`);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Close subjects modal
//   const handleCloseSubjects = () => {
//     setShowSubjectsModal(false);
//     setSelectedBatch(null);
//     setBatchSubjects([]);
//   };

//   // Get status color class
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Active": return "bg-green-100 text-green-800";
//       case "Graduated": return "bg-blue-100 text-blue-800";
//       case "Inactive": return "bg-gray-100 text-gray-800";
//       default: return "bg-gray-100 text-gray-800";
//     }
//   };

//   // Calculate batch statistics
//   const calculateStats = () => {
//     const totalBatches = (batches || []).length;
//     const activeBatches = (batches || []).filter(b => b.status === "Active").length;
//     const totalStudents = (batches || []).reduce((sum, batch) => sum + (batch.totalStudents || 0), 0);
    
//     return { totalBatches, activeBatches, totalStudents };
//   };

//   // Loading state
//   if (loading && (batches || []).length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading batches...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto">
//         {/* Header Section */}
//         <div className="pt-24 text-center mb-8">
//           <h1 className="text-4xl font-bold text-gray-800 mb-2">
//             Student Batches Management
//           </h1>
//           <p className="text-lg text-gray-600">
//             Manage departments, batches, and semesters
//           </p>
//         </div>

//         {/* Statistics Cards */}
//         {(batches || []).length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center">
//                 <div className="p-3 bg-blue-100 rounded-lg mr-4">
//                   <i className="fas fa-users text-blue-600 text-2xl"></i>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Batches</p>
//                   <p className="text-2xl font-bold text-gray-900">{calculateStats().totalBatches}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center">
//                 <div className="p-3 bg-green-100 rounded-lg mr-4">
//                   <i className="fas fa-check-circle text-green-600 text-2xl"></i>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Active Batches</p>
//                   <p className="text-2xl font-bold text-gray-900">{calculateStats().activeBatches}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <div className="flex items-center">
//                 <div className="p-3 bg-purple-100 rounded-lg mr-4">
//                   <i className="fas fa-user-graduate text-purple-600 text-2xl"></i>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Students</p>
//                   <p className="text-2xl font-bold text-gray-900">{calculateStats().totalStudents}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Error Display */}
//         {apiError && (
//           <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
//             <div className="flex justify-between items-center">
//               <span>{apiError}</span>
//               <button
//                 onClick={() => setApiError(null)}
//                 className="text-red-700 hover:text-red-900"
//               >
//                 ×
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Search and Filters Section */}
//         <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Search batches...
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <i className="fas fa-search text-gray-400"></i>
//                 </div>
//                 <input
//                   type="text"
//                   placeholder="Search by name, code or department..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Department
//               </label>
//               <select
//                 value={selectedDepartment}
//                 onChange={(e) => setSelectedDepartment(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="All Departments">All Departments</option>
//                 {departments.map((dept) => (
//                   <option key={dept} value={dept}>
//                     {dept}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Semester
//               </label>
//               <select
//                 value={selectedSemester}
//                 onChange={(e) => setSelectedSemester(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="All Semesters">All Semesters</option>
//                 {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
//                   <option key={sem} value={`Semester ${sem}`}>
//                     Semester {sem}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-between items-center">
//             <button
//               onClick={clearFilters}
//               className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
//             >
//               Clear Filters
//             </button>
//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
//             >
//               <i className="fas fa-plus mr-2"></i>
//               Add New Batch
//             </button>
//           </div>
//         </div>

//         {/* Error State */}
//         {error && (batches || []).length === 0 && (
//           <div className="text-center py-12">
//             <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
//             <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
//             <button
//               onClick={fetchBatches}
//               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
//             >
//               Retry Loading
//             </button>
//           </div>
//         )}

//         {/* Batches Grid */}
//         {!error && (
//           <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//             {filteredBatches.map((batch) => (
//               <div
//                 key={batch._id}
//                 className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
//               >
//                 <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="text-xl font-bold text-white">
//                         {batch.name}
//                       </h3>
//                       <p className="text-blue-100 text-sm mt-1">{batch.code}</p>
//                     </div>
//                     <span
//                       className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(batch.status)}`}
//                     >
//                       {batch.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="p-4">
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <i className="fas fa-building text-gray-400 w-5"></i>
//                       <span className="ml-2 text-gray-700">
//                         <strong>Department:</strong> {batch.department}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       <i className="fas fa-calendar text-gray-400 w-5"></i>
//                       <span className="ml-2 text-gray-700">
//                         <strong>Academic Year:</strong> {batch.academicYear}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       <i className="fas fa-layer-group text-gray-400 w-5"></i>
//                       <span className="ml-2 text-gray-700">
//                         <strong>Semester:</strong> {batch.semesterText}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       <i className="fas fa-users text-gray-400 w-5"></i>
//                       <span className="ml-2 text-gray-700">
//                         <strong>Students:</strong> {batch.totalStudents}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       <i className="fas fa-book text-gray-400 w-5"></i>
//                       <span className="ml-2 text-gray-700">
//                         <strong>Subjects:</strong> {batch.subjectCount || 0}
//                       </span>
//                     </div>
//                     <div className="flex items-center">
//                       <i className="fas fa-graduation-cap text-gray-400 w-5"></i>
//                       <span className="ml-2 text-gray-700">
//                         <strong>Duration:</strong> {batch.startYear} - {batch.endYear}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
//                     <button
//                       onClick={() => handleViewSubjects(batch)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
//                     >
//                       <i className="fas fa-book mr-2"></i>
//                       View Subjects
//                     </button>
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => openEditModal(batch)}
//                         className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
//                         title="Edit"
//                       >
//                         <i className="fas fa-edit"></i>
//                       </button>
//                       <button
//                         onClick={() => handleDeleteBatch(batch._id)}
//                         className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
//                         title="Delete"
//                       >
//                         <i className="fas fa-trash"></i>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Empty State */}
//         {!error && filteredBatches.length === 0 && (batches || []).length > 0 && (
//           <div className="text-center py-12">
//             <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
//             <h3 className="text-xl font-semibold text-gray-600">No batches match your search</h3>
//             <p className="text-gray-500">Try adjusting your search or filters</p>
//           </div>
//         )}

//         {/* No Batches State */}
//         {!error && (batches || []).length === 0 && (
//           <div className="text-center py-12">
//             <i className="fas fa-graduation-cap text-6xl text-gray-300 mb-4"></i>
//             <h3 className="text-xl font-semibold text-gray-600">No batches yet</h3>
//             <p className="text-gray-500">Add your first batch using the button below</p>
//           </div>
//         )}
//       </div>

//       {/* Add Batch Modal */}
//       {isAddModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
//               <h2 className="text-2xl font-bold text-white">Add New Batch</h2>
//               <p className="text-blue-100 mt-1">Enter batch details</p>
//             </div>

//             <div className="p-6 space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Batch Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={newBatch.name}
//                   onChange={handleInputChange}
//                   placeholder="e.g., Computer Science 2024"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                   disabled={isSubmitting}
//                   required
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Batch Code *
//                   </label>
//                   <input
//                     type="text"
//                     name="code"
//                     value={newBatch.code}
//                     onChange={handleInputChange}
//                     placeholder="e.g., CS2024"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Department *
//                   </label>
//                   <select
//                     name="department"
//                     value={newBatch.department}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                   >
//                     {departments.map((dept) => (
//                       <option key={dept} value={dept}>
//                         {dept}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Academic Year *
//                   </label>
//                   <input
//                     type="number"
//                     name="academicYear"
//                     value={newBatch.academicYear}
//                     onChange={handleInputChange}
//                     min="2000"
//                     max="2100"
//                     placeholder="e.g., 2024"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Current Semester *
//                   </label>
//                   <select
//                     name="currentSemester"
//                     value={newBatch.currentSemester}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                   >
//                     {semesters.map((sem) => (
//                       <option key={sem} value={sem}>
//                         Semester {sem}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Start Year *
//                   </label>
//                   <input
//                     type="number"
//                     name="startYear"
//                     value={newBatch.startYear}
//                     onChange={handleInputChange}
//                     min="2000"
//                     max="2100"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     End Year *
//                   </label>
//                   <input
//                     type="number"
//                     name="endYear"
//                     value={newBatch.endYear}
//                     onChange={handleInputChange}
//                     min="2000"
//                     max="2100"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Total Students
//                   </label>
//                   <input
//                     type="number"
//                     name="totalStudents"
//                     value={newBatch.totalStudents}
//                     onChange={handleInputChange}
//                     min="0"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Status
//                   </label>
//                   <select
//                     name="status"
//                     value={newBatch.status}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                   >
//                     {statusOptions.map((status) => (
//                       <option key={status} value={status}>
//                         {status}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
//               <button
//                 onClick={closeModals}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddBatch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <i className="fas fa-spinner fa-spin mr-2"></i>
//                     Adding...
//                   </>
//                 ) : (
//                   "Add Batch"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Edit Batch Modal */}
//       {isEditModalOpen && editingBatch && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
//               <h2 className="text-2xl font-bold text-white">Edit Batch</h2>
//               <p className="text-blue-100 mt-1">Update batch information</p>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Batch Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={newBatch.name}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                     disabled={isSubmitting}
//                     required
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Batch Code *
//                     </label>
//                     <input
//                       type="text"
//                       name="code"
//                       value={newBatch.code}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Department *
//                     </label>
//                     <select
//                       name="department"
//                       value={newBatch.department}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                     >
//                       {departments.map((dept) => (
//                         <option key={dept} value={dept}>
//                           {dept}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Academic Year *
//                     </label>
//                     <input
//                       type="number"
//                       name="academicYear"
//                       value={newBatch.academicYear}
//                       onChange={handleInputChange}
//                       min="2000"
//                       max="2100"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Current Semester *
//                     </label>
//                     <select
//                       name="currentSemester"
//                       value={newBatch.currentSemester}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                     >
//                       {semesters.map((sem) => (
//                         <option key={sem} value={sem}>
//                           Semester {sem}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Start Year *
//                     </label>
//                     <input
//                       type="number"
//                       name="startYear"
//                       value={newBatch.startYear}
//                       onChange={handleInputChange}
//                       min="2000"
//                       max="2100"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                       required
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       End Year *
//                     </label>
//                     <input
//                       type="number"
//                       name="endYear"
//                       value={newBatch.endYear}
//                       onChange={handleInputChange}
//                       min="2000"
//                       max="2100"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Total Students
//                     </label>
//                     <input
//                       type="number"
//                       name="totalStudents"
//                       value={newBatch.totalStudents}
//                       onChange={handleInputChange}
//                       min="0"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Status
//                     </label>
//                     <select
//                       name="status"
//                       value={newBatch.status}
//                       onChange={handleInputChange}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
//                       disabled={isSubmitting}
//                     >
//                       {statusOptions.map((status) => (
//                         <option key={status} value={status}>
//                           {status}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
//               <button
//                 onClick={closeModals}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleEditBatch}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <>
//                     <i className="fas fa-spinner fa-spin mr-2"></i>
//                     Updating...
//                   </>
//                 ) : (
//                   "Update Batch"
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* View Subjects Modal */}
//       {showSubjectsModal && selectedBatch && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <h2 className="text-2xl font-bold text-white">
//                     {selectedBatch.name} - Subjects
//                   </h2>
//                   <p className="text-blue-100 mt-1">
//                     Department: {selectedBatch.department} | 
//                     Semester: {getSemesterText(selectedBatch.currentSemester)} | 
//                     Total Subjects: {(batchSubjects || []).length}
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6">
//               {loadingSubjects ? (
//                 <div className="text-center py-8">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
//                   <p className="mt-2 text-gray-600">Loading subjects...</p>
//                 </div>
//               ) : (batchSubjects || []).length > 0 ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                   {(batchSubjects || []).map((subject) => (
//                     <div key={subject._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
//                       <div className="mb-3">
//                         <h4 className="font-bold text-gray-900">{subject.name}</h4>
//                         <p className="text-sm text-gray-600">{subject.code}</p>
//                       </div>
                      
//                       <div className="space-y-2">
//                         <div className="flex items-center">
//                           <span className="text-sm text-gray-500 w-16">Credits:</span>
//                           <span className="font-medium">{subject.credits || 3}</span>
//                         </div>
//                         <div className="flex items-center">
//                           <span className="text-sm text-gray-500 w-16">Type:</span>
//                           <span className={`px-2 py-1 text-xs rounded-full ${
//                             (subject.type || 'Core') === 'Core' ? 'bg-green-100 text-green-800' :
//                             (subject.type || 'Core') === 'Elective' ? 'bg-purple-100 text-purple-800' :
//                             'bg-yellow-100 text-yellow-800'
//                           }`}>
//                             {subject.type || 'Core'}
//                           </span>
//                         </div>
//                       </div>
                      
//                       {subject.description && (
//                         <div className="mt-3 pt-3 border-t border-gray-100">
//                           <p className="text-sm text-gray-600">{subject.description}</p>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <i className="fas fa-book text-6xl text-gray-300 mb-4"></i>
//                   <h3 className="text-xl font-semibold text-gray-600">No subjects found</h3>
//                   <p className="text-gray-500">
//                     No subjects assigned for {selectedBatch.department} - {getSemesterText(selectedBatch.currentSemester)}
//                   </p>
//                 </div>
//               )}
//             </div>

//             <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
//               <button
//                 onClick={handleCloseSubjects}
//                 className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentBatches;

import React, { useState, useEffect } from "react";
import batchService from '../../services/batchService';
import subjectService from '../../services/subjectService';

const StudentBatches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All Departments");
  const [selectedSemester, setSelectedSemester] = useState("All Semesters");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [realSubjects, setRealSubjects] = useState([]);
  const [batchSubjects, setBatchSubjects] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Get current year
  const currentYear = new Date().getFullYear();
  
  // Format current academic year as "2023-2024"
  const getCurrentAcademicYear = () => {
    const year = new Date().getFullYear();
    return `${year}-${year + 1}`;
  };

  const [newBatch, setNewBatch] = useState({
    name: "",
    code: "",
    department: "Computer Science Engineering",
    academicYear: getCurrentAcademicYear(), // Now in format "2023-2024"
    currentSemester: 1, 
    startYear: currentYear,
    endYear: currentYear + 4,
    totalStudents: 0,
    status: "Active"
  });

  // Departments and semesters for dropdowns
  const departments = [
    "Computer Science Engineering",
    "Information Technology",
    "Computer Technology",
    "Industrial-IOT",
    "Artificial Intelligence",
    "Data Science",
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Robotics"
  ];

  const statusOptions = ["Active", "Graduated", "Inactive"];
  
  const semesters = [1, 2, 3, 4, 5, 6, 7, 8];

  // Convert semester number to text for display
  const getSemesterText = (semesterNumber) => {
    return `Semester ${semesterNumber}`;
  };

  // Parse academic year to get start year (e.g., "2023-2024" -> 2023)
  const getStartYearFromAcademicYear = (academicYear) => {
    if (!academicYear) return currentYear;
    if (typeof academicYear === 'string' && academicYear.includes('-')) {
      return parseInt(academicYear.split('-')[0]);
    }
    return parseInt(academicYear) || currentYear;
  };

  // Parse academic year to get end year (e.g., "2023-2024" -> 2024)
  const getEndYearFromAcademicYear = (academicYear) => {
    if (!academicYear) return currentYear + 1;
    if (typeof academicYear === 'string' && academicYear.includes('-')) {
      return parseInt(academicYear.split('-')[1]);
    }
    return (parseInt(academicYear) + 1) || currentYear + 1;
  };

  // Fetch batches from API
  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await batchService.getAll();

      // Handle different response structures
      let batchesData = [];
      if (response.data) {
        if (Array.isArray(response.data.data)) {
          batchesData = response.data.data;
        } else if (Array.isArray(response.data)) {
          batchesData = response.data;
        }
      }

      // Fetch subjects and count them properly
      const allSubjects = await fetchAllSubjects();
      
      const batchesWithDefaults = batchesData.map(batch => {
        // Count subjects for this batch
        let subjectCount = 0;
        if (allSubjects.length > 0) {
          subjectCount = allSubjects.filter(subject => 
            subject.department === batch.department && 
            subject.semester === getSemesterText(batch.currentSemester)
          ).length;
        }
        
        // Format academic year if it's a single year
        let formattedAcademicYear = batch.academicYear;
        if (batch.academicYear && !batch.academicYear.toString().includes('-')) {
          const year = parseInt(batch.academicYear);
          formattedAcademicYear = `${year}-${year + 1}`;
        }
        
        return {
          ...batch,
          semesterText: getSemesterText(batch.currentSemester || 1),
          subjectCount: subjectCount,
          academicYear: formattedAcademicYear || getCurrentAcademicYear()
        };
      });

      setBatches(batchesWithDefaults);
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        "Failed to fetch batches. Please try again.";
      setError(errorMessage);
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all subjects from the subject API
  const fetchAllSubjects = async () => {
    try {
      const response = await subjectService.getAll();
      const subjects = response.data?.data || [];
      setRealSubjects(subjects);
      return subjects;
    } catch (err) {
      console.error('Error fetching all subjects:', err);
      return [];
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  // Handle view subjects for a batch
  const handleViewSubjects = async (batch) => {
    setSelectedBatch(batch);
    setLoadingSubjects(true);
    
    try {
      // Fetch all subjects
      const allSubjects = await fetchAllSubjects();
      
      if (allSubjects.length > 0 && batch) {
        // Filter subjects by batch department and current semester
        const filteredSubjects = allSubjects.filter(subject => 
          subject.department === batch.department && 
          subject.semester === getSemesterText(batch.currentSemester)
        );
        
        setBatchSubjects(filteredSubjects);
      } else {
        setBatchSubjects([]);
      }
    } catch (err) {
      console.error('Error fetching subjects:', err);
      setBatchSubjects([]);
    } finally {
      setLoadingSubjects(false);
    }
    
    setShowSubjectsModal(true);
  };

  // Handle academic year change - FIXED
  const handleAcademicYearChange = (e) => {
    const { value } = e.target;
    
    // Allow typing in "2023-2024" format
    setNewBatch(prev => ({
      ...prev,
      academicYear: value
      // DON'T update startYear and endYear - they remain independent
    }));
  };

  // Filter batches
  const filteredBatches = (batches || []).filter((batch) => {
    if (!batch || typeof batch !== "object") return false;
    
    const name = batch.name || "";
    const code = batch.code || "";
    const batchDepartment = batch.department || "";
    const batchSemester = batch.currentSemester || 1;

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batchDepartment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      batchDepartment === selectedDepartment;

    const filterSemesterNumber = selectedSemester === "All Semesters" 
      ? null 
      : parseInt(selectedSemester.replace("Semester ", ""));
    
    const matchesSemester =
      selectedSemester === "All Semesters" || 
      batchSemester === filterSemesterNumber;

    return matchesSearch && matchesDepartment && matchesSemester;
  });

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDepartment("All Departments");
    setSelectedSemester("All Semesters");
  };

  // Delete batch function with confirmation
  const handleDeleteBatch = async (id) => {
    if (!id) {
      alert("Invalid batch ID");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this batch?")) {
      return;
    }

    try {
      console.log("Deleting batch with ID:", id);
      const response = await batchService.delete(id);
      console.log("Batch deleted successfully:", response.data);

      // Refresh the list
      await fetchBatches();
      alert("Batch deleted successfully!");
    } catch (err) {
      console.error("Error deleting batch:", err);

      let errorMessage = "Failed to delete batch. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      alert(`Error: ${errorMessage}`);
    }
  };

  // Open Edit Modal - FIXED
  const openEditModal = (batch) => {
    if (!batch || !batch._id) {
      alert("Invalid batch data");
      return;
    }

    setEditingBatch(batch);
    
    // Format academic year if needed
    let academicYear = batch.academicYear;
    if (academicYear && !academicYear.toString().includes('-')) {
      const year = parseInt(academicYear);
      academicYear = `${year}-${year + 1}`;
    }
    
    setNewBatch({
      name: batch.name || "",
      code: batch.code || "",
      department: batch.department || "Computer Science Engineering",
      academicYear: academicYear || getCurrentAcademicYear(),
      currentSemester: batch.currentSemester || 1,
      startYear: batch.startYear || currentYear,
      endYear: batch.endYear || currentYear + 4,
      totalStudents: batch.totalStudents || 0,
      status: batch.status || "Active"
    });
    setIsEditModalOpen(true);
    setApiError(null);
  };

  // Close Modals - FIXED
  const closeModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingBatch(null);
    setApiError(null);
    // Reset form
    setNewBatch({
      name: "",
      code: "",
      department: "Computer Science Engineering",
      academicYear: getCurrentAcademicYear(),
      currentSemester: 1,
      startYear: currentYear,
      endYear: currentYear + 4,
      totalStudents: 0,
      status: "Active"
    });
  };

  // Handle input changes - FIXED
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "academicYear") {
      // Only update academic year, don't touch start/end years
      setNewBatch((prev) => ({
        ...prev,
        academicYear: value
      }));
    } else if (name === "currentSemester") {
      setNewBatch((prev) => ({
        ...prev,
        [name]: parseInt(value) || 1
      }));
    } else if (name === "startYear" || name === "endYear") {
      // For start and end year, keep as numbers
      setNewBatch((prev) => ({
        ...prev,
        [name]: parseInt(value) || currentYear
      }));
    } else {
      setNewBatch((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Add Batch Functionality - FIXED
  const handleAddBatch = async () => {
    // Validate required fields
    if (!newBatch.name.trim()) {
      alert("Please enter batch name");
      return;
    }
    if (!newBatch.code.trim()) {
      alert("Please enter batch code");
      return;
    }
    if (!newBatch.academicYear || !newBatch.academicYear.includes('-')) {
      alert("Please enter academic year in format YYYY-YYYY (e.g., 2023-2024)");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Parse academic year to get start year for backend if needed
      // But keep the original format for display
      const academicYearParts = newBatch.academicYear.split('-');
      const academicStartYear = parseInt(academicYearParts[0]);
      
      // Prepare data for API - send academicYear as string
      const batchData = {
        name: newBatch.name.trim(),
        code: newBatch.code.trim(),
        department: newBatch.department,
        academicYear: newBatch.academicYear, // Send as string "2023-2024"
        currentSemester: newBatch.currentSemester,
        startYear: parseInt(newBatch.startYear) || currentYear,
        endYear: parseInt(newBatch.endYear) || (currentYear + 4),
        totalStudents: parseInt(newBatch.totalStudents) || 0,
        status: newBatch.status,
      };

      console.log("Adding batch with data:", batchData);

      const response = await batchService.create(batchData);
      console.log("Batch added successfully:", response.data);

      // Refresh the list
      await fetchBatches();
      closeModals();
      alert("Batch added successfully!");
    } catch (err) {
      console.error("Error adding batch:", err);

      let errorMessage = "Failed to add batch. Please try again.";

      if (err.response?.data) {
        if (err.response.data.errors) {
          const errors = err.response.data.errors;
          errorMessage = Object.values(errors)
            .map((error) => error.message || error)
            .join("\n");
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Batch Functionality - FIXED
  const handleEditBatch = async () => {
    if (!editingBatch) return;

    // Validate required fields
    if (!newBatch.name.trim()) {
      alert("Please enter batch name");
      return;
    }
    if (!newBatch.code.trim()) {
      alert("Please enter batch code");
      return;
    }
    if (!newBatch.academicYear || !newBatch.academicYear.includes('-')) {
      alert("Please enter academic year in format YYYY-YYYY (e.g., 2023-2024)");
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Prepare data for API
      const batchData = {
        name: newBatch.name.trim(),
        code: newBatch.code.trim(),
        department: newBatch.department,
        academicYear: newBatch.academicYear, // Send as string "2023-2024"
        currentSemester: newBatch.currentSemester,
        startYear: parseInt(newBatch.startYear) || currentYear,
        endYear: parseInt(newBatch.endYear) || (currentYear + 4),
        totalStudents: parseInt(newBatch.totalStudents) || 0,
        status: newBatch.status,
      };

      console.log("Updating batch with data:", batchData);

      const response = await batchService.update(editingBatch._id, batchData);
      console.log("Batch updated successfully:", response.data);

      // Refresh the list
      await fetchBatches();
      closeModals();
      alert("Batch updated successfully!");
    } catch (err) {
      console.error("Error updating batch:", err);

      let errorMessage = "Failed to update batch. Please try again.";

      if (err.response?.data) {
        if (err.response.data.errors) {
          const errors = err.response.data.errors;
          errorMessage = Object.values(errors)
            .map((error) => error.message || error)
            .join("\n");
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setApiError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close subjects modal
  const handleCloseSubjects = () => {
    setShowSubjectsModal(false);
    setSelectedBatch(null);
    setBatchSubjects([]);
  };

  // Get status color class
  const getStatusColor = (status) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Graduated": return "bg-blue-100 text-blue-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate batch statistics
  const calculateStats = () => {
    const totalBatches = (batches || []).length;
    const activeBatches = (batches || []).filter(b => b.status === "Active").length;
    const totalStudents = (batches || []).reduce((sum, batch) => sum + (batch.totalStudents || 0), 0);
    
    return { totalBatches, activeBatches, totalStudents };
  };

  // Loading state
  if (loading && (batches || []).length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading batches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="pt-24 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Student Batches Management
          </h1>
          <p className="text-lg text-gray-600">
            Manage departments, batches, and semesters
          </p>
        </div>

        {/* Statistics Cards */}
        {(batches || []).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg mr-4">
                  <i className="fas fa-users text-blue-600 text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Batches</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateStats().totalBatches}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg mr-4">
                  <i className="fas fa-check-circle text-green-600 text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Batches</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateStats().activeBatches}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg mr-4">
                  <i className="fas fa-user-graduate text-purple-600 text-2xl"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{calculateStats().totalStudents}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <div className="flex justify-between items-center">
              <span>{apiError}</span>
              <button
                onClick={() => setApiError(null)}
                className="text-red-700 hover:text-red-900"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Search and Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search batches...
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="Search by name, code or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Departments">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semester
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All Semesters">All Semesters</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={`Semester ${sem}`}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            >
              <i className="fas fa-plus mr-2"></i>
              Add New Batch
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (batches || []).length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
            <button
              onClick={fetchBatches}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Batches Grid */}
        {!error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredBatches.map((batch) => (
              <div
                key={batch._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
              >
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {batch.name}
                      </h3>
                      <p className="text-blue-100 text-sm mt-1">{batch.code}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(batch.status)}`}
                    >
                      {batch.status}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <i className="fas fa-building text-gray-400 w-5"></i>
                      <span className="ml-2 text-gray-700">
                        <strong>Department:</strong> {batch.department}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-calendar text-gray-400 w-5"></i>
                      <span className="ml-2 text-gray-700">
                        <strong>Academic Year:</strong> {batch.academicYear}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-layer-group text-gray-400 w-5"></i>
                      <span className="ml-2 text-gray-700">
                        <strong>Semester:</strong> {batch.semesterText}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-users text-gray-400 w-5"></i>
                      <span className="ml-2 text-gray-700">
                        <strong>Students:</strong> {batch.totalStudents}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-book text-gray-400 w-5"></i>
                      <span className="ml-2 text-gray-700">
                        <strong>Subjects:</strong> {batch.subjectCount || 0}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <i className="fas fa-graduation-cap text-gray-400 w-5"></i>
                      <span className="ml-2 text-gray-700">
                        <strong>Duration:</strong> {batch.startYear} - {batch.endYear}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewSubjects(batch)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <i className="fas fa-book mr-2"></i>
                      View Subjects
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(batch)}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => handleDeleteBatch(batch._id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                        title="Delete"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && filteredBatches.length === 0 && (batches || []).length > 0 && (
          <div className="text-center py-12">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">No batches match your search</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}

        {/* No Batches State */}
        {!error && (batches || []).length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-graduation-cap text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600">No batches yet</h3>
            <p className="text-gray-500">Add your first batch using the button below</p>
          </div>
        )}
      </div>

      {/* Add Batch Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Add New Batch</h2>
              <p className="text-blue-100 mt-1">Enter batch details</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Batch Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={newBatch.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Computer Science 2024"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Code *
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={newBatch.code}
                    onChange={handleInputChange}
                    placeholder="e.g., CS2024"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={newBatch.department}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Academic Year * (Format: YYYY-YYYY)
                  </label>
                  <input
                    type="text"
                    name="academicYear"
                    value={newBatch.academicYear}
                    onChange={handleInputChange}
                    placeholder="e.g., 2023-2024"
                    pattern="\d{4}-\d{4}"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Semester *
                  </label>
                  <select
                    name="currentSemester"
                    value={newBatch.currentSemester}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Year *
                  </label>
                  <input
                    type="number"
                    name="startYear"
                    value={newBatch.startYear}
                    onChange={handleInputChange}
                    min="2000"
                    max="2100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Year *
                  </label>
                  <input
                    type="number"
                    name="endYear"
                    value={newBatch.endYear}
                    onChange={handleInputChange}
                    min="2000"
                    max="2100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Students
                  </label>
                  <input
                    type="number"
                    name="totalStudents"
                    value={newBatch.totalStudents}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={newBatch.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBatch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Adding...
                  </>
                ) : (
                  "Add Batch"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Batch Modal */}
      {isEditModalOpen && editingBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <h2 className="text-2xl font-bold text-white">Edit Batch</h2>
              <p className="text-blue-100 mt-1">Update batch information</p>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Batch Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newBatch.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Batch Code *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={newBatch.code}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={newBatch.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      name="academicYear"
                      value={newBatch.academicYear}
                      onChange={handleInputChange}
                      placeholder="e.g., 2023-2024"
                      pattern="\d{4}-\d{4}"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Semester *
                    </label>
                    <select
                      name="currentSemester"
                      value={newBatch.currentSemester}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {semesters.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Year *
                    </label>
                    <input
                      type="number"
                      name="startYear"
                      value={newBatch.startYear}
                      onChange={handleInputChange}
                      min="2000"
                      max="2100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Year *
                    </label>
                    <input
                      type="number"
                      name="endYear"
                      value={newBatch.endYear}
                      onChange={handleInputChange}
                      min="2000"
                      max="2100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Students
                    </label>
                    <input
                      type="number"
                      name="totalStudents"
                      value={newBatch.totalStudents}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={newBatch.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleEditBatch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Updating...
                  </>
                ) : (
                  "Update Batch"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Subjects Modal */}
      {showSubjectsModal && selectedBatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedBatch.name} - Subjects
                  </h2>
                  <p className="text-blue-100 mt-1">
                    Department: {selectedBatch.department} | 
                    Semester: {getSemesterText(selectedBatch.currentSemester)} | 
                    Total Subjects: {(batchSubjects || []).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loadingSubjects ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading subjects...</p>
                </div>
              ) : (batchSubjects || []).length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(batchSubjects || []).map((subject) => (
                    <div key={subject._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md">
                      <div className="mb-3">
                        <h4 className="font-bold text-gray-900">{subject.name}</h4>
                        <p className="text-sm text-gray-600">{subject.code}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 w-16">Credits:</span>
                          <span className="font-medium">{subject.credits || 3}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 w-16">Type:</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            (subject.type || 'Core') === 'Core' ? 'bg-green-100 text-green-800' :
                            (subject.type || 'Core') === 'Elective' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {subject.type || 'Core'}
                          </span>
                        </div>
                      </div>
                      
                      {subject.description && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-sm text-gray-600">{subject.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <i className="fas fa-book text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-600">No subjects found</h3>
                  <p className="text-gray-500">
                    No subjects assigned for {selectedBatch.department} - {getSemesterText(selectedBatch.currentSemester)}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex justify-end">
              <button
                onClick={handleCloseSubjects}
                className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBatches;