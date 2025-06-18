export default class Tag {
    element:    HTMLElement
    x:          number
    y:          number
    constructor(element: HTMLElement, x: number, y: number) {
        this.element    = element
        this.x          = x
        this.y          = y
    }
}