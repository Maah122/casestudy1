const mongoose = require('mongoose');

const MembersSchema = new mongoose.Schema({
    name: String,
    stock: { type: mongoose.Schema.Types.ObjectId, ref: 'Stocks' }, // Reference to Stocks model
    status: String,
    date: { type: Date, default: Date.now }
});

const MembersModel = mongoose.model('Members', MembersSchema);

module.exports = MembersModel;
