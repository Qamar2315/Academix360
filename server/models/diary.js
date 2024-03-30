// models/Diary.js
const mongoose = require('mongoose');

const diarySchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }
});

const Diary = mongoose.model('Diary', diarySchema);
module.exports = Diary;