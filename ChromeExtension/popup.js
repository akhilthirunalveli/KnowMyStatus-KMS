// Configuration
const API_BASE_URL = 'https://knowmystatus-kms.onrender.com/api';
// const API_BASE_URL = 'http://localhost:5000/api'; // For local development

// DOM elements
let currentUser = null;
let currentStatus = 'available';

// Initialize popup
document.addEventListener('DOMContentLoaded', async () => {
    await initializeExtension();
    setupEventListeners();
});

async function initializeExtension() {
    showLoading();
    
    try {
        // Check if user is already logged in
        const savedToken = await getStoredToken();
        if (savedToken) {
            // Try to fetch real profile
            const profile = await fetchUserProfile(savedToken);
            if (profile) {
                currentUser = { ...profile, token: savedToken };
                showDashboard();
                loadUserData();
                return;
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
    
    showLoginForm();
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('teacher-login');
    loginForm?.addEventListener('submit', handleLogin);
    
    // Password toggle
    const passwordToggle = document.getElementById('toggle-password');
    passwordToggle?.addEventListener('click', togglePasswordVisibility);
    
    // Status buttons
    const statusButtons = document.querySelectorAll('.status-btn');
    statusButtons.forEach(btn => {
        btn.addEventListener('click', () => selectStatus(btn.dataset.status));
    });
    
    // Character counter for status note
    const statusNote = document.getElementById('status-note');
    statusNote?.addEventListener('input', updateCharCounter);
    
    // Action buttons
    document.getElementById('update-btn')?.addEventListener('click', handleStatusUpdate);
    document.getElementById('logout-btn')?.addEventListener('click', handleLogout);
    
    // Navigation
    document.getElementById('open-dashboard')?.addEventListener('click', openDashboard);
}

// Authentication functions
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
    } else {
        passwordInput.type = 'password';
        eyeOpen.style.display = 'none';
        eyeClosed.style.display = 'block';
    }
}

async function handleLogin(event) {
    event.preventDefault();
    
    const loginBtn = document.getElementById('login-btn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    const errorDiv = document.getElementById('login-error');
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email || !password) {
        showError('Please enter both email and password', errorDiv);
        return;
    }
    
    // Show loading state
    loginBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    hideError(errorDiv);
    
    try {
        // Real API login
        await performRealLogin(email, password);
        
        // Switch to dashboard
        showDashboard();
        loadUserData();
        
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message || 'Login failed. Please try again.', errorDiv);
    } finally {
        // Reset button state
        loginBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

async function performRealLogin(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Login failed');
    }
    
    // Store token and user data
    await storeToken(data.token);
    currentUser = { ...data.teacher, token: data.token };
}

async function handleLogout() {
    try {
        await removeStoredToken();
        currentUser = null;
        showLoginForm();
        
        // Reset form
        document.getElementById('teacher-login').reset();
        hideError(document.getElementById('login-error'));
        
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Status management
function selectStatus(status) {
    currentStatus = status;
    
    // Update UI
    const statusButtons = document.querySelectorAll('.status-btn');
    statusButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        }
    });
    
    // Update current status display
    const statusDisplay = document.getElementById('current-status');
    if (statusDisplay) {
        statusDisplay.textContent = formatStatusLabel(status);
    }
}

function formatStatusLabel(status) {
    const statusLabels = {
        'available': 'Available',
        'busy': 'Busy',
        'in_meeting': 'In Meeting',
        'teaching': 'Teaching',
        'on_break': 'On Break',
        'away': 'Away'
    };
    return statusLabels[status] || 'Available';
}

