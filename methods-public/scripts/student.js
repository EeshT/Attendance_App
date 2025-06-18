console.log('Student JS loaded');
let menu_btn = document.querySelectorAll('.menu-btn')
let card_content = document.querySelectorAll('.enroll-card')
menu_btn.forEach(btn => {
    btn.addEventListener('click', () => {
        let targetId = btn.getAttribute('data-target');

        if (targetId) {
            // Remove 'clicked' from all and add to this one
            menu_btn.forEach(b => b.classList.remove('clicked'));
            btn.classList.add('clicked');

            // Hide all cards
            card_content.forEach(c => c.classList.remove('active'));

            // Show selected card
            const targetCard = document.getElementById(targetId);
            if (targetCard) {
                targetCard.classList.add('active');
            }
        }

    })
})


function getCorrectYearString(year) {
    let currYear = ''
    if(year === 1){
        currYear = `${year}st`
    } else if( year === 2){
        currYear = `${year}nd`
    } else if( year === 3){
        currYear = `${year}rd`
    } else if( year === 4){
        currYear = `${year}th`
    } 
    return currYear
}
window.onload = async () => {
  try {
    const res = await fetch('/student/info');
    if (!res.ok) throw new Error('Not logged in or session expired');

    const data = await res.json();
    const currYear = getCorrectYearString(data.year);

    document.getElementById('main-name').innerHTML = `${data.student_name}`;
    document.getElementById('main-info').innerHTML = `Roll No: ${data.roll_number} | ${data.branch_code}-${data.section} | ${currYear} Year`;
  } catch (err) {
    console.error('User info error:', err);
    alert('Session expired or not logged in. Redirecting to login...');
    window.location.href = '/pages/login.html';
    return;
  }

  //  If the first one is fine, proceed with second
  try {
    const subRes = await fetch('/student/subjects');
    if (!subRes.ok) throw new Error('Failed to fetch subjects');

    const subjects = await subRes.json();

    const container = document.getElementById('subjects-container');
    if (!container) {
        alert('subjects-container not found')
        throw new Error('Subjects container not found');
    }
    container.innerHTML = '';

    subjects.forEach(sub => {
      const div = document.createElement('div');
      div.className = 'subject';
      div.innerHTML = `
        <p class="course-code">${sub.subject_code}</p>
        <h2>${sub.subject_name}</h2>
        <h4>${sub.professor_name} | ${sub.credits} Credits</h4>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error('Subject fetch error:', err);
    alert('Failed to load subject data');
  }

  //If the second one is fine proceed with third
  try {
    const activeSessionRes = await fetch('/student/activeSession');
    if (!activeSessionRes.ok) throw new Error('Failed to load active session');

    const activeSessions = await activeSessionRes.json();
    const activeSessionContainer = document.getElementById('active-session');

    activeSessionContainer.innerHTML = '';

    if (activeSessions.length === 0) {
    activeSessionContainer.innerHTML = '<p>No active session</p>';
    } else {
    activeSessions.forEach(sess => {
        const div = document.createElement('div');
        div.className = 'session';
        div.innerHTML = `
            <div class="enroll-stat">
                <p class="course-code">${sess.subject_code}</p>
                <div class="live-indicator">
                    <span class="dot"></span>
                    <span class="text">Live</span>
                </div>
            </div>
            <h2>${sess.subject_name}</h2>
            <h4>Prof. ${sess.professor_name}</h4>
            <div class="enroll-stat">
                <div>
                    <p>Credits: ${sess.credits} |  Lesson Type: ${sess.session_type} |  Time: ${sess.session_time}</p>
                </div>
                <button onclick="requestAttendance('${sess.session_id}')" id="request-btn" class="course-code">Request Attendance</button>
            </div>
        `;
        activeSessionContainer.appendChild(div);
    });
    }

  } catch(err) {
    console.error('Active sessions could not be retrieved')
    alert('Failed to load active sessions')
  }
};

async function requestAttendance(sessionId) {
  const res = await fetch('/student/requestAttendance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  
  const result = await res.json();
  alert(result.message);
}



