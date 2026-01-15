// import React from 'react';
// import { Link } from 'react-router-dom';

// const Footer = () => {
//   return (
//     <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white mt-auto">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="grid md:grid-cols-4 gap-8">
//           {/* Brand Section */}
//           <div className="md:col-span-2">
//             <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//               EduScheduler
//             </h2>
//             <p className="text-gray-300 mb-6 text-lg">
//               Intelligent classroom and timetable management for higher education institutions.
//             </p>
//             <div className="flex flex-wrap gap-4">
//               <Link 
//                 to="/suggestions"
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//               >
//                 💡 Suggestions
//               </Link>
//               <Link 
//                 to="/reports"
//                 className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//               >
//                 📊 Reports
//               </Link>
//               <Link 
//                 to="/settings"
//                 className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//               >
//                 ⚙ Settings
//               </Link>
//               <Link 
//                 to="/contact"
//                 className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
//               >
//                 📞 Contact
//               </Link>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-xl font-semibold mb-4 text-white">Quick Access</h3>
//             <ul className="space-y-3">
//               <li>
//                 <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
//                   Dashboard
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/create-timetable" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-green-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
//                   Timetables
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/faculty" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
//                   Faculty
//                 </Link>
//               </li>
//               <li>
//                 <Link to="/classrooms" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group">
//                   <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 group-hover:scale-150 transition-transform"></span>
//                   Classrooms
//                 </Link>
//               </li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div>
//             <h3 className="text-xl font-semibold mb-4 text-white">Get Help</h3>
//             <div className="space-y-4">
//               <Link to="/contact" className="flex items-center space-x-3 p-3 bg-blue-800/30 rounded-lg hover:bg-blue-800/50 transition-colors cursor-pointer">
//                 <div className="text-2xl">📞</div>
//                 <div>
//                   <p className="font-medium">Contact Support</p>
//                   <p className="text-sm text-gray-300">24/7 assistance available</p>
//                 </div>
//               </Link>
//               <div className="p-4 bg-gradient-to-r from-blue-800/40 to-purple-800/40 rounded-lg border border-blue-500/30">
//                 <p className="text-sm text-gray-200">
//                   💡 <strong>Pro Tip:</strong> Use our smart scheduling features to optimize resource allocation and reduce conflicts.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Copyright */}
//         <div className="border-t border-blue-700 mt-8 pt-8 text-center">
//           <p className="text-gray-300">
//             © 2025 <span className="text-white font-semibold">Smart Scheduler</span>. All rights reserved.
//           </p>
//           <p className="text-gray-400 text-sm mt-2">
//             Built with ❤ for educational institutions
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;


import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              EduScheduler
            </h2>
            <p className="text-gray-300 mb-4 text-sm">
              Intelligent classroom and timetable management for higher education institutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link 
                to="/suggestions"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                💡 Suggestions
              </Link>
              <Link 
                to="/reports"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                📊 Reports
              </Link>
              <Link 
                to="/settings"
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                ⚙ Settings
              </Link>
              <Link 
                to="/contact"
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-md text-sm transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                📞 Contact
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Access</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="text-gray-300 hover:text-white transition flex items-center group">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/create-timetable" className="text-gray-300 hover:text-white transition flex items-center group">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Timetables
                </Link>
              </li>
              <li>
                <Link to="/faculty" className="text-gray-300 hover:text-white transition flex items-center group">
                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Faculty
                </Link>
              </li>
              <li>
                <Link to="/classrooms" className="text-gray-300 hover:text-white transition flex items-center group">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2 group-hover:scale-150 transition-transform"></span>
                  Classrooms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Get Help</h3>
            <div className="space-y-3 text-sm">
              <Link to="/contact" className="flex items-center space-x-2 p-2 bg-blue-800/30 rounded-md hover:bg-blue-800/50 transition">
                <div className="text-lg">📞</div>
                <div>
                  <p className="font-medium">Contact Support</p>
                  <p className="text-xs text-gray-300">24/7 assistance available</p>
                </div>
              </Link>
              <div className="p-3 bg-gradient-to-r from-blue-800/40 to-purple-800/40 rounded-md border border-blue-500/30">
                <p className="text-xs text-gray-200">
                  💡 <strong>Pro Tip:</strong> Use our smart scheduling features to optimize resources.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-blue-700 mt-6 pt-4 text-center text-xs">
          <p className="text-gray-300">
            © 2025 <span className="text-white font-semibold">Smart Scheduler</span>. All rights reserved.
          </p>
          <p className="text-gray-400 mt-1">
            Built with ❤ for educational institutions
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;