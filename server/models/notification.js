// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true
    }
});

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;