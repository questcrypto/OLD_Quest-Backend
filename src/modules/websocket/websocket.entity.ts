import { Entity, PrimaryColumn, Column } from 'typeorm'

@Entity()
export class Sockets {
  @PrimaryColumn()
  clientId: string

  @Column()
  user: string
}
