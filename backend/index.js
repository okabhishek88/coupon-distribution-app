import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import connectDB from "./database/db.js"
import claimRoute from "./routes/claim.route.js"
import tempCoupons from "./routes/demoCoupons.route.js"
import cors from "cors"

dotenv.config()
const app = express()
connectDB()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(cors({
    origin: "https://coupon-distribution-app-frontend.onrender.com",
    credentials: true
  }))

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.use("/api", claimRoute)
app.use("/api", tempCoupons)
