const express = require('express');
const { supabase } = require('../config/supabase');
const path = require('path');

const router = express.Router();

// Get all teachers for student view
router.get('/teachers', async (req, res) => {
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
    console.error('Student teachers fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get teacher details by ID
router.get('/teacher/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('id, name, subject, department, phone, office, email, qr_code, created_at')
      .eq('id', id)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json({ teacher });

  } catch (error) {
    console.error('Teacher details fetch error:', error);
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
    console.error('Student search error:', error);
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
router.get('/departments', async (req, res) => {
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

// Get teacher QR code image
router.get('/teacher/:id/qr', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('id, name, qr_code')
      .eq('id', id)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (!teacher.qr_code) {
      return res.status(404).json({ error: 'QR code not available for this teacher' });
    }

    // Serve the QR code image file
    const qrCodePath = path.join(__dirname, '../uploads', teacher.qr_code);
    
    // Check if file exists
    if (!require('fs').existsSync(qrCodePath)) {
      return res.status(404).json({ error: 'QR code file not found' });
    }

    // Set appropriate headers for image
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `inline; filename="${teacher.qr_code}"`);
    
    // Send the file
    res.sendFile(qrCodePath);

  } catch (error) {
    console.error('Teacher QR fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get recently scanned teachers (based on QR scans)
router.get('/recent-scans', async (req, res) => {
  try {
    // Get recent QR scans (last 24 hours)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const { data: recentScans, error: scansError } = await supabase
      .from('qr_scans')
      .select('teacher_id, scanned_at')
      .gte('scanned_at', yesterday.toISOString())
      .order('scanned_at', { ascending: false });

    if (scansError) {
      console.error('Recent scans fetch error:', scansError);
      return res.status(500).json({ error: 'Failed to fetch recent scans' });
    }

    // Get unique teacher IDs from recent scans
    const teacherIds = [...new Set(recentScans.map(scan => scan.teacher_id))];

    if (teacherIds.length === 0) {
      return res.json({ teachers: [] });
    }

    // Get teacher details for recently scanned teachers
    const { data: teachers, error: teachersError } = await supabase
      .from('teachers')
      .select('id, name, subject, department, office, qr_code')
      .in('id', teacherIds)
      .order('name');

    if (teachersError) {
      console.error('Recent teachers fetch error:', teachersError);
      return res.status(500).json({ error: 'Failed to fetch recent teachers' });
    }

    res.json({ teachers });

  } catch (error) {
    console.error('Recent scans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 