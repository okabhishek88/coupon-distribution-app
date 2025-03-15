import { Coupon } from "../models/coupon.model.js"
import { Claim } from "../models/claim.model.js"

export const claimCoupon = async (req, res) => {
    try {
        const userIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        const recentClaim = await Claim.findOne({
            ip: userIp,
            timestamp: { $gte: oneHourAgo },
        })

        if (recentClaim) {
            const timeLeft =
                60 * 60 * 1000 - (Date.now() - new Date(recentClaim.timestamp).getTime())
            const minutesLeft = Math.ceil(timeLeft / 60000)
            return res.status(429).json({
                message: `You've already claimed a coupon. Wait ${minutesLeft} minutes.`,
            })
        }

        const availableCoupon = await Coupon.findOne({ isUsed: false })
        console.log("Available coupon:", availableCoupon)
        if (!availableCoupon) {
            return res.status(404).json({ message: "No coupons available!" })
        }

        availableCoupon.isUsed = true
        await availableCoupon.save()
        console.log("Coupon marked used:", availableCoupon)

        const newClaim = new Claim({ ip: userIp, couponCode: availableCoupon.code })
        await newClaim.save()
        console.log("Claim saved:", newClaim)

        res.cookie("lastClaim", Date.now(), { maxAge: 60 * 60 * 1000, httpOnly: true })
        res.status(200).json({
            message: "Coupon claimed successfully!",
            coupon: availableCoupon.code,
        })
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({ message: "Something went wrong!" })
    }
}
