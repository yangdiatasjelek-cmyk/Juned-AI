export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { messages } = req.body;

    const response = await fetch(
      "https://9router-production-d579.up.railway.app/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.AI_API_KEY}`
        },
        body: JSON.stringify({
          model: "claude-opus-5",
          messages: messages
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "API error"
      });
    }

    const answer = data?.choices?.[0]?.message?.content;

    if (!answer) {
      return res.status(500).json({
        error: "AI tidak memberikan jawaban"
      });
    }

    return res.status(200).json({
      answer: answer
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
