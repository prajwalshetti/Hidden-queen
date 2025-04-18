// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Feedback submission endpoint
app.post('http://localhost:8002/api/submit-feedback', async (req, res) => {
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
      to: 'your-email@example.com',  // Replace with your email address
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});