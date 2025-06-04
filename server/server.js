const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const user = require('./models/userModel');

const app = express();

dotenv.config({ path: './.env' });

const db = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(db);

const corsOptions = {
  origin: ['http://localhost:5173'],
};
app.use(cors(corsOptions));
app.use(express.json());

// app.post('/api/users', async (req, res) => {
//   try {
//     const { name, password, preferences, avoid } = req.body;
//     const newUser = new user({ name, password, preferences, avoid });
//     await newUser.save();
//     res.status(201).json({ message: 'User created', user: newUser });
//   } catch (err) {
//     console.error('Error creating user:', err);
//     res.status(500).json({ error: 'Failed to create user' });
//   }
// });

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
