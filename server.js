const express = require('express');
const { connectDB } = require('./config');
const { pool } = require('./config')
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
  await connectDB();
  pool.connect();
  const userRoutes = require('./src/routes/userRoutes'); 
  const placeRoutes = require('./src/routes/placeRoutes'); 
  const eventRoutes = require('./src/routes/eventRoutes');
  const reviewRoutes = require('./src/routes/reviewsRoutes');
  const reminderRoutes = require('./src/routes/reminderRoutes')
  app.use('/api/users', userRoutes); 
  app.use('/api/places', placeRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/reminders', reminderRoutes);
  
  app.listen(port, () => {
    console.log(`API activa en http://localhost:${port}`);
  });
};

startServer();
