
import React, { useState, useEffect } from 'react';
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    LineElement, 
    PointElement, 
    Title, 
    Tooltip, 
    Legend,
    Filler // ✅ ADD THIS LINE
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { 
    FaDoorOpen, 
    FaCheckCircle, 
    FaUserGraduate, 
    FaChartLine, 
    FaClock,
    FaLaptop,
    FaWifi,
    FaSnowflake
} from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler // ✅ ADD THIS LINE
);


const Dashboard = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [timeFilter, setTimeFilter] = useState('today');

    // Enhanced sample data with historical utilization data
    const sampleClassrooms = [
        {
            id: 1,
            name: "CS-101",
            department: "Computer Science",
            capacity: 45,
            status: "occupied",
            currentClass: "Data Structures",
            faculty: "Dr. Sharma",
            nextAvailable: "11:00 AM",
            facilities: ["projector", "ac", "wifi"],
            utilization: 85,
            historicalUtilization: {
                today: [70, 75, 80, 85, 82, 78, 72],
                week: [80, 82, 85, 83, 78, 75, 72],
                month: [75, 78, 82, 85, 80, 77, 73]
            },
            schedule: [
                { time: "9:00-10:00", class: "Data Structures", faculty: "Dr. Sharma" },
                { time: "11:00-12:00", class: "Algorithms", faculty: "Prof. Kumar" }
            ]
        },
        {
            id: 2,
            name: "CS-102",
            department: "Computer Science",
            capacity: 35,
            status: "available",
            currentClass: "",
            faculty: "",
            nextAvailable: "Now",
            facilities: ["projector", "wifi"],
            utilization: 60,
            historicalUtilization: {
                today: [55, 58, 60, 62, 59, 57, 53],
                week: [58, 60, 62, 61, 59, 56, 54],
                month: [56, 58, 61, 62, 60, 57, 55]
            },
            schedule: []
        },
        {
            id: 3,
            name: "M-201",
            department: "Mathematics",
            capacity: 60,
            status: "available",
            currentClass: "",
            faculty: "",
            nextAvailable: "Now",
            facilities: ["projector", "ac"],
            utilization: 45,
            historicalUtilization: {
                today: [40, 42, 45, 47, 44, 42, 38],
                week: [42, 44, 46, 45, 43, 40, 38],
                month: [41, 43, 45, 46, 44, 41, 39]
            },
            schedule: []
        },
        {
            id: 4,
            name: "P-301",
            department: "Physics",
            capacity: 40,
            status: "occupied",
            currentClass: "Quantum Mechanics",
            faculty: "Dr. Gupta",
            nextAvailable: "2:00 PM",
            facilities: ["projector", "ac", "lab-equipment"],
            utilization: 75,
            historicalUtilization: {
                today: [70, 72, 75, 77, 74, 71, 68],
                week: [72, 74, 76, 75, 73, 70, 68],
                month: [70, 72, 75, 76, 74, 71, 69]
            },
            schedule: [
                { time: "10:00-12:00", class: "Quantum Mechanics", faculty: "Dr. Gupta" }
            ]
        }
    ];

    // Faculty data with availability tracking
    const facultyData = {
        total: 24,
        available: 18,
        byDepartment: {
            "Computer Science": 6,
            "Mathematics": 4,
            "Physics": 5,
            "Chemistry": 3,
            "Biology": 4,
            "English": 2
        },
        historicalAvailability: {
            today: [16, 17, 18, 18, 17, 16, 15],
            week: [17, 18, 18, 19, 18, 16, 15],
            month: [16, 17, 18, 18, 17, 16, 15]
        }
    };

    useEffect(() => {
        setClassrooms(sampleClassrooms);
    }, []);

    // Filter classrooms based on department
    const filteredClassrooms = selectedDepartment === 'all' 
        ? classrooms 
        : classrooms.filter(room => room.department === selectedDepartment);

    // Get utilization data based on time filter
    const getUtilizationDataForTimeFilter = () => {
        const utilizationData = filteredClassrooms.map(room => 
            room.historicalUtilization[timeFilter]?.slice(-1)[0] || room.utilization
        );
        
        const avgUtilization = utilizationData.length > 0 
            ? Math.round(utilizationData.reduce((sum, util) => sum + util, 0) / utilizationData.length)
            : 0;

        return {
            utilizationData,
            avgUtilization
        };
    };

    // Get trend data based on time filter
    const getTrendDataForTimeFilter = () => {
        if (filteredClassrooms.length === 0) {
            return Array(7).fill(0);
        }

        // Average utilization across all filtered classrooms for each time point
        const trendData = [];
        const timePoints = filteredClassrooms[0].historicalUtilization[timeFilter]?.length || 7;
        
        for (let i = 0; i < timePoints; i++) {
            const sum = filteredClassrooms.reduce((total, room) => {
                return total + (room.historicalUtilization[timeFilter]?.[i] || 0);
            }, 0);
            trendData.push(Math.round(sum / filteredClassrooms.length));
        }

        return trendData;
    };

    // Get faculty availability for time filter
    const getFacultyAvailabilityForTimeFilter = () => {
        const availabilityData = facultyData.historicalAvailability[timeFilter];
        return {
            current: availabilityData ? availabilityData.slice(-1)[0] : facultyData.available,
            trend: availabilityData || facultyData.historicalAvailability.today
        };
    };

    const { utilizationData, avgUtilization } = getUtilizationDataForTimeFilter();
    const trendData = getTrendDataForTimeFilter();
    const facultyAvailability = getFacultyAvailabilityForTimeFilter();

    // Calculate statistics with time filter applied
    const stats = {
        totalClassrooms: filteredClassrooms.length,
        availableClassrooms: filteredClassrooms.filter(room => {
            const roomUtilization = room.historicalUtilization[timeFilter]?.slice(-1)[0] || room.utilization;
            return roomUtilization < 50; // Consider available if utilization < 50%
        }).length,
        occupiedClassrooms: filteredClassrooms.filter(room => {
            const roomUtilization = room.historicalUtilization[timeFilter]?.slice(-1)[0] || room.utilization;
            return roomUtilization >= 50; // Consider occupied if utilization >= 50%
        }).length,
        facultyAvailable: facultyAvailability.current,
        totalFaculty: facultyData.total,
        avgUtilization: avgUtilization
    };

    // Chart data for classroom utilization with time filter
    const utilizationChartData = {
        labels: filteredClassrooms.map(room => room.name),
        datasets: [
            {
                label: `Utilization Rate (%) - ${timeFilter}`,
                data: utilizationData,
                backgroundColor: '#3b82f6',
                borderColor: '#1d4ed8',
                borderWidth: 2,
                borderRadius: 4,
            }
        ]
    };

    // Faculty distribution data
    const facultyDistributionData = {
        labels: Object.keys(facultyData.byDepartment),
        datasets: [
            {
                label: 'Faculty Count',
                data: Object.values(facultyData.byDepartment),
                backgroundColor: ['#3b82f6', '#60a5fa', '#93c5fd', '#1d4ed8', '#2563eb', '#1e40af'],
                borderWidth: 2,
            }
        ]
    };

    // Weekly utilization trend with time filter
    const weeklyTrendData = {
        labels: timeFilter === 'today' 
            ? ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM']
            : timeFilter === 'week'
            ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            : ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        datasets: [
            {
                label: `Utilization Trend (%) - ${timeFilter}`,
                data: trendData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true,
                borderWidth: 3,
            }
        ]
    };

    // Chart options
    const barOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: `Classroom Utilization - ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}`,
                font: { size: 14, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Utilization (%)' }
            },
            x: { grid: { display: false } }
        },
        maintainAspectRatio: false
    };

    const facultyBarOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: 'Faculty by Department',
                font: { size: 14, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: 'Number of Faculty' }
            },
            x: { grid: { display: false } }
        },
        maintainAspectRatio: false
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Utilization Trend - ${timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}`,
                font: { size: 14, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                title: { display: true, text: 'Utilization (%)' }
            }
        },
        maintainAspectRatio: false
    };

    // Facility icons
    const facilityIcons = {
        projector: FaLaptop,
        wifi: FaWifi,
        ac: FaSnowflake,
        'lab-equipment': FaWifi
    };

    // Get status info based on utilization
    const getStatusInfo = (utilization) => {
        if (utilization < 50) {
            return { color: 'text-green-600', bg: 'bg-green-100', icon: FaCheckCircle, label: 'Available' };
        } else {
            return { color: 'text-red-600', bg: 'bg-red-100', icon: FaClock, label: 'Occupied' };
        }
    };

    // Handle classroom status change
    const handleStatusChange = (classroomId, newStatus) => {
        setClassrooms(prev => prev.map(room => 
            room.id === classroomId ? { 
                ...room, 
                status: newStatus,
                utilization: newStatus === 'available' ? 30 : 80 // Update utilization based on status
            } : room
        ));
    };

    // Get current utilization for a classroom based on time filter
    const getCurrentUtilization = (room) => {
        return room.historicalUtilization[timeFilter]?.slice(-1)[0] || room.utilization;
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header */}
            <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               College Dashboard
            </h1>
            <p className="text-lg text-gray-600">
                Classroom and faculty overview - {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)} View
            </p>
        </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select 
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Departments</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                    </select>
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                    <select 
                        value={timeFilter}
                        onChange={(e) => setTimeFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Total Classrooms</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.totalClassrooms}</p>
                        </div>
                        <FaDoorOpen className="text-blue-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Available</p>
                            <p className="text-2xl font-bold text-green-600">{stats.availableClassrooms}</p>
                        </div>
                        <FaCheckCircle className="text-green-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Faculty Available</p>
                            <p className="text-2xl font-bold text-purple-600">{stats.facultyAvailable}</p>
                        </div>
                        <FaUserGraduate className="text-purple-500 text-xl" />
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Avg Utilization</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.avgUtilization}%</p>
                        </div>
                        <FaChartLine className="text-orange-500 text-xl" />
                    </div>
                </div>
            </div>

            {/* Classroom Status */}
            <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Classroom Status - {timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1)}</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredClassrooms.map((room) => {
                        const currentUtilization = getCurrentUtilization(room);
                        const statusInfo = getStatusInfo(currentUtilization);
                        
                        return (
                            <div key={room.id} className="border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="font-semibold">{room.name}</h4>
                                    <select 
                                        value={currentUtilization < 50 ? 'available' : 'occupied'}
                                        onChange={(e) => handleStatusChange(room.id, e.target.value)}
                                        className="text-sm border rounded px-2 py-1"
                                    >
                                        <option value="available">Available</option>
                                        <option value="occupied">Occupied</option>
                                    </select>
                                </div>
                                
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span>Department:</span>
                                        <span className="font-medium">{room.department}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Status:</span>
                                        <span className={`font-medium ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Utilization:</span>
                                        <span className="font-medium">{currentUtilization}%</span>
                                    </div>
                                    {room.currentClass && currentUtilization >= 50 && (
                                        <div>
                                            <span>Current: </span>
                                            <span className="font-medium">{room.currentClass}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 flex flex-wrap gap-1">
                                    {room.facilities.map((facility, index) => {
                                        const FacilityIcon = facilityIcons[facility];
                                        return FacilityIcon ? (
                                            <span key={index} className="flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                                                <FacilityIcon className="mr-1" />
                                                {facility}
                                            </span>
                                        ) : null;
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="h-64">
                        <Bar data={utilizationChartData} options={barOptions} />
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="h-64">
                        <Bar data={facultyDistributionData} options={facultyBarOptions} />
                    </div>
                </div>
            </div>

            {/* Trend Chart */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="h-64">
                    <Line data={weeklyTrendData} options={lineOptions} />
                </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-4 border-b">
                    <h3 className="text-lg font-semibold">Today's Schedule</h3>
                </div>
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredClassrooms
                        .filter(room => room.schedule && room.schedule.length > 0)
                        .map(room => (
                            <div key={room.id} className="border rounded-lg p-3">
                                <h4 className="font-semibold mb-2">{room.name}</h4>
                                <div className="space-y-2">
                                    {room.schedule.map((slot, index) => (
                                        <div key={index} className="text-sm border-l-2 border-blue-500 pl-2">
                                            <div className="font-medium text-blue-600">{slot.time}</div>
                                            <div>{slot.class}</div>
                                            <div className="text-gray-500">{slot.faculty}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

