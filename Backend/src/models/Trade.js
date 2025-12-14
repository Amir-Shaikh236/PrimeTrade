const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const tradeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    symbol: {
        type: String,
        required: true,
        upperCase: true,
        trim: true,
    },

    entryPrice: {
        type: Number,
        required: true,
    },

    targetPrice: {
        type: Number,
    },

    status: {
        type: String,
        enum: ['Open', 'Closed', 'Pending'],
        default: 'Open',
    },

    notes: {
        type: String,
        maxlength: 500,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    }
});

tradeSchema.index({ user: 1 });

module.exports = mongoose.model('Trade', tradeSchema);
