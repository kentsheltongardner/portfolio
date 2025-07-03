const ACCELERATION = 3000.0;
const DAMPING_FACTOR = 5.0;
export default class Enemy {
    static RADIUS = 20.0;
    x;
    y;
    vx = 0;
    vy = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    navigate(ship, delta_time) {
        const dx = ship.x - this.x;
        const dy = ship.y - this.y;
        const theta = Math.atan2(dy, dx);
        this.vx += Math.cos(theta) * ACCELERATION * delta_time;
        this.vy += Math.sin(theta) * ACCELERATION * delta_time;
        this.vx -= this.vx * DAMPING_FACTOR * delta_time;
        this.vy -= this.vy * DAMPING_FACTOR * delta_time;
        this.x += this.vx * delta_time;
        this.y += this.vy * delta_time;
    }
}
