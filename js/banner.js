export default class Tag {
    x;
    y;
    element;
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.element = document.getElementById(id);
    }
    reposition(camera) {
        const viewport_position = camera.world_to_viewport(this.x, this.y);
        this.element.style.transform = `translate(calc(${viewport_position.x}px - 50%), calc(${viewport_position.y}px - 50%))`;
    }
}
