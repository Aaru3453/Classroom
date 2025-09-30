import React, { useState } from 'react';

const Suggestions = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Feature Request',
    priority: 'Medium',
    suggestion: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.suggestion) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Suggestion submitted:', formData);
    setSubmitted(true);
    setIsSubmitting(false);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({ 
        name: '', 
        email: '', 
        category: 'Feature Request', 
        priority: 'Medium', 
        suggestion: '' 
      });
      setSubmitted(false);
    }, 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleReset = () => {
    setFormData({ 
      name: '', 
      email: '', 
      category: 'Feature Request', 
      priority: 'Medium', 
      suggestion: '' 
    });
    setSubmitted(false);
  };

  const categories = [
    { value: 'Feature Request', label: 'Feature Request', icon: '✨' },
    { value: 'Bug Report', label: 'Bug Report', icon: '🐛' },
    { value: 'Improvement', label: 'Improvement', icon: '🚀' },
    { value: 'UI/UX Feedback', label: 'UI/UX Feedback', icon: '🎨' },
    { value: 'Performance', label: 'Performance', icon: '⚡' },
    { value: 'General Feedback', label: 'General Feedback', icon: '💬' }
  ];

  const priorities = [
    { value: 'Low', label: 'Low', color: 'text-green-600' },
    { value: 'Medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'High', label: 'High', color: 'text-orange-600' },
    { value: 'Critical', label: 'Critical', color: 'text-red-600' }
  ];

  const recentUpdates = [
    {
      type: 'New',
      date: 'Last week',
      title: 'Faculty workload tracking added',
      description: 'Now you can monitor faculty workload distribution across departments',
      icon: '📊'
    },
    {
      type: 'Improved',
      date: '2 weeks ago',
      title: 'Schedule conflict detection enhanced',
      description: 'Better algorithms for detecting timetable conflicts and overlaps',
      icon: '⚡'
    },
    {
      type: 'Fixed',
      date: '3 weeks ago',
      title: 'Export functionality improved',
      description: 'Fixed issues with PDF and Excel exports, added new templates',
      icon: '📁'
    },
    {
      type: 'Upcoming',
      date: 'Next release',
      title: 'Mobile app development',
      description: 'Native mobile app for iOS and Android coming soon',
      icon: '📱'
    }
  ];

  if (submitted) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Thank You!</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        
        <div className="text-center py-8">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Suggestion Submitted Successfully!
          </h3>
          <p className="text-gray-600 mb-6">
            Thank you for your feedback. Our team will review your suggestion and get back to you if needed.
          </p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={handleReset}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another Suggestion
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
          <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               Suggestions & Feedback
            </h1>
        </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Suggestion Form */}
        <div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💡 Share Your Ideas</h3>
            <p className="text-sm text-gray-600">
              We value your feedback! Help us improve EduScheduler by sharing your suggestions, 
              reporting issues, or requesting new features.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors" 
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select 
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Suggestion <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows="6" 
                name="suggestion"
                value={formData.suggestion}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Please describe your suggestion in detail. Be as specific as possible about the problem and your proposed solution..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-1">
                Character count: {formData.suggestion.length}/1000
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                } text-white shadow-lg`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Suggestion'
                )}
              </button>
              
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        {/* Recent Updates & Information */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Updates & Roadmap</h3>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-start space-x-3">
                  <span className="text-2xl">{update.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium mr-2 ${
                        update.type === 'New' ? 'bg-green-100 text-green-800' :
                        update.type === 'Improved' ? 'bg-blue-100 text-blue-800' :
                        update.type === 'Fixed' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {update.type}
                      </span>
                      <span className="text-xs text-gray-500">{update.date}</span>
                    </div>
                    <p className="font-medium text-gray-900">{update.title}</p>
                    <p className="text-sm text-gray-600 mt-1">{update.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Section */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips for Great Suggestions</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Be specific about the problem you're facing</li>
              <li>• Include steps to reproduce if it's a bug</li>
              <li>• Suggest a clear solution or alternative</li>
              <li>• Consider how it benefits other users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;