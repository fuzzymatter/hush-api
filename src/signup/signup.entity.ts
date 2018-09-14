import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
}
