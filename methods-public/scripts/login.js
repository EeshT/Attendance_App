let currentUserType = 'student';
let currentFormType = 'login';

// DOM elements
const userTypeBtns = document.querySelectorAll('.user-type-btn');
const formToggleBtns = document.querySelectorAll('.toggle-btn');
const forms = document.querySelectorAll('.form');
const studentFields = document.querySelector('.student-fields');
const professorFields = document.querySelector('.professor-fields');

// User type toggle functionality
userTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        userTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentUserType = btn.dataset.type;
        updateFieldsVisibility();
    });
});

// Form toggle functionality
formToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        formToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFormType = btn.dataset.form;
        updateFormVisibility();
    });
});

// Update form visibility
function updateFormVisibility() {
    forms.forEach(form => form.classList.remove('active'));
    if (currentFormType === 'login') {
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.getElementById('registerForm').classList.add('active');
    }
}
const userTypeField = document.getElementById('userTypeField');
const loginUserTypeField = document.getElementById('loginUserTypeField'); 
// Update fields visibility based on user type
function updateFieldsVisibility() {
    if (currentUserType === 'student') {
        studentFields.classList.add('active');
        professorFields.classList.remove('active');
        userTypeField.value = 'student'; 
        loginUserTypeField.value = 'student';
        // Make student fields required
        document.querySelectorAll('.student-fields input[required], .student-fields select[required]')
            .forEach(field => field.required = true);
        // Make professor fields not required
        document.querySelectorAll('.professor-fields input, .professor-fields select')
            .forEach(field => field.required = false);
    } else {
        studentFields.classList.remove('active');
        professorFields.classList.add('active');
        userTypeField.value = 'professor'; 
        loginUserTypeField.value = 'professor';
        // Make professor fields required (only name)
        document.getElementById('professorName').required = true;
        // Make student fields not required
        document.querySelectorAll('.student-fields input, .student-fields select')
            .forEach(field => field.required = false);
    }
}


// Initialize
updateFieldsVisibility();

// In your login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = {
        username: formData.get('username'),
        password: formData.get('password'),
        userType: document.getElementById('loginUserTypeField').value
    };
    console.log('Sending login request with:', credentials);
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
        });
        
        const data = await response.json();
        
        if (data.success) {
            window.location.href = data.redirect;
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
});

 window.addEventListener('pageshow', async function (event) {
    // Trigger only if page is loaded from cache (back/forward navigation)
    const navType = performance.getEntriesByType("navigation")[0]?.type;
    if (event.persisted || navType === "back_forward") {
      try {
        const res = await fetch('/session-check', { credentials: 'include' });
        const data = await res.json();

        if (data.loggedIn) {
          if (data.userType === 'student') {
            window.location.href = '/student';
          } else if (data.userType === 'professor') {
            window.location.href = '/professor';
          }
        }
      } catch (err) {
        console.error('Session check failed:', err);
      }
    }
  });