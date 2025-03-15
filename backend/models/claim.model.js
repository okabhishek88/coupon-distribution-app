import mongoose from "mongoose"

const claimSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true
    },
    couponCode: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

export const Claim = mongoose.model("Claim", claimSchema)