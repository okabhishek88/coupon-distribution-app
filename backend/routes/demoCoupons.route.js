import express from "express"
import { addCoupons } from "../controllers/demoCoupon.controller.js"

const router = express.Router()
router.route("/add-coupons").post(addCoupons)

export default router