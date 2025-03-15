import express from "express"
import { claimCoupon } from "../controllers/coupon.controller.js"

const router = express.Router()
router.route("/claim").post(claimCoupon)

export default router