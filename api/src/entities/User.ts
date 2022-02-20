import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column("varchar", { nullable: false, unique: true })
  email: string

  @Column("varchar", { nullable: false })
  password: string

  @Column("varchar", { nullable: false })
  firstName: string

  @Column("varchar", { nullable: false })
  lastName: string
}
