const express = require('express');
const { supabase } = require('../config/supabase');
const router = express.Router();

// Get all teachers (Admin endpoint)
router.get('/teachers', async (req, res) => {
  try {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teachers:', error);
      return res.status(500).json({ error: 'Failed to fetch teachers' });
    }

    res.json({ 
      teachers: teachers || [],
      total: teachers?.length || 0 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get teacher statistics
router.get('/stats', async (req, res) => {
  try {
    const { data: teachers, error } = await supabase
      .from('teachers')
      .select('status, department, subject, created_at');

    if (error) {
      console.error('Error fetching teacher stats:', error);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }

    const stats = {
      total: teachers?.length || 0,
      byStatus: {},
      byDepartment: {},
      bySubject: {},
      registrationsByMonth: {}
    };

    if (teachers) {
      // Count by status
      teachers.forEach(teacher => {
        const status = teacher.status || 'available';
        stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
      });

      // Count by department
      teachers.forEach(teacher => {
        if (teacher.department) {
          stats.byDepartment[teacher.department] = (stats.byDepartment[teacher.department] || 0) + 1;
        }
      });

      // Count by subject
      teachers.forEach(teacher => {
        if (teacher.subject) {
          stats.bySubject[teacher.subject] = (stats.bySubject[teacher.subject] || 0) + 1;
        }
      });

      // Count registrations by month
      teachers.forEach(teacher => {
        if (teacher.created_at) {
          const month = new Date(teacher.created_at).toISOString().slice(0, 7); // YYYY-MM
          stats.registrationsByMonth[month] = (stats.registrationsByMonth[month] || 0) + 1;
        }
      });
    }

    res.json({ stats });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete teacher (Admin endpoint)
router.delete('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('teachers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting teacher:', error);
      return res.status(500).json({ error: 'Failed to delete teacher' });
    }

    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update teacher status (Admin endpoint)
router.patch('/teachers/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, status_note, status_until } = req.body;

    const updateData = { status };
    if (status_note !== undefined) updateData.status_note = status_note;
    if (status_until !== undefined) updateData.status_until = status_until;

    const { data, error } = await supabase
      .from('teachers')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating teacher status:', error);
      return res.status(500).json({ error: 'Failed to update teacher status' });
    }

    res.json({ 
      message: 'Teacher status updated successfully',
      teacher: data 
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get teacher by ID (Admin endpoint)
router.get('/teachers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: teacher, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Teacher not found' });
      }
      console.error('Error fetching teacher:', error);
      return res.status(500).json({ error: 'Failed to fetch teacher' });
    }

    res.json({ teacher });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
