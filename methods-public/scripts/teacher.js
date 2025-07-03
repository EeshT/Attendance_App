
// functionality to hover between various pages
const menu_btn = document.querySelectorAll(".teach-menu-btn")
const page_content = document.querySelectorAll(".card-content")

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('teach-menu-btn')) {
    const btn = e.target;
    const targetId = btn.getAttribute('data-target');
    
    if (targetId) {
      document.querySelectorAll('.teach-menu-btn').forEach(b => 
        b.classList.remove('clicked')
      );
      
      btn.classList.add('clicked');
      
      document.querySelectorAll('.card-content').forEach(card => 
        card.classList.remove('active')
      );
      
      const targetCard = document.getElementById(targetId);
      if (targetCard) {
        targetCard.classList.add('active');
      }
      if (targetId === 'card3') {
        console.log("Loading analytics on tab click");
        loadLowAttendance();
        loadSessionsForDate();
      }
    }
  }
});
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
    const profNameRes = await fetch('/professor/name')
    if (!profNameRes.ok) throw new Error('Unable to load the name');
    const nameData = await profNameRes.json();

    const mainNameElement = document.querySelector('.main-name');
    if (mainNameElement && nameData.profName) {
      mainNameElement.innerText = `Welcome back, Prof. ${nameData.profName}`;
    }


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
      div.className = 'sub-stat dynamic-btn';
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
            class="btn edit-subject dynamic-btn"
            data-name="${sub.subject_name}"
            data-code="${sub.subject_code}"
            data-year="${sub.year}"
            data-semester="${sub.semester}"
            data-section="${sub.section}"
            data-branch="${sub.branch_code}"
            data-credits="${sub.credits}"
            >Edit</button>
            <button class="btn delete-subject dynamic-btn" data-code="${sub.subject_code}">Delete</button>
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


