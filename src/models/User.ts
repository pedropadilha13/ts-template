import bcrypt from 'bcrypt';
import moment from 'moment';
import mongoose, { Document, Schema, Model } from 'mongoose';

interface UserProps {
  name: string;
  email: string;
  password: string;
  birthdate: Date;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Interface that represents User mongoose Document
 */
export interface User extends UserProps, Document {
  /**
   * Get age (in years) of user
   * @returns {number} age
   */
  getAge(): number;

  /**
   * Compare given password to registered (encrypted) password
   * @param {string} password
   * @returns {boolean} true if password matches, false if not
   */
  verifyPassword(password: string): boolean;
}

/**
 * Interface that represents User mongoose Model
 */
export interface IUserModel extends Model<User> {
  findByEmail(email: string): Promise<User | null>;
}

const UserSchema = new Schema<User>(
  {
    name: {
      type: Schema.Types.String,
      required: true
    },
    email: {
      type: Schema.Types.String,
      required: true
    },
    password: {
      type: Schema.Types.String,
      required: true
    },
    birthdate: {
      type: Schema.Types.Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

UserSchema.methods.getAge = function (): number {
  return moment().diff(this.birthdate, 'years');
};

UserSchema.methods.verifyPassword = function (password: string): boolean {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.statics.findByEmail = async function (email: string): Promise<User | null> {
  const user = await this.findOne({ email });
  return user;
};

const UserModel = mongoose.model<User, IUserModel>('User', UserSchema);

export { UserModel };
