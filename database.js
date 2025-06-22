import mysql from 'mysql2';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export let logStudentDetails = async (data)=> {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const [userRes] = await pool.query(
        'INSERT INTO users (username, password_hash, user_type, email) VALUES(?,?,?,?)',
        [data.username, hashedPassword, data.userType, data.email]
        );

        const user_id = userRes.insertId;

        const [branchRows] = await pool.query(
            'SELECT branch_id FROM branches WHERE branch_code = ?',
            [data.branch] 
        );

        if (branchRows.length === 0) {
            throw new Error('Branch not found');
        }

        const branchId = branchRows[0].branch_id;

        const [result] = await pool.query(
        'INSERT INTO students (user_id, roll_number, student_name, branch_id, section, year, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [user_id, data.rollNumber, data.studentName, branchId, data.section, data.year, data.phoneNumber[0]]
        );

        return result;
    } catch (err) {
        console.error('Error inserting student details', err);
        throw err;
  }
}
export let logProfessorDetails = async (data) => {
    try {
        const hashedPassword = await bcrypt.hash(data.password, 10);

        const [userRes] = await pool.query(
        'INSERT INTO users (username, password_hash, user_type, email) VALUES(?,?,?,?)',
        [data.username, hashedPassword, data.userType, data.email]
        );

        const user_id = userRes.insertId;

        const [branchRows] = await pool.query(
            'SELECT branch_name FROM branches WHERE branch_code = ?',
            [data.department] 
        );

        if (branchRows.length === 0) {
            throw new Error('Branch not found');
        }

        const branchName = branchRows[0].branch_name;

        const [result] = await pool.query(
            'INSERT INTO professors (user_id, professor_name, employee_id, phone_number, department) VALUES (?, ?, ?, ?, ?)',
            [user_id, data.professorName, data.employeeId, data.phoneNumber[1], branchName]
        );
        return result;

    } catch (err) {
        console.error('Error inserting professor details', err);
        throw err;
    }

}

export let checkLoginDetails = async (username, password) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const user = rows[0];
        return user
    } catch(err){
        console.error('Error finding logging details', err);
        throw err;
    }
}

export let getStudentInfo = async (username) => {
    try{
        const [ studentsInfo ] = await pool.query(
            'SELECT * FROM students JOIN users ON students.user_id = users.user_id JOIN branches ON students.branch_id = branches.branch_id WHERE users.username = ?',
            [username]
        );
        const studentData = studentsInfo[0];
        return studentData;

    } catch (err){
        console.error('Error getting students info', err);
        throw err;
    }
}

export let addNewSubject = async (data, username) => {
    try{
        const [existingSubjects] = await pool.query(
        'SELECT subject_id FROM subjects WHERE subject_code = ?',
        [data.subjectCode]
        );

        if (existingSubjects.length > 0) {
        throw new Error(`Subject with code '${data.subjectCode}' already exists.`);
        }

        // 2. Insert into subjects table
        const [insertRes] = await pool.query(
        'INSERT INTO subjects (subject_code, subject_name, credits) VALUES (?, ?, ?)',
        [data.subjectCode, data.subjectName, data.credits]
        );
        const subject_id = insertRes.insertId;

        const [professorIdInfo] = await pool.query(
            'SELECT professor_id FROM professors JOIN users ON professors.user_id = users.user_id WHERE users.username = ?',
            [username]
        )
        const professor_id = professorIdInfo[0].professor_id

        const [branchIdInfo] = await pool.query(
            'SELECT branch_id FROM branches WHERE branches.branch_code = ?',
            [data.branch]
        )
        const branch_id = branchIdInfo[0].branch_id

        const [finalRes] = await pool.query(
            'INSERT INTO professor_subjects (professor_id, subject_id, branch_id, section, year, semester) VALUES(?,?,?,?,?,?)',
            [professor_id, subject_id, branch_id, data.section, data.year, data.semester]
        )
        return finalRes

    } catch(err){
        console.error('Error inserting subjects info', err);
        throw err;
    }
}

