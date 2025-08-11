import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, BookOpen, Building, Phone, MapPin, Save, X, Clock, StickyNote } from 'lucide-react';

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
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Teacher Profile
        </h1>
        <p className="text-gray-600">
          Manage your profile information and contact details.
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleCancel}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your full name"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{user?.name}</span>
                </div>
              )}
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="font-medium">{user?.email}</span>
              </div>
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.subject ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your subject"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <BookOpen className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{user?.subject}</span>
                </div>
              )}
              {errors.subject && (
                <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
              )}
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="department"
                    type="text"
                    value={formData.department}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.department ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your department"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Building className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{user?.department}</span>
                </div>
              )}
              {errors.department && (
                <p className="mt-1 text-sm text-red-600">{errors.department}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`input-field pl-10 ${errors.phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Enter your phone number"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{user?.phone || 'Not provided'}</span>
                </div>
              )}
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Office */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Location
              </label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    name="office"
                    type="text"
                    value={formData.office}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Enter your office location"
                  />
                </div>
              ) : (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="font-medium">{user?.office || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Real-time Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Status</label>
              {isEditing ? (
                <>
                  <div className="mb-2">
                    <select
                      name="status"
                      className="input-field"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      <option value="available">Available</option>
                      <option value="not_available">Not Available</option>
                      <option value="on_leave">On Leave</option>
                      <option value="lunch">Lunch</option>
                      <option value="in_meeting">In Meeting</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                      <StickyNote className="h-4 w-4 text-gray-400" /> Note (optional)
                    </label>
                    <input
                      name="status_note"
                      type="text"
                      className="input-field"
                      value={formData.status_note}
                      onChange={handleChange}
                      placeholder="Add a note (e.g. 'Back at 2pm')"
                      maxLength={100}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Expected Return (optional)</label>
                    <input
                      name="status_until"
                      type="datetime-local"
                      className="input-field"
                      value={formData.status_until}
                      onChange={handleChange}
                    />
                  </div>
                </>
              ) : (
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium capitalize">{user?.status ? user.status.replace('_', ' ') : 'Available'}</span>
                  </div>
                  {user?.status_note && <div className="text-xs text-gray-500">Note: {user.status_note}</div>}
                  {user?.status_until && <div className="text-xs text-gray-500">Until: {new Date(user.status_until).toLocaleString()}</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile; 