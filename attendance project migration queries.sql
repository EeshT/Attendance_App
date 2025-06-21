-- Student Attendance App Database Schema

-- Users table (for authentication)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'professor') NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Branches table (Computer Science, Mechanical, etc.)
CREATE TABLE branches (
    branch_id INT PRIMARY KEY AUTO_INCREMENT,
    branch_code VARCHAR(10) UNIQUE NOT NULL,
    branch_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Students table
CREATE TABLE students (
    student_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    branch_id INT NOT NULL,
    section VARCHAR(5) NOT NULL,
    year INT NOT NULL,
    phone_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    INDEX idx_roll_number (roll_number),
    INDEX idx_branch_section_year (branch_id, section, year)
);

-- Professors table
CREATE TABLE professors (
    professor_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    professor_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(20) UNIQUE,
    phone_number VARCHAR(15),
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Subjects table
CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_code VARCHAR(20) UNIQUE NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    credits INT DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professor-Subject-Class mapping (which professor teaches which subject to which class)
CREATE TABLE professor_subjects (
    mapping_id INT PRIMARY KEY AUTO_INCREMENT,
    professor_id INT NOT NULL,
    subject_id INT NOT NULL,
    branch_id INT NOT NULL,
    section VARCHAR(5) NOT NULL,
    year INT NOT NULL,
    academic_year VARCHAR(10) NOT NULL, -- e.g., '2024-25'
    semester INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (professor_id) REFERENCES professors(professor_id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id),
    FOREIGN KEY (branch_id) REFERENCES branches(branch_id),
    UNIQUE KEY unique_assignment (professor_id, subject_id, branch_id, section, year, academic_year, semester),
    INDEX idx_prof_subject (professor_id, subject_id),
    INDEX idx_class_details (branch_id, section, year, academic_year, semester)
);

-- Attendance sessions (each class session)
CREATE TABLE attendance_sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    mapping_id INT NOT NULL,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    session_duration INT DEFAULT 60, -- duration in minutes
    session_type ENUM('lecture', 'lab', 'tutorial') DEFAULT 'lecture',
    session_status ENUM('scheduled', 'ongoing', 'completed', 'cancelled') DEFAULT 'scheduled',
    created_by INT NOT NULL, -- professor_id who created the session
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mapping_id) REFERENCES professor_subjects(mapping_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES professors(professor_id),
    INDEX idx_session_date (session_date),
    INDEX idx_mapping_date (mapping_id, session_date)
);

-- Individual attendance records
CREATE TABLE attendance_records (
    attendance_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    attendance_status ENUM('present', 'absent', 'late') DEFAULT 'present',
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    marked_by_student BOOLEAN DEFAULT TRUE, -- TRUE if student marked, FALSE if professor marked
    remarks TEXT,
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    UNIQUE KEY unique_student_session (session_id, student_id),
    INDEX idx_student_attendance (student_id, session_id),
    INDEX idx_session_status (session_id, attendance_status)
);

INSERT INTO branches (branch_code, branch_name) VALUES('CSE', 'Computer Science and Engineering');
INSERT INTO branches (branch_code, branch_name) VALUES('ECE', 'Electronics and Communication');
INSERT INTO branches (branch_code, branch_name) VALUES('ME', 'Mechanical Engineering');
INSERT INTO branches (branch_code, branch_name) VALUES('CE', 'Civil Engineering');
INSERT INTO branches (branch_code, branch_name) VALUES('EEE', 'Electrical and Electronics');

SELECT * FROM branches;

SELECT * FROM users;

SELECT * FROM students;

SELECT * FROM professors;


SELECT * FROM students 
JOIN users ON students.user_id = users.user_id 
JOIN branches ON students.branch_id = branches.branch_id 
WHERE users.username = 'etriot';

ALTER TABLE professor_subjects
DROP COLUMN academic_year;

SELECT * FROM professor_subjects;

ALTER TABLE subjects ADD UNIQUE (subject_code);

SELECT * FROM subjects; 

SELECT * FROM attendance_sessions;


CREATE TABLE attendance_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    student_id INT NOT NULL,
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
    FOREIGN KEY (session_id) REFERENCES attendance_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

ggDELETE FROM attendance_requests;

SELECT * FROM attendance_requests;

/////jkjjALTER TABLE attendance_requests
ADD CONSTRAINT unique_request UNIQUE (session_id, student_id);

ALTER TABLE attendance_records
DROP COLUMN marked_by_student;

ALTER TABLE attendance_records
DROP COLUMN remarks;

SELECT * FROM attendance_records;

hgDELETE FROM attendance_records;

SELECT * FROM students;

