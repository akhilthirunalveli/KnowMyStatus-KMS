const express = require('express');
const QRCode = require('qrcode');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/supabase');
const { authenticateToken } = require('../utils/auth');
const supabaseStorage = require('../utils/supabaseStorage');

const router = express.Router();

// Generate QR code for teacher
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Get teacher details
    const { data: teacher, error: teacherError } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', teacherId)
      .single();

    if (teacherError || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Create QR code data
    const qrData = {
      teacherId: teacher.id,
      name: teacher.name,
      subject: teacher.subject,
      department: teacher.department,
      phone: teacher.phone,
      office: teacher.office,
      email: teacher.email,
      status: teacher.status,
      status_note: teacher.status_note,
      status_until: teacher.status_until || teacher.available_until,
      // Add separated date and time for better display
      expected_return_date: (teacher.status_until || teacher.available_until)
        ? new Date(teacher.status_until || teacher.available_until).toLocaleDateString()
        : null,
      expected_return_time: (teacher.status_until || teacher.available_until)
        ? new Date(teacher.status_until || teacher.available_until).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        : null
    };

    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(JSON.stringify(qrData), {
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      width: 300,
      margin: 2
    });

    // Upload to Supabase Storage
    const uploadResult = await supabaseStorage.uploadQRCode(qrBuffer, teacherId);
    
    if (!uploadResult.success) {
      return res.status(500).json({ error: 'Failed to upload QR code' });
    }

    // Update teacher record with QR code URL
    const { error: updateError } = await supabase
      .from('teachers')
      .update({ qr_code: uploadResult.data.publicUrl })
      .eq('id', teacherId);

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({ error: 'Failed to update QR code reference' });
    }

    res.json({
      message: 'QR code generated successfully',
      qrCodeUrl: uploadResult.data.publicUrl,
      qrData
    });

  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// Get teacher QR code
router.get('/teacher/:teacherId', async (req, res) => {
  try {
    const { teacherId } = req.params;

    // Get teacher details
    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', teacherId)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (!teacher.qr_code) {
      return res.status(404).json({ error: 'QR code not generated for this teacher' });
    }

    // Return QR code data
    const qrData = {
      teacherId: teacher.id,
      name: teacher.name,
      subject: teacher.subject,
      department: teacher.department,
      phone: teacher.phone,
      office: teacher.office,
      email: teacher.email,
      status: teacher.status,
      status_note: teacher.status_note,
      status_until: teacher.status_until || teacher.available_until,
      // Add separated date and time for better display
      expected_return_date: (teacher.status_until || teacher.available_until)
        ? new Date(teacher.status_until || teacher.available_until).toLocaleDateString()
        : null,
      expected_return_time: (teacher.status_until || teacher.available_until)
        ? new Date(teacher.status_until || teacher.available_until).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        : null
    };

    res.json({
      teacher: qrData,
      qrCodeUrl: teacher.qr_code
    });

  } catch (error) {
    console.error('QR fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Scan QR code (for students)
router.post('/scan', async (req, res) => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      return res.status(400).json({ error: 'QR data is required' });
    }

    let teacherData;
    try {
      teacherData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid QR code data' });
    }

    // Validate teacher data
    if (!teacherData.teacherId || !teacherData.name) {
      return res.status(400).json({ error: 'Invalid teacher data in QR code' });
    }

    // Get updated teacher details from database
    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', teacherData.teacherId)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Remove sensitive information
    const { password: _, qr_code: __, ...publicTeacherData } = teacher;

    // Log the scan (optional - for analytics)
    const { error: logError } = await supabase
      .from('qr_scans')
      .insert([
        {
          teacher_id: teacher.id,
          scanned_at: new Date().toISOString(),
          ip_address: req.ip || req.connection.remoteAddress
        }
      ]);

    if (logError) {
      console.error('Scan logging error:', logError);
    }

    res.json({
      message: 'QR code scanned successfully',
      teacher: publicTeacherData
    });

  } catch (error) {
    console.error('QR scan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current teacher's QR code
router.get('/my-qr', authenticateToken, async (req, res) => {
  try {
    const teacherId = req.user.id;

    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', teacherId)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    if (!teacher.qr_code) {
      return res.status(404).json({ error: 'QR code not generated yet' });
    }

    const qrData = {
      teacherId: teacher.id,
      name: teacher.name,
      subject: teacher.subject,
      department: teacher.department,
      phone: teacher.phone,
      office: teacher.office,
      email: teacher.email,
      status: teacher.status,
      status_note: teacher.status_note,
      status_until: teacher.status_until || teacher.available_until,
      // Add separated date and time for better display
      expected_return_date: (teacher.status_until || teacher.available_until)
        ? new Date(teacher.status_until || teacher.available_until).toLocaleDateString()
        : null,
      expected_return_time: (teacher.status_until || teacher.available_until)
        ? new Date(teacher.status_until || teacher.available_until).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        : null
    };

    res.json({
      qrCodeUrl: teacher.qr_code,
      qrData
    });

  } catch (error) {
    console.error('My QR fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 