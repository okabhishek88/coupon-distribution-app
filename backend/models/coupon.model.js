import mongoose from "mongoose"

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    isUsed: {
        type: Boolean,
        default: false
    }
})

export const Coupon = mongoose.model("Coupon", couponSchema)