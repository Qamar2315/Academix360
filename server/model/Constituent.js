const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constituentSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String
    },
    signUpTime: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Constituent', constituentSchema);