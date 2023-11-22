import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
  tableName: 'users'
})
export class User extends Model<User> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  username!: string
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  first_name!: string
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  last_name!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  email!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  phone!: string
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    unique: false
  })
  role!: string
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false
  })
  avatar_img!: string
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  uuid!: string
}

export default User