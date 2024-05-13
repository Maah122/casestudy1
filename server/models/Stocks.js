const mongoose = require('mongoose');

const StocksSchema = new mongoose.Schema({
    title: String,
    genre: String,
    available: String,
    rating: String,
    price: String,
    imagePath: String,

});

const StocksModel = mongoose.model('Stocks', StocksSchema);
module.exports = StocksModel;
