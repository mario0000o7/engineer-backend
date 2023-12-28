import { Column, DataType, Model, Table } from 'sequelize-typescript'
import Service from './service.model'

@Table({
  tableName: 'appointments'
})
export class Appointment extends Model<Appointment> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id'
    }
  })
  userId!: number
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE',
    references: {
      model: 'services',
      key: 'id'
    }
  })
  serviceId!: number
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  date!: Date
  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  price!: number
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  archive!: boolean

  static associate() {
    this.belongsTo(Service, { as: 'services', foreignKey: 'serviceId' })
  }
}

export default Appointment
