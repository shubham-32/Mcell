import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ success: false, message: "No token provided" });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decoded.id;
		req.role = decoded.role;
		next();
	} catch (error) {
		console.error("JWT Error:", error);
		res.status(401).json({ success: false, message: "Invalid token" });
	}
};
