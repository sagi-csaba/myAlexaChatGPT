import express from "express";
import OpenAI from "openai";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/", async (req, res) => {
  const userText = req.body.text;
  if (!userText) return res.json({ text: "Nem kaptam szöveget." });

  const response = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: userText }],
  });

  const reply = response.choices[0].message.content;
  res.json({ text: reply });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
