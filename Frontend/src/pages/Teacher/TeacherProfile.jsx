import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, BookOpen, Building, Phone, MapPin, Save, X, Clock, StickyNote, ArrowRight, ArrowLeft } from 'lucide-react';

const TeacherProfile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth();
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
    <div className="min-h-screen bg-app-background subtle-grid cabinet-grotesk">
      {/* Navbar */}
      <nav className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <div className="premium-card w-full max-w-5xl !rounded-full px-6 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-white tracking-tight transition-opacity flex items-center cabinet-grotesk">
            KnowMyStatus<span className="text-[#ff3333] text-4xl leading-none">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-base font-medium text-white cabinet-grotesk">
            <Link to="/" className="text-white transition-colors">
              Home
            </Link>
            <Link to="/student" className="text-white transition-colors">
              Find Teacher
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/teacher/dashboard"
              className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2"
            >
              Dashboard
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
              Teacher <span className="text-[#ff3333]">Profile</span>
            </h1>
            <p className="text-gray-400">Manage your publicly visible information</p>
          </div>

          <div className="premium-card p-1 bg-gradient-to-br from-white/10 to-transparent border-0">
            <div className="bg-black/90 p-6 sm:p-8 rounded-[1.4rem]">
              {/* Action Buttons */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#ff3333]/10 rounded-full flex items-center justify-center border border-[#ff3333]/20">
                    <User className="h-8 w-8 text-[#ff3333]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white cabinet-grotesk">{formData.name || 'Your Name'}</h2>
                    <p className="text-sm text-gray-500">{formData.subject || 'Subject'}</p>
                  </div>
                </div>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#ff3333] text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-500/20"
                  >
                    <User className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleCancel}
                      className="flex items-center justify-center gap-2 py-2.5 px-4 border border-white/10 bg-white/5 rounded-xl text-white transition-colors text-sm"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="flex items-center justify-center gap-2 bg-[#ff3333] text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg shadow-red-500/20"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
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
                        className={`block w-full pl-10 pr-4 py-3 border ${errors.name ? 'border-red-500' : 'border-white/10'} bg-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff3333] transition-colors`}
                        placeholder="Enter your full name"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">{user?.name}</span>
                    </div>
                  )}
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5 opacity-70">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span className="text-white font-medium">{user?.email}</span>
                    <span className="ml-auto text-xs text-gray-500 border border-white/10 px-2 py-1 rounded">Read Only</span>
                  </div>
                </div>

                {/* Subject and Department Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
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
                          className={`block w-full pl-10 pr-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-white/10'} bg-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff3333] transition-colors`}
                          placeholder="Mathematics"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                        <span className="text-white font-medium">{user?.subject}</span>
                      </div>
                    )}
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-400">{errors.subject}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="department" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
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
                          className={`block w-full pl-10 pr-4 py-3 border ${errors.department ? 'border-red-500' : 'border-white/10'} bg-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff3333] transition-colors`}
                          placeholder="Science"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <Building className="h-5 w-5 text-gray-400" />
                        <span className="text-white font-medium">{user?.department}</span>
                      </div>
                    )}
                    {errors.department && (
                      <p className="mt-1 text-xs text-red-400">{errors.department}</p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
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
                        className={`block w-full pl-10 pr-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-white/10'} bg-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff3333] transition-colors`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">{user?.phone || 'Not provided'}</span>
                    </div>
                  )}
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                  )}
                </div>

                {/* Office */}
                <div>
                  <label htmlFor="office" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
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
                        className="block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff3333] transition-colors"
                        placeholder="Room 204"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span className="text-white font-medium">{user?.office || 'Not provided'}</span>
                    </div>
                  )}
                </div>

                {/* Status Section Divider */}
                <div className="border-t border-white/10 pt-6 mt-8">
                  <h3 className="text-lg font-bold text-white mb-4 cabinet-grotesk flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[#ff3333]" />
                    Status Configuration
                  </h3>

                  {/* Status */}
                  <div>
                    <label htmlFor="status" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                      Current Status
                    </label>
                    {isEditing ? (
                      <>
                        <select
                          id="status"
                          name="status"
                          className="block w-full py-3 px-4 border border-white/10 bg-white/5 rounded-xl text-white text-sm mb-4 focus:outline-none focus:border-[#ff3333] transition-colors"
                          value={formData.status}
                          onChange={handleChange}
                        >
                          <option value="available" className="bg-black text-white">Available</option>
                          <option value="not_available" className="bg-black text-white">Not Available</option>
                          <option value="on_leave" className="bg-black text-white">On Leave</option>
                          <option value="lunch" className="bg-black text-white">Lunch</option>
                          <option value="in_meeting" className="bg-black text-white">In Meeting</option>
                        </select>

                        <div className="mb-4">
                          <label htmlFor="status_note" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
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
                              className="block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#ff3333] transition-colors"
                              value={formData.status_note}
                              onChange={handleChange}
                              placeholder="Add a note (e.g. 'Back at 2pm')"
                              maxLength={100}
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="status_until" className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
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
                              className="block w-full pl-10 pr-4 py-3 border border-white/10 bg-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-[#ff3333] transition-colors"
                              value={formData.status_until}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="p-4 bg-[#ff3333]/10 rounded-xl border border-[#ff3333]/20">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff3333]"></span>
                          <span className="text-white font-bold capitalize text-lg cabinet-grotesk">{user?.status ? user.status.replace('_', ' ') : 'Available'}</span>
                        </div>
                        {user?.status_note && (
                          <div className="text-sm text-gray-300 ml-5 italic">"{user.status_note}"</div>
                        )}
                        {user?.status_until && (
                          <div className="text-xs text-gray-500 ml-5 mt-1 border-t border-[#ff3333]/10 pt-2 inline-block">
                            Until: {new Date(user.status_until).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherProfile;