import BigStar          from './big_star.js'
import BlackHole        from './black_hole.js'
import Bullet           from './bullet.js'
import Camera           from './camera.js'
import ColorStop        from './color_stop.js'
import Connection       from './connection.js'
import Constellation    from './constellation.js'
import Exhaust          from './exhaust.js'
import Planet           from './planet.js'
import Point            from './point.js'
import Ship             from './ship.js'
import Star             from './star.js'
import Sun              from './sun.js'
import Tag              from './tag.js'

const STAR_DENSITY  = 0.001
const TAU           = Math.PI * 2

export default class Engine {
    key_press_w     = false
    key_press_a     = false
    key_press_s     = false
    key_press_d     = false
    key_press_up    = false
    key_press_left  = false
    key_press_down  = false
    key_press_right = false

    canvas          = <HTMLCanvasElement>document.getElementById('main-canvas')
    context         = this.canvas.getContext('2d')!
    tags            = new Array<Tag>()
    tag_map         = new Map<string, Tag>()

    bullets         = new Array<Bullet>()
    exhaust         = new Array<Exhaust>()
    camera          = new Camera()
    ship            = new Ship()
    suns            = new Array<Sun>
    stars           = new Array<Star>
    constellations  = new Array<Constellation>()
    planets         = new Array<Planet>
    black_hole      = new BlackHole(-1900.0, 1400.0)
    
    last_time       = 0.0

    constructor() {
        this.load_tags()
        this.load_tag_map()
        this.reposition_tags()

        this.create_constellations()
        this.generate_stars()
        this.create_suns()
        this.create_planets()
        this.resize_canvas()

        this.add_event_listeners()
        this.loop(0)
    }

    create_constellations() {
        const create_constellation = (
            base_x:             number, 
            base_y:             number, 
            center_x:           number, 
            center_y:           number, 
            scale:              number,
            big_star_data:      number[][],
            connection_data:    number[][],
            period:             number
        ) => {
            const x = (x: number) => { return base_x + (x - center_x) * scale }
            const y = (y: number) => { return base_y + (y - center_y) * scale }

            const big_stars     = new Array<BigStar>()
            const connections   = new Array<Connection>()

            for (const data of big_star_data) {
                big_stars.push(new BigStar(x(data[0]), y(data[1]), data[2], data[3]))
            }
            for (const data of connection_data) {
                connections.push(new Connection(big_stars[data[0]], big_stars[data[1]]))
            }
            return new Constellation(big_stars, connections, period)
        }

        const orion_big_star_data = [
            [368, 462, 10.0,    0.95    ],
            [414, 904, 7.0,     0.9     ],
            [460, 706, 8.0,     0.875   ],
            [490, 686, 6.0,     0.92    ],
            [516, 664, 7.5,     0.95    ],
            [562, 490, 6.0,     0.88    ],
            [628, 868, 11.0,    0.86    ]
        ]
        const orion_connection_data = [
            [0, 2],
            [1, 2],
            [2, 3],
            [3, 4],
            [4, 5],
            [4, 6]
        ]
        const orion = create_constellation(900.0, -2100.0, 490, 686, 1.0, orion_big_star_data, orion_connection_data, 2.0)

        const big_dipper_big_star_data = [
            [132, 132, 10.0,    0.7     ],
            [342, 180, 7.0,     0.75    ],
            [428, 290, 8.0,     0.675   ],
            [524, 558, 6.0,     0.72    ],
            [548, 416, 7.5,     0.75    ],
            [752, 662, 6.0,     0.68    ],
            [854, 524, 11.0,    0.66    ]
        ]
        const big_dipper_connection_data = [
            [0, 1],
            [1, 2],
            [2, 4],
            [3, 4],
            [3, 5],
            [4, 6],
            [5, 6]
        ]
        const big_dipper = create_constellation(-200.0, -2500.0, 512, 410, 0.8, big_dipper_big_star_data, big_dipper_connection_data, 1.0)

        const cassiopeia_big_star_data = [
            [162, 594, 10.0,    0.82    ],
            [408, 668, 7.0,     0.86    ],
            [560, 538, 8.0,     0.87    ],
            [794, 620, 6.0,     0.85    ],
            [876, 354, 7.5,     0.83    ]
        ]
        const cassiopeia_connection_data = [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 4]
        ]
        const cassiopeia = create_constellation(400.0, -1500.0, 500, 500, 0.9, cassiopeia_big_star_data, cassiopeia_connection_data, 1.5)

