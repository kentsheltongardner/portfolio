import BigStar from './big_star.js'

export default class Connection {
    big_star_a: BigStar
    big_star_b: BigStar
    constructor(big_star_a: BigStar, big_star_b: BigStar) {
        this.big_star_a = big_star_a
        this.big_star_b = big_star_b
    }
}