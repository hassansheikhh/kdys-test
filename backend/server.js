const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // To generate unique IDs
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017';
// const mongoURI = 'mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority'; // for MongoDB Atlas

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

const biomarkerSchema = new mongoose.Schema({
  biomarker: String,
  masterId: {
    type: String,
    default: uuidv4,
    unique: true
  },
  measurementUnit: String,
  categories: String,
  result: String
});

const Biomarker = mongoose.model('Biomarker', biomarkerSchema);

const resultCheckSchema = new mongoose.Schema({
  date: Date,
  refMin: String,
  refMax: String,
  optMin: String,
  optMax: String,
  result: String,
  age: Number,
  masterId: String
});

const ResultCheck = mongoose.model('ResultCheck', resultCheckSchema);

// Biomarker endpoints
app.post('/biomarkers', async (req, res) => {
  try {
    const biomarker = new Biomarker(req.body);
    await biomarker.save();
    res.status(201).send(biomarker);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/biomarkers', async (req, res) => {
  try {
    const biomarkers = await Biomarker.find();
    res.status(200).send(biomarkers);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/biomarkers/:id', async (req, res) => {
  try {
    const biomarker = await Biomarker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!biomarker) {
      return res.status(404).send();
    }
    res.send(biomarker);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/biomarkers/:id', async (req, res) => {
  try {
    const biomarker = await Biomarker.findByIdAndDelete(req.params.id);
    if (!biomarker) {
      return res.status(404).send();
    }
    res.send(biomarker);
  } catch (error) {
    res.status(500).send(error);
  }
});

// ResultCheck endpoints
app.post('/result-check', async (req, res) => {
  try {
    const { date, refMin, refMax, optMin, optMax, result, masterId } = req.body;
    const age = new Date().getFullYear() - new Date(date).getFullYear();

    const resultCheck = new ResultCheck({
      date,
      refMin,
      refMax,
      optMin,
      optMax,
      result,
      age,
      masterId
    });

    await resultCheck.save();
    res.status(201).send(resultCheck);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/result-check', async (req, res) => {
  try {
    const resultChecks = await ResultCheck.find();
    res.status(200).send(resultChecks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/result-check/:masterId', async (req, res) => {
  try {
    const resultChecks = await ResultCheck.find({ masterId: req.params.masterId });
    if (!resultChecks) {
      return res.status(404).send();
    }
    res.status(200).send(resultChecks);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/result-check/:id', async (req, res) => {
  try {
    const resultCheck = await ResultCheck.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resultCheck) {
      return res.status(404).send();
    }
    res.send(resultCheck);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
