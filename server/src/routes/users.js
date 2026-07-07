import { Router } from "express"
import UserController from "../controller/UserController.js"

const userRouter = Router()
const userController = new UserController()

userRouter.post("/api/users", userController.create)
userRouter.post("/api/login", userController.login)

export { userRouter }