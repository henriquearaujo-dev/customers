import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/User';
import { IsEmail } from 'class-validator';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  @IsEmail()
  email!: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