async function loadAttendanceRequests(sessionId) {
  try {
    const response = await fetch(`/professor/attendanceRequests/${sessionId}`);
    const statResponse = await fetch(`/professor/sessionStats/${sessionId}`)
    const stats = await statResponse.json();
    const requests = await response.json();
    
    const requestsContainer = document.getElementById('requests');
    requestsContainer.innerHTML = '';
    
    if (requests.length === 0) {
      requestsContainer.innerHTML = '<p class="no-requests">No attendance requests yet.</p>';
      return;
    }
    
    // Add bulk action buttons
    const session_id = requests[0].session_id
    const bulkActions = document.createElement('div');
    bulkActions.className = 'bulk-actions';
    bulkActions.innerHTML = `
      <button class="btn btn-success dynamic-btn" id="mark-all-present-btn">Mark All Present</button>
      <p> Total Requests: ${stats.total}</p>
      <p> Marked as present: ${stats.present}</p>
      <p> Attention: All the shown requests will be marked as present </p>
    `;
    requestsContainer.appendChild(bulkActions);

    const markAllBtn = document.getElementById('mark-all-present-btn');
    markAllBtn.addEventListener('click', () => {
      console.log('Mark All button clicked!'); // Debug log
      markAllAttendance('present', sessionId);
    });
    
    // Add individual requests
    requests.forEach(request => {
      const requestDiv = document.createElement('div');
      requestDiv.className = 'sub-stat attendance-request dynamic-btn';
      requestDiv.innerHTML = `
        <div class="student-info">
          <strong>${request.student_name}</strong> (${request.roll_number})
          <br>
          <small>${request.branch_code} - Section ${request.section} - Year ${request.year}</small>
          <br>
          <small>Requested at: ${new Date(request.request_time).toLocaleString()}</small>
        </div>
        <div class="request-actions">
          <button class="btn btn-success dynamic-btn" onclick="markIndividualAttendance(${request.session_id}, ${request.student_id}, 'present','accepted')">
            Present
          </button>
          <button class="btn btn-warning dynamic-btn" onclick="markIndividualAttendance(${request.session_id}, ${request.student_id}, 'absent','rejected')">
            Absent
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
      document.getElementById('activeSessionStatus').innerText = `Active : ${data.subject}`;
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

async function markIndividualAttendance(sessionId, studentId, status, requestStatus) {
  try {
    const response = await fetch('/professor/markAttendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, studentId, status , requestStatus})
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

async function markAllAttendance(status, sessionId) {
  
  const confirmed = confirm(`Mark all pending requests as ${status}?`);
  if (!confirmed) return;
  
  try {
    const response = await fetch('/professor/markAllAttendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId, status })
    });
    
    if (response.ok) {
      const result = await response.json();
      alert(result.message || `All students marked as ${status}`);
      loadAttendanceRequests(sessionId);
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to mark all attendance');
    }
  } catch (err) {
    console.error('Error marking all attendance:', err);
    alert('Failed to mark all attendance');
  }
}

let startAttend = document.getElementById('start-attendance');
let stopAttend = document.getElementById('stop-attendance');

function showStartSession() {
  const startDiv = document.getElementById('start-session');
  const stopDiv = document.getElementById('stop-session');
  
  startDiv.style.display = 'flex';
  stopDiv.style.display = 'none';
}

function showActiveSession(sessionData) {
  const startDiv = document.getElementById('start-session');
  const stopDiv = document.getElementById('stop-session');
  
  startDiv.style.display = 'none';
  stopDiv.style.display = 'flex';
  
  const statusDiv = stopDiv.querySelector('.session-status');
  statusDiv.textContent = `Active: ${sessionData.subject_name} (${sessionData.session_type})`;
  
  loadAttendanceRequests(sessionData.session_id);
}

async function stopAttendanceSession (sessionId) {
  const confirmed = confirm('Are you sure you want to stop the current session?');
  if (!confirmed) return;
  
  try {
    const response = await fetch('/professor/stopSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId })
    });
    
    if (response.ok) {
      showStartSession();
      alert('Session stopped successfully');
    } else {
      const error = await response.json();
      alert(error.error || 'Failed to stop session');
    }
  } catch (err) {
    console.error('Error stopping session:', err);
    alert('Failed to stop session');
  }
}

stopAttend.addEventListener('click',async ()=> {
  const res = await fetch('/professor/checkSession');
  const data = await res.json();
  if (data.active) {
    stopAttendanceSession(data.sessionId);
  }

})

const logoutBtn = document.getElementById('logout-btn') 
logoutBtn.addEventListener('click',async () => {
  try {
      const response = await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        window.location.href = '/login'; 
      }
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Error logging out. Please try again.');
    }
})

// loading the attendance analytics
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("analytics-date");
    const sessionDropdown = document.getElementById("session-dropdown");

    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;

    dateInput.addEventListener("change", loadSessionsForDate);
    sessionDropdown.addEventListener("change", loadAnalytics);

    loadLowAttendance();
});

async function loadSessionsForDate() {
    const date = document.getElementById("analytics-date").value;
    const res = await fetch(`/api/sessions?date=${date}`);
    const sessions = await res.json();
    const dropdown = document.getElementById("session-dropdown");
    dropdown.innerHTML = "";

    sessions.forEach(session => {
        const option = document.createElement("option");
        option.value = session.session_id;
        option.textContent = `${session.subject_code} (${session.session_type})`;
        dropdown.appendChild(option);
    });

    if (sessions.length > 0) {
        dropdown.value = sessions[0].session_id;
        loadAnalytics(); // auto-load first session
    }
}

async function loadAnalytics() {
    const sessionId = document.getElementById("session-dropdown").value;
    const presentRes = await fetch(`/api/attendance/presentAbsent?sessionId=${sessionId}`);
    const summary = await presentRes.json();

    document.getElementById("present-count").innerText = summary.present;
    document.getElementById("absent-count").innerText = summary.absent;

    renderChart(summary.present, summary.absent);

    const absentRes = await fetch(`/api/attendance/absentNames?sessionId=${sessionId}`);
    const absentees = await absentRes.json();
    const tbody = document.querySelector("#absent-students-table tbody");
    tbody.innerHTML = "";

    absentees.forEach(st => {
        const row = document.createElement("tr");
        const nameCell = document.createElement("td");
        nameCell.innerText = st.student_name || st.name;
        row.appendChild(nameCell);
        tbody.appendChild(row);
    });
}

async function loadLowAttendance() {
   try {
        const res = await fetch('/api/attendance/lowAttendance');
        const students = await res.json();

        const tbody = document.querySelector("#low-attendance-table tbody");
        if (!tbody) {
            console.error("Missing tbody in low-attendance-table");
            return;
        }

        tbody.innerHTML = "";

        students.forEach(st => {
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.innerText = st.student_name || st.name || "N/A";

            const percentCell = document.createElement("td");
            const percentage = parseFloat(st.percentage);
            percentCell.innerText = isNaN(percentage) ? "0%" : percentage.toFixed(2) + "%";


            row.appendChild(nameCell);
            row.appendChild(percentCell);
            tbody.appendChild(row);
        });
    } catch (err) {
        console.error("Error loading low attendance:", err);
    }
}

let summaryChart;
function renderChart(present, absent) {
    const ctx = document.getElementById("summaryChart").getContext("2d");
    if (summaryChart) summaryChart.destroy(); // clear previous

    summaryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Present', 'Absent'],
            datasets: [{
                label: 'Count',
                data: [present, absent],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        }
    });
}

