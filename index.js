import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { groq } from "./utility/grogClient.js";
import nodemailer from "nodemailer";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Generate email from prompt
app.post("/api/generate-email", async (req, res) => {
  const { prompt } = req.body;
  try {
    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    const email = completion.choices[0]?.message?.content || "";
    res.json({ email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate email" });
  }
});

// Send email
app.post("/api/send-email", async (req, res) => {
  const { recipients, emailContent } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail", // or your SMTP
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: "AI Generated Email",
      text: emailContent,
    });

    res.json({ message: "Email sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
