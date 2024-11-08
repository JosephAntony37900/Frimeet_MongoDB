const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      
    });
    console.log('Conectado a la base de datos');
  } catch (err) {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  }
};

module.exports = { connectDB };
