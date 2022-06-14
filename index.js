import express from 'express';
import mongoose from 'mongoose';
import { registerValidation } from './validations/auth.js';
import checkAuth from './utils/checkAuth.js';

import { register, login, getMe } from './controllers/UserController.js';

const app = express();
mongoose
  .connect('mongodb://localhost:27017/blog')
  .then(() => console.log('done'))
  .catch(() => console.log('Error'));
app.get('/', (req, res) => {
  res.send('hello world');
});

app.use(express.json());

app.post('/auth/login', login);

app.post('/auth/register', registerValidation, register);

app.get('/auth/me', checkAuth, getMe);

// START SERVER
app.listen(4444, (err) => {
  if (err) {
    return console.log('Error HELP HELP', err);
  }
  console.log('Lets Start buddy');
});
