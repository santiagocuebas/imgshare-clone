
import {
	DataType,
	Model,
	Table,
	Column,
	AllowNull,
	PrimaryKey,
	Unique,
	Default,
	CreatedAt,
	UpdatedAt
} from 'sequelize-typescript';

import { UserData, UserCreationData } from '../types.js';

@Table({
	tableName: 'User'
})
class User extends Model<UserData, UserCreationData> {
	@AllowNull(false)
	@PrimaryKey
	@Column
	declare username: string;
	
	@AllowNull(false)
	@Unique(true)
	@Column
	declare email: string;
	
	@AllowNull(false)
	@Column
	declare password: string;
	
	@Default('')
	@Column
	declare phoneNumber: string;
	
	@Default('')
	@Column(DataType.TEXT)
	declare description: string;
	
	@Default('default.png')
	@Column
	declare avatar: string;
	
	@Default('')
	@Column(DataType.TEXT)
	declare links: string;
	
	@Default(0)
	@Column
	declare totalViews: number;
	
	@CreatedAt
	declare creationDate: Date;

  @UpdatedAt
	declare updatedOn: Date;
}

export default User;
