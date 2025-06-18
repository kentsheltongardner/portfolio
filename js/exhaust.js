const BASE_TIME_TO_LIVE = 0.4;
const TIME_TO_LIVE_VARIANCE = 0.15;
const SPREAD = 0.1;
export default class Exhaust {
    x;
    y;
    vx;
    vy;
    creation_time;
    time_to_live;
    constructor(x, y, vx, vy, creation_time) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.creation_time = creation_time;
        this.time_to_live = BASE_TIME_TO_LIVE + Math.random() * TIME_TO_LIVE_VARIANCE - TIME_TO_LIVE_VARIANCE / 2;
    }
    update(delta_time) {
        this.x += delta_time * this.vx;
        this.y += delta_time * this.vy;
    }
}
