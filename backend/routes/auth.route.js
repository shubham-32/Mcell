import express from "express";
import {
	signup,
	checkAuth,
	login,
	logout,
	submitComplaint,
	getStudentComplaints,
	getAllComplaints,
	getEngineers,
	assignEngineerToComplaint,
	getEngineerTasks,
	getCompletedTasks,
	getAllTasks,
	toggleResubmit
	// verifyEmail,
	// forgotPassword,
	// resetPassword,
	// updateProfile,
	// feedback,
	// googleAuth,
	// setPass,
	// deleteUser
} from "../controller/auth.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

  
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);


// verifyTokened Routes
router.get("/check-auth", verifyToken, checkAuth);

// STUDENT ROUTES
router.post("/submit", verifyToken, submitComplaint); // Submit new complaint
router.get("/student/all", verifyToken, getStudentComplaints); // Get student’s own complaints

//  ENGINEER ROUTES
router.get("/engineer/tasks", verifyToken, getEngineerTasks); // Get engineer's assigned tasks
// router.put("/engineer/update/:taskId", verifyToken, updateTaskStatus); // Accept / Reject / Resolve
router.get("/engineer/completedTasks", verifyToken, getCompletedTasks);
// ADMIN ROUTES
router.get("/admin/complaints", getAllComplaints); // Admin: view all complaints
router.get("/admin/tasks", verifyToken, getAllTasks) // Admin : view all tasks
// router.get("/admin/engineers", verifyToken, getEngineers); // Admin: view all engineers

//removing verifyToken to test for mcell app
router.get("/admin/engineers", getEngineers);
router.post("/admin/assign", verifyToken, assignEngineerToComplaint); // Admin: assign engineer to complaint

//toggle
router.post("/complaint/toggle", verifyToken, toggleResubmit);
// Email Verification & Password
// router.post("/verify-email", verifyEmail);


export default router;
