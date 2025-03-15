import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)

  const claimCoupon = async () => {
    setLoading(true)
    setFeedback("")
    try {
      const response = await axios.post("http://localhost:8000/api/claim", {}, {
        withCredentials: true,
      })
      setFeedback(response.data.coupon ? `Success! Your coupon is: ${response.data.coupon}` : response.data.message)
    } catch (error) {
      setFeedback(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="App">
      <div className="container">
        <h1>Coupon Claim App</h1>
        <button onClick={claimCoupon} disabled={loading}>
          {loading ? "Claiming..." : "Claim Coupon"}
        </button>
        {feedback && <p className="feedback">{feedback}</p>}
      </div>
    </div>
  )
}

export default App