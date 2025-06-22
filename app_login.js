import express from 'express';
import path from 'path';
import session from 'express-session';
import bcrypt from 'bcrypt';
import nocache from 'nocache';
import { logStudentDetails, logProfessorDetails, checkLoginDetails, getStudentInfo, addNewSubject, updateSubjectDetails, deleteSubjectAndMapping, getProfessorName, getStudentSubjectInfo, startAttendanceSession ,getActiveSessionForStudent, requestStudentAttendance, checkActiveSession, getAttendanceRequests, markIndividualAttendance, markAllAttendance, stopAttendanceSession, getStudentAttendanceSummary} from './database.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,  // 1 day
    secure: process.env.NODE_ENV === 'production', // HTTPS in production
    httpOnly: true
  }
}));
app.use(nocache());
app.use(express.json()); 
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(path.join(__dirname, 'methods-public')));
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'methods-public', 'pages', 'login.html'));
});

app.post('/register',async (req,res) => {
    const userType = req.body.userType // 'student' or 'professor'
    console.log('User type:', userType)
    console.log(req.body)
    let data = req.body

    if (userType === 'student') {
      try{
        await logStudentDetails(data)
        res.status(200).redirect('/login')
      } catch(err) {
        console.error(err);
        res.status(500).send('Error registering student')
      }
    } else if (userType === 'professor') {
      try{
        await logProfessorDetails(data)
        res.status(200).redirect('/login')
      } catch(err) {
        console.error(err);
        res.status(500).send('Error registering professor')
      }
    }
  
})

/* app.post('/login',async (req,res) => {
  try {
    console.log(req.body)
    const { username, password } = req.body;

    const user = await checkLoginDetails(username, password)

    if (user && await bcrypt.compare(password, user.password_hash)) {
      req.session.userId = user.user_id;
      req.session.userType = user.user_type;
      req.session.username = user.username; 
      console.log(req.session.userType)
      if (user.user_type === 'student') {
        return res.redirect('/student');
      } else if (user.user_type === 'professor') {
        return res.redirect('/professor');
      } else {
        return res.status(400).send('Unknown user type');
      }
    } else {
      res.status(401).send('Invalid credentials');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error in loging')
  }
}) */

app.get('/login', (req, res) => {
  if (req.session.userId) {
    if (req.session.role === 'student') return res.redirect('/student');
    if (req.session.role === 'teacher') return res.redirect('/teacher');
  }
  res.sendFile(path.join(__dirname, 'methods-public', 'pages', 'login.html'));
}); 

