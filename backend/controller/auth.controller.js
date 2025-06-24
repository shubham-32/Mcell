import bcryptjs from "bcryptjs";
import connection from "../config/db.js";
import dotenv from "dotenv";
import db from "../config/db.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import jwt from "jsonwebtoken";

dotenv.config();
const queryAsync = (sql, params) => {
	return new Promise((resolve, reject) => {
		db.query(sql, params, (err, results) => {
			if (err) return reject(err);
			resolve(results);
		});
	});
};

// SIGNUP CONTROLLER
export const signup = async (req, res) => {
	const { name, email, password, role, roll, specialization } = req.body;
	console.log(name, email, password, role, roll, specialization); // Add roll to log
	try {
		if (!name || !email || !password || !role) {
			throw new Error("All fields are required");
		}

		if (!["student", "engineer", "admin"].includes(role)) {
			throw new Error("Invalid role");
		}

		const existingUser = await queryAsync(`SELECT * FROM ${role} WHERE email = ?`, [email]);

		if (existingUser.length > 0) {
			return res.status(400).json({ success: false, message: `${role} already exists` });
		}

		const hashedPassword = await bcryptjs.hash(password, 10);
		const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
		const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

        let insertResult;
        
		if (role === "engineer" && specialization) {
			insertResult = await queryAsync(
				`INSERT INTO ${role} (name, email, password, verification_token, verification_token_expires_at, specialization, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				[name, email, hashedPassword, verificationToken, verificationTokenExpiresAt, specialization, "Available"]
			);
		}
		else if (role === "student" && roll) {
			insertResult = await queryAsync(
				`INSERT INTO ${role} (name, email, password, verification_token, verification_token_expires_at, roll_no) VALUES (?, ?, ?, ?, ?, ?)`,
				[name, email, hashedPassword, verificationToken, verificationTokenExpiresAt, roll]
			);
		}
        else if (role === "admin") {
            insertResult = await queryAsync(
                `INSERT INTO ${role} (name, email, password, verification_token, verification_token_expires_at) VALUES (?, ?, ?, ?, ?)`,
                [name, email, hashedPassword, verificationToken, verificationTokenExpiresAt]
            );
        }
        else {
            throw new Error(`Missing required fields for ${role} role`);
        }

		const userId = insertResult.insertId;
		generateTokenAndSetCookie(res, userId, role);

		res.status(201).json({
			success: true,
			message: `${role} registered successfully. Verification email sent.`,
			user: {
				id: userId,
				name,
				email,
				role,
				roll,
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const login = async (req, res) => {
	const { email, password, role } = req.body;

	try {
		if (!email || !password || !role) {
			throw new Error("All fields are required");
		}

		if (!["student", "engineer", "admin"].includes(role)) {
			throw new Error("Invalid role");
		}

		const result = await queryAsync(`SELECT * FROM ${role} WHERE email = ?`, [email]);

		if (result.length === 0) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const user = result[0];
		const isMatch = await bcryptjs.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		const userId = user[`${role}_id`]; // 🧠 Dynamically extract correct ID column

		generateTokenAndSetCookie(res, userId, role);

		res.status(200).json({
			success: true,
			message: `${role} logged in successfully`,
			user: {
				id: userId,
				name: user.name,
				email: user.email,
				role: role,
				roll: user.roll_no,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const toggleResubmit = async (req,res) => {
	
	const {complaintId} = req.body;
	console.log(complaintId);
	try {
		await queryAsync(
			`UPDATE complaints SET resubmit = 1 - resubmit WHERE complaint_id = ?`,[complaintId]
		)
		return res.status(200).json({success:true , message : "success toggle"})
	}
	catch(error) {
		res.status(500).json({ success: false, message: error.message });
	}
}
export const checkAuth = async (req, res) => {
	try {
		const { userId, role } = req;

		if (!userId || !role || !["student", "engineer", "admin"].includes(role)) {
			return res.status(401).json({ success: false, message: "Unauthorized access" });
		}

		const result = await queryAsync(
			`SELECT ${role}_id AS id, name, email FROM ${role} WHERE ${role}_id = ?`,
			[userId]
		);

		if (result.length === 0) {
			return res.status(404).json({ success: false, message: "User not found" });
		}

		const user = {
			...result[0],
			role : role
		};

		res.status(200).json({ success: true, user });
	} catch (error) {
		console.error("Error in checkAuth:", error);
		res.status(500).json({ success: false, message: error.message });
	}
};
export const logout = async (req, res) => {
	res.clearCookie("token");
	res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const submitComplaint = async (req, res) => {
	console.log("submit request : " , req)
	const {
	  fullName,
	  rollNo,
	  email,
	  phoneNo,
	  hostelNo,
	  roomNo,
	  problemType,
	  problemDescription,
	  priorityLevel,
	  resubmit,
	} = req.body;
	const { userId } = req;
  
	try {
	  const insertComplaint = await queryAsync(
		`INSERT INTO complaints 
		  (student_id, subject, description, priority, problem_type, status, hostel_no, room_no, phone_no, email, resubmit)
		  VALUES (?, ?, ?, ?, ?, 'Submitted', ?, ?, ?, ?, ?)`,
		[
		  userId,
		  problemType,
		  problemDescription,
		  priorityLevel,
		  problemType,
		  hostelNo,
		  roomNo,
		  phoneNo,
		  email,
		  resubmit,
		]
	  );
  
	  const complaintId = insertComplaint.insertId;
  
	  await queryAsync(
		`INSERT INTO complaint_timeline (complaint_id, status, note) VALUES (?, ?, ?)`,
		[complaintId, 'Submitted', 'Complaint filed by student']
	  );
  
	  res.status(201).json({ success: true, message: "Complaint submitted", complaintId });
	} catch (err) {
	  console.error("Error submitting complaint:", err);
	  res.status(500).json({ success: false, message: "Error submitting complaint" });
	}
  };

  
  export const getStudentComplaints = async (req, res) => {
	const { userId } = req;
	
	try {
	  // Use DATE_FORMAT to ensure consistent date formatting in the SQL query
	  const complaints = await queryAsync(
		`SELECT 
		  complaint_id, student_id, engineer_id, subject, description, 
		  resubmit,
		  priority, problem_type, status, hostel_no, room_no, phone_no, email,
		  DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at, 
		  DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at 
		 FROM complaints 
		 WHERE student_id = ? 
		 ORDER BY created_at DESC`,
		[userId]
	  );
	
	  for (const complaint of complaints) {
		// Apply the same date formatting to timeline dates
		const timeline = await queryAsync(
		  `SELECT complaint_id, status, note, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date 
		   FROM complaint_timeline 
		   WHERE complaint_id = ? 
		   ORDER BY date ASC`,
		  [complaint.complaint_id]
		);
		complaint.timeline = timeline;
	  }
	
	  res.status(200).json({ success: true, complaints });
	} catch (err) {
	  console.error("Error fetching complaints:", err);
	  res.status(500).json({ success: false, message: "Error fetching complaints" });
	}
  };

  export const getAllComplaints = async (req, res) => {
	try {
	  const complaints = await queryAsync(
		`SELECT 
		  complaint_id, student_id, engineer_id, subject, description, 
		  priority, problem_type, status, hostel_no, room_no, phone_no, email,
		  DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') as created_at, 
		  DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') as updated_at 
		 FROM complaints 
		 ORDER BY created_at DESC`
	  );
  
	  for (const complaint of complaints) {
		console.log("i was hit - > complaints")
		const timeline = await queryAsync(
		  `SELECT status, note, DATE_FORMAT(date, '%Y-%m-%d %H:%i:%s') as date 
		   FROM complaint_timeline 
		   WHERE complaint_id = ? 
		   ORDER BY date ASC`,
		  [complaint.complaint_id]
		);
		complaint.timeline = timeline;
	  }
  
	  res.status(200).json({ success: true, complaints });
	} catch (err) {
	  res.status(500).json({ success: false, message: "Error fetching complaints" });
	}
  };
  export const getCompletedTasks = async (req, res) => {
	const {userId} = req;
	try {
	  const completedTasks = await queryAsync(
		`SELECT 
		  c.email, 
		  c.status, 
		  c.hostel_no, 
		  c.description, 
		  DATE_FORMAT(t.completion_date, '%Y-%m-%d %H:%i:%s') as completion_date, 
		  t.task_id 
		FROM complaints c 
		JOIN tasks t ON c.complaint_id = t.complaint_id
		WHERE c.status = ? AND t.engineer_id = ?`,
		["Resolved", userId]
	  );
  
	  res.status(200).json({ success: true, completedTasks });
	} catch (err) {
	  res.status(500).json({ success: false, message: "Error fetching complaints" });
	}
  };
  
  export const getEngineers = async (req, res) => {
	
	try {
	  const engineers = await queryAsync(`SELECT * FROM engineer`);
	  res.status(200).json({ success: true, engineers });
	} catch (err) {
	  res.status(500).json({ success: false, message: "Error fetching engineers" });
	}
  };
  
  export const getAssignedEngineer = async (req , res) => {
	const {engineerId} = req.body;
	try {
		const engineer = await queryAsync(`SELECT * from engineer WHERE engineer_id = ?`,[engineerId])
		res.status(200),json({success: true , engineer});
	}
	catch (err) {
		console.error("Error fetching engineer tasks:", err);
	  	res.status(500).json({ success: false, message: "Error fetching tasks" });
	}

  }

  
  export const assignEngineerToComplaint = async (req, res) => {
	const { complaintId, engineerId, deadline } = req.body;
	const { userId } = req;  
	try {
	  // 1. Create a task record
	  const taskResult = await queryAsync(
		`INSERT INTO tasks 
		 (complaint_id, engineer_id, assigned_date, deadline, status) 
		 VALUES (?, ?, NOW(), ?, 'Pending')`,
		[complaintId, engineerId, deadline]
	  );
  
	  const taskId = taskResult.insertId;
  
	  // 2. Update the complaint status and updated_at timestamp
	  await queryAsync(
		`UPDATE complaints SET status = 'Under Review', updated_at = NOW() WHERE complaint_id = ?`,
		[complaintId]
	  );

	  await queryAsync(
		`UPDATE complaints SET engineer_id = ? WHERE complaint_id = ?`,
		[engineerId, complaintId]
	  );
		
	  // 3. Update the engineer status
	  await queryAsync(
		`UPDATE engineer SET status = 'Busy' WHERE engineer_id = ?`,
		[engineerId]
	  );
	  
	  // 4. Add to complaint timeline with formatted date
	  await queryAsync(
		`INSERT INTO complaint_timeline 
		 (complaint_id, status, note, date) 
		 VALUES (?, 'Assigned', ?, NOW())`,
		[complaintId, `Assigned to engineer (ID: ${engineerId})`]
	  );
  
	  res.status(201).json({ 
		success: true, 
		message: "Engineer assigned successfully", 
		taskId 
	  });
	} catch (err) {
	  console.error("Error assigning engineer:", err);
	  res.status(500).json({ success: false, message: "Error assigning engineer" });
	}
  };

  export const getAllTasks = async(req ,res) => {
		try {
			const tasks = await queryAsync(
				'SELECT * from tasks'
			)
			res.status(200).json({ success: true, tasks});

		}
		catch (err) {
			console.log("error fetching all tasks : " , err);
			res.status(500).json({ success: false, message: "Error fetching all tasks" });
		}
  }
  export const getEngineerTasks = async (req, res) => {
	const { userId } = req; // Engineer ID from auth middleware
  
	try {
	  const tasks = await queryAsync(
		`SELECT t.task_id, t.complaint_id , t.engineer_id , t.deadline ,
		DATE_FORMAT(t.assigned_date, '%Y-%m-%d %H:%i:%s') as assigned_date ,
		DATE_FORMAT(t.completion_date, '%Y-%m-%d %H:%i:%s') as completion_date,
		t.status , t.notes,
		c.subject, c.description, c.problem_type, 
				c.hostel_no, c.room_no, c.priority, s.name, s.email, c.phone_no
		 FROM tasks t
		 JOIN complaints c ON t.complaint_id = c.complaint_id
		 JOIN student s ON c.student_id = s.student_id
		 WHERE t.engineer_id = ? 
		 ORDER BY t.deadline, 
				  CASE 
					WHEN c.priority = 'High' THEN 1
					WHEN c.priority = 'Medium' THEN 2
					WHEN c.priority = 'Low' THEN 3
				  END`,
		[userId]
	  );
  
	  res.status(200).json({ success: true, tasks });
	} catch (err) {
	  console.error("Error fetching engineer tasks:", err);
	  res.status(500).json({ success: false, message: "Error fetching tasks" });
	}
  };
  

  export const updateTaskStatus = async (req, res) => {
	const { taskId } = req.params;
	const { status, note } = req.body;
	const { userId } = req; // Engineer ID from auth middleware
	
	try {
	  // 1. Update task status
	  await queryAsync(
		`UPDATE tasks SET status = ? WHERE task_id = ? AND engineer_id = ?`,
		[status, taskId, userId]
	  );
	  
	  // 2. Get complaint_id from the task
	  const taskRows = await queryAsync(
		`SELECT complaint_id FROM tasks WHERE task_id = ?`,
		[taskId]
	  );
	  
	  if (taskRows.length === 0) {
		throw new Error("Task not found");
	  }
	  
	  const complaintId = taskRows[0].complaint_id;
	  
	  // 3. Update complaint status based on task status
	  let complaintStatus;
	  switch (status) {
		case 'Accepted':
		  complaintStatus = 'In Progress';
		  break;
		case 'Declined':
		  complaintStatus = 'Rejected'; // Return to unassigned pool
		  // Update engineer status back to Available
		  await queryAsync(
			`UPDATE engineer SET status = 'Available' WHERE engineer_id = ?`,
			[userId]
		  );
		  
		  break;
		case 'Completed':
		  complaintStatus = 'Resolved';
		  // Update engineer status back to Available
		  await queryAsync(
			`UPDATE engineer SET status = 'Available' WHERE engineer_id = ?`,
			[userId]
		  );
		  // Set completion date
		  await queryAsync(
			`UPDATE tasks SET completion_date = NOW() WHERE task_id = ?`,
			[taskId]
		  );
		  break;
		default:
		  complaintStatus = 'Under Review';
	  }
	  
	  // Update complaint status and updated_at in a single query
	  await queryAsync(
		`UPDATE complaints SET status = ?, updated_at = NOW() WHERE complaint_id = ?`,
		[complaintStatus, complaintId]
	  );
	  
	  // 4. Add to complaint timeline with current timestamp
	  const timelineNote = note || `Task ${status.toLowerCase()} by engineer`;
	  await queryAsync(
		`INSERT INTO complaint_timeline 
		 (complaint_id, status, note, date) 
		 VALUES (?, ?, ?, NOW())`,
		[complaintId, complaintStatus, timelineNote]
	  );
	  
	  res.status(200).json({ 
		success: true, 
		message: `Task ${status.toLowerCase()} successfully` 
	  });
	} catch (err) {
	  console.error(`Error updating task status:`, err);
	  res.status(500).json({ success: false, message: "Error updating task status" });
	}
  };
  