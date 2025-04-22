// index.js
import dotenv from "dotenv";
import connectDB from "./src/db/index.js";
import { app } from "./src/app.js";
import nodemailer from "nodemailer";

dotenv.config({
    path: "./env"
});

// Set up feedback endpoint
app.post('/api/v1/submit-feedback', async (req, res) => {
  try {
    const {
      name,
      email,
      problemType,
      problemDescription,
      suggestion,
      rating,
      attachScreenshot
    } = req.body;

    // Input validation
    if (!name || !email || !problemType || !problemDescription) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Configure email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',  // or another service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Format email content
    const emailContent = `
      <h2>New Feedback Submission</h2>
      
      <h3>User Information</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      
      <h3>Feedback Details</h3>
      <p><strong>Type:</strong> ${problemType}</p>
      <p><strong>Rating:</strong> ${rating}/5</p>
      
      <h3>Problem Description</h3>
      <p>${problemDescription}</p>
      
      <h3>Suggestion</h3>
      <p>${suggestion || 'No suggestion provided'}</p>
      
      <p><strong>Screenshot Requested:</strong> ${attachScreenshot ? 'Yes' : 'No'}</p>
      
      <p>Submitted on: ${new Date().toLocaleString()}</p>
    `;

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.FEEDBACK_EMAIL || 'capstone.project.bms@gmail.com',
      subject: `New Feedback: ${problemType} from ${name}`,
      html: emailContent,
    });

    // Return success response
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending feedback:', error);
    return res.status(500).json({ message: 'Failed to send feedback' });
  }
});

// Connect to database and start server
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
    });
}).catch(err => {
    console.error("Database connection failed:", err);
    process.exit(1);
});