export default class Exhaust {
    static SPEED_MIN = 120.0;
    static SPEED_MAX = 150.0;
    static SPREAD = 0.3;
    static MIN_RADIUS = 2;
    static MAX_RADIUS = 10;
    static TIME_TO_LIVE = 0.4;
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
