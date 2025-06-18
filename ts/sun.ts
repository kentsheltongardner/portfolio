import ColorStop from './color_stop.js'

export default class Sun {
    x:              number
    y:              number
    radius:         number
    diameter:       number
    color_stops:    Array<ColorStop>

    constructor(x: number, y: number, radius: number, color_stops: Array<ColorStop>) {
        this.x              = x
        this.y              = y
        this.radius         = radius
        this.diameter       = radius * 2.0
        this.color_stops    = color_stops
    }
}