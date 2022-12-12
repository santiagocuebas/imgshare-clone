
import { Request, Response, NextFunction } from 'express';
import { Optional } from 'sequelize';
import { User as IUser } from './models/index.js';

declare global {
	namespace Express {
		interface User extends IUser {}
	}
}

export interface IImage {
	title: string;
	description: string;
	filename: string;
	views: number;
	like: string[];
	dislike: string[];
	author: string;
	avatar: string;
	uniqueId: string;
	totalLikes: number;
	totalDislikes: number;
}

export interface IComment {
	id: number;
	image_dir: string;
	sender: string;
	avatar: string;
	receiver: string;
	comment: string;
	like: string[];
	dislike: string[];
	totalLikes: number;
	totalDislikes: number;
}

export interface UserData {
	username: string;
  email: string;
  password: string;
  phoneNumber: string;
  description: string;
  avatar: string;
  links: string;
  totalViews: number;
  creationDate: Date;
  updatedOn: Date;
}

export interface UserCreationData extends Optional<UserData, 'totalViews' | 'links' | 'avatar' | 'description' | 'phoneNumber'> {}

export interface MessageData {
	[index: string]: string
}

export type Authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => void;
