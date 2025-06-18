export default class Sun {
    x;
    y;
    radius;
    diameter;
    color_stops;
    constructor(x, y, radius, color_stops) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.diameter = radius * 2.0;
        this.color_stops = color_stops;
    }
}
