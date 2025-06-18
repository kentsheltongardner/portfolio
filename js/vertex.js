export default class Vertex {
    x;
    y;
    connections = new Array();
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
