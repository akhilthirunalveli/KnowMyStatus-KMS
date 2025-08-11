const express = require('express');
const { supabase } = require('../config/supabase');
const { generateToken, hashPassword, comparePassword, authenticateToken } = require('../utils/auth');

const router = express.Router();

// Teacher Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, subject, department, phone, office } = req.body;

    // Validate required fields
    if (!name || !email || !password || !subject || !department) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    // Check if teacher already exists
    const { data: existingTeacher } = await supabase
      .from('teachers')
      .select('id')
      .eq('email', email)
      .single();

    if (existingTeacher) {
      return res.status(400).json({ error: 'Teacher with this email already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create teacher record
    const { data: teacher, error } = await supabase
      .from('teachers')
      .insert([
        {
          name,
          email,
          password: hashedPassword,
          subject,
          department,
          phone: phone || null,
          office: office || null,
          qr_code: null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create teacher account' });
    }

    // Generate JWT token
    const token = generateToken({
      id: teacher.id,
      email: teacher.email,
      role: 'teacher'
    });

    // Remove password from response
    const { password: _, ...teacherWithoutPassword } = teacher;

    res.status(201).json({
      message: 'Teacher registered successfully',
      teacher: teacherWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Teacher Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find teacher by email
    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !teacher) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, teacher.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = generateToken({
      id: teacher.id,
      email: teacher.email,
      role: 'teacher'
    });

    // Remove password from response
    const { password: _, ...teacherWithoutPassword } = teacher;

    res.json({
      message: 'Login successful',
      teacher: teacherWithoutPassword,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get current teacher profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    // Remove password from response
    const { password: _, ...teacherWithoutPassword } = teacher;

    res.json({ teacher: teacherWithoutPassword });

  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update teacher profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, subject, department, phone, office, status, available_until, status_note } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (subject) updateData.subject = subject;
    if (department) updateData.department = department;
    if (phone !== undefined) updateData.phone = phone;
    if (office !== undefined) updateData.office = office;
    if (status) updateData.status = status;
    if (available_until !== undefined) updateData.available_until = available_until;
    if (status_note !== undefined) updateData.status_note = status_note;

    const { data: teacher, error } = await supabase
      .from('teachers')
      .update(updateData)
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }

    // Remove password from response
    const { password: _, ...teacherWithoutPassword } = teacher;

    res.json({
      message: 'Profile updated successfully',
      teacher: teacherWithoutPassword
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 