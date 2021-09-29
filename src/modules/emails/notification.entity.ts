import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { CreatedModified } from '../../helper/helper'
import {NotificationType,Notification } from './notification.interface'

@Entity()
export class Notifications extends CreatedModified implements Notification {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  receiver: string

  @Column()
  message: string

  @Column()
  type: NotificationType
}
