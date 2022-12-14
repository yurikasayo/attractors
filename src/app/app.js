import GUI from 'lil-gui';
import * as Stats from 'stats-js';
import { Renderer } from './webgl/renderer';
import { Attractor } from './attractor';
import { Display } from './display';

export class MyApp {
    constructor(canvas, debug) {
        this.canvas = canvas;
        this.debug = debug;

        this.setSize();

        this.renderer = new Renderer(canvas);
        this.attractor = new Attractor(this.renderer, 300000, 20);
        this.display = new Display(this.renderer, this.canvas.width, this.canvas.height);

        this.mouse = {x: null, y: null, dx: 0, dy: 0, down: false, dist: null};
        window.addEventListener('resize', this.resize.bind(this));
        this.canvas.addEventListener('mousemove', e => this.mousemove(e));
        this.canvas.addEventListener('mousedown', this.mousedown.bind(this));
        this.canvas.addEventListener('mouseup', this.mouseup.bind(this));
        this.canvas.addEventListener('wheel', this.mousewheel.bind(this));
        this.canvas.addEventListener('touchmove', e => this.touchmove(e));
        this.canvas.addEventListener('touchend', this.touchend.bind(this));

        this.setGui();
        if (this.debug) {
            this.setStats();
        }

        this.loop();
    }

    setSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = Math.min(window.devicePixelRatio, 2);

        this.canvas.width = Math.floor(width * pixelRatio);
        this.canvas.height = Math.floor(height * pixelRatio);

        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }

    resize() {
        this.setSize();
        this.renderer.resize(this.canvas.width, this.canvas.height);
        this.display.resize(this.canvas.width, this.canvas.height);
    }

    mousemove(e) {
        this.mouse.x = e.x / window.innerWidth;
        this.mouse.y = (window.innerHeight - e.y) / window.innerHeight;
        this.mouse.dx = e.movementX;
        this.mouse.dy = -e.movementY;

        if (this.mouse.down == true) {
            this.display.rotation.dtheta = -Math.PI * this.mouse.dx / window.innerWidth;
            this.display.rotation.dphi = Math.PI * this.mouse.dy / window.innerHeight;
        }
    }

    mousedown() {
        this.mouse.down = true;
    }

    mouseup() {
        this.mouse.down = false;
    }

    mousewheel(e) {
        e.preventDefault();

        this.display.radius += e.deltaY * -0.01;
        this.display.radius = Math.min(Math.max(5, this.display.radius), 50);
    }

    touchmove(e) {
        e.preventDefault();
        const touches = e.touches;

        if (touches.length == 1) {
            const x = touches[0].pageX;
            const y = window.innerHeight - touches[0].pageY;
            
            if (this.mouse.x) {
                this.mouse.dx = x - this.mouse.x;
                this.mouse.dy = y - this.mouse.y;
                this.mouse.x = x;
                this.mouse.y = y;
    
                this.display.rotation.dtheta = -Math.PI * this.mouse.dx / window.innerWidth;
                this.display.rotation.dphi = Math.PI * this.mouse.dy / window.innerHeight;
            } else {
                this.mouse.x = x;
                this.mouse.y = y;
            }
        } else if (touches.length == 2) {
            const x1 = touches[0].pageX;
            const y1 = window.innerHeight - touches[0].pageY;
            const x2 = touches[1].pageX;
            const y2 = window.innerHeight - touches[1].pageY;
            const dist = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            
            if (this.mouse.dist) {
                this.display.radius += (this.mouse.dist - dist) * 0.02;
                this.display.radius = Math.min(Math.max(5, this.display.radius), 50);
                this.mouse.dist = dist;
            } else {
                this.mouse.dist = dist;
            }
        }
    }

    touchend() {
        this.mouse.x = null;
        this.mouse.y = null;
        this.mouse.dist = null;
    }

    loop() {
        requestAnimationFrame(this.loop.bind(this));

        if (this.debug) {
            this.stats.end();
            this.stats.begin();
        }
        this.attractor.render(); 
        this.display.updateCamera();
        this.display.render(this.attractor.system.points);
    }

    setGui() {
        this.gui = new GUI();
        this.gui.add(this.attractor.param, "mode", { thomas: 0, lorenz: 1, dadras: 2, halvorsen: 3, arneodo: 4 });
        this.gui.add(this.attractor.param, "dt").min(0).max(1).step(0.01);
        this.gui.add(this.attractor.param, "param1").min(0).max(1).step(0.01);
        this.gui.add(this.attractor.param, "param2").min(0).max(1).step(0.01);
        this.gui.add(this.attractor.param, "param3").min(0).max(1).step(0.01);
        this.gui.add(this.attractor.param, "param4").min(0).max(1).step(0.01);
        this.gui.add(this.attractor.param, "param5").min(0).max(1).step(0.01);
        this.gui.add(this.attractor.param, "reset");
    }

    setStats() {
        this.stats = new Stats();
        this.stats.showPanel(0);
        this.stats.dom.style.pointerEvents = 'none';
        this.stats.dom.style.userSelect = 'none';
        document.body.appendChild(this.stats.dom);
    }
}