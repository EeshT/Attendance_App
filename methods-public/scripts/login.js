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
// Update fields visibility based on user type
function updateFieldsVisibility() {
    if (currentUserType === 'student') {
        studentFields.classList.add('active');
        professorFields.classList.remove('active');
        userTypeField.value = 'student'; 
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
        // Make professor fields required (only name)
        document.getElementById('professorName').required = true;
        // Make student fields not required
        document.querySelectorAll('.student-fields input, .student-fields select')
            .forEach(field => field.required = false);
    }
}


// Initialize
updateFieldsVisibility();