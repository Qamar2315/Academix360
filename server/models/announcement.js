/ models/Announcement.js
const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
    message: {
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

const Announcement = mongoose.model('Announcement', announcementSchema);
module.exports = Announcement;