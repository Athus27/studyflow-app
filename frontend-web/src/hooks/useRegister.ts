import { useState } from "react";
import { usersService } from "../services/usersService";

interface RegisterData {
	name: string;
	username: string;
	email: string;
	password: string;
	state?: string;
	city?: string;
}

export const useRegister = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	const register = async (formData: RegisterData) => {
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			// Call the usersService.register function and await the result
			await usersService.register(formData);
			setSuccess("Registration successful!");
		} catch (err) {
			setError("Registration failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return { loading, error, success, register };
};