        this.constellations.push(orion)
        this.constellations.push(big_dipper)
        this.constellations.push(cassiopeia)
    }

    load_tags() {
        const elements = document.querySelectorAll<HTMLElement>('.tag')
        for (const element of elements) {
            element.style.display   = 'flex'
            const x                 = Number.parseInt(element.dataset.x!)
            const y                 = Number.parseInt(element.dataset.y!)
            const tag               = new Tag(element, x, y)
            this.tags.push(tag)
        }
    }
    load_tag_map() {
        for (const tag of this.tags) {
            this.tag_map.set(tag.element.id, tag)
        }
    }
    reposition_tags() {
        for (const tag of this.tags) {
            const viewport_position     = this.camera.world_to_viewport(tag.x, tag.y)
            const x                     = viewport_position.x
            const y                     = viewport_position.y
            tag.element.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`
        }
    }

    generate_stars() {
        const star_count = Math.floor(window.innerWidth * window.innerHeight * STAR_DENSITY)
        this.stars = new Array<Star>(star_count)
        for (let i = 0; i < star_count; i++) {
            this.stars[i] = new Star()
        }
    }
    create_suns() {
        const color_stops_1 = [
            new ColorStop(0.0, '#ffffff'),
            new ColorStop(0.2, '#ffffff'),
            new ColorStop(0.4, '#ffff00'),
            new ColorStop(0.5, '#ff8000'),
            new ColorStop(0.6, '#ff400080'),
            new ColorStop(1.0, '#f000'),
        ]
        const color_stops_2 = [
            new ColorStop(0.0, '#ffffff'),
            new ColorStop(0.2, '#ffffff'),
            new ColorStop(0.4, '#ff00ff'),
            new ColorStop(0.5, '#8000ff'),
            new ColorStop(0.6, '#4000ff80'),
            new ColorStop(1.0, '#00f0'),
        ]
        this.suns.push(new Sun(-300.0, -500.0, 200.0, color_stops_1))
        this.suns.push(new Sun(2300.0, 2200.0, 50.0, color_stops_2))
    }
    create_planets() {
        const dwarf         = this.suns[1]
        const color_stops   = [
            new ColorStop(0.0,  '#607090'),
            new ColorStop(0.45, '#504050'),
            new ColorStop(0.65, '#201000'),
            new ColorStop(0.8,  '#100800'),
            new ColorStop(0.95, '#080400'),
            new ColorStop(1.0,  '#0000')
        ]

        this.planets.push(new Planet(15.0,   dwarf,  1.2,    150.0,  0.15,   color_stops, this.tag_map.get('tower')!))
        this.planets.push(new Planet(12.0,   dwarf,  4.3,    225.0,  0.06,   color_stops, this.tag_map.get('snap')!))
        this.planets.push(new Planet(23.0,   dwarf,  3.0,    350.0,  -0.025, color_stops, this.tag_map.get('scrawl')!))
        this.planets.push(new Planet(9.0,    dwarf,  5.9,    80.0,   0.125,  color_stops, this.tag_map.get('merger')!))
    }

    add_event_listeners() {
        window.addEventListener('mousedown',    () => { this.mouse_down() })
        window.addEventListener('mousemove',    e => { this.mouse_move(e) })
        window.addEventListener('keydown',      e => { this.key_down(e) })
        window.addEventListener('keyup',        e => { this.key_up(e) })
        window.addEventListener('contextmenu',  e => {
            e.preventDefault()
        })

        document.getElementById('projects-button')!.addEventListener('mousedown', () => {
            this.ship.attempt_seek('projects-tag')
        })
        document.getElementById('home-button')!.addEventListener('mousedown', () => {
            this.ship.attempt_seek('home-tag')
        })
        document.getElementById('contact-button')!.addEventListener('mousedown', () => {
            this.ship.attempt_seek('contact-tag')
        })
        document.getElementById('controls-button')!.addEventListener('mousedown', () => {
            this.ship.attempt_seek('controls-tag')
        })

        window.addEventListener('resize', () => {
            this.generate_stars()
            this.resize_canvas()
        })
    }
    mouse_down() {
        if (this.ship.seeking) return

        const vx = this.ship.vx + Math.cos(this.ship.orientation) * Bullet.SPEED
        const vy = this.ship.vy + Math.sin(this.ship.orientation) * Bullet.SPEED
        const bullet = new Bullet(this.ship.x, this.ship.y, vx, vy, this.last_time)
        this.bullets.push(bullet)
    }
    mouse_move(e: MouseEvent) {
        if (this.ship.seeking) return

        const world_position    = this.camera.viewport_to_world(e.clientX, e.clientY)
        const dy                = world_position.y - this.ship.y
        const dx                = world_position.x - this.ship.x
        this.ship.orientation   = Math.atan2(dy, dx)
    }
    key_down(e: KeyboardEvent) {
        switch (e.code) {
            case 'KeyW':        this.key_press_w        = true;     break
            case 'KeyA':        this.key_press_a        = true;     break
            case 'KeyS':        this.key_press_s        = true;     break
            case 'KeyD':        this.key_press_d        = true;     break

            case 'ArrowUp':     this.key_press_up       = true;     break
            case 'ArrowLeft':   this.key_press_left     = true;     break
            case 'ArrowDown':   this.key_press_down     = true;     break
            case 'ArrowRight':  this.key_press_right    = true;     break
        }
    }
    key_up(e: KeyboardEvent) {
        switch (e.code) {
            case 'KeyW':        this.key_press_w        = false;    break
            case 'KeyA':        this.key_press_a        = false;    break
            case 'KeyS':        this.key_press_s        = false;    break
            case 'KeyD':        this.key_press_d        = false;    break

            case 'ArrowUp':     this.key_press_up       = false;    break
            case 'ArrowLeft':   this.key_press_left     = false;    break
            case 'ArrowDown':   this.key_press_down     = false;    break
            case 'ArrowRight':  this.key_press_right    = false;    break
        }
    }


    loop(time_ms: number) {
        const time          = time_ms * 0.001
        const delta_time    = time - this.last_time
        this.last_time      = time
        this.update(delta_time)

        performance.mark("render-start")
        this.render(time)
        performance.mark("render-end")
        performance.measure("Render Frame", "render-start", "render-end")

        requestAnimationFrame(time_ms => { this.loop(time_ms) })
    }

    update(delta_time: number) {
        const forward   = this.key_press_w || this.key_press_up
        const backward  = this.key_press_s || this.key_press_down
        const left      = this.key_press_a || this.key_press_left
        const right     = this.key_press_d || this.key_press_right

        if (forward || this.ship.seeking) {
            this.create_exhaust(delta_time)
        }

        if (this.ship.seeking) {
            this.ship.seek(delta_time)
        } else {
            this.ship.fly(delta_time, forward, backward, left, right)
        }
        for (const bullet of this.bullets) {
            bullet.update(delta_time)
        }
        for (const exhaust of this.exhaust) {
            exhaust.update(delta_time)
        }
        for (const planet of this.planets) {
            planet.update(delta_time)
        }

        this.remove_dead_bullets()
        this.remove_dead_exhaust()
        this.reposition_tags()
        this.camera.track(this.ship.x, this.ship.y)
    }

    create_exhaust(delta_time: number) {
        const count = Math.round(Math.random() * delta_time * 200)
        for (let i = 0; i < count; i++) {
            const theta     = this.ship.orientation + Math.PI + (Math.random() - 0.5) * Exhaust.SPREAD
            const speed     = Exhaust.SPEED_MIN + Math.random() * (Exhaust.SPEED_MAX - Exhaust.SPEED_MIN)
            const cos       = Math.cos(theta)
            const sin       = Math.sin(theta)
            const vx        = cos * speed
            const vy        = sin * speed
            const variance  = Math.random() * 7.0
            const x         = this.ship.x + cos * variance
            const y         = this.ship.y + sin * variance
            const exhaust   = new Exhaust(x, y, vx, vy, this.last_time)
            this.exhaust.push(exhaust)
        }
    }
    remove_dead_exhaust() {
        for (let i = this.exhaust.length - 1; i >= 0; i--) {
            const exhaust = this.exhaust[i]
            if (this.last_time - exhaust.creation_time > Exhaust.TIME_TO_LIVE) {
                this.exhaust.splice(i, 1)
            }
        }
    }
    remove_dead_bullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i]
            if (this.last_time - bullet.creation_time > Bullet.LIFETIME) {
                this.bullets.splice(i, 1)
            }
        }
    }

    resize_canvas() {
        this.canvas.width   = window.innerWidth
        this.canvas.height  = window.innerHeight
    }

    render(time: number) {
        //this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.context.fillStyle      = '#000008a0'
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
        const black_hole_position   = this.camera.world_to_viewport(this.black_hole.x, this.black_hole.y)
        const black_hole_x          = black_hole_position.x
        const black_hole_y          = black_hole_position.y
        const center_x              = window.innerWidth / 2.0
        const center_y              = window.innerHeight / 2.0
        const distant_x             = center_x + (black_hole_x - center_x) * 0.5
        const distant_y             = center_y + (black_hole_y - center_y) * 0.5

        this.render_black_hole(distant_x, distant_y)
        this.render_stars(distant_x, distant_y)

        this.precompute_constellations(distant_x, distant_y)
        this.render_constellations(time)

        this.render_suns(distant_x, distant_y)
        this.render_planets(distant_x, distant_y)
        this.render_bullets(distant_x, distant_y)
        this.render_exhaust_clouds(distant_x, distant_y)
        this.render_ship(distant_x, distant_y)
    }
    mod(n: number, m: number) {
        return ((n % m) + m) % m
    }
    render_position(x: number, y: number, black_hole_x: number, black_hole_y: number, distance: number) {
        const viewport_position = this.camera.world_to_viewport(x, y)
        const center_x          = window.innerWidth / 2.0
        const center_y          = window.innerHeight / 2.0
        const distant_x         = center_x + (viewport_position.x - center_x) * distance
        const distant_y         = center_y + (viewport_position.y - center_y) * distance
        const position          = this.distorted_position(distant_x, distant_y, black_hole_x, black_hole_y)
        return new Point(position.x, position.y)
    }
    render_stars(black_hole_x: number, black_hole_y: number) {
        this.context.fillStyle = 'white'
        this.context.beginPath()
        for (const star of this.stars) {
            const base_x    = this.canvas.width * star.x - star.scroll_speed * this.camera.x
            const base_y    = this.canvas.height * star.y - star.scroll_speed * this.camera.y
            const mod_x     = this.mod(base_x, this.canvas.width)
            const mod_y     = this.mod(base_y, this.canvas.height)
            const radius    = star.radius * (0.75 + Math.random() * 0.25)

            const position  = this.distorted_position(mod_x, mod_y, black_hole_x, black_hole_y)
            const x         = position.x
            const y         = position.y

            this.context.moveTo(x, y)
            this.context.arc(x, y, radius, 0, TAU)
        }
        this.context.fill()
    }

    precompute_constellations(black_hole_x: number, black_hole_y: number) {
        for (const constellation of this.constellations) {
            for (const big_star of constellation.big_stars) {
                this.precompute_big_star(big_star, black_hole_x, black_hole_y)
            }
        }
    }
    precompute_big_star(big_star: BigStar, black_hole_x: number, black_hole_y: number) {
        const position      = this.render_position(big_star.x, big_star.y, black_hole_x, black_hole_y, big_star.distance)
        big_star.render_x   = position.x
        big_star.render_y   = position.y
    }

    render_constellations(time: number) {
        for (const constellation of this.constellations) {
            const position = constellation.period * time
            this.render_connections(constellation.connections, position)
            this.render_big_stars(constellation.big_stars, position)
        }
    }
    render_connections(connections: Connection[], position: number) {
        const alpha = 0.25 * Math.pow((Math.sin(position) + 1) / 2, 4)
        this.context.strokeStyle = `rgba(255, 255, 255, ${alpha})`
        this.context.beginPath()
        for (const connection of connections) {
            const a = connection.big_star_a
            const b = connection.big_star_b
            this.context.moveTo(a.render_x, a.render_y)
            this.context.lineTo(b.render_x, b.render_y)
        }
        this.context.stroke()
    }
    render_big_stars(big_stars: BigStar[], position: number) {
        const alpha = 0.5 * Math.pow((Math.sin(position) + 1) / 2, 8)
        for (const big_star of big_stars) {
            this.render_big_star(big_star, alpha)
        }
    }
    render_big_star(big_star: BigStar, alpha: number) {
        const x         = big_star.render_x
        const y         = big_star.render_y
        const gradient  = this.context.createRadialGradient(x, y, 0, x, y, big_star.radius)
        gradient.addColorStop(0.0, 'white')
        gradient.addColorStop(0.2, 'white')
        gradient.addColorStop(0.25, `rgba(255, 255, 255, ${alpha})`)
        gradient.addColorStop(1.0, '#fff0')

        this.context.fillStyle = gradient
        this.context.fillRect(x - big_star.radius, y - big_star.radius, big_star.diameter, big_star.diameter)
    }
    render_bullets(black_hole_x: number, black_hole_y: number) {
        this.context.fillStyle = 'white'
        this.context.beginPath()
        for (const bullet of this.bullets) {
            const viewport_position = this.camera.world_to_viewport(bullet.x, bullet.y)
            const position  = this.distorted_position(viewport_position.x, viewport_position.y, black_hole_x, black_hole_y)
            const x         = position.x
            const y         = position.y
            this.context.moveTo(x, y)
            this.context.arc(x, y, 2, 0, TAU)
        }
        this.context.fill()
    }
    render_exhaust_clouds(black_hole_x: number, black_hole_y: number) {
        for (const exhaust of this.exhaust) {
            const viewport_position = this.camera.world_to_viewport(exhaust.x, exhaust.y)
            const position          = this.distorted_position(viewport_position.x, viewport_position.y, black_hole_x, black_hole_y)
            const x                 = position.x
            const y                 = position.y
            const scalar            = (this.last_time - exhaust.creation_time) / Exhaust.TIME_TO_LIVE
            const radius            = (Exhaust.MIN_RADIUS + (Exhaust.MAX_RADIUS - Exhaust.MIN_RADIUS) * scalar)
            const r                 = 1.0 - scalar
            const g                 = Math.pow(r, 2)
            const b                 = Math.pow(g, 4)

            this.context.fillStyle = `rgba(${Math.floor(256 * r)}, ${Math.floor(256 * g)}, ${Math.floor(256 * b)}, ${r})`
            this.context.beginPath()
            this.context.moveTo(x, y)
            this.context.arc(x, y, radius, 0, TAU)
            this.context.fill()
        }

    }
    render_suns(black_hole_x: number, black_hole_y: number) {
        for (const sun of this.suns) {
            this.render_sun(sun, black_hole_x, black_hole_y)
        }
    }
    render_sun(sun: Sun, black_hole_x: number, black_hole_y: number) {
        const position  = this.render_position(sun.x, sun.y, black_hole_x, black_hole_y, 0.9)
        const x         = position.x
        const y         = position.y

        const gradient = this.context.createRadialGradient(x, y, 0, x, y, sun.radius)
        for (const color_stop of sun.color_stops) {
            gradient.addColorStop(color_stop.position, color_stop.color)
        }

        this.context.fillStyle = gradient
        this.context.fillRect(x - sun.radius, y - sun.radius, sun.diameter, sun.diameter)
    }
    render_planets(black_hole_x: number, black_hole_y: number) {
        for (const planet of this.planets) {
            this.render_planet(planet, black_hole_x, black_hole_y)
        }
    }
    render_planet(planet: Planet, black_hole_x: number, black_hole_y: number) {
        const position  = this.render_position(planet.x, planet.y, black_hole_x, black_hole_y, 0.9)
        const x         = position.x
        const y         = position.y

        const dx        = planet.sun.x - planet.x
        const dy        = planet.sun.y - planet.y
        const distance  = Math.hypot(dx, dy)
        const offset_x  = x + (dx / distance) * planet.radius * 0.5
        const offset_y  = y + (dy / distance) * planet.radius * 0.5

        const gradient  = this.context.createRadialGradient(offset_x, offset_y, 0.0, 
                                                            x, y, planet.radius)
        for (const color_stop of planet.color_stops) {
            gradient.addColorStop(color_stop.position, color_stop.color)
        }

        this.context.fillStyle = gradient
        this.context.fillRect(x - planet.radius, y - planet.radius, planet.diameter, planet.diameter)

    }
    render_ship(black_hole_x: number, black_hole_y: number) {
        const viewport_position = this.camera.world_to_viewport(this.ship.x, this.ship.y)

        const position  = this.distorted_position(viewport_position.x, viewport_position.y, black_hole_x, black_hole_y)
        const x         = position.x
        const y         = position.y

        const theta_0   = this.ship.orientation
        const theta_1   = theta_0 + Ship.SIDE_ANGLE
        const theta_2   = theta_0 + Math.PI
        const theta_3   = theta_0 - Ship.SIDE_ANGLE

        const x_0       = x + Math.cos(theta_0) * Ship.NOSE_LENGTH
        const x_1       = x + Math.cos(theta_1) * Ship.SIDE_LENGTH
        const x_2       = x + Math.cos(theta_2) * Ship.REAR_LENGTH
        const x_3       = x + Math.cos(theta_3) * Ship.SIDE_LENGTH

        const y_0       = y + Math.sin(theta_0) * Ship.NOSE_LENGTH
        const y_1       = y + Math.sin(theta_1) * Ship.SIDE_LENGTH
        const y_2       = y + Math.sin(theta_2) * Ship.REAR_LENGTH
        const y_3       = y + Math.sin(theta_3) * Ship.SIDE_LENGTH

        this.context.fillStyle = '#111'
        this.context.strokeStyle = '#fff8'

        this.context.beginPath()
        this.context.moveTo(x_0, y_0)
        this.context.lineTo(x_1, y_1)
        this.context.lineTo(x_2, y_2)
        this.context.lineTo(x_3, y_3)
        this.context.closePath()
        this.context.fill()
        this.context.stroke()
    }
    render_black_hole(black_hole_x: number, black_hole_y: number) {

        const gradient = this.context.createRadialGradient(black_hole_x, black_hole_y, 0, black_hole_x, black_hole_y, BlackHole.RADIUS)
        gradient.addColorStop(0.0, 'black')
        gradient.addColorStop(0.75, '#080000')
        gradient.addColorStop(0.8, '#08f1')
        gradient.addColorStop(1.0, '#fff0')

        this.context.fillStyle = gradient
        this.context.fillRect(black_hole_x - BlackHole.RADIUS, black_hole_y - BlackHole.RADIUS, BlackHole.DIAMETER, BlackHole.DIAMETER)
    }
    distorted_position(x: number, y: number, black_hole_x: number, black_hole_y: number) {
        const dx        = x - black_hole_x
        const dy        = y - black_hole_y
        const distance_squared = dx * dx + dy * dy

        const scalar = BlackHole.RADIUS * BlackHole.RADIUS / distance_squared
        const distorted_x = x + dx * scalar
        const distorted_y = y + dy * scalar
        return new Point(distorted_x, distorted_y)
    }
}