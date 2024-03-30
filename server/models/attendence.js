// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    totalStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    presentStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    absentStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class'
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;