const express = require('express');
const { connectDB } = require('./config');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const startServer = async () => {
  await connectDB();
  const userRoutes = require('./src/routes/userRoutes'); 
  const placeRoutes = require('./src/routes/placeRoutes'); 
  app.use('/api/users', userRoutes); 
  app.use('/api/places', placeRoutes);
  
  app.listen(port, () => {
    console.log(`API activa en http://localhost:${port}`);
  });
};

startServer();
