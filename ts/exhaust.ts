export default class Exhaust {
    static readonly SPEED_MIN       = 120.0
    static readonly SPEED_MAX       = 150.0
    static readonly SPREAD          = 0.3
    static readonly MIN_RADIUS      = 2
    static readonly MAX_RADIUS      = 10
    static readonly TIME_TO_LIVE    = 0.4

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