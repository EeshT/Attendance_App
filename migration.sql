-- MySQL dump 10.13  Distrib 8.0.42, for Linux (x86_64)
--
-- Host: localhost    Database: attendence_app
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_records` (
  `attendance_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `student_id` int NOT NULL,
  `attendance_status` enum('present','absent','late') DEFAULT 'present',
  `marked_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`attendance_id`),
  UNIQUE KEY `unique_student_session` (`session_id`,`student_id`),
  KEY `idx_student_attendance` (`student_id`,`session_id`),
  KEY `idx_session_status` (`session_id`,`attendance_status`),
  CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`session_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_records_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_records`
--

LOCK TABLES `attendance_records` WRITE;
/*!40000 ALTER TABLE `attendance_records` DISABLE KEYS */;
INSERT INTO `attendance_records` VALUES (5,6,3,'present','2025-06-18 19:55:00'),(6,6,5,'present','2025-06-18 19:55:00'),(7,6,6,'present','2025-06-18 19:55:00'),(9,6,7,'absent','2025-06-19 15:43:29'),(10,8,5,'present','2025-06-19 18:07:17'),(11,8,3,'absent','2025-06-19 18:07:28'),(12,8,6,'absent','2025-06-19 18:07:28'),(13,8,7,'absent','2025-06-19 18:07:28'),(14,9,3,'present','2025-06-21 09:31:56'),(15,9,5,'absent','2025-06-21 09:32:03'),(16,9,6,'absent','2025-06-21 09:32:03'),(17,9,7,'absent','2025-06-21 09:32:03'),(18,10,3,'present','2025-06-21 10:30:19'),(19,10,5,'absent','2025-06-21 10:30:44'),(20,10,6,'present','2025-06-21 10:30:56'),(21,10,7,'absent','2025-06-21 10:31:26'),(22,11,3,'present','2025-06-21 16:25:48'),(23,11,5,'absent','2025-06-21 16:25:50'),(24,11,6,'absent','2025-06-21 16:25:50'),(25,11,7,'absent','2025-06-21 16:25:50'),(26,12,3,'absent','2025-06-21 17:32:12'),(27,12,5,'absent','2025-06-21 17:32:12'),(28,12,6,'absent','2025-06-21 17:32:12'),(29,12,7,'absent','2025-06-21 17:32:12'),(33,13,7,'present','2025-06-21 17:37:07'),(34,13,3,'absent','2025-06-21 17:37:10'),(35,13,5,'absent','2025-06-21 17:37:10'),(36,13,6,'absent','2025-06-21 17:37:10'),(37,14,3,'absent','2025-06-21 17:37:20'),(38,14,5,'absent','2025-06-21 17:37:20'),(39,14,6,'absent','2025-06-21 17:37:20'),(40,14,7,'absent','2025-06-21 17:37:20'),(44,17,3,'present','2025-06-22 15:53:47'),(45,17,5,'absent','2025-06-22 15:53:50'),(46,17,6,'absent','2025-06-22 15:53:50'),(47,17,7,'absent','2025-06-22 15:53:50'),(48,18,4,'absent','2025-06-22 16:16:44'),(49,19,3,'present','2025-06-22 16:19:34'),(50,19,5,'present','2025-06-22 16:21:01'),(51,19,6,'present','2025-06-22 16:21:08'),(52,19,7,'absent','2025-06-22 16:21:12'),(53,20,3,'present','2025-06-28 17:14:35'),(54,20,5,'absent','2025-06-28 17:14:38'),(55,20,6,'absent','2025-06-28 17:14:38'),(56,20,7,'absent','2025-06-28 17:14:38'),(57,21,3,'absent','2025-07-03 18:16:37'),(58,21,5,'absent','2025-07-03 18:16:37'),(59,21,6,'absent','2025-07-03 18:16:37'),(60,21,7,'absent','2025-07-03 18:16:37');
/*!40000 ALTER TABLE `attendance_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_requests`
--

DROP TABLE IF EXISTS `attendance_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_requests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `student_id` int NOT NULL,
  `request_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  PRIMARY KEY (`request_id`),
  UNIQUE KEY `unique_request` (`session_id`,`student_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `attendance_requests_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `attendance_sessions` (`session_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_requests_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_requests`
--

LOCK TABLES `attendance_requests` WRITE;
/*!40000 ALTER TABLE `attendance_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendance_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance_sessions`
--

DROP TABLE IF EXISTS `attendance_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `mapping_id` int NOT NULL,
  `session_date` date NOT NULL,
  `session_time` time NOT NULL,
  `session_duration` int DEFAULT '60',
  `session_type` enum('lecture','lab','tutorial') DEFAULT 'lecture',
  `session_status` enum('scheduled','ongoing','completed','cancelled') DEFAULT 'scheduled',
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `created_by` (`created_by`),
  KEY `idx_session_date` (`session_date`),
  KEY `idx_mapping_date` (`mapping_id`,`session_date`),
  CONSTRAINT `attendance_sessions_ibfk_1` FOREIGN KEY (`mapping_id`) REFERENCES `professor_subjects` (`mapping_id`) ON DELETE CASCADE,
  CONSTRAINT `attendance_sessions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `professors` (`professor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance_sessions`
--

LOCK TABLES `attendance_sessions` WRITE;
/*!40000 ALTER TABLE `attendance_sessions` DISABLE KEYS */;
INSERT INTO `attendance_sessions` VALUES (6,1,'2025-06-16','00:38:52',60,'lecture','completed',2,'2025-06-16 19:08:52','2025-06-19 15:43:29'),(8,1,'2025-06-19','23:35:38',60,'lecture','completed',2,'2025-06-19 18:05:38','2025-06-19 18:07:28'),(9,1,'2025-06-21','15:00:14',60,'lecture','completed',2,'2025-06-21 09:30:14','2025-06-21 09:32:03'),(10,1,'2025-06-21','15:56:04',60,'lecture','completed',2,'2025-06-21 10:26:04','2025-06-21 10:31:26'),(11,5,'2025-06-21','21:55:14',60,'lecture','completed',3,'2025-06-21 16:25:14','2025-06-21 16:25:50'),(12,5,'2025-06-21','22:44:13',60,'lecture','completed',3,'2025-06-21 17:14:13','2025-06-21 17:32:12'),(13,5,'2025-06-21','23:05:25',60,'lecture','completed',3,'2025-06-21 17:35:25','2025-06-21 17:37:10'),(14,5,'2025-06-21','23:07:16',60,'lab','completed',3,'2025-06-21 17:37:16','2025-06-21 17:37:20'),(15,4,'2025-06-22','20:16:13',60,'lecture','completed',2,'2025-06-22 14:46:13','2025-06-22 14:46:22'),(16,4,'2025-06-22','21:21:32',60,'lecture','completed',2,'2025-06-22 15:51:32','2025-06-22 15:52:11'),(17,1,'2025-06-22','21:22:21',60,'lecture','completed',2,'2025-06-22 15:52:21','2025-06-22 15:53:50'),(18,2,'2025-06-22','21:46:03',60,'lecture','completed',2,'2025-06-22 16:16:03','2025-06-22 16:16:44'),(19,1,'2025-06-22','21:47:02',60,'lecture','completed',2,'2025-06-22 16:17:02','2025-06-22 16:21:12'),(20,1,'2025-06-28','22:42:51',60,'lecture','completed',2,'2025-06-28 17:12:51','2025-06-28 17:14:38'),(21,1,'2025-07-03','23:46:31',60,'lecture','completed',2,'2025-07-03 18:16:31','2025-07-03 18:16:37');
/*!40000 ALTER TABLE `attendance_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `branches`
--

