const User = require('../models/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { mongoose } = require('mongoose');

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.createUser = async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    console.log(newUser)
    const result = await newUser.save();
    //const token = jwt.sign({ userId: result.insertedId }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({
      message: "Usuario creado exitosamente",
      userId: result._id,
      //token: token 
    });
  } catch (err) {
    res.status(400).json({ message:  err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET_KEY, { expiresIn: '1h' });
    res.json({
      message: 'Inicio de sesión exitoso',
      userId: user._id,
      token: token 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID de usuario no válido' });
  }
  try {
    const user = await User.findById({ userId});
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: 'ID de usuario no válido' });
  }
  try {
    const result = await User.findByIdAndDelete({ userId });
    if (!result) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

