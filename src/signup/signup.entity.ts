import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Status {
  Active = 'active',
  Expired = 'expired',
  Complete = 'complete',
}

@Entity('signups')
export class Signup {
  @PrimaryGeneratedColumn('uuid')
  id;

  @Column({ length: 255 })
  email: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 15 })
  code: string;

  @Column({ enum: Status })
  status: string;

  @Column()
  expires_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
