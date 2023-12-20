import { Column, DataType, Model, Table } from 'sequelize-typescript'

@Table({
  tableName: 'services'
})
export class Service extends Model<Service> {
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
  description!: string
  @Column({
    type: DataType.NUMBER,
    allowNull: false
  })
  price!: number
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'offices',
      key: 'id'
    }
  })
  officeId!: number
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  duration!: Date
}

export default Service
