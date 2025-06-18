const SCROLL_SPEED_VARIANCE = 0.5
const RADIUS_SCALAR         = 2
const DOWN_SCALING_POWER    = 6

export default class Star {
    x:              number
    y:              number
    scroll_speed:   number
    radius:         number
    constructor() {
        this.x              = Math.random()
        this.y              = Math.random()
        this.scroll_speed   = Math.pow(Math.random(), DOWN_SCALING_POWER) * 0.75
        this.radius         = this.scroll_speed * (RADIUS_SCALAR + (Math.random() * SCROLL_SPEED_VARIANCE - SCROLL_SPEED_VARIANCE / 2))
    }
}