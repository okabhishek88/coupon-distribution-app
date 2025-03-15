import { Coupon } from "../models/coupon.model.js"

export const addCoupons = async (req, res) => {
    try {
        await Coupon.deleteMany({})
        const sampleCoupons = [
            {
                code: "SAVE10",
                isUsed: false
            },
            {
                code: "FREESHIP",
                isUsed: false
            },
            {
                code: "20OFF",
                isUsed: false
            },
            {
                code: "GET50",
                isUsed: false
            }
        ]

        await Coupon.insertMany(sampleCoupons)
        res.send("Sample coupons added successfully!")
    }
    catch (error) {
        console.error(`Error: ${error}`)
        res.status(500).send("Failed to add coupons")
    }
}
