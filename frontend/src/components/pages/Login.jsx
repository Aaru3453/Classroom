// import React, { useState } from 'react';
// import { useAuth } from "../../context/AuthContext.jsx";
// import { useNavigate, Link } from 'react-router-dom';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//     if (error) setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const result = await login(formData.email, formData.password);

//       if (result?.success) {
//         navigate('/dashboard');
//       } else {
//         setError(result?.message || 'Login failed');
//       }
//     } catch (err) {
//       setError('An error occurred during login');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">

//         {/* Header */}
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Login
//           </h2>
//           <p className="text-gray-600">
//             Sign in to your EduScheduler account
//           </p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">

//           {error && (
//             <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
//               <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
//               <span className="text-red-700 text-sm">{error}</span>
//             </div>
//           )}

//           <form className="space-y-6" onSubmit={handleSubmit}>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <i className="fas fa-envelope text-gray-400"></i>
//                 </div>
//                 <input
//                   type="email"
//                   name="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="Enter your email"
//                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <i className="fas fa-lock text-gray-400"></i>
//                 </div>
//                 <input
//                   type="password"
//                   name="password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             {/* Button */}
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
//             >
//               {loading ? (
//                 <>
//                   <i className="fas fa-spinner fa-spin mr-2"></i>
//                   Signing in...
//                 </>
//               ) : (
//                 <>
//                   <i className="fas fa-sign-in-alt mr-2"></i>
//                   Sign In
//                 </>
//               )}
//             </button>

//           </form>

//           {/* Register */}
//           <div className="mt-6 text-center">
//             <Link to="/register" className="text-blue-600 font-medium">
//               Create an account →
//             </Link>
//           </div>

//           {/* Forgot */}
//           <div className="mt-4 text-center">
//             <Link to="/forgot-password" className="text-blue-600 text-sm">
//               Forgot your password?
//             </Link>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from 'react';
import { useAuth } from "../../context/AuthContext.jsx";
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center mb-6">
            {/* <div className="bg-blue-600 p-3 rounded-full">
              <i className="fas fa-calendar-check text-white text-2xl"></i>
            </div> */}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Login
          </h2>
          <p className="text-gray-600">
            Sign in to your EduScheduler account
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-3"></i>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-gray-400"></i>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-gray-400"></i>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">New to EduScheduler?</span>
              </div>
            </div>
          </div>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <Link
              to="/register"
              className="inline-flex items-center text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              Create an account
              <i className="fas fa-arrow-right ml-2 text-sm"></i>
            </Link>
          </div>

          {/* Forgot Password Link - ADDED HERE */}
          <div className="mt-4 text-center">
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium transition-colors"
            >
              <i className="fas fa-key mr-1"></i>
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Demo Credentials Hint */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Demo credentials? Check the backend documentation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;