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
    allowNull: false
  })
  password!: string
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  firstName!: string
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  lastName!: string

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
  avatarImg!: string
  @Column({
    type: DataType.DATE,
    allowNull: false,
    unique: false
  })
  birthDate!: Date
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: false
  })
  gender!: string
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false
  })
  title!: string
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false
  })
  address1!: string
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false
  })
  address2!: string
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false
  })
  city!: string
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false
  })
  country!: string
  @Column({
    type: DataType.STRING,
    allowNull: true,
    unique: false
  })
  postalCode!: string
}

export default User
