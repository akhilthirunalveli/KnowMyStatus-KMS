const express = require('express');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../utils/auth');

const router = express.Router();

// Get all teachers (public info only)
router.get('/', async (req, res) => {
  try {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('id, name, subject, department, office, qr_code')
      .order('name');

    if (error) {
      console.error('Fetch teachers error:', error);
      return res.status(500).json({ error: 'Failed to fetch teachers' });
    }

    res.json({ teachers });

  } catch (error) {
    console.error('Teachers fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get teacher by ID (public info only)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('id, name, subject, department, phone, office, email, qr_code')
      .eq('id', id)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ teacher });

  } catch (error) {
    console.error('Teacher fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get teacher analytics (authenticated teacher only)
router.get('/analytics/me', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Get QR scan statistics
    const { data: scans, error: scansError } = await supabase
      .from('qr_scans')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('scanned_at', { ascending: false });

    if (scansError) {
      console.error('Scans fetch error:', scansError);
      return res.status(500).json({ error: 'Failed to fetch scan data' });
    }

    // Calculate statistics
    const totalScans = scans.length;
    const todayScans = scans.filter(scan => {
      const scanDate = new Date(scan.scanned_at).toDateString();
      const today = new Date().toDateString();
      return scanDate === today;
    }).length;

    const weeklyScans = scans.filter(scan => {
      const scanDate = new Date(scan.scanned_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return scanDate >= weekAgo;
    }).length;

    // Get recent scans (last 10)
    const recentScans = scans.slice(0, 10);

    res.json({
      analytics: {
        totalScans,
        todayScans,
        weeklyScans,
        recentScans
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Search teachers
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;

    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('id, name, subject, department, office')
      .or(`name.ilike.${searchTerm},subject.ilike.${searchTerm},department.ilike.${searchTerm}`)
      .order('name');

    if (error) {
      console.error('Search error:', error);
      return res.status(500).json({ error: 'Failed to search teachers' });
    }

    res.json({ teachers });

  } catch (error) {
    console.error('Teacher search error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get teachers by department
router.get('/department/:department', async (req, res) => {
  try {
    const { department } = req.params;

    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('id, name, subject, department, office, qr_code')
      .eq('department', department)
      .order('name');

    if (error) {
      console.error('Department fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch teachers by department' });
    }

    res.json({ teachers });

  } catch (error) {
    console.error('Department teachers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all departments
router.get('/departments/list', async (req, res) => {
  try {
    const { data: departments, error } = await supabase
      .from('teachers')
      .select('department')
      .not('department', 'is', null);

    if (error) {
      console.error('Departments fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch departments' });
    }

    // Get unique departments
    const uniqueDepartments = [...new Set(departments.map(d => d.department))].sort();

    res.json({ departments: uniqueDepartments });

  } catch (error) {
    console.error('Departments list error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 