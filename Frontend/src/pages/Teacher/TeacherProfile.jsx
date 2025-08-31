import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, BookOpen, Building, Phone, MapPin, Save, X, Clock, StickyNote, ArrowLeft } from 'lucide-react';

const TeacherProfile = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    subject: user?.subject || '',
    department: user?.department || '',
    phone: user?.phone || '',
    office: user?.office || '',
    status: user?.status || 'available',
    status_note: user?.status_note || '',
    status_until: user?.status_until ? user.status_until.slice(0, 16) : ''
  });
  const [errors, setErrors] = useState({});

  // Set page title
  useEffect(() => {
    document.title = "Teacher Profile - KnowMyStatus";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (formData.phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      const result = await updateProfile(formData);
      if (result.success) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      subject: user?.subject || '',
      department: user?.department || '',
      phone: user?.phone || '',
      office: user?.office || '',
      status: user?.status || 'available',
      status_note: user?.status_note || '',
      status_until: user?.status_until ? user.status_until.slice(0, 16) : ''
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Left Side - Profile Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            {/* Back Button */}
            <div className="mb-4">
              <Link 
                to="/teacher/dashboard" 
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-1 cabinet-grotesk">Teacher Profile</h1>
              <p className="text-gray-400 text-sm">Manage your profile information and status</p>
            </div>

            {/* Action Buttons */}
            <div className="mb-6">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-200 text-sm flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-600 bg-gray-900/50 rounded-lg text-white hover:bg-gray-800 transition-colors text-sm"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-red-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <Save className="h-4 w-4" />
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-300 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className={`block w-full pl-9 pr-3 py-2.5 border ${errors.name ? 'border-red-500' : 'border-gray-600'} bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm`}
                      placeholder="Enter your full name"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2.5 px-3 border border-gray-600 bg-gray-900/30 rounded-lg text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span>{user?.name}</span>
                  </div>
                )}
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="flex items-center gap-3 py-2.5 px-3 border border-gray-600 bg-gray-900/30 rounded-lg text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span>{user?.email}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              {/* Subject and Department Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="subject" className="block text-xs font-medium text-gray-300 mb-1">
                    Subject
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`block w-full pl-9 pr-3 py-2.5 border ${errors.subject ? 'border-red-500' : 'border-gray-600'} bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm`}
                        placeholder="Mathematics"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-2.5 px-3 border border-gray-600 bg-gray-900/30 rounded-lg text-sm">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span>{user?.subject}</span>
                    </div>
                  )}
                  {errors.subject && (
                    <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="department" className="block text-xs font-medium text-gray-300 mb-1">
                    Department
                  </label>
                  {isEditing ? (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="department"
                        name="department"
                        type="text"
                        value={formData.department}
                        onChange={handleChange}
                        className={`block w-full pl-9 pr-3 py-2.5 border ${errors.department ? 'border-red-500' : 'border-gray-600'} bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm`}
                        placeholder="Science"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 py-2.5 px-3 border border-gray-600 bg-gray-900/30 rounded-lg text-sm">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span>{user?.department}</span>
                    </div>
                  )}
                  {errors.department && (
                    <p className="mt-1 text-xs text-red-400">{errors.department}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-300 mb-1">
                  Phone Number
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`block w-full pl-9 pr-3 py-2.5 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm`}
                      placeholder="Enter your phone number"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2.5 px-3 border border-gray-600 bg-gray-900/30 rounded-lg text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>{user?.phone || 'Not provided'}</span>
                  </div>
                )}
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                )}
              </div>

              {/* Office */}
              <div>
                <label htmlFor="office" className="block text-xs font-medium text-gray-300 mb-1">
                  Office Location (Optional)
                </label>
                {isEditing ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="office"
                      name="office"
                      type="text"
                      value={formData.office}
                      onChange={handleChange}
                      className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                      placeholder="Room 204"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 py-2.5 px-3 border border-gray-600 bg-gray-900/30 rounded-lg text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{user?.office || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-xs font-medium text-gray-300 mb-1">
                  Current Status
                </label>
                {isEditing ? (
                  <>
                    <select
                      id="status"
                      name="status"
                      className="block w-full py-2.5 px-3 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-sm mb-3"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="available">Available</option>
                      <option value="not_available">Not Available</option>
                      <option value="on_leave">On Leave</option>
                      <option value="lunch">Lunch</option>
                      <option value="in_meeting">In Meeting</option>
                    </select>
                    
                    <div className="mb-3">
                      <label htmlFor="status_note" className="block text-xs font-medium text-gray-300 mb-1">
                        Status Note (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <StickyNote className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="status_note"
                          name="status_note"
                          type="text"
                          className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-white text-sm"
                          value={formData.status_note}
                          onChange={handleChange}
                          placeholder="Add a note (e.g. 'Back at 2pm')"
                          maxLength={100}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="status_until" className="block text-xs font-medium text-gray-300 mb-1">
                        Expected Return (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Clock className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="status_until"
                          name="status_until"
                          type="datetime-local"
                          className="block w-full pl-9 pr-3 py-2.5 border border-gray-600 bg-gray-900/50 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-white text-sm"
                          value={formData.status_until}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-2.5 px-3 border border-gray-600 bg-gray-900/30 rounded-lg text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="capitalize">{user?.status ? user.status.replace('_', ' ') : 'Available'}</span>
                    </div>
                    {user?.status_note && (
                      <div className="text-xs text-gray-400 ml-6">Note: {user.status_note}</div>
                    )}
                    {user?.status_until && (
                      <div className="text-xs text-gray-400 ml-6">Until: {new Date(user.status_until).toLocaleString()}</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - KnowMyStatus Text */}
        <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center">
          <div className="text-center">
            <Link to="/" className="text-6xl font-bold navbar-brand text-white tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
              KnowMyStatus<span className="navbar-red-dot">.</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile; 