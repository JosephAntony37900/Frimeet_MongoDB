const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const uri = process.env.MONGODB_URI;
const pgUri = process.env.POSTGRES_URL_FRIMEET;

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Conectado a la base de datos de MongoDB');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1); 
  }
};

// Conexión opcional a PostgreSQL
let pool;
if (pgUri) {
  pool = new Pool({
    connectionString: pgUri,
  });

  pool.on('connect', () => {
    console.log('Conectado a PostgreSQL');
  });

  pool.on('error', (err) => {
    console.error('Error conectando a PostgreSQL:', err.message);
  });
} else {
  console.log('URL de PostgreSQL no proporcionada. No se realizará la conexión a PostgreSQL.');
}

module.exports = { connectDB, pool };
