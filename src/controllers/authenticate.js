const jwt = require('jsonwebtoken');
const { pool } = require('../../config');

exports.authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Failed to authenticate token:', err);
      return res.sendStatus(403);
    }

    console.log('User authenticated:', user);
    // Manejar el objeto anidado correctamente
    if (typeof user.sub === 'object' && user.sub !== null) {
      req.user = user.sub;
    } else {
      req.user = user;
    }
    next();
  });
};


  exports.authenticateTokenMongoDB = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };