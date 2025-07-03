const ACCELERATION_FORWARD          = 4000.0
const ACCELERATION_BACKWARD         = 2000.0
const ACCELERATION_LATERAL          = 2000.0
const SEEK_DAMPING_FACTOR           = 7.0
const TAU                           = Math.PI * 2
const THETA_FORWARD                 = 0.0
const THETA_RIGHT                   = 0.25  * TAU
const THETA_BACKWARD                = 0.5   * TAU
const THETA_LEFT                    = 0.75  * TAU
const DAMPING_FACTOR                = 3.0
const MINIMUM_SEEK_DISTANCE         = 200.0
const MINIMUM_SEEK_DISTANCE_SQUARED = MINIMUM_SEEK_DISTANCE * MINIMUM_SEEK_DISTANCE

export default class Ship {
    static readonly SIDE_ANGLE  = 2.3
    static readonly SIDE_LENGTH = 30.0
    static readonly NOSE_LENGTH = 30.0
    static readonly REAR_LENGTH = 8.0

    x           = 0.0
    y           = 0.0
    target_x    = 0.0
    target_y    = 0.0
    vx          = 0.0
    vy          = 0.0
    orientation = 0.0
    seeking     = false

    accelerate(theta: number, acceleration: number, delta_time: number) {
        this.vx += Math.cos(theta) * acceleration * delta_time
        this.vy += Math.sin(theta) * acceleration * delta_time
    }
    distance_squared(x: number, y: number) {
        const dx = x - this.x
        const dy = y - this.y
        return dx * dx + dy * dy
    }
    damp(delta_time: number) {
        if (this.seeking) {
            this.vx -= this.vx * SEEK_DAMPING_FACTOR * delta_time
            this.vy -= this.vy * SEEK_DAMPING_FACTOR * delta_time
        } else {
            this.vx -= this.vx * DAMPING_FACTOR * delta_time
            this.vy -= this.vy * DAMPING_FACTOR * delta_time
        }
    }
    move(delta_time: number) {
        this.x += this.vx * delta_time
        this.y += this.vy * delta_time
    }
    seek(delta_time: number) {
        this.orientation        = Math.atan2(this.target_y - this.y, this.target_x - this.x)
        const dx                = this.target_x - this.x
        const dy                = this.target_y - this.y
        const distance_squared  = dx * dx + dy * dy
        const distance          = Math.sqrt(distance_squared)
        const acceleration      = 10.0 * distance

        this.accelerate(this.orientation + THETA_FORWARD, acceleration, delta_time)
        this.damp(delta_time)
        this.move(delta_time)
        if (!this.can_seek(this.target_x, this.target_y)) {
            this.seeking = false
        }
    }
    fly(delta_time: number, forward: boolean, backward: boolean, left: boolean, right: boolean) {
        if (forward)    this.accelerate(this.orientation + THETA_FORWARD, ACCELERATION_FORWARD, delta_time)
        if (right)      this.accelerate(this.orientation + THETA_RIGHT, ACCELERATION_LATERAL, delta_time)
        if (backward)   this.accelerate(this.orientation + THETA_BACKWARD, ACCELERATION_BACKWARD, delta_time)
        if (left)       this.accelerate(this.orientation + THETA_LEFT, ACCELERATION_LATERAL, delta_time)
        this.damp(delta_time)
        this.move(delta_time)
    }

    can_seek(target_x: number, target_y: number) {
        const dx = target_x - this.x
        const dy = target_y - this.y
        const distance_squared = dx * dx + dy * dy
        return distance_squared >= MINIMUM_SEEK_DISTANCE_SQUARED
    }
    begin_seeking(target_x: number, target_y: number) {
        this.target_x   = target_x
        this.target_y   = target_y
        this.seeking    = true
    }
    attempt_seek(id: string) {
        const tag       = document.getElementById(id)!
        const target_x  = Number.parseInt(tag.dataset['x']!)
        const target_y  = Number.parseInt(tag.dataset['y']!)

        if (this.can_seek(target_x, target_y)) {
            this.begin_seeking(target_x, target_y)
        }
    }
    speed() {
        return Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    }
}