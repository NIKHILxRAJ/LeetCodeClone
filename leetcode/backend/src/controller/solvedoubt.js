const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function solvedoubt(req, res) {

  try {

    const {
      messages,
      title,
      description,
      testcases,
      startcode
    } = req.body;

    const userMessage =
      messages?.slice(-1)[0]?.parts?.[0]?.text || "Hello";

    const completion = await groq.chat.completions.create({

      messages: [

        {
          role: "system",
          content: `You are an expert Data Structures and Algorithms mentor helping users solve coding interview problems.

You are inside a LeetCode-style coding platform.

Problem Details:
Title: ${title}

Description:
${description}

Visible Test Cases:
${JSON.stringify(testcases)}

Starter Code:
${JSON.stringify(startcode)}

Your job:
- Help users understand the problem
- Explain approaches clearly
- Give hints before full solutions
- Teach DSA concepts
- Explain time and space complexity
- Help debug code
- Keep explanations beginner friendly

Rules:
- Focus ONLY on coding/programming/DSA
- Be concise but educational
- Prefer hints over complete solutions unless explicitly asked
- Use simple English
- Explain step-by-step
- If user asks unrelated questions, politely redirect to coding help`
        },

        {
          role: "user",
          content: userMessage,
        }

      ],

      model: "llama-3.3-70b-versatile",
    });

    const text =
      completion.choices[0].message.content;

    res.status(200).json({
      message: text,
    });

  } catch (error) {

    console.error("Groq Error:", error);

    res.status(500).json({
      message: "AI Error"
    });
  }
}

module.exports = { solvedoubt };