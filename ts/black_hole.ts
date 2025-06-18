export default class BlackHole {
    static readonly RADIUS = 100.0
    static readonly DIAMETER = BlackHole.RADIUS * 2
    
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
}