export default class BigStar {
    x;
    y;
    radius;
    diameter;
    distance;
    render_x = 0.0;
    render_y = 0.0;
    constructor(x, y, radius, distance) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.distance = distance;
        this.diameter = radius * 2.0;
    }
}
