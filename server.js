const express = require('express');
const { connectDB, pool } = require('./config');
const dotenv = require('dotenv');
const cors = require('cors')

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({ 
   origin: '*'
  }));

const startServer = async () => {
  await connectDB();

  // Conecta a PostgreSQL solo si pool está definido
  if (pool) {
    try {
      await pool.connect();
      console.log('Conexión a PostgreSQL realizada');
    } catch (error) {
      console.warn('Advertencia: No se pudo conectar a PostgreSQL');
    }
  }

  // Rutas
  const userRoutes = require('./src/routes/userRoutes');
  const placeRoutes = require('./src/routes/placeRoutes');
  const eventRoutes = require('./src/routes/eventRoutes');
  const reviewRoutes = require('./src/routes/reviewsRoutes');
  const reminderRoutes = require('./src/routes/reminderRoutes');
  app.use('/api/users', userRoutes);
  app.use('/api/places', placeRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/reminders', reminderRoutes);

  // Inicia el servidor
  app.listen(port, () => {
    console.log(`API activa en http://localhost:${port}`);
  });
};

startServer();
