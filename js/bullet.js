export default class Bullet {
    static SPEED = 1000.0;
    static LIFETIME = 0.75;
    static RADIUS = 2.0;
    x;
    y;
    vx;
    vy;
    creation_time;
    constructor(x, y, vx, vy, creation_time) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.creation_time = creation_time;
    }
    update(delta_time) {
        this.x += delta_time * this.vx;
        this.y += delta_time * this.vy;
    }
}
