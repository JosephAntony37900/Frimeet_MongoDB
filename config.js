const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const uri = process.env.MONGODB_URI;
const pgUri = process.env.POSTGRES_URL;

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

const pool = new Pool({
  connectionString: pgUri,
})

pool.on('connect', () => {
   console.log('Conectado a PostgreSQL'); 
  });

module.exports = { connectDB, pool };