app.post('/login', async (req, res) => {
  try {
    console.log('Login request body:', req.body);
    const { username, password, userType } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, password, and user type are required' 
      });
    }

    const user = await checkLoginDetails(username, password);

    if (user && await bcrypt.compare(password, user.password_hash)) {
      // Verify the user type matches what they selected
      if (user.user_type !== userType) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid user type. Please select the correct role.` 
        });
      }

      req.session.userId = user.user_id;
      req.session.userType = user.user_type;
      req.session.username = user.username; 
      
      console.log('Session created:', req.session);
      
      if (user.user_type === 'student') {
        res.json({ 
          success: true, 
          redirect: '/student'
        });
      } else if (user.user_type === 'professor') {
        res.json({ 
          success: true, 
          redirect: '/professor'
        });
      } else {
        return res.status(400).json({ 
          success: false, 
          message: 'Unknown user type' 
        });
      }
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid username or password' 
      });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
});

function requireLogin(role) {
  return (req, res, next) => {
    if (!req.session.userId || req.session.userType !== role) {
      return res.redirect('/login');
    }
    next();
  };
}

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).send('Error logging out');
    }
    res.redirect('/login');
  });
});

app.get('/session-check', (req, res) => {
  if (req.session.userId) {
    res.json({ loggedIn: true, userType: req.session.userType });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/student', requireLogin('student'),async (req, res) => {
  res.sendFile(path.join(__dirname, 'methods-public', 'pages', 'student.html'));
});

app.get('/professor', requireLogin('professor'),async (req, res) => {
  res.sendFile(path.join(__dirname, 'methods-public', 'pages', 'teacher.html'));
});

app.get('/student/info', requireLogin('student'), async (req,res) => {
  try {
    const user_name = req.session.username
    const studentData = await getStudentInfo(user_name)
    res.json(studentData)
  } catch(err){
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch student info' });
  }
})

app.post('/addSubject', requireLogin('professor'),async (req,res) => {
  try{
      const data = req.body
      const username = req.session.username
      await addNewSubject(data, username)
      res.status(200).send('Subject registered successfully')
  } catch(err){
    console.error('Add Subject Error:', err.message)
    res.status(400).send(err.message || 'There was a problem in registering the subject')
  }
})

import { getProfessorSubjects } from './database.js';

app.get('/professor/subjects', requireLogin('professor'), async (req, res) => {
  try {
    const username = req.session.username;
    const subjects = await getProfessorSubjects(username);
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load subjects' });
  }
});

app.get('/student/subjects', requireLogin('student'), async (req, res) => {
  try {
    const username = req.session.username;
    const subjects = await getStudentSubjectInfo(username);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load subjects' });
  }
});

app.post('/editSubject', requireLogin('professor'), async (req, res) => {
  try {
    const data = req.body;
    const username = req.session.username;
    await updateSubjectDetails(data, username);
    res.status(200).send('Subject updated successfully')
  } catch (err) {
    console.error(err);
    res.status(400).send('Error updating subject');
  }
});

app.post('/deleteSubject', async (req, res) => {
  const { subjectCode } = req.body;
  const username = req.session.username
  console.log('Deleting subject with code:', subjectCode);
  try {
    await deleteSubjectAndMapping(username, subjectCode);
    res.status(200).send('Subject deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete subject');
  }
});

app.get('/professor/name', requireLogin('professor'), async (req, res) => {
  try {
    const username = req.session.username;

    const name = await getProfessorName(username);
    res.status(200).json({profName: name})
  } catch (err) {
    console.error(err);
    res.status(500).send('Error starting attendance session');
  }
})
app.post('/professor/startSession', requireLogin('professor'), async (req, res) => {
  try {
    const { subjectCode, sessionType } = req.body;
    const username = req.session.username;

    const startTime = new Date();
    const date = startTime.toISOString().split('T')[0];
    const time = startTime.toTimeString().split(' ')[0];

    await startAttendanceSession(username, subjectCode, sessionType, date, time);

    res.status(200).redirect('/professor'); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Error starting attendance session');
  }
});

app.get('/student/activeSession', requireLogin('student'), async (req, res) => {
  try {
    const sessionInfo = await getActiveSessionForStudent(req.session.username);
    res.json(sessionInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch session info' });
  }
});

app.post('/student/requestAttendance', requireLogin('student'), async (req, res) => {
  try {
    const { sessionId } = req.body;
    const username = req.session.username;

    await requestStudentAttendance(sessionId, username);
    res.json({ message: 'Attendance request submitted.' });

  } catch (err) {
    if (err.code === 'DUPLICATE_REQUEST') {
      res.status(409).json({ message: 'You have already requested attendance for this session.' });
    } else {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

app.get('/professor/checkSession', async (req, res) => {
  const username = req.session.username;
  const sessionInfo = await checkActiveSession(username);
  if (sessionInfo) {
    res.json({ active: true, ...sessionInfo });
  } else {
    res.json({ active: false });
  }
});


app.get('/professor/attendanceRequests/:sessionId', requireLogin('professor'), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const requests = await getAttendanceRequests(sessionId);
    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance requests' });
  }
});

app.post('/professor/markAttendance', requireLogin('professor'), async (req, res) => {
  try {
    const { sessionId, studentId, status, requestStatus } = req.body;
    await markIndividualAttendance(sessionId, studentId, status, requestStatus);
    res.json({ message: 'Attendance marked successfully' });
  } catch (err) {
    console.error(err);
    if (err.message.includes('already marked')) {
      res.status(409).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to mark attendance' });
    }
  }
});

app.post('/professor/markAllAttendance', requireLogin('professor'), async (req, res) => {
  try {
    const { sessionId, status } = req.body;
    const result = await markAllAttendance(sessionId, status);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark all attendance' });
  }
});

app.post('/professor/stopSession', requireLogin('professor'), async (req, res) => {
  try {
    const { sessionId } = req.body;
    console.log(sessionId);
    const result = await stopAttendanceSession(sessionId);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to stop session' });
  }
});


app.get('/student/attendance-summary-percentage', requireLogin('student'), async (req, res) => {
  try {
    const username = req.session.username;

    const summary = await getStudentAttendanceSummary(username); 
    res.json(summary);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch attendance summary' });
  }
});


app.listen(8000, () => {
  console.log('Server listening on http://localhost:8000');
});

