export default class BigStar {
    x:          number
    y:          number
    radius:     number
    diameter:   number
    distance:   number
    render_x    = 0.0
    render_y    = 0.0
    constructor(x: number, y: number, radius: number, distance: number) {
        this.x          = x
        this.y          = y
        this.radius     = radius
        this.distance   = distance
        this.diameter   = radius * 2.0
    }
}