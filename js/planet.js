export default class Planet {
    x;
    y;
    radius;
    diameter;
    sun;
    theta;
    distance;
    omega;
    color_stops;
    tag;
    constructor(radius, sun, theta, distance, omega, color_stops, tag) {
        this.radius = radius;
        this.sun = sun;
        this.theta = theta;
        this.distance = distance;
        this.omega = omega;
        this.color_stops = color_stops;
        this.tag = tag;
        this.x = sun.x + Math.cos(theta) * distance;
        this.y = sun.y + Math.sin(theta) * distance;
        this.diameter = radius * 2.0;
    }
    update(delta_time) {
        this.theta += delta_time * this.omega;
        this.x = this.sun.x + Math.cos(this.theta) * this.distance;
        this.y = this.sun.y + Math.sin(this.theta) * this.distance;
        this.tag.x = this.x;
        this.tag.y = this.y;
    }
}
