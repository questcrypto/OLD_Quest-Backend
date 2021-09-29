import { ApiProperty } from '@nestjs/swagger'
import { NotificationType } from './notification.interface'
export type Uuid = string

export class GetNotificationsResponse {
  @ApiProperty()
  id: Uuid

  @ApiProperty()
  receiver: string

  @ApiProperty()
  message: string

  @ApiProperty()
  type: NotificationType
}