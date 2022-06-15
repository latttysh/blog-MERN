import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { registerValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';
import checkAuth from './utils/checkAuth.js';

import { create, getAll, getOne, remove, update } from './controllers/PostController.js';
import { register, login, getMe } from './controllers/UserController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';

const app = express();
mongoose
  .connect('mongodb://localhost:27017/blog')
  .then(() => console.log('done'))
  .catch(() => console.log('Error'));
app.get('/', (req, res) => {
  res.send('hello world');
});

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads'); // function function does not receive errors, and save in path "uploads"
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname); // get original name
  },
});

const upload = multer({ storage }); // init

app.use(express.json());
app.use('/uploads', express.static('uploads')); // return image on route "/uploads"

app.post('/auth/login', login);
app.post('/auth/register', registerValidation, handleValidationErrors, register);
app.get('/auth/me', checkAuth, getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `uploads/${req.file.originalname}`, // return path
  });
});

app.get('/posts', getAll);
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postCreateValidation, create);
app.delete('/posts/:id', checkAuth, remove);
app.patch('/posts/:id', checkAuth, postCreateValidation, update);

// START SERVER
app.listen(4444, (err) => {
  if (err) {
    return console.log('Error HELP HELP', err);
  }
  console.log('Lets Start buddy');
});
