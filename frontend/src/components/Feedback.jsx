// FeedbackForm.jsx
import { useState } from 'react';

export default function FeedbackForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    problemType: 'bug',
    problemDescription: '',
    suggestion: '',
    rating: 3,
    attachScreenshot: false
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // setIsSubmitting(true);
    
    // try {
    //   // Update this URL to your Express server's address
    //   const response = await fetch('http://localhost:8002/api/submit-feedback', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formData),
    //   });
      
    //   if (response.ok) {
    //     setSubmitStatus({
    //       success: true,
    //       message: 'Thank you for your feedback! We appreciate your input.'
    //     });
    //     // Reset form
    //     setFormData({
    //       name: '',
    //       email: '',
    //       problemType: 'bug',
    //       problemDescription: '',
    //       suggestion: '',
    //       rating: 3,
    //       attachScreenshot: false
    //     });
    //   } else {
    //     throw new Error('Failed to submit feedback');
    //   }
    // } catch (error) {
    //   setSubmitStatus({
    //     success: false,
    //     message: 'Something went wrong. Please try again later.'
    //   });
    // } finally {
    //   setIsSubmitting(false);
      
    //   setTimeout(() => {
    //     setSubmitStatus(null);
    //   }, 5000);
    // }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-500 bg-clip-text text-transparent">
            We Value Your Feedback
          </h1>
          <div className="h-1 w-24 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 mx-auto"></div>
          <p className="mt-6 text-lg text-gray-300">
            Your insights help us improve our products and services. Please share your thoughts with us.
          </p>
        </div>
        
        {/* Form */}
        <div className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>
            
            {/* Problem Type */}
            <div className="mb-6">
              <label htmlFor="problemType" className="block text-sm font-medium text-gray-300 mb-2">
                Feedback Type
              </label>
              <select
                id="problemType"
                name="problemType"
                value={formData.problemType}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              >
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement Suggestion</option>
                <option value="experience">User Experience</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Problem Description */}
            <div className="mb-6">
              <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-300 mb-2">
                Describe the Issue or Feedback
              </label>
              <textarea
                id="problemDescription"
                name="problemDescription"
                value={formData.problemDescription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Please describe the issue you encountered or feedback you'd like to share..."
                required
              ></textarea>
            </div>
            
            {/* Suggestion */}
            <div className="mb-6">
              <label htmlFor="suggestion" className="block text-sm font-medium text-gray-300 mb-2">
                Your Suggestion or Expected Outcome
              </label>
              <textarea
                id="suggestion"
                name="suggestion"
                value={formData.suggestion}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="How do you think we could improve this? What would be your ideal solution?"
              ></textarea>
            </div>
            
            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                How would you rate your experience? (1-5)
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setFormData({...formData, rating})}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      formData.rating >= rating 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Screenshot Option */}
            <div className="mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="attachScreenshot"
                  name="attachScreenshot"
                  checked={formData.attachScreenshot}
                  onChange={handleChange}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-600 rounded"
                />
                <label htmlFor="attachScreenshot" className="ml-2 block text-sm text-gray-300">
                  I would like to attach a screenshot (you'll be prompted after submission)
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-lg text-white font-medium transition-colors duration-300 ${
                  isSubmitting 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
            
            {/* Status Message */}
            {submitStatus && (
              <div className={`mt-6 p-4 rounded-lg ${
                submitStatus.success ? 'bg-green-800/30 border border-green-700' : 'bg-red-800/30 border border-red-700'
              }`}>
                <p className={submitStatus.success ? 'text-green-300' : 'text-red-300'}>
                  {submitStatus.message}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}