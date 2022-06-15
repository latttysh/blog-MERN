import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const password = req.body.password; //start crypt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt); // end crypt password
    const doc = new UserModel({
      //create model of new user
      email: req.body.email,
      fullName: req.body.fullName,
      passwordHash,
    });

    const user = await doc.save(); //create user
    const token = jwt.sign(
      // create token
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    res.json({ ...user._doc, token }); //return token
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось зарегестрироваться',
      reason: error,
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }); // Try to find email in db
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash); // compare two crypt passwords
    if (!isValidPass) {
      return res.status(404).json({
        message: 'Пароль не верный',
      });
    }

    const token = jwt.sign(
      // create jwt
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );
    res.json({ ...user._doc, token }); //return user.doc info and jwt token
  } catch (error) {
    res.status(500).json('Не удалось авторизоваться');
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: 'Пользователя не сущетсвует',
      });
    }
    res.json({ ...user._doc });
  } catch (error) {
    res.status(500).json({
      message: 'Не удалось найти информацию',
      reason: error,
    });
  }
};
