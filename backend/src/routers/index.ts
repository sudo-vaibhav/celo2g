import { Router } from "express"
import messageRequestRouter from "./messageRequestRouter"
import userRouter from "./userRouter"
const router = Router()

router.use("/message-request",messageRequestRouter)
router.use("/user",userRouter)

export default router