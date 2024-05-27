const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

const mongoURI = 'mongodb://localhost:27017';

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
  age: Number
});

const ResultCheck = mongoose.model('ResultCheck', resultCheckSchema);

const groupDetailSchema = new mongoose.Schema({
  groupId: {
    type: String,
    unique: true
  },
  group: String,
  age: Number,
  reference_low: String,
  reference_high: String,
  optimal_low: String,
  optimal_high: String
});

const GroupDetail = mongoose.model('GroupDetail', groupDetailSchema);


app.post('/AddBiomarkers', async (req, res) => {
  try {
    const biomarker = new Biomarker(req.body);
    await biomarker.save();
    res.status(201).send(biomarker);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/GetBiomarkers', async (req, res) => {
  try {
    const biomarkers = await Biomarker.find();
    res.status(200).send(biomarkers);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/GetBiomarkersById/:id', async (req, res) => {
  try {
    const biomarker = await Biomarker.findById(req.params.id);
    if (!biomarker) {
      return res.status(404).send();
    }
    res.send(biomarker);
  } catch (error) {
    res.status(500).send(error);
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

app.post('/result-check', async (req, res) => {
  try {
    const { date, refMin, refMax, optMin, optMax, result } = req.body;
    const age = new Date().getFullYear() - new Date(date).getFullYear();

    const resultCheck = new ResultCheck({
      date,
      refMin,
      refMax,
      optMin,
      optMax,
      result,
      age
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

app.get('/result-check/:id', async (req, res) => {
  try {
    const resultCheck = await ResultCheck.findById(req.params.id);
    if (!resultCheck) {
      return res.status(404).send();
    }
    res.status(200).send(resultCheck);
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


app.post('/AddGroupDetail', async (req, res) => {
  try {
    const { group, age, reference_low, reference_high, optimal_low, optimal_high } = req.body;
    const groupId = uuidv4();
    const groupDetail = new GroupDetail({
      groupId,
      group,
      age,
      reference_low,
      reference_high,
      optimal_low,
      optimal_high
    });

    await groupDetail.save();
    res.status(201).send({ groupDetail });
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get('/GetAllGroupDetails', async (req, res) => {
  try {
    const groupDetails = await GroupDetail.find();
    res.status(200).send(groupDetails);
  } catch (error) {
    console.error('Error fetching group details:', error);
    res.status(500).send('Error fetching group details');
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
