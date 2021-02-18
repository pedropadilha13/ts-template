import dotenv from 'dotenv';
dotenv.config();

import { Mongoose } from 'mongoose';
import bcrypt from 'bcrypt';

import { connectDB } from '../services/db';
import { UserModel as User } from '../models/User';

describe('User Model', () => {
  let connection: Mongoose | undefined;

  beforeAll(async () => {
    const conn = await connectDB();
    if (conn) {
      connection = conn;
    }
  });

  afterAll(async () => {
    if (connection instanceof Mongoose) {
      await connection.connection.close();
    }
  });

  it('Create new User', async () => {
    const userData = {
      name: 'Pedro Padilha',
      email: 'pedropadilhafarroco@gmail.com',
      password: '123',
      birthdate: new Date(1999, 1, 29)
    };

    const validUser = new User({
      ...userData,
      password: bcrypt.hashSync(userData.password, 10),
    });

    const savedUser = await validUser.save();

    const user = await User.findById(savedUser._id);

    if (user) {
      expect(user).toBeDefined();
      expect(user.name).toBe(userData.name);
      expect(user.email).toBe(userData.email);
      expect(bcrypt.compareSync(userData.password, user.password)).toBe(true);
      expect(user.birthdate.getDate()).toBe(userData.birthdate.getDate());
    }
  });
});
