export default class Bullet {
    static readonly SPEED       = 1000.0
    static readonly LIFETIME    = 0.75
    static readonly RADIUS      = 2.0

    x:              number
    y:              number
    vx:             number
    vy:             number
    creation_time:  number

    constructor(x: number, y: number, vx: number, vy: number, creation_time: number) {
        this.x              = x
        this.y              = y
        this.vx             = vx
        this.vy             = vy
        this.creation_time  = creation_time
    }

    update(delta_time: number) {
        this.x += delta_time * this.vx
        this.y += delta_time * this.vy
    }
}