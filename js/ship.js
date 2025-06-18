const ACCELERATION_FORWARD = 60.0;
const ACCELERATION_BACKWARD = 30.0;
const ACCELERATION_LATERAL = 30.0;
const SEEK_DAMPING_FACTOR = 0.93;
const TAU = Math.PI * 2;
const THETA_FORWARD = 0.0;
const THETA_RIGHT = 0.25 * TAU;
const THETA_BACKWARD = 0.5 * TAU;
const THETA_LEFT = 0.75 * TAU;
const DAMPING_FACTOR = 0.95;
const MINIMUM_SEEK_DISTANCE = 200.0;
const MINIMUM_SEEK_DISTANCE_SQUARED = MINIMUM_SEEK_DISTANCE * MINIMUM_SEEK_DISTANCE;
export default class Ship {
    x = 0.0;
    y = 0.0;
    target_x = 0.0;
    target_y = 0.0;
    vx = 0.0;
    vy = 0.0;
    orientation = 0.0;
    seeking = false;
    accelerate(theta, acceleration) {
        this.vx += Math.cos(theta) * acceleration;
        this.vy += Math.sin(theta) * acceleration;
    }
    distance_squared(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy;
    }
    damp() {
        if (this.seeking) {
            this.vx *= SEEK_DAMPING_FACTOR;
            this.vy *= SEEK_DAMPING_FACTOR;
        }
        else {
            this.vx *= DAMPING_FACTOR;
            this.vy *= DAMPING_FACTOR;
        }
    }
    move(delta_time) {
        this.x += this.vx * delta_time;
        this.y += this.vy * delta_time;
    }
    seek(delta_time) {
        this.orientation = Math.atan2(this.target_y - this.y, this.target_x - this.x);
        const dx = this.target_x - this.x;
        const dy = this.target_y - this.y;
        const distance_squared = dx * dx + dy * dy;
        const distance = Math.sqrt(distance_squared);
        const acceleration = 0.1 * distance;
        this.accelerate(this.orientation + THETA_FORWARD, acceleration);
        this.damp();
        this.move(delta_time);
        if (!this.can_seek(this.target_x, this.target_y)) {
            this.seeking = false;
        }
    }
    fly(delta_time, forward, backward, left, right) {
        if (forward)
            this.accelerate(this.orientation + THETA_FORWARD, ACCELERATION_FORWARD);
        if (right)
            this.accelerate(this.orientation + THETA_RIGHT, ACCELERATION_LATERAL);
        if (backward)
            this.accelerate(this.orientation + THETA_BACKWARD, ACCELERATION_BACKWARD);
        if (left)
            this.accelerate(this.orientation + THETA_LEFT, ACCELERATION_LATERAL);
        this.damp();
        this.move(delta_time);
    }
    can_seek(target_x, target_y) {
        const dx = target_x - this.x;
        const dy = target_y - this.y;
        const distance_squared = dx * dx + dy * dy;
        return distance_squared >= MINIMUM_SEEK_DISTANCE_SQUARED;
    }
    begin_seeking(target_x, target_y) {
        this.target_x = target_x;
        this.target_y = target_y;
        this.seeking = true;
    }
    attempt_seek(id) {
        const tag = document.getElementById(id);
        const target_x = Number.parseInt(tag.dataset['x']);
        const target_y = Number.parseInt(tag.dataset['y']);
        if (this.can_seek(target_x, target_y)) {
            this.begin_seeking(target_x, target_y);
        }
    }
}
