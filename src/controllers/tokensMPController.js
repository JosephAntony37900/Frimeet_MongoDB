const TokenMP = require('../models/TokensMP')
const axios = require('axios')
const mongoose = require('mongoose');

exports.createToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    response = await axios.post(
      'https://api.mercadopago.com/oauth/token',
      {
        grant_type: 'refresh_token', 
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        refresh_token: refreshToken, 
      },
      {
        headers: {
          'accept': 'application/json',
          'content-type': 'application/x-www-form-urlencoded'
        },
      }
    )
    console.log('Status:', response.status);
    console.log('Data:', response.data); 
    const { access_token, refresh_token } = response.data;

    const newTokenMP  = new TokenMP({
        accessToken: access_token,
        refreshToken: refresh_token,
        createdAt: new Date()
    })

    const result = await newTokenMP.save();
    res.status(201).json({
      message: "Token renovado con éxito",
      TokenId: result._id
    });
  } catch (err) { console.error('Response data:', err.response?.data); // Muestra el detalle devuelto por Mercado Pago
    console.error('Response status:', err.response?.status); // Muestra el código de estado
    console.error('Request headers:', err.config?.headers); // Opcional, para verificar lo enviado
    res.status(500).json({ 
      message: err.response?.data || err.message 
    });
  }
};

exports.deleteToken = async (req, res) => {
  const TokenId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(TokenId)) {
    return res.status(400).json({ message: 'ID de token no válido.' });
  }
  try {
    const Token = await TokenMP.findByIdAndDelete(TokenId);
    if (!Token) {
      return res.status(404).json({ message: 'token no encontrado.' });
    }
    res.json({ message: 'Token eliminado con exito.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTokens = async (req, res) => {
  try {
    const tokens = await TokenMP.find(); 
    res.json(tokens);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};