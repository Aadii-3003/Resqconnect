const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    bloodGroup: { type: String, required: true },
    hospitalName: { type: String, required: true },
    city: { type: String, required: true },
    urgency: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'accepted', 'fulfilled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Request', requestSchema);