const axios = require("axios");
require("dotenv").config();

const analyzeMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message text is required" });
  }

  console.log("📨 Message received:", message);
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
      {
        inputs: message,
        parameters: {
          candidate_labels: ["safe", "spam", "scam", "fraud"],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 15000, // ⏱️ 15 seconds timeout
      }
    );

    console.log("✅ Model response:", response.data);
    return res.json(response.data);
  } catch (error) {
    if (error.response) {
      console.error("❌ API response error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("❌ No response from Hugging Face:", error.request);
    } else {
      console.error("❌ Internal Axios error:", error.message);
    }

    return res.status(500).json({ error: "Error analyzing message" });
  }
};

module.exports = { analyzeMessage };
