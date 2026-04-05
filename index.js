import express from "express";
import OpenAI from "openai";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// OpenAI kulcs a Render Environment Variable-ból
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Alexa POST kérések feldolgozása
app.post("/", async (req, res) => {
  try {
    // Ellenőrizzük, hogy az Alexa JSON-ban van-e slot
    const userText = req.body.request?.intent?.slots?.text?.value;
    if (!userText) {
      return res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Nem kaptam szöveget."
          },
          shouldEndSession: false
        }
      });
    }

    // OpenAI ChatGPT hívás
    const reply = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userText }],
    });

    // Alexa-kompatibilis válasz
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: reply.choices[0].message.content
        },
        shouldEndSession: false
      }
    });

  } catch (err) {
    console.error(err);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Hiba történt a feldolgozás során."
        },
        shouldEndSession: true
      }
    });
  }
});

// Szerver indítása
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running");
});
