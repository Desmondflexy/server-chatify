import { Response, Request } from 'express';
import { errorHandler } from '../utils/helpers';
import { User } from './models';

export function me(req: Request, res: Response) {
  try {
    return res.json(req.user);

  } catch (error) {
    errorHandler(res, error);
  }
}

export async function allUsers(req: Request, res: Response) {
  try {
    const users = await User.find().select('email displayName phone');
    return res.json({
      noOfUsers: users.length,
      users,
    });

  } catch (error) {
    errorHandler(res, error);
  }
}

export async function getUserByEmail(req: Request, res: Response) {
  try {
    const { email } = req.query;
    const user = await User.findOne({ email }).select('email displayName phone');
    if (!user) return res.status(404).json("User not found");
    return res.json(user);
  } catch (error) {
    errorHandler(res, error);
  }
}