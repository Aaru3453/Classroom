// frontend/src/components/pages/Suggestions.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suggestions = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    occupation: 'Student',
    category: 'Feature Request',
    suggestion: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSuggestions, setTotalSuggestions] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const API_URL = "http://localhost:5000/api";

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch suggestions
        const response = await axios.get(`${API_URL}/suggestions?sort=latest`);
        
        if (response.data.success) {
          setSuggestions(response.data.suggestions || []);
          setTotalSuggestions(response.data.stats?.total || 0);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
        setSuggestions([]);
        setTotalSuggestions(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.suggestion) {
      alert('Please fill in all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Real API call
      const response = await axios.post(`${API_URL}/suggestions`, formData);
      
      if (response.data.success) {
        setSubmitted(true);
        
        // Refresh suggestions after successful submission
        const refreshResponse = await axios.get(`${API_URL}/suggestions?sort=latest`);
        if (refreshResponse.data.success) {
          setSuggestions(refreshResponse.data.suggestions || []);
          setTotalSuggestions(refreshResponse.data.stats?.total || 0);
        }
      }
    } catch (error) {
      console.error('Error submitting suggestion:', error);
      alert(error.response?.data?.message || 'Failed to submit suggestion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
    
    // Reset form after success
    setTimeout(() => {
      setFormData({ 
        name: '', 
        email: '', 
        occupation: 'Student',
        category: 'Feature Request', 
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
      occupation: 'Student',
      category: 'Feature Request', 
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
    { value: 'General Feedback', label: 'General Feedback', icon: '💬' },
    { value: 'Other', label: 'Other', icon: '📌' }
  ];

  const occupations = [
    { value: 'Student', label: 'Student', icon: '👨‍🎓' },
    { value: 'Teacher', label: 'Teacher', icon: '👩‍🏫' },
    { value: 'Admin', label: 'Admin', icon: '👔' },
    { value: 'Other', label: 'Other', icon: '👤' }
  ];

  // Filter suggestions by category
  const filteredSuggestions = selectedCategory === 'All' 
    ? suggestions 
    : suggestions.filter(s => s.category === selectedCategory);

  // Get unique categories for filter
  const filterCategories = ['All', ...new Set(suggestions.map(s => s.category))];

  if (submitted) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
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
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-800 mb-3">
            Suggestion Submitted!
          </h3>
          
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Thank you for your feedback. Our team will review your suggestion.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Another
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 py-14">
      {/* Header Section - Center aligned */}
      <div className="text-center mb-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-3">
          Suggestions & Feedback
        </h1>
        <p className="text-gray-600 text-lg">
          Help us improve with your ideas and suggestions
        </p>
      </div>

      {/* Total suggestions in corner */}
      <div className="flex justify-end mb-4">
        <div className="bg-gray-50 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-gray-600">Total suggestions:</span>
          <span className="ml-2 text-lg font-semibold text-blue-600">{totalSuggestions}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Form */}
        <div>
          {/* Info card */}
          <div className="bg-blue-50 rounded-xl p-5 mb-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Share Your Ideas</h3>
                <p className="text-sm text-gray-600">
                  Your feedback helps shape the future of our product.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Occupation</label>
                  <select 
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {occupations.map((occ) => (
                      <option key={occ.value} value={occ.value}>
                        {occ.icon} {occ.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Your Suggestion <span className="text-red-500">*</span>
                </label>
                <textarea 
                  rows="5" 
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Describe your suggestion in detail..."
                ></textarea>
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-400">
                    {formData.suggestion.length}/1000
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-all ${
                    isSubmitting 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
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
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right Column - Suggestions List */}
        <div>
          {/* Category Filter */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium text-gray-800">Latest Suggestions</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
          
          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600"></div>
              <p className="mt-3 text-gray-500">Loading suggestions...</p>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No suggestions found</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredSuggestions.map((item) => (
                <div 
                  key={item._id} 
                  className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Category Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg ${
                      item.category === 'Feature Request' ? 'bg-purple-50 text-purple-600' :
                      item.category === 'Bug Report' ? 'bg-red-50 text-red-600' :
                      item.category === 'Improvement' ? 'bg-blue-50 text-blue-600' :
                      item.category === 'UI/UX Feedback' ? 'bg-pink-50 text-pink-600' :
                      item.category === 'Performance' ? 'bg-yellow-50 text-yellow-600' :
                      'bg-gray-50 text-gray-600'
                    }`}>
                      {item.category === 'Feature Request' ? '✨' :
                       item.category === 'Bug Report' ? '🐛' :
                       item.category === 'Improvement' ? '🚀' :
                       item.category === 'UI/UX Feedback' ? '🎨' :
                       item.category === 'Performance' ? '⚡' :
                       '📌'}
                    </div>
                    
                    <div className="flex-1">
                      {/* Date, Category and Occupation */}
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs text-gray-400">
                          {new Date(item.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {item.category}
                        </span>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                          {item.occupation === 'Student' ? '👨‍🎓' :
                           item.occupation === 'Teacher' ? '👩‍🏫' :
                           item.occupation === 'Admin' ? '👔' : '👤'} {item.occupation || 'Student'}
                        </span>
                      </div>
                      
                      {/* Suggestion Text */}
                      <p className="text-sm text-gray-700 mt-2">{item.suggestion}</p>
                      
                      {/* By whom */}
                      <div className="mt-2 text-xs text-gray-400">
                        By: {item.isAnonymous ? 'Anonymous' : item.name}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Yellow Tips Section */}
          <div className="mt-6 bg-yellow-50 rounded-xl border border-yellow-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">💡</span>
              <h4 className="font-medium text-yellow-800">Tips for good suggestions</h4>
            </div>
            
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Be specific about the problem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Include steps if reporting a bug</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-0.5">•</span>
                <span>Suggest a clear solution</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suggestions;