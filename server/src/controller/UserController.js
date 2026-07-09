/**
 implementando esquema
 routes/users.js
  ↓ chama
controller/UserController.js (parte atual)
  ↓ usa
database/client.js
  ↓ conecta
Prisma/PostgreSQL
 */

import { prisma } from "../database/client.js";
import bcrypt from "bcrypt";

export default class UserController {
	async getAll(req, res) {
		try {
			const users = await prisma.user.findMany();
			res.json(users);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	}

	async getById(req, res) {}
	async create(req, res) {
		const { name, username, email, password, state, city } = req.body;

		if (!name || !username || !email || !password) {
			return res.status(400).json({
				code: 400,
				message: "invalid data request."
			});
		}

		try {
			const passwordHash = await bcrypt.hash(password, 10);

			const user = await prisma.user.create({
				data: {
					name,
					username,
					email,
					password: passwordHash,
					state,
					city
				}
			});
			return res.status(201).json(user);
		} catch (error) {
			return res.status(400).json({
				code: 400,
				message: "Could not create user.",
				error
			});
		}
	}
	async login(req, res) {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				code: 400,
				message: "Username and password are required."
			});
		}

		try {
			const user = await prisma.user.findFirst({
				where: {
					username
				}
			});

			if (!user) {
				return res.status(401).json({
					code: 401,
					message: "Invalid credentials."
				});
			}

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(401).json({
					code: 401,
					message: "Invalid credentials."
				});
			}

			console.log("logado com sucesso ");
			return res.json({
				id: user.id,
				name: user.name,
				username: user.username,
				email: user.email,
				state: user.state,
				city: user.city
			});
		} catch (error) {
			return res.status(500).json({
				code: 500,
				message: "Could not login.",
				error
			});
		}
	}
	async update(req, res) {}
	async delete(req, res) {}
}
