import { clerkClient } from "@clerk/express";

export const protectRoute = async (req, res, next) => {
	if (!req.auth.userId) {
		return res.status(401).json({ message: "Unauthorized - you must be logged in" });
	}
	next();
};

export const requireAdmin = async (req, res, next) => {
	try {
		const currentUser = await clerkClient.users.getUser(req.auth.userId);
    // Parse the admin emails from a comma-separated string and trim any whitespace
		const adminEmails = process.env.ADMIN_EMAILS.split(',').map(email => email.trim());
		const isAdmin = adminEmails.includes(currentUser.primaryEmailAddress?.emailAddress);

		if (!isAdmin) {
			return res.status(403).json({ message: "Unauthorized - you must be an admin" });
		}

		next();
	} catch (error) {
		next(error);
	}
};
