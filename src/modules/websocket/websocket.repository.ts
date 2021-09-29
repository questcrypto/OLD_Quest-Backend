import { EntityRepository, Repository } from 'typeorm'
import { Sockets } from './websocket.entity'
import { getSingleBy } from '../../helper/helper'

export const getClientBy = getSingleBy(Sockets)

@EntityRepository(Sockets)
export class SocketRepository extends Repository<Sockets> {}
