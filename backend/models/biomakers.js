const mongoose = require('mongoose');

const modalSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    referenceLow: {
        type: Number,
        required: true
    },
    referenceHigh: {
        type: Number,
        required: true
    },
    optionalLow: {
        type: Number
    },
    optionalHigh: {
        type: Number
    }
});

const Modal = mongoose.model('Modal', modalSchema);

module.exports = Modal;