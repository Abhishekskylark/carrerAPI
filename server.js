require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch((err) => console.error("MongoDB connection error:", err));

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));

// Schema & Model
const formSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  contactNum: String,
  applyFor: String,
  currentCTC: String,
  expectedCTC: String,
  noticePeriod: String,
  location: String,
  currentLocation: String,
  preferredLocation: String,
  mode: String,
  totalExperience: String,
  expertise: String,
  experience: String,
  clients: String,
  successfulPlacements: String,
});

const Form = mongoose.model("Form", formSchema);

// Routes
app.post("/api/form", async (req, res) => {
  try {
    const newForm = new Form(req.body);
    await newForm.save();
    res.status(201).json({ message: "Form submitted successfully", data: newForm });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/form", async (req, res) => {
  try {
    const forms = await Form.find();
    res.status(200).json(forms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


const contactFormSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    organizationName: { type: String, required: true },
    message: { type: String, required: true },
  });
  
  const ContactForm = mongoose.model("ContactForm", contactFormSchema);
  
  // API to handle Contact Form Submission
  app.post("/api/contact", async (req, res) => {
    try {
      const newContact = new ContactForm(req.body);
      await newContact.save();
      res.status(201).json({ message: "Message sent successfully", data: newContact });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // API to retrieve Contact Form submissions
  app.get("/api/contact", async (req, res) => {
    try {
      const contacts = await ContactForm.find();
      res.status(200).json(contacts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
