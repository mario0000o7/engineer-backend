import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript'
import Office from './office.model'

@Table({
  tableName: 'dayOff'
})
export class DayOff extends Model<DayOff> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true
  })
  id!: number
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
  dateFrom!: Date
  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  dateTo!: Date

  @BelongsTo(() => Office, 'officeId')
  offices!: Office
}
