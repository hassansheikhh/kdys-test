const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Modal = require('./models/biomakers'); 

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/yourDatabaseName', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

app.use(bodyParser.json());

app.post('/api/add', async (req, res) => {
    const newData = req.body;
    const modal = new Modal(newData);
    try {
        await modal.save();
        res.send('Data added successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/get/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Modal.findById(id);
        if (result) {
            res.json(result);
        } else {
            res.status(404).send('Data not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/getAll', async (req, res) => {
    try {
        const allData = await Modal.find();
        res.json(allData);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