DROP TABLE IF EXISTS `branches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `branches` (
  `branch_id` int NOT NULL AUTO_INCREMENT,
  `branch_code` varchar(10) NOT NULL,
  `branch_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`branch_id`),
  UNIQUE KEY `branch_code` (`branch_code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `branches`
--

LOCK TABLES `branches` WRITE;
/*!40000 ALTER TABLE `branches` DISABLE KEYS */;
INSERT INTO `branches` VALUES (1,'CSE','Computer Science and Engineering','2025-06-12 16:00:21'),(2,'ECE','Electronics and Communication','2025-06-12 16:00:21'),(3,'ME','Mechanical Engineering','2025-06-12 16:00:21'),(4,'CE','Civil Engineering','2025-06-12 16:00:22'),(5,'EEE','Electrical and Electronics','2025-06-12 16:00:22');
/*!40000 ALTER TABLE `branches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professor_subjects`
--

DROP TABLE IF EXISTS `professor_subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professor_subjects` (
  `mapping_id` int NOT NULL AUTO_INCREMENT,
  `professor_id` int NOT NULL,
  `subject_id` int NOT NULL,
  `branch_id` int NOT NULL,
  `section` varchar(5) NOT NULL,
  `year` int NOT NULL,
  `semester` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`mapping_id`),
  UNIQUE KEY `unique_assignment` (`professor_id`,`subject_id`,`branch_id`,`section`,`year`,`semester`),
  KEY `subject_id` (`subject_id`),
  KEY `idx_prof_subject` (`professor_id`,`subject_id`),
  KEY `idx_class_details` (`branch_id`,`section`,`year`,`semester`),
  CONSTRAINT `professor_subjects_ibfk_1` FOREIGN KEY (`professor_id`) REFERENCES `professors` (`professor_id`) ON DELETE CASCADE,
  CONSTRAINT `professor_subjects_ibfk_2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  CONSTRAINT `professor_subjects_ibfk_3` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professor_subjects`
--

LOCK TABLES `professor_subjects` WRITE;
/*!40000 ALTER TABLE `professor_subjects` DISABLE KEYS */;
INSERT INTO `professor_subjects` VALUES (1,2,1,1,'B',2,2,'2025-06-14 07:06:43'),(2,2,2,1,'A',3,6,'2025-06-14 09:56:31'),(4,2,4,2,'C',3,6,'2025-06-14 13:15:49'),(5,3,5,1,'B',2,4,'2025-06-21 10:45:35'),(6,3,6,1,'B',2,4,'2025-06-28 17:07:08');
/*!40000 ALTER TABLE `professor_subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professors`
--

DROP TABLE IF EXISTS `professors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professors` (
  `professor_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `professor_name` varchar(100) NOT NULL,
  `employee_id` varchar(20) DEFAULT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`professor_id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `professors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professors`
--

LOCK TABLES `professors` WRITE;
/*!40000 ALTER TABLE `professors` DISABLE KEYS */;
INSERT INTO `professors` VALUES (2,7,'Devansh Goyal','3','2345678912','Civil Engineering','2025-06-13 09:06:22','2025-06-13 09:06:22'),(3,12,'Dr. Sandesh Tripathi','789','6799919345','Computer Science and Engineering','2025-06-21 10:21:13','2025-06-21 10:21:13');
/*!40000 ALTER TABLE `professors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `student_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `roll_number` varchar(20) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `branch_id` int NOT NULL,
  `section` varchar(5) NOT NULL,
  `year` int NOT NULL,
  `phone_number` varchar(15) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `roll_number` (`roll_number`),
  KEY `user_id` (`user_id`),
  KEY `idx_roll_number` (`roll_number`),
  KEY `idx_branch_section_year` (`branch_id`,`section`,`year`),
  CONSTRAINT `students_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `students_ibfk_2` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`branch_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (3,6,'123','Eesh tripathi',1,'B',2,'1234567892','2025-06-13 09:04:33','2025-06-13 09:04:33'),(4,8,'23EEB0A04','Bhaumik Tripathi',1,'A',3,'4566789134','2025-06-13 12:49:21','2025-06-13 12:49:21'),(5,9,'23EEB0A05','Hitesh',1,'B',2,'6789012345','2025-06-18 18:47:21','2025-06-18 18:47:21'),(6,10,'23EEB0A07','Rahul',1,'B',2,'6789019345','2025-06-18 18:48:00','2025-06-18 18:48:00'),(7,11,'23EEB0A10','Arnav',1,'B',2,'4566789189','2025-06-19 14:01:48','2025-06-19 14:01:48');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `subject_id` int NOT NULL AUTO_INCREMENT,
  `subject_code` varchar(20) NOT NULL,
  `subject_name` varchar(100) NOT NULL,
  `credits` int DEFAULT '3',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subject_id`),
  UNIQUE KEY `subject_code` (`subject_code`),
  UNIQUE KEY `subject_code_2` (`subject_code`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'EVS201','Environmental Studies',4,'2025-06-14 07:06:43'),(2,'SD201','System Design',10,'2025-06-14 09:56:31'),(4,'SE401','Software Engineering',4,'2025-06-14 13:15:49'),(5,'DMS201','Database Management',4,'2025-06-21 10:45:35'),(6,'ENG201','English',5,'2025-06-28 17:07:08');
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `user_type` enum('student','professor') NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (6,'etriot','$2b$10$Kvd5DnZsQtzoz/pRbT44/eYydBBHHnY/YZFN5UJ06KC9DjJJ72JiW','student','eeg@gmail.com','2025-06-13 09:04:33','2025-06-13 09:04:33'),(7,'devgoy','$2b$10$0CTVGcym39zHvqGsHKWGyuY/SXS3tKfvbpy8RaoLGxcxbuIe3FxlO','professor','devgoy@gmail.com','2025-06-13 09:06:22','2025-06-13 09:06:22'),(8,'bhau','$2b$10$lUBb5HBdHuTDLIcogUwj1.lrzkr5lM.GC83ACHz093PFn2i/Xe.nO','student','bhau@gmail.com','2025-06-13 12:49:21','2025-06-13 12:49:21'),(9,'alpha','$2b$10$CjonnaEm0LmCP4.X54XPgey1GEapkLlYL/mJrivkZonRrh7vodFsS','student','alpha@gmail','2025-06-18 18:47:21','2025-06-18 18:47:21'),(10,'beta','$2b$10$6MzNgu3KQZAg5UUVRO.DM.BOOUBqenDksAXTcBtfD1Om.iEzNGipi','student','beta@gmail','2025-06-18 18:48:00','2025-06-18 18:48:00'),(11,'gamma','$2b$10$j45dktDzGBNKMOobnR30CuWryvMurQRqPyC/Sxm.Ae1QzUZ7XLIEG','student','gamma@gmail.com','2025-06-19 14:01:48','2025-06-19 14:01:48'),(12,'santri','$2b$10$cv3iuhTPqJ0DfT17q68iYOHaM02KeOYwzyOV.iSj/QMpCsbjLsVlO','professor','santripathi@gmail.com','2025-06-21 10:21:13','2025-06-21 10:21:13');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-05 22:54:54