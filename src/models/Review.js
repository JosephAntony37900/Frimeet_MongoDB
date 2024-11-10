const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema ({
    content: {type: String, required: true},
    starts: {type: Number, required: false},
    idPlace: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: false},
    idEvent: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: false},

});

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review; 