const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/surveyDb', { useNewUrlParser: true, useUnifiedTopology: true });

// Define the survey schema
const surveySchema = new mongoose.Schema({
  question: String,
  answer: String
});

const Survey = mongoose.model('Survey', surveySchema);

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = req.file.path;
  const stream = fs.createReadStream(filePath);
  stream.pipe(csvParser()).on('data', async (data) => {
    const newSurvey = new Survey(data);
    await newSurvey.save();
  }).on('end', () => {
    fs.unlinkSync(filePath);
    res.send('File uploaded and saved to MongoDB');
  });
});

// Serve static files
app.use(express.static('public'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});