async function handleStatusUpdate() {
    if (!currentUser) return;
    
    const updateBtn = document.getElementById('update-btn');
    const btnText = updateBtn.querySelector('.btn-text');
    const btnLoader = updateBtn.querySelector('.btn-loader');
    const messageDiv = document.getElementById('update-message');
    
    // Get form data
    const statusNote = document.getElementById('status-note').value.trim();
    const phone = document.getElementById('phone-update').value.trim();
    const office = document.getElementById('office-update').value.trim();
    
    // Show loading state
    updateBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'block';
    hideMessage(messageDiv);
    
    try {
        // Real API update
        await performRealUpdate(statusNote, phone, office);
        
        // Show success message
        showMessage('Status updated successfully!', 'success', messageDiv);
        
        // Update UI
        loadUserData();
        
    } catch (error) {
        console.error('Update error:', error);
        showMessage(error.message || 'Update failed. Please try again.', 'error', messageDiv);
    } finally {
        // Reset button state
        updateBtn.disabled = false;
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

async function performRealUpdate(statusNote, phone, office) {
    const updateData = {
        status: currentStatus,
        status_note: statusNote || null,
    };
    
    // Only include phone and office if they have values
    if (phone) updateData.phone = phone;
    if (office) updateData.office = office;
    
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    
    if (!response.ok) {
        throw new Error(data.error || 'Update failed');
    }
    
    // Update current user data
    currentUser = { ...currentUser, ...data.teacher };
}

// UI functions
function showLoading() {
    hideAllViews();
    document.getElementById('loading-state').style.display = 'block';
}

function showLoginForm() {
    hideAllViews();
    document.getElementById('login-form').style.display = 'block';
}

function showDashboard() {
    hideAllViews();
    document.getElementById('dashboard').style.display = 'block';
}

function hideAllViews() {
    const views = ['loading-state', 'login-form', 'dashboard'];
    views.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
}

function loadUserData() {
    if (!currentUser) return;
    
    // Update teacher info
    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'T';
    document.getElementById('teacher-initial').textContent = initial;
    document.getElementById('teacher-name').textContent = currentUser.name || 'Unknown';
    document.getElementById('teacher-subject').textContent = currentUser.subject || 'No subject';
    document.getElementById('teacher-dept').textContent = currentUser.department || 'No department';
    
    // Set current status
    if (currentUser.status) {
        selectStatus(currentUser.status);
    }
    
    // Load status note
    if (currentUser.status_note) {
        document.getElementById('status-note').value = currentUser.status_note;
        updateCharCounter();
    }
    
    // Load contact info
    if (currentUser.phone) {
        document.getElementById('phone-update').value = currentUser.phone;
    }
    if (currentUser.office) {
        document.getElementById('office-update').value = currentUser.office;
    }
}

function updateCharCounter() {
    const statusNote = document.getElementById('status-note');
    const charCount = document.getElementById('char-count');
    if (statusNote && charCount) {
        charCount.textContent = statusNote.value.length;
    }
}

async function openDashboard() {
    try {
        await chrome.tabs.create({ 
            url: 'https://knowmystatus.vercel.app/teacher' 
        });
    } catch (error) {
        console.error('Error opening dashboard:', error);
        // Fallback: try to open in current tab
        window.open('https://knowmystatus.vercel.app/teacher', '_blank');
    }
}

// Utility functions
function showError(message, element) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function hideError(element) {
    if (element) {
        element.style.display = 'none';
    }
}

function showMessage(message, type, element) {
    if (element) {
        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => hideMessage(element), 3000);
    }
}

function hideMessage(element) {
    if (element) {
        element.style.display = 'none';
    }
}

// Storage functions
async function storeToken(token) {
    try {
        await chrome.storage.local.set({ 'kms_teacher_token': token });
    } catch (error) {
        console.error('Token storage error:', error);
        // Fallback to localStorage
        localStorage.setItem('kms_teacher_token', token);
    }
}

async function getStoredToken() {
    try {
        const result = await chrome.storage.local.get(['kms_teacher_token']);
        return result.kms_teacher_token;
    } catch (error) {
        console.error('Token retrieval error:', error);
        // Fallback to localStorage
        return localStorage.getItem('kms_teacher_token');
    }
}

async function removeStoredToken() {
    try {
        await chrome.storage.local.remove(['kms_teacher_token']);
    } catch (error) {
        console.error('Token removal error:', error);
        // Fallback to localStorage
        localStorage.removeItem('kms_teacher_token');
    }
}

async function fetchUserProfile(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch profile');
        }
        
        const data = await response.json();
        return data.teacher;
        
    } catch (error) {
        console.error('Profile fetch error:', error);
        return null;
    }
}
