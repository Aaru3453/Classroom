import React, { useState } from 'react';

const Contact = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    urgency: 'Medium',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Contact form submitted:', formData);
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', urgency: 'Medium', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    { icon: '📧', method: 'Email', details: 'support@eduscheduler.com', response: 'Within 24 hours' },
    { icon: '📞', method: 'Phone', details: '+1 (555) 123-EDU', response: '24/7 Hotline' },
    { icon: '💬', method: 'Live Chat', details: 'Available on dashboard', response: 'Instant response' },
    { icon: '🕒', method: 'Office Hours', details: 'Mon-Fri 9AM-6PM EST', response: 'Immediate assistance' }
  ];

  return (
    <div className="p-6">
        <div className="pt-24 text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
               Contact Support
            </h1>
        </div>
    
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Contact Methods */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Quick Support Channels</h3>
          <div className="space-y-4">
            {contactMethods.map((method, index) => (
              <div key={index} className="flex items-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
                <span className="text-2xl mr-4">{method.icon}</span>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{method.method}</p>
                  <p className="text-gray-600">{method.details}</p>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">{method.response}</span>
              </div>
            ))}
          </div>

          {/* Emergency Contact */}
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-3">🚨</span>
              <h4 className="font-semibold text-red-800">Emergency Technical Support</h4>
            </div>
            <p className="text-red-700 text-sm">
              For critical system outages or urgent technical issues, call our emergency line: 
              <strong> +1 (555) 911-EDU</strong>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                <select 
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
              <textarea 
                rows="5" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Please describe your issue or question in detail..."
              ></textarea>
            </div>

            <div className="flex space-x-3 pt-4">
              <button 
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-105'
                } text-white shadow-lg`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
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
      </div>
    </div>
  );
};

export default Contact;