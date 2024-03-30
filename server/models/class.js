// models/Class.js
const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    classTeacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    announcements: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Announcement'
    }],
    diaries: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Diary'
    }],
    attendances: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attendance'
    }]
});

const Class = mongoose.model('Class', classSchema);
module.exports = Class;