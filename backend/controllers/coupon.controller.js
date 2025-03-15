import { Coupon } from "../models/coupon.model.js"
import { Claim } from "../models/claim.model.js"

export const claimCoupon = async (req, res) => {
    try {
        // Get user's IP (works with proxies too)
        const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress

        // Check if user has claimed recently (within 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
        const recentClaim = await Claim.findOne({
            ip: userIp,
            timestamp: { $gte: oneHourAgo }
        })

        // if true 
        if (recentClaim) {
            // calculate time remaining
            const timeElapsed = Date.now() - new Date(recentClaim.timestamp).getTime()
            const timeLeft = 60 * 60 * 1000 - timeElapsed
            const minutesLeft = Math.ceil(timeLeft / 60000)
            return res.status(429).json({
                message: `You've already claimed a coupon. Wait ${minutesLeft} minutes to claim again.`,
            })
        }

        // Find the next unused coupon (round-robin)
        const availableCoupon = await Coupon.findOne({ isUsed: false });
        if (!availableCoupon) {
            return res.status(404).json({ message: "No coupons available right now!" });
        }

        // Mark the coupon as used
        availableCoupon.isUsed = true
        await availableCoupon.save()

        // Record the claim
        const newClaim = new Claim({
            ip: userIp,
            couponCode: availableCoupon.code,
        })
        await newClaim.save()

        // Set a cookie to track this user (optional extra layer)
        res.cookie("lastClaim", Date.now(), {
            maxAge: 60 * 60 * 1000,
            httpOnly: true,
        })

        res.status(200).json({
            message: "Coupon claimed successfully!",
            coupon: availableCoupon.code,
        })
    }
    catch (error) {
        console.error(`Erorr: ${error}`)
        res.status(500).json({ message: "Something went wrong. Try again later." })
    }
}