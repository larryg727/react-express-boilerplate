import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"
import { IsEmail, IsNotEmpty } from "class-validator"
import { IsEmailAlreadyExist } from "../utils/validatorUtils"

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  @IsEmail({}, { message: "Must be a valid Email" })
  @IsEmailAlreadyExist({ message: "$value is already registered" })
  email: string

  @Column({ select: false })
  @IsNotEmpty({ message: "Password must not be empty" })
  password: string

  @Column()
  @IsNotEmpty({ message: "First name must not be empty" })
  firstName: string

  @Column()
  @IsNotEmpty({ message: "Last name must not be empty" })
  lastName: string

  @CreateDateColumn()
  dateCreated: Date

  @UpdateDateColumn()
  lastUpdated: Date
}
