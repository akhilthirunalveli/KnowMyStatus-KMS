const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();

// Record a status change in history
router.post('/record', authenticateToken, async (req, res) => {
  try {
    const { teacher_id, previous_status, new_status, status_note, changed_by } = req.body;

    if (!teacher_id || !new_status) {
      return res.status(400).json({ error: 'Teacher ID and new status are required' });
    }

    const { data: historyRecord, error } = await supabase
      .from('status_history')
      .insert([{
        teacher_id,
        previous_status: previous_status || null,
        new_status,
        status_note: status_note || null,
        changed_by: changed_by || req.user?.email || 'system'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error recording status history:', error);
      return res.status(500).json({ error: 'Failed to record status change' });
    }

    res.json({
      message: 'Status change recorded successfully',
      record: historyRecord
    });

  } catch (error) {
    console.error('Status history recording error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get status history for a specific teacher
router.get('/teacher/:teacherId', authenticateToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { limit = 50, offset = 0, days = 30 } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const { data: history, error } = await supabase
      .from('status_history')
      .select('*')
      .eq('teacher_id', teacherId)
      .gte('changed_at', startDate.toISOString())
      .order('changed_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Error fetching status history:', error);
      return res.status(500).json({ error: 'Failed to fetch status history' });
    }

    res.json({ history: history || [] });

  } catch (error) {
    console.error('Status history fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my status history (authenticated teacher)
router.get('/my-history', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { limit = 50, offset = 0, days = 30 } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const { data: history, error } = await supabase
      .from('status_history')
      .select('*')
      .eq('teacher_id', teacherId)
      .gte('changed_at', startDate.toISOString())
      .order('changed_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    if (error) {
      console.error('Error fetching my status history:', error);
      return res.status(500).json({ error: 'Failed to fetch status history' });
    }

    res.json({ history: history || [] });

  } catch (error) {
    console.error('My status history fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get status analytics for a teacher
router.get('/analytics/:teacherId', authenticateToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { days = 30 } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get all status changes in the date range
    const { data: history, error } = await supabase
      .from('status_history')
      .select('*')
      .eq('teacher_id', teacherId)
      .gte('changed_at', startDate.toISOString())
      .order('changed_at', { ascending: true });

    if (error) {
      console.error('Error fetching status analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch status analytics' });
    }

    // Calculate analytics
    const analytics = calculateStatusAnalytics(history || [], parseInt(days));

    res.json({ analytics });

  } catch (error) {
    console.error('Status analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get my status analytics
router.get('/analytics/me', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { days = 30 } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get all status changes in the date range
    const { data: history, error } = await supabase
      .from('status_history')
      .select('*')
      .eq('teacher_id', teacherId)
      .gte('changed_at', startDate.toISOString())
      .order('changed_at', { ascending: true });

    if (error) {
      console.error('Error fetching my status analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch status analytics' });
    }

    // Calculate analytics
    const analytics = calculateStatusAnalytics(history || [], parseInt(days));

    res.json({ analytics });

  } catch (error) {
    console.error('My status analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all teachers' status analytics (Admin only)
router.get('/admin/analytics', async (req, res) => {
  try {
    const { days = 30, department } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Build query
    let query = supabase
      .from('status_history')
      .select('*, teachers!inner(name, department, subject)')
      .gte('changed_at', startDate.toISOString());

    if (department) {
      query = query.eq('teachers.department', department);
    }

    const { data: history, error } = await query.order('changed_at', { ascending: true });

    if (error) {
      console.error('Error fetching admin status analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch status analytics' });
    }

    // Calculate system-wide analytics
    const analytics = calculateAdminAnalytics(history || [], parseInt(days));

    res.json({ analytics });

  } catch (error) {
    console.error('Admin status analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to calculate status analytics for a teacher
function calculateStatusAnalytics(history, days) {
  const analytics = {
    totalChanges: history.length,
    changesByStatus: {},
    mostCommonStatus: null,
    mostActiveDay: null,
    averageChangesPerDay: 0,
    peakHour: null,
    statusBreakdown: {},
    dailyPattern: {},
    hourlyPattern: {}
  };

  if (history.length === 0) {
    return analytics;
  }

  // Count changes by new status
  history.forEach(record => {
    const status = record.new_status;
    analytics.changesByStatus[status] = (analytics.changesByStatus[status] || 0) + 1;
  });

  // Find most common status
  let maxCount = 0;
  for (const [status, count] of Object.entries(analytics.changesByStatus)) {
    if (count > maxCount) {
      maxCount = count;
      analytics.mostCommonStatus = status;
    }
  }

  // Analyze daily patterns
  const dayCounts = {};
  const hourCounts = {};

  history.forEach(record => {
    const date = new Date(record.changed_at);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = date.getHours();

    dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  analytics.dailyPattern = dayCounts;
  analytics.hourlyPattern = hourCounts;

  // Find most active day
  let maxDayCount = 0;
  for (const [day, count] of Object.entries(dayCounts)) {
    if (count > maxDayCount) {
      maxDayCount = count;
      analytics.mostActiveDay = day;
    }
  }

  // Find peak hour
  let maxHourCount = 0;
  for (const [hour, count] of Object.entries(hourCounts)) {
    if (count > maxHourCount) {
      maxHourCount = count;
      analytics.peakHour = `${hour}:00 - ${parseInt(hour) + 1}:00`;
    }
  }

  // Calculate average changes per day
  analytics.averageChangesPerDay = (history.length / days).toFixed(2);

  // Calculate status breakdown (time-based approximation)
  const statusBreakdown = {};
  let previousTimestamp = null;
  let previousStatus = null;

  history.forEach((record, index) => {
    const currentTimestamp = new Date(record.changed_at);
    
    if (previousTimestamp && previousStatus) {
      const duration = currentTimestamp - previousTimestamp;
      statusBreakdown[previousStatus] = (statusBreakdown[previousStatus] || 0) + duration;
    }

    previousTimestamp = currentTimestamp;
    previousStatus = record.new_status;
  });

  // Convert durations to hours
  for (const [status, duration] of Object.entries(statusBreakdown)) {
    statusBreakdown[status] = (duration / (1000 * 60 * 60)).toFixed(2);
  }

  analytics.statusBreakdown = statusBreakdown;

  // Recent status changes (last 10)
  analytics.recentChanges = history.slice(-10).reverse();

  return analytics;
}

// Helper function to calculate admin-level analytics
function calculateAdminAnalytics(history, days) {
  const analytics = {
    totalStatusChanges: history.length,
    changesByDepartment: {},
    mostActiveDepartment: null,
    peakActivityDay: null,
    peakActivityHour: null,
    statusChangeTrend: {},
    departmentBreakdown: {},
    dailyActivity: {},
    hourlyActivity: {}
  };

  if (history.length === 0) {
    return analytics;
  }

  // Group by department
  history.forEach(record => {
    const dept = record.teachers?.department || 'Unknown';
    analytics.changesByDepartment[dept] = (analytics.changesByDepartment[dept] || 0) + 1;
  });

  // Find most active department
  let maxDeptCount = 0;
  for (const [dept, count] of Object.entries(analytics.changesByDepartment)) {
    if (count > maxDeptCount) {
      maxDeptCount = count;
      analytics.mostActiveDepartment = dept;
    }
  }

  // Analyze daily and hourly patterns
  const dayCounts = {};
  const hourCounts = {};

  history.forEach(record => {
    const date = new Date(record.changed_at);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    const hour = date.getHours();

    dayCounts[dayOfWeek] = (dayCounts[dayOfWeek] || 0) + 1;
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  analytics.dailyActivity = dayCounts;
  analytics.hourlyActivity = hourCounts;

  // Find peak activity day
  let maxDayCount = 0;
  for (const [day, count] of Object.entries(dayCounts)) {
    if (count > maxDayCount) {
      maxDayCount = count;
      analytics.peakActivityDay = day;
    }
  }

  // Find peak activity hour
  let maxHourCount = 0;
  for (const [hour, count] of Object.entries(hourCounts)) {
    if (count > maxHourCount) {
      maxHourCount = count;
      analytics.peakActivityHour = `${hour}:00 - ${parseInt(hour) + 1}:00`;
    }
  }

  // Status change trend by date
  const trend = {};
  history.forEach(record => {
    const date = new Date(record.changed_at).toISOString().split('T')[0];
    trend[date] = (trend[date] || 0) + 1;
  });
  analytics.statusChangeTrend = trend;

  return analytics;
}

// Export status history to CSV
router.get('/export/:teacherId', authenticateToken, async (req, res) => {
  try {
    const { teacherId } = req.params;
    const { days = 90 } = req.query;

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get teacher info
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('name, email, department, subject')
      .eq('id', teacherId)
      .single();

    if (teacherError) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Get status history
    const { data: history, error } = await supabase
      .from('status_history')
      .select('*')
      .eq('teacher_id', teacherId)
      .gte('changed_at', startDate.toISOString())
      .order('changed_at', { ascending: true });

    if (error) {
      console.error('Error exporting status history:', error);
      return res.status(500).json({ error: 'Failed to export status history' });
    }

    // Generate CSV
    const headers = ['Date', 'Time', 'Previous Status', 'New Status', 'Status Note', 'Changed By'];
    const csvContent = [
      headers.join(','),
      ...history.map(record => [
        new Date(record.changed_at).toLocaleDateString(),
        new Date(record.changed_at).toLocaleTimeString(),
        record.previous_status || 'N/A',
        record.new_status,
        record.status_note ? `"${record.status_note.replace(/"/g, '""')}"` : '',
        record.changed_by || 'system'
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="status-history-${teacher.name}-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);

  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
