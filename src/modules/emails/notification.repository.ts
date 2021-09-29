import { EntityRepository, Repository, getConnection } from 'typeorm'
import { Notifications } from './notification.entity'
import { getSingleBy, getManyBy } from '../../helper/helper'

export async function getNotificationsByRequest(receiver) {
  const sql = `SELECT * from "notifications" WHERE "notifications"."receiver"=$1 ORDER BY "notifications"."CreatedAt" DESC`
  const result = await getConnection().query(sql, [receiver])
  return result
}

export const getNotificationBy = getSingleBy(Notifications)

export const getNotificationsBy = getManyBy(Notifications)

@EntityRepository(Notifications)
export class NotificationRepository extends Repository<Notifications> {}
