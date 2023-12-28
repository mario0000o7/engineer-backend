import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Office from './office.model'

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
  @ForeignKey(() => Office)
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
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true
  })
  archive!: boolean
  @BelongsTo(() => Office, 'officeId')
  offices!: Office

  static associate() {
    // this.belongsTo(Office, { as: 'office', foreignKey: 'officeId' })
  }
}

export default Service
