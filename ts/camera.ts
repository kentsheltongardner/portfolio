import Point from './point.js'

export default class Camera {
    x = 0.0
    y = 0.0

    viewport_to_world(viewport_x: number, viewport_y: number) {
        const world_x = this.x + (viewport_x - window.innerWidth / 2)
        const world_y = this.y + (viewport_y - window.innerHeight / 2)
        return new Point(world_x, world_y)
    }
    world_to_viewport(world_x: number, world_y: number) {
        const viewport_x = world_x - this.x + window.innerWidth / 2
        const viewport_y = world_y - this.y + window.innerHeight / 2
        return new Point(viewport_x, viewport_y)
    }
}