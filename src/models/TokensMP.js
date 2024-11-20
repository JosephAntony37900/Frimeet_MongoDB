const mongoose = require('mongoose')

const TokenMPSchema = new mongoose.Schema ({
    accessToken: {type: String, required: true},
    refreshToken: {type: String, required: true},
    createdAt: {type: Date, required: true}

});

const TokenMP = mongoose.model('TokenMP',TokenMPSchema);

module.exports = TokenMP; 