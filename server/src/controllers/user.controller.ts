import User from '../models/user';
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

const createUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res
        .status(409)
        .send({ error: '409', message: 'User already exists' });
    }
    if (password === '') {
      throw new Error();
    }
    const hash = await bcrypt.hash(password, 10);
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    const savedUser = await newUser.save();
    if (req.session) {
      req.session.uid = savedUser._id;
    }
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send({ error, message: 'Could not create user' });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error();
    }
    const validatedPass = await bcrypt.compare(password, user.password);
    if (!validatedPass) {
      throw new Error();
    }
    if (req.session) {
      req.session.uid = user._id;
    }
    res.status(200).send(user);
  } catch (error) {
    res
      .status(401)
      .send({ error: '401', message: 'Username or password is incorrect' });
  }
};

const logout = (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy((error: Error) => {
      if (error) {
        res
          .status(500)
          .send({ error, message: 'Could not log out, please try again' });
      } else {
        res.clearCookie('sid');
        res.status(200).send({ message: 'Logout successful' });
      }
    });
  } else {
    res.status(200).send({ message: 'Logout successful' });
  }
};

const getUser = async (req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const existingUser = await User.find({ email: email });
    if (!existingUser) {
      throw new Error('User not found');
    }
    res.status(200).json(existingUser);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    let allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

const editUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(user);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    let id = req.params.id;
    const user = await User.deleteOne({ _id: id });
    res.status(200).json(`User with id:${id} was successfully deleted.`);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};


export {createUser, login, logout, getAllUsers, getUser, deleteUser, editUser}