export const getProfessorSubjects = async (username) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        sub.subject_name, 
        sub.subject_code, 
        sub.credits,
        ps.year,
        ps.semester,
        ps.section,
        b.branch_code
      FROM professor_subjects ps
      JOIN professors p ON ps.professor_id = p.professor_id
      JOIN users u ON p.user_id = u.user_id
      JOIN subjects sub ON ps.subject_id = sub.subject_id
      JOIN branches b ON ps.branch_id = b.branch_id
      WHERE u.username = ?
      ORDER BY ps.mapping_id DESC`,
      [username]
    );
    return rows;
  } catch (err) {
    console.error("Error fetching professor subjects:", err);
    throw err;
  }
};

export const updateSubjectDetails = async (data, username) => {
  try {
    
    const [subjectRows] = await pool.query(
      'SELECT subject_id FROM subjects WHERE subject_code = ?',
      [data.subjectCode]
    );
    if (subjectRows.length === 0) throw new Error('Subject not found');
    const subject_id = subjectRows[0].subject_id;

    await pool.query(
      'UPDATE subjects SET subject_name = ?, credits = ? WHERE subject_code = ?',
      [data.subjectName, data.credits, data.subjectCode]
    );

    const [professorRows] = await pool.query(
      `SELECT professor_id FROM professors
       JOIN users ON professors.user_id = users.user_id
       WHERE users.username = ?`,
      [username]
    );
    const professor_id = professorRows[0].professor_id;

    const [branchRows] = await pool.query(
      'SELECT branch_id FROM branches WHERE branch_code = ?',
      [data.branch]
    );
    if (branchRows.length === 0) throw new Error('Branch not found');
    const branch_id = branchRows[0].branch_id;

    await pool.query(
      `UPDATE professor_subjects
       SET branch_id = ?, section = ?, year = ?, semester = ?
       WHERE professor_id = ? AND subject_id = ?`,
      [branch_id, data.section, data.year, data.semester, professor_id, subject_id]
    );

    return { message: 'Subject mapping updated successfully' };
  } catch (err) {
    console.error('Error updating subject details:', err);
    throw err;
  }
};

export async function deleteSubjectAndMapping(username, subjectCode) {
  try {
    const [professorRes] = await pool.query(
      `SELECT professor_id FROM professors
       JOIN users ON professors.user_id = users.user_id
       WHERE users.username = ?`,
      [username]
    )
    if (professorRes.length === 0) throw new Error('Professor not found')

    const professor_id = professorRes[0].professor_id;

    const [subjectIdRes] = await pool.query(
        'SELECT subject_id FROM subjects WHERE subject_code = ?',
        [subjectCode]
    )

    if(subjectIdRes.length === 0) throw new Error('Subject Id not found') 

    const subject_id = subjectIdRes[0].subject_id

    // Delete the mapping first
    await pool.query(
      'DELETE FROM professor_subjects WHERE professor_id = ? AND subject_id = ?',
      [professor_id, subject_id]
    );

    // Delete the subject
    await pool.query(
      'DELETE FROM subjects WHERE subject_id = ?',
      [subject_id]
    );

    return true;
  } catch (err) {
    console.error('Error deleting subject and mapping:', err);
    throw err;
  }
}

export let getStudentSubjectInfo = async (username) => {
    try{
        const [studentRows] = await pool.query(
            `SELECT branch_id, year, section FROM students
            JOIN users ON students.user_id = users.user_id
            WHERE users.username = ?`,
            [username]
        )

        if(studentRows.length === 0) throw new Error('Student info not found')
        
        const { branch_id, year, section } = studentRows[0];

        const [studentSubjectInfo] = await pool.query(
            `SELECT professor_name, subject_code, subject_name, credits FROM professor_subjects
            JOIN professors ON professor_subjects.professor_id = professors.professor_id
            JOIN subjects ON professor_subjects.subject_id = subjects.subject_id
            WHERE professor_subjects.branch_id = ? AND professor_subjects.year = ? AND professor_subjects.section = ? `,
            [branch_id, year, section]
        )

        return studentSubjectInfo
    } catch(err){
        console.error('Error in displaying subjects info:', err);
    throw err;
    }
}

export async function startAttendanceSession(username, subjectCode, sessionType, session_date, session_time) {
  try {
    const [[prof]] = await pool.query(
      `SELECT professor_id FROM professors
       JOIN users ON professors.user_id = users.user_id
       WHERE users.username = ?`,
      [username]
    );

    const professor_id = prof.professor_id;

    const [[mapping]] = await pool.query(
      `SELECT mapping_id FROM professor_subjects
       JOIN subjects ON professor_subjects.subject_id = subjects.subject_id
       WHERE subject_code = ? AND professor_id = ?`,
      [subjectCode, professor_id]
    );

    await pool.query(
      `INSERT INTO attendance_sessions
       (mapping_id, session_date, session_time, session_type, session_status, created_by)
       VALUES (?, ?, ?, ?, 'ongoing', ?)`,
      [mapping.mapping_id, session_date, session_time, sessionType, professor_id]
    );
  } catch (err) {
    console.error('Error starting session:', err);
    throw err;
  }
}

export async function getActiveSessionForStudent(username) {
  try {
    const [studentRows] = await pool.query(`
      SELECT s.branch_id, s.year, s.section
      FROM students s
      JOIN users u ON s.user_id = u.user_id
      WHERE u.username = ?
    `, [username]);

    if (studentRows.length === 0) throw new Error('Student not found');
    const { branch_id, year, section } = studentRows[0];

    const [sessionRows] = await pool.query(`
      SELECT a.session_id, a.session_time, a.session_type, a.session_status,
             s.subject_name, s.credits, s.subject_code, p.professor_name
      FROM attendance_sessions a
      JOIN professor_subjects ps ON a.mapping_id = ps.mapping_id
      JOIN subjects s ON ps.subject_id = s.subject_id
      JOIN professors p ON ps.professor_id = p.professor_id
      WHERE a.session_status = 'ongoing'
        AND ps.branch_id = ? AND ps.year = ? AND ps.section = ?
    `, [branch_id, year, section]);

    return sessionRows;
  } catch (err) {
    console.error('Error fetching active session for student:', err);
    throw err;
  }
}

export let requestStudentAttendance = async (session_id, username) => {
    try {
        const [studentRes] = await pool.query(
        `SELECT student_id FROM students 
        JOIN users ON students.user_id = users.user_id
        WHERE users.username = ?`,
        [username]
        );

        if (studentRes.length === 0) throw new Error('Student not found');

        const student_id = studentRes[0]?.student_id;

        const [existing] = await pool.query(
        `SELECT * FROM attendance_requests WHERE session_id = ? AND student_id = ?`,
        [session_id, student_id]
        );

        if (existing.length > 0) {
        const error = new Error('Already requested');
        error.code = 'DUPLICATE_REQUEST';
        throw error;
        }

        await pool.query(
        `INSERT INTO attendance_requests (session_id, student_id) VALUES (?, ?)`,
        [session_id, student_id]
        );
  } catch (err) {
       console.error('Error in requesting attendeance :', err);
        throw err;
  }
}

export const checkActiveSession = async (username) => {
  const [rows] = await pool.query(
    `SELECT s.session_id, subj.subject_name
     FROM attendance_sessions s
     JOIN professor_subjects ps ON ps.mapping_id = s.mapping_id
     JOIN subjects subj ON subj.subject_id = ps.subject_id
     JOIN professors p ON p.professor_id = s.created_by
     JOIN users u ON u.user_id = p.user_id
     WHERE u.username = ? AND s.session_status = 'ongoing'`,
    [username]
  );
  if (rows.length === 0) return null;
  return { sessionId: rows[0].session_id, subject: rows[0].subject_name };
};


export async function getAttendanceRequests(sessionId) {
  try {
    const [requestRows] = await pool.query(`
      SELECT ar.request_id, ar.session_id, ar.student_id, ar.request_time,
             s.student_name, s.roll_number, s.section,
             b.branch_code, s.year
      FROM attendance_requests ar
      JOIN students s ON ar.student_id = s.student_id
      JOIN branches b ON s.branch_id = b.branch_id
      WHERE ar.session_id = ? AND ar.status = 'pending'
      ORDER BY ar.request_time ASC
    `, [sessionId]);

    return requestRows;
  } catch (err) {
    console.error('Error fetching attendance requests:', err);
    throw err;
  }
}

export const markIndividualAttendance = async (sessionId, studentId,status,requestStatus) => {
  try{
    await pool.query(
      `INSERT INTO attendance_records
      (session_id, student_id, attendance_status)
      VALUES(?,?,?) 
      `,
      [sessionId, studentId,status]
    );

    await pool.query(
      `UPDATE attendance_requests
      SET status = ?
      WHERE session_id = ? AND student_id = ?`,
      [requestStatus, sessionId, studentId]
    )
  } catch(err){
    console.error('Error inserting student details in attendance records', err);
    throw err;
  }
};


export async function markAllAttendance(sessionId, status) {
  try {
    // Get all pending requests for this session
    const [requests] = await pool.query(`
      SELECT student_id FROM attendance_requests 
      WHERE session_id = ? AND status = 'pending'
    `, [sessionId]);

    if (requests.length === 0) {
      return { message: 'No pending requests to mark' };
    }

    const studentIds = requests.map(r => r.student_id);

    // Insert attendance records for each student
    for (const studentId of studentIds) {
      try {
        await pool.query(`
          INSERT INTO attendance_records (session_id, student_id, attendance_status)
          VALUES (?, ?, ?)
        `, [sessionId, studentId, status]);
      } catch (insertErr) {
        // Skip if already exists (duplicate entry)
        if (insertErr.code !== 'ER_DUP_ENTRY') {
          throw insertErr;
        }
      }
    }

    // Update all requests to 'accepted' status
    const placeholders = studentIds.map(() => '?').join(',');
    await pool.query(`
      UPDATE attendance_requests
      SET status = 'accepted'
      WHERE session_id = ? AND student_id IN (${placeholders})
    `, [sessionId, ...studentIds]);

    return { 
      success: true, 
      count: studentIds.length,
      message: `Successfully marked ${studentIds.length} students as ${status}`
    };

  } catch (err) {
    console.error('Error marking all attendance:', err);
    throw err;
  }
}

export async function stopAttendanceSession(sessionId) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(`
    INSERT INTO attendance_records (session_id, student_id, attendance_status)
    SELECT ?, s.student_id, 'absent'
    FROM students s
    JOIN professor_subjects ps ON s.branch_id = ps.branch_id 
      AND s.year = ps.year 
      AND s.section = ps.section
    JOIN attendance_sessions ats ON ps.mapping_id = ats.mapping_id
    LEFT JOIN attendance_requests ar ON s.student_id = ar.student_id 
      AND ar.session_id = ats.session_id
    LEFT JOIN attendance_records existing_ar ON s.student_id = existing_ar.student_id 
      AND existing_ar.session_id = ats.session_id
    WHERE ats.session_id = ? 
      AND (ar.status IS NULL OR ar.status = 'pending')
      AND existing_ar.student_id IS NULL  -- Ensure no existing attendance record
    ON DUPLICATE KEY UPDATE attendance_status = 'absent'
    `, [sessionId, sessionId]);

    await conn.query(`
      DELETE FROM attendance_requests
      WHERE session_id = ?
    `, [sessionId]);

    await conn.query(`
      UPDATE attendance_sessions
      SET session_status = 'completed'
      WHERE session_id = ?
    `, [sessionId]);

    await conn.commit();
    return { success: true };
  } catch (err) {
    await conn.rollback();
    console.error('Error stopping session:', err);
    throw err;
  } finally {
    conn.release();
  }
}

export async function getStudentAttendanceSummary(username) {
  const [rows] = await pool.query(
    `SELECT s.student_id
     FROM students s
     JOIN users u ON s.user_id = u.user_id
     WHERE u.username = ?`, [username]
  );

  if (!rows || rows.length === 0) return [];

  const studentId = rows[0].student_id;

  const [attendanceRows] = await pool.query(
    `SELECT sub.subject_name,
            SUM(CASE WHEN ar.attendance_status = 'present' THEN 1 ELSE 0 END) AS total_attended,
            COUNT(DISTINCT a.session_id) AS total_sessions
     FROM attendance_records ar
     JOIN attendance_sessions a ON ar.session_id = a.session_id
     JOIN professor_subjects ps ON a.mapping_id = ps.mapping_id
     JOIN subjects sub ON ps.subject_id = sub.subject_id
     WHERE ar.student_id = ? AND a.session_status = 'completed'
     GROUP BY sub.subject_name`, [studentId]
  );

  return attendanceRows.map(row => ({
    subject: row.subject_name,
    attended: row.total_attended,
    total: row.total_sessions
  }));
}


export async function getProfessorName(username){
  try{
    const [rows] = await pool.query(
      `SELECT professor_name FROM professors p
       JOIN users u ON p.user_id = u.user_id
       WHERE username = ?
      `, [username]
    )
    return rows[0]?.professor_name;
  } catch(err){
    console.log("error fetching professor name", err)
  }

}