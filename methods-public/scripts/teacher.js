// This function hides the modal by removing 'active' class
function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.getElementById('addSubjectForm').reset();
    document.getElementById('form-title').innerText = 'Add New Subject';
    document.getElementById('submit-button').innerText = 'Add Subject';
    document.getElementById('subjectCode').disabled = false;
    document.getElementById('addSubjectForm').action = '/addSubject';
  }
}

// This function shows the modal by adding 'active' class
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
  }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the add subject button and modal
  const addSubjectBtn = document.getElementById('add-subject');
  const addSubjectModal = document.getElementById('addSubjectModal');
  const closeBtn = addSubjectModal.querySelector('.close-btn');

  document.getElementById('submit-button').addEventListener('click', () => {
        const btn = document.getElementById('submit-button');
            if (btn.innerText === 'Update Subject') {
                // Change form action to /editSubject and temporarily enable subjectCode
                document.getElementById('addSubjectForm').action = '/editSubject';
                document.getElementById('subjectCode').disabled = false;

                // Optional: enable back after short delay if needed
                setTimeout(() => {
                    document.getElementById('subjectCode').disabled = true;
                }, 500);
            }
        });

  // When "+ Add Subjects" button is clicked → open modal
  addSubjectBtn.addEventListener('click', () => {
    document.getElementById('addSubjectForm').reset(); // clear inputs
    document.getElementById('form-title').innerText = 'Add New Subject';
    document.getElementById('submit-button').innerText = 'Add Subject';
    document.getElementById('subjectCode').disabled = false; // enable subject code
    openModal('addSubjectModal');
  });

  // When close (×) button is clicked → close modal
  closeBtn.addEventListener('click', () => {
    closeModal('addSubjectModal');
  });

  // Optional: close modal if user clicks outside it
  window.addEventListener('click', (e) => {
    if (e.target === addSubjectModal) {
      closeModal('addSubjectModal');
    }
  });

  // Optional: close modal on pressing Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal('addSubjectModal');
    }
    });

    // function to open form in edit
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-subject')) {
        const btn = e.target;

        // Prefill form inputs
        document.getElementById('subjectName').value = btn.dataset.name;
        document.getElementById('subjectCode').value = btn.dataset.code;
        document.getElementById('credits').value = btn.dataset.credits;

        // Set selects by looping or using value
        document.querySelector('select#semester').value = btn.dataset.semester;
        
        // Assuming you fix duplicate 'semester' ids in HTML:
        document.querySelector('select[name="year"]').value = btn.dataset.year;
        document.querySelector('select[name="section"]').value = btn.dataset.section;

        document.getElementById('form-title').innerText = 'Edit Subject';
        document.getElementById('submit-button').innerText = 'Update Subject';

        // Disable subject code to prevent edits
        document.getElementById('subjectCode').disabled = true;

        openModal('addSubjectModal'); 
    }
    });
    

});


window.onload = async () => {
  try {
    const res = await fetch('/professor/subjects');
    if (!res.ok) throw new Error('Unable to load subjects');
    const subjects = await res.json();

    const subjectContainer = document.getElementById('subjects-container');
    const formOptionContainer = document.getElementById('session-form')

    if (!subjectContainer) return;
    if(!formOptionContainer) return;

    // Clear existing static examples if any
    subjectContainer.innerHTML = '';
    formOptionContainer.innerHTML = '<option value="">Choose a subject...</option>';

    subjects.forEach(sub => {
      const div = document.createElement('div');
      div.className = 'sub-stat';
      div.innerHTML = `
        <div class="hd">
            <p class="sub">${sub.subject_name}</p>
            <p>
              ${sub.subject_code} | ${sub.year}th Year | ${sub.semester}th semester | 
              ${sub.branch_code}-${sub.section} | ${sub.credits} credits
            </p>
        </div>
        <div class="edit-btn">
            <button 
            class="btn edit-subject"
            data-name="${sub.subject_name}"
            data-code="${sub.subject_code}"
            data-year="${sub.year}"
            data-semester="${sub.semester}"
            data-section="${sub.section}"
            data-branch="${sub.branch_code}"
            data-credits="${sub.credits}"
            >Edit</button>
            <button class="btn delete-subject" data-code="${sub.subject_code}">Delete</button>
        </div>
      `;
      subjectContainer.appendChild(div);

      const option = document.createElement("option")
      option.value = sub.subject_code
      option.innerText = sub.subject_name
      formOptionContainer.appendChild(option)

    });
  } catch (err) {
    console.error('Error loading subjects:', err);
    alert('Failed to load subjects');
  }
};

