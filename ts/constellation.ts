import BigStar      from './big_star.js'
import Connection   from './connection.js'

export default class Constellation {
    big_stars:      BigStar[]
    connections:    Connection[]
    period:         number

    constructor(big_stars: BigStar[], connections: Connection[], period: number) {
        this.big_stars      = big_stars
        this.connections    = connections
        this.period         = period
    }
}