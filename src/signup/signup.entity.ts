import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DateTime } from 'luxon';

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

  @Column({ type: 'timestamp with time zone', name: 'expires_at' })
  expiresAt: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', name: 'updated_at' })
  updatedAt: Date;

  get isExpired(): boolean {
    return this.expiresAt < new Date();
  }

  get timeRemaining() {
    const diff = DateTime.fromJSDate(this.expiresAt)
      .diff(DateTime.fromJSDate(new Date()), ['minutes', 'seconds'])
      .toObject();

    return {
      minutes: diff.minutes,
      seconds: diff.seconds,
    };
  }
}