const deleteSubject = async (code) => {
  // First confirmation
  const first = confirm(`Are you sure you want to delete the subject with code: ${code}?`);
  if (!first) return;

  // Second confirmation
  const second = confirm(`This will permanently remove the subject and all related mappings.\nContinue?`);
  if (!second) return;

  const res = await fetch('/deleteSubject', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subjectCode: code })
  });

  if (res.ok) {
    alert('Subject deleted successfully');
    window.location.reload();
  } else {
    alert('Failed to delete subject');
  }
};

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('delete-subject')) {
    const subjectCode = e.target.dataset.code;
    deleteSubject(subjectCode);
  }
});

/* let startAttend = document.getElementById('start-attendance')
let stopAttend = document.getElementById('stop-attendance')
let startDiv = document.getElementById('start-session')
let stopDiv = document.getElementById('stop-session')

startAttend.addEventListener('click', (e)=> {
  e.preventDefault()
    startDiv.classList.remove('session-live')
    stopDiv.classList.add('session-live')
})

stopAttend.addEventListener('click', (e)=> {
  e.preventDefault()
    stopDiv.classList.remove('session-live')
    startDiv.classList.add('session-live')
}) */

///bhasad

async function loadAttendanceRequests(sessionId) {
  try {
    const response = await fetch(`/professor/attendanceRequests/${sessionId}`);
    const requests = await response.json();
    
    const requestsContainer = document.getElementById('requests');
    requestsContainer.innerHTML = '';
    
    if (requests.length === 0) {
      requestsContainer.innerHTML = '<p class="no-requests">No attendance requests yet.</p>';
      return;
    }
    
    // Add bulk action buttons
    const bulkActions = document.createElement('div');
    bulkActions.className = 'bulk-actions';
    bulkActions.innerHTML = `
      <button class="btn btn-success" onclick="markAllAttendance('present')">Mark All Present</button>
    `;
    requestsContainer.appendChild(bulkActions);
    
    // Add individual requests
    requests.forEach(request => {
      const requestDiv = document.createElement('div');
      requestDiv.className = 'sub-stat attendance-request';
      requestDiv.innerHTML = `
        <div class="student-info">
          <strong>${request.student_name}</strong> (${request.roll_number})
          <br>
          <small>${request.branch_code} - Section ${request.section} - Year ${request.year}</small>
          <br>
          <small>Requested at: ${new Date(request.request_time).toLocaleString()}</small>
        </div>
        <div class="request-actions">
          <button class="btn btn-success" onclick="markIndividualAttendance(${request.session_id}, ${request.student_id}, 'present')">
            Present
          </button>
          <button class="btn btn-warning" onclick="markIndividualAttendance(${request.session_id}, ${request.student_id}, 'absent')">
            Absent
          </button>
          <button class="btn btn-danger" onclick="deleteRequest(${request.request_id})">
            Delete
          </button>
        </div>
      `;
      requestsContainer.appendChild(requestDiv);
    });
    
  } catch (err) {
    console.error('Error loading attendance requests:', err);
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch('/professor/checkSession');
    const data = await res.json();
    if (data.active) {
      document.getElementById('start-session').style.display = 'none';
      document.getElementById('stop-session').style.display = 'flex';
      document.getElementById('sessionStatus').innerText = `Active : ${data.subject}`;
      currentSessionId = data.sessionId; // store for future use
      loadAttendanceRequests(data.sessionId);
    } else {
      document.getElementById('start-session').style.display = 'flex';
      document.getElementById('stop-session').style.display = 'none';
    }
  } catch (err) {
    console.error("Error checking session:", err);
  }
});

async function markIndividualAttendance(sessionId, studentId, status) {
  try {
    const response = await fetch('/professor/markAttendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, studentId, status })
    });
    
    if (response.ok) {
      // Reload requests to update the display
      loadAttendanceRequests(sessionId);
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to mark attendance');
    }
  } catch (err) {
    console.error('Error marking attendance:', err);
    alert('Failed to mark attendance');
  }
}


