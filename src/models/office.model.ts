import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
  tableName: 'offices'
})
export class Office extends Model<Office> {
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
  name!: string
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  address1!: string
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  address2!: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  city!: string

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  country!: string
  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  postalCode!: string
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id'
    }
  })
  ownerId!: number
  @Column({
    type: DataType.ARRAY(DataType.DATE),
    allowNull: false
  })
  timeFrom!: Date
  @Column({
    type: DataType.ARRAY(DataType.DATE),
    allowNull: false
  })
  timeTo!: Date
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  archive!: boolean
}

export default Office
