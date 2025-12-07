import {
    Composite, AABBCollider2D, CollisionFilter, Resources, Component, Sprite, Tranform,
    Render, RigidBody2D, Vector2D, InputTracker, SysCollision2D, Draw, CircleCollider2D, PoligonCollider2D,
    RectangleCollider2D, Segment2D, Camera
} from "./Engine.js";

const ecena = new Composite();
const resources = new Resources();
const sistemaColision = new SysCollision2D();
let inputs;
let player;
let camera;

let preloaded = true;
let created = true;

// Sistema de particulas para explosiones
const particulas = [];
const proyectiles = [];
const paredes = [];

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
const WORLD_WIDTH = 1600;
const WORLD_HEIGHT = 1600;
const WALL_THICKNESS = 40;
const GRID_SIZE = 50;

// Variables para generacion infinita de enemigos
let contadorEnemigosCirculo = 0;
let contadorEnemigosPoligono = 0;
let contadorEnemigosRectangulo = 0;
const MAX_ENEMIGOS = 20;
const TIEMPO_ENTRE_SPAWNS = 2;
let tiempoUltimoSpawn = 0;

// Modo de movimiento del jugador
let modoMovimiento = "wasd";
let teclaTPreviamentePresionada = false;

function preload() {
    resources.addImage("./ResourcesTest/PincheRojo.png", "pinche");
    resources.addImage("./ResourcesTest/Rombo2.png", "rombo");
    resources.addAudio("./ResourcesTest/synthetic_explosion_1.flac", "explosion");
    preloaded = false;
}

function create() {
    if (!(resources.checkLoadingStatus().totalResources === resources.checkLoadingStatus().totalLoaded)) {
        return;
    }

    crearParedes();

    player = new PinchePlayer();
    player.setTag("player");
    ecena.add(player);

    crearEnemigosIniciales();

    created = false;
    
    Render.create(CANVAS_WIDTH, CANVAS_HEIGHT, true);
    
    camera = new Camera(CANVAS_WIDTH, CANVAS_HEIGHT);
    camera.setTarget(player, 0.08);
    camera.setWorldBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    camera.centerOn(player.transform().position().x, player.transform().position().y);
    Render.setCamera(camera);
    
    inputs = new InputTracker(Render.view());
}

function crearParedes() {
    let paredSuperior = new Pared(0, 0, WORLD_WIDTH, WALL_THICKNESS);
    paredSuperior.setTag("pared_superior");
    ecena.add(paredSuperior);
    paredes.push(paredSuperior);

    let paredInferior = new Pared(0, WORLD_HEIGHT - WALL_THICKNESS, WORLD_WIDTH, WALL_THICKNESS);
    paredInferior.setTag("pared_inferior");
    ecena.add(paredInferior);
    paredes.push(paredInferior);

    let paredIzquierda = new Pared(0, WALL_THICKNESS, WALL_THICKNESS, WORLD_HEIGHT - WALL_THICKNESS * 2);
    paredIzquierda.setTag("pared_izquierda");
    ecena.add(paredIzquierda);
    paredes.push(paredIzquierda);

    let paredDerecha = new Pared(WORLD_WIDTH - WALL_THICKNESS, WALL_THICKNESS, WALL_THICKNESS, WORLD_HEIGHT - WALL_THICKNESS * 2);
    paredDerecha.setTag("pared_derecha");
    ecena.add(paredDerecha);
    paredes.push(paredDerecha);

    let paredInterna1 = new Pared(300, 300, 200, WALL_THICKNESS);
    paredInterna1.setTag("pared_interna_1");
    ecena.add(paredInterna1);
    paredes.push(paredInterna1);

    let paredInterna2 = new Pared(600, 500, WALL_THICKNESS, 300);
    paredInterna2.setTag("pared_interna_2");
    ecena.add(paredInterna2);
    paredes.push(paredInterna2);

    let paredInterna3 = new Pared(900, 200, WALL_THICKNESS, 400);
    paredInterna3.setTag("pared_interna_3");
    ecena.add(paredInterna3);
    paredes.push(paredInterna3);

    let paredInterna4 = new Pared(1000, 900, 300, WALL_THICKNESS);
    paredInterna4.setTag("pared_interna_4");
    ecena.add(paredInterna4);
    paredes.push(paredInterna4);

    let paredInterna5 = new Pared(200, 1000, WALL_THICKNESS, 300);
    paredInterna5.setTag("pared_interna_5");
    ecena.add(paredInterna5);
    paredes.push(paredInterna5);

    let paredInterna6 = new Pared(400, 1200, 400, WALL_THICKNESS);
    paredInterna6.setTag("pared_interna_6");
    ecena.add(paredInterna6);
    paredes.push(paredInterna6);
}

function dibujarCuadricula(ctx) {
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    for (let x = 0; x <= WORLD_WIDTH; x += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, WORLD_HEIGHT);
        ctx.stroke();
    }

    for (let y = 0; y <= WORLD_HEIGHT; y += GRID_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(WORLD_WIDTH, y);
        ctx.stroke();
    }
}

function crearEnemigosIniciales() {
    for (let i = 0; i < 5; i++) {
        spawnEnemigoAleatorio();
    }
}

function spawnEnemigoAleatorio() {
    let tipo = Math.floor(Math.random() * 3);
    let pos = obtenerPosicionSpawnValida();
    
    if (!pos) return;

    let enemigo;
    
    switch(tipo) {
        case 0:
            let radio = 20 + Math.random() * 30;
            enemigo = new EnemigoCirculo(pos.x, pos.y, radio);
            enemigo.setTag("enemigo_circulo_" + contadorEnemigosCirculo++);
            break;
        case 1:
            let lados = 3 + Math.floor(Math.random() * 4);
            let radioP = 25 + Math.random() * 25;
            enemigo = new EnemigoPoligono(pos.x, pos.y, lados, radioP);
            enemigo.setTag("enemigo_poligono_" + contadorEnemigosPoligono++);
            break;
        case 2:
            let ancho = 30 + Math.random() * 40;
            let alto = 30 + Math.random() * 40;
            enemigo = new EnemigoRectangulo(pos.x, pos.y, ancho, alto);
            enemigo.setTag("enemigo_rectangulo_" + contadorEnemigosRectangulo++);
            break;
    }

    if (enemigo) {
        ecena.add(enemigo);
    }
}

function obtenerPosicionSpawnValida() {
    const margen = 100;
    const maxIntentos = 50;
    
    for (let i = 0; i < maxIntentos; i++) {
        let x = WALL_THICKNESS + margen + Math.random() * (WORLD_WIDTH - WALL_THICKNESS * 2 - margen * 2);
        let y = WALL_THICKNESS + margen + Math.random() * (WORLD_HEIGHT - WALL_THICKNESS * 2 - margen * 2);
        
        if (player) {
            let playerPos = player.transform().position();
            let dist = Math.sqrt(Math.pow(x - playerPos.x, 2) + Math.pow(y - playerPos.y, 2));
            if (dist < 200) continue;
        }
        
        let dentroDeAlgunaPared = false;
        for (let pared of paredes) {
            let paredPos = pared.transform().position();
            let paredScale = pared.transform().scale();
            if (x > paredPos.x - 50 && x < paredPos.x + paredScale.x + 50 &&
                y > paredPos.y - 50 && y < paredPos.y + paredScale.y + 50) {
                dentroDeAlgunaPared = true;
                break;
            }
        }
        
        if (!dentroDeAlgunaPared) {
            return { x, y };
        }
    }
    
    return null;
}

function contarEnemigos() {
    let count = 0;
    for (let child of ecena.childrens()) {
        if (child.tag() && child.tag().startsWith("enemigo")) {
            count++;
        }
    }
    return count;
}

function generarEnemigosInfinitos(t) {
    if (t - tiempoUltimoSpawn >= TIEMPO_ENTRE_SPAWNS) {
        let numEnemigos = contarEnemigos();
        if (numEnemigos < MAX_ENEMIGOS) {
            spawnEnemigoAleatorio();
        }
        tiempoUltimoSpawn = t;
    }
}

function crearProyectil(x, y, dirX, dirY) {
    let proyectil = new Proyectil(x, y, dirX, dirY);
    proyectil.setTag("proyectil_" + Date.now());
    ecena.add(proyectil);
    proyectiles.push(proyectil);
}

function actualizarProyectiles(dt) {
    for (let i = proyectiles.length - 1; i >= 0; i--) {
        if (!proyectiles[i].life()) {
            proyectiles.splice(i, 1);
        }
    }
}

function crearExplosion(x, y, color, cantidad = 15) {
    for (let i = 0; i < cantidad; i++) {
        let angulo = (Math.PI * 2 / cantidad) * i + Math.random() * 0.5;
        let velocidad = 100 + Math.random() * 150;
        particulas.push({
            x: x,
            y: y,
            vx: Math.cos(angulo) * velocidad,
            vy: Math.sin(angulo) * velocidad,
            vida: 1.0,
            color: color,
            tamano: 3 + Math.random() * 5
        });
    }
    let sonido = resources.audio("explosion");
    if (sonido) {
        sonido.currentTime = 0;
        sonido.volume = 0.3;
        sonido.play().catch(e => console.log("Audio no disponible"));
    }
}

function actualizarParticulas(dt) {
    for (let i = particulas.length - 1; i >= 0; i--) {
        let p = particulas[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vida -= dt * 2;
        p.vx *= 0.98;
        p.vy *= 0.98;

        if (p.vida <= 0) {
            particulas.splice(i, 1);
        }
    }
}

function dibujarParticulas(ctx) {
    for (let p of particulas) {
        ctx.globalAlpha = p.vida;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tamano * p.vida, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

function update(dt, t) {
    if (preloaded) { preload(); }
    if (created) { create(); }

    if (preloaded || created) { return; }

    let tPresionada = inputs.keysDowns.includes("t");
    if (tPresionada && !teclaTPreviamentePresionada) {
        modoMovimiento = (modoMovimiento === "wasd") ? "click" : "wasd";
    }
    teclaTPreviamentePresionada = tPresionada;

    let childrens = ecena.childrens();
    for (let i = childrens.length - 1; i >= 0; i--) {
        let child = childrens[i];
        if (!child.life()) {
            ecena.remove(child);
        }
    }

    generarEnemigosInfinitos(t);

    sistemaColision.detecteCollision(ecena);

    actualizarParticulas(dt);
    actualizarProyectiles(dt);

    camera.update(dt);
    
    if (inputs.keysDowns.includes("z")) {
        camera.zoomIn(0.02);
    }
    if (inputs.keysDowns.includes("x")) {
        camera.zoomOut(0.02);
    }

    ecena.update(dt, t);
    
    // === RENDERIZADO MANUAL COMPLETO ===
    let ctx = Render.contexto;
    
    // 1. Limpiar y dibujar fondo
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // 2. Aplicar transformación de cámara para todo el mundo
    ctx.save();
    camera.applyTransform(ctx);
    
    // 3. Dibujar cuadrícula
    dibujarCuadricula(ctx);
    
    // 4. Dibujar paredes
    for (let pared of paredes) {
        pared.drawPost(ctx);
    }
    
    // 5. Dibujar todos los elementos de la escena manualmente
    let childrensParaDibujar = ecena.childrens();
    for (let child of childrensParaDibujar) {
        if (child.life() && child.tag() && !child.tag().startsWith("pared")) {
            try {
                ctx.save();
                let pos = child.transform().position();
                let scale = child.transform().scale();
                let angle = child.transform().angle() || 0;
                
                ctx.translate(pos.x + scale.x/2, pos.y + scale.y/2);
                ctx.rotate(angle * Math.PI / 180);
                ctx.translate(-pos.x - scale.x/2, -pos.y - scale.y/2);
                
                // Dibujar sprite si tiene
                if (child.sprite && child.sprite()) {
                    let spr = child.sprite();
                    if (spr.image()) {
                        ctx.drawImage(spr.image(),
                            spr.offset().x, spr.offset().y, 
                            spr.scale().x, spr.scale().y,
                            pos.x, pos.y,
                            scale.x, scale.y
                        );
                    }
                }
                
                // Dibujar drawPost
                if (child.drawPost) {
                    child.drawPost(ctx);
                }
                ctx.restore();
            } catch(e) {
                ctx.restore();
                console.log("Error dibujando:", child.tag(), e);
            }
        }
    }
    
    // 6. Dibujar proyectiles
    for (let proy of proyectiles) {
        if (proy.life()) {
            proy.drawPost(ctx);
        }
    }
    
    // 7. Dibujar partículas
    dibujarParticulas(ctx);
    
    // 8. Restaurar transformación
    ctx.restore();

    Render.drawUI((ctx) => {
        ctx.fillStyle = "white";
        ctx.font = "18px Arial";
        ctx.fillText("Enemigos: " + contarEnemigos(), 10, 30);
        ctx.fillText("Modo: " + modoMovimiento.toUpperCase() + " (T para cambiar)", 10, 55);
        ctx.fillText("Z/X: Zoom | Click: Disparar", 10, 80);
        ctx.fillText("Zoom: " + camera.zoom().toFixed(2) + "x", 10, 105);
        
        ctx.fillStyle = modoMovimiento === "wasd" ? "#00ff00" : "#00ffff";
        ctx.fillRect(CANVAS_WIDTH - 120, 10, 110, 30);
        ctx.fillStyle = "black";
        ctx.font = "14px Arial";
        ctx.fillText(modoMovimiento === "wasd" ? "WASD Mover" : "Click Mover", CANVAS_WIDTH - 115, 30);
        
        dibujarMiniMapa(ctx, ecena.childrens());
    });

    inputs.reset(t, 0.005);
}

function dibujarMiniMapa(ctx, childrens) {
    const mapSize = 150;
    const mapX = CANVAS_WIDTH - mapSize - 10;
    const mapY = 50;
    const scale = mapSize / WORLD_WIDTH;
    
    ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
    ctx.fillRect(mapX, mapY, mapSize, mapSize);
    ctx.strokeStyle = "#666";
    ctx.strokeRect(mapX, mapY, mapSize, mapSize);
    
    ctx.fillStyle = "#666";
    for (let pared of paredes) {
        let pos = pared.transform().position();
        let sc = pared.transform().scale();
        ctx.fillRect(mapX + pos.x * scale, mapY + pos.y * scale, sc.x * scale, sc.y * scale);
    }
    
    childrens.forEach(child => {
        if (child.tag() && child.tag().startsWith("enemigo")) {
            let pos = child.transform().position();
            let x = mapX + pos.x * scale;
            let y = mapY + pos.y * scale;
            
            if (child.tag().includes("circulo")) {
                ctx.fillStyle = "#ff4444";
            } else if (child.tag().includes("poligono")) {
                ctx.fillStyle = "#44ff44";
            } else {
                ctx.fillStyle = "#4444ff";
            }
            ctx.fillRect(x - 2, y - 2, 4, 4);
        }
    });
    
    ctx.fillStyle = "#ffff00";
    for (let proy of proyectiles) {
        if (proy.life()) {
            let pos = proy.transform().position();
            ctx.fillRect(mapX + pos.x * scale - 1, mapY + pos.y * scale - 1, 2, 2);
        }
    }
    
    if (player) {
        let pos = player.transform().position();
        let x = mapX + pos.x * scale;
        let y = mapY + pos.y * scale;
        ctx.fillStyle = "#00ffff";
        ctx.fillRect(x - 3, y - 3, 6, 6);
    }
    
    let bounds = camera.getVisibleBounds();
    ctx.strokeStyle = "#ffffff";
    ctx.strokeRect(
        mapX + bounds.min_x * scale,
        mapY + bounds.min_y * scale,
        (bounds.max_x - bounds.min_x) * scale,
        (bounds.max_y - bounds.min_y) * scale
    );
}

let last;
let dt;

function loopy(ms) {
    requestAnimationFrame(loopy);

    const t = ms / 1000;
    dt = t - last;
    last = t;

    update(dt, t);
}

requestAnimationFrame(loopy);

class Pared extends Component {
    constructor(x, y, ancho, alto) {
        let RB = new RigidBody2D(
            new RectangleCollider2D(new Vector2D(x, y), ancho, alto), 
            new CollisionFilter(0, 4, [1, 2, 8])
        );
        let T = new Tranform(new Vector2D(x, y), new Vector2D(ancho, alto));
        super(T, null, RB);
        
        // Forzar renderizado aunque no tenga sprite
        this.setRender(true);
        
        this.ancho = ancho;
        this.alto = alto;
        this.color = "#555";
        this.colorBorde = "#777";
    }

    updateFrame(dt, t) {}

    drawPost(ctx) {
        let pos = this.transform().position();
        let scale = this.transform().scale();
        
        ctx.fillStyle = this.color;
        ctx.fillRect(pos.x, pos.y, scale.x, scale.y);
        
        ctx.strokeStyle = this.colorBorde;
        ctx.lineWidth = 2;
        ctx.strokeRect(pos.x, pos.y, scale.x, scale.y);
    }

    onCollision(colision) {}
}

class Proyectil extends Component {
    constructor(x, y, dirX, dirY) {
        let radio = 8;
        let RB = new RigidBody2D(
            new CircleCollider2D(new Vector2D(x, y), radio), 
            new CollisionFilter(0, 8, [2, 4])
        );
        let T = new Tranform(new Vector2D(x - radio, y - radio), new Vector2D(radio * 2, radio * 2));
        super(T, null, RB);
        
        // Forzar renderizado aunque no tenga sprite
        this.setRender(true);
        
        this.radio = radio;
        this.velocidad = 500;
        this.dirX = dirX;
        this.dirY = dirY;
        this.tiempoVida = 3;
        this.tiempoCreacion = 0;
    }

    updateFrame(dt, t) {
        if (this.tiempoCreacion === 0) {
            this.tiempoCreacion = t;
        }
        
        this.traslate(new Vector2D(this.dirX * this.velocidad * dt, this.dirY * this.velocidad * dt));
        
        if (t - this.tiempoCreacion > this.tiempoVida) {
            this.destroy();
        }
    }

    drawPost(ctx) {
        let center = this.rigidBody().collider2D().centerCopy();
        
        ctx.fillStyle = "#ffff00";
        ctx.beginPath();
        ctx.arc(center.x, center.y, this.radio, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(center.x - 2, center.y - 2, this.radio / 3, 0, Math.PI * 2);
        ctx.fill();
    }

    onCollision(colision) {
        if (colision.tag() && colision.tag().startsWith("pared")) {
            let center = this.rigidBody().collider2D().centerCopy();
            crearExplosion(center.x, center.y, "#ffff88", 5);
            this.destroy();
        }
        else if (colision.tag() && colision.tag().startsWith("enemigo")) {
            let pos = colision.transform().position();
            let centroX = pos.x + colision.transform().scale().x / 2;
            let centroY = pos.y + colision.transform().scale().y / 2;

            let color = "orange";
            if (colision.tag().includes("circulo")) {
                color = "#ff4444";
            } else if (colision.tag().includes("poligono")) {
                color = "#44ff44";
            } else if (colision.tag().includes("rectangulo")) {
                color = "#4444ff";
            }

            crearExplosion(centroX, centroY, color, 20);
            colision.destroy();
            this.destroy();
        }
    }
}

class PinchePlayer extends Component {
    constructor() {
        let RB = new RigidBody2D(
            new AABBCollider2D(new Vector2D(WORLD_WIDTH/2, WORLD_HEIGHT/2), 50, 50), 
            new CollisionFilter(0, 1, [2, 4])
        );
        let T = new Tranform(new Vector2D(WORLD_WIDTH/2, WORLD_HEIGHT/2), new Vector2D(50, 50));
        let sprite = new Sprite(resources.image("pinche"), new Vector2D(resources.image("pinche").naturalWidth / 4, resources.image("pinche").naturalHeight), new Vector2D(0, 0));
        super(T, sprite, RB);

        this.velocidadRotacion = 0;
        this.lastTime = 0;
        this.tiempoUltimoDisparo = 0;
        this.cadenciaDisparo = 0.2;
    }

    updateFrame(dt, t) {
        this.velocidadRotacion += 90 * dt;
        this.rotate(this.velocidadRotacion);

        // Usar el centro del AABB para mayor precisión
        let aabb = this.AABB();
        let centerX = (aabb.min_x + aabb.max_x) / 2;
        let centerY = (aabb.min_y + aabb.max_y) / 2;

        if (modoMovimiento === "click") {
            if (inputs.clickIsPressed && !inputs.keysDowns.includes("Shift")) {
                let mouseWorldPos = camera.screenToWorld(inputs.position.x, inputs.position.y);
                let dirX = mouseWorldPos.x - centerX;
                let dirY = mouseWorldPos.y - centerY;
                let distancia = Math.sqrt(dirX * dirX + dirY * dirY);
                if (distancia > 10) {
                    let velocidad = 250 * dt;
                    this.traslate(new Vector2D((dirX / distancia) * velocidad, (dirY / distancia) * velocidad));
                }
            }
        } else {
            let vel = 200 * dt;
            if (inputs.keysDowns.includes("w")) {
                this.traslate(new Vector2D(0, -vel));
            }
            if (inputs.keysDowns.includes("s") && !inputs.keysDowns.includes("Control")) {
                this.traslate(new Vector2D(0, vel));
            }
            if (inputs.keysDowns.includes("a") && !inputs.keysDowns.includes("Control")) {
                this.traslate(new Vector2D(-vel, 0));
            }
            if (inputs.keysDowns.includes("d")) {
                this.traslate(new Vector2D(vel, 0));
            }
        }

        let puedeDisparar = (modoMovimiento === "wasd" && inputs.clickIsPressed) || 
                           (modoMovimiento === "click" && inputs.clickIsPressed && inputs.keysDowns.includes("Shift"));
        
        if (puedeDisparar && t - this.tiempoUltimoDisparo >= this.cadenciaDisparo) {
            let mouseWorldPos = camera.screenToWorld(inputs.position.x, inputs.position.y);
            // Recalcular centro actualizado después del movimiento
            let aabbActual = this.AABB();
            let cx = (aabbActual.min_x + aabbActual.max_x) / 2;
            let cy = (aabbActual.min_y + aabbActual.max_y) / 2;
            
            let dirX = mouseWorldPos.x - cx;
            let dirY = mouseWorldPos.y - cy;
            let dist = Math.sqrt(dirX * dirX + dirY * dirY);
            if (dist > 0) {
                dirX /= dist;
                dirY /= dist;
                crearProyectil(cx, cy, dirX, dirY);
                this.tiempoUltimoDisparo = t;
            }
        }

        if (inputs.keysDowns.includes("q")) {
            this.scale(new Vector2D(1.02, 1.02));
        }
        if (inputs.keysDowns.includes("e")) {
            this.scale(new Vector2D(0.98, 0.98));
        }

        this.lastTime = t;
    }

    drawPost(ctx) {
        Draw.color = "cyan";
        Draw.drawRectangulo(ctx, new Vector2D(this.AABB().min_x, this.AABB().min_y), new Vector2D(this.AABB().max_x - this.AABB().min_x, this.AABB().max_y - this.AABB().min_y));
    }

    onCollision(colision) {
        if (colision.tag() && colision.tag().startsWith("pared")) {
            this.resolverColisionPared(colision);
        }
        else if (colision.life() && colision.tag() && colision.tag().startsWith("enemigo")) {
            let pos = colision.transform().position();
            let centroX = pos.x + colision.transform().scale().x / 2;
            let centroY = pos.y + colision.transform().scale().y / 2;

            let color = "orange";
            if (colision.tag().includes("circulo")) {
                color = "#ff4444";
            } else if (colision.tag().includes("poligono")) {
                color = "#44ff44";
            } else if (colision.tag().includes("rectangulo")) {
                color = "#4444ff";
            }

            crearExplosion(centroX, centroY, color, 20);
            colision.destroy();
        }
    }

    resolverColisionPared(pared) {
        let playerAABB = this.AABB();
        let paredPos = pared.transform().position();
        let paredScale = pared.transform().scale();
        
        let overlapLeft = (paredPos.x + paredScale.x) - playerAABB.min_x;
        let overlapRight = playerAABB.max_x - paredPos.x;
        let overlapTop = (paredPos.y + paredScale.y) - playerAABB.min_y;
        let overlapBottom = playerAABB.max_y - paredPos.y;
        
        let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        
        let correccion = new Vector2D(0, 0);
        if (minOverlap === overlapLeft) {
            correccion.x = overlapLeft + 1;
        } else if (minOverlap === overlapRight) {
            correccion.x = -overlapRight - 1;
        } else if (minOverlap === overlapTop) {
            correccion.y = overlapTop + 1;
        } else {
            correccion.y = -overlapBottom - 1;
        }
        
        this.traslate(correccion);
    }
}

class EnemigoCirculo extends Component {
    constructor(x, y, radio) {
        let RB = new RigidBody2D(new CircleCollider2D(new Vector2D(x + radio, y + radio), radio), new CollisionFilter(0, 2, [1, 4, 8]));
        let T = new Tranform(new Vector2D(x, y), new Vector2D(radio * 2, radio * 2));
        let sprite = new Sprite(resources.image("rombo"), new Vector2D(resources.image("rombo").naturalWidth, resources.image("rombo").naturalHeight), new Vector2D(0, 0));
        super(T, sprite, RB);

        this.radio = radio;
        this.velocidadX = (Math.random() - 0.5) * 150;
        this.velocidadY = (Math.random() - 0.5) * 150;
        this.colorBorde = "hsl(" + (Math.random() * 60) + ", 70%, 50%)";
    }

    updateFrame(dt, t) {
        this.traslate(new Vector2D(this.velocidadX * dt, this.velocidadY * dt));
    }

    drawPost(ctx) {
        Draw.color = this.colorBorde;
        let center = this.rigidBody().collider2D().centerCopy();
        Draw.drawCirculo(ctx, center, this.radio);
    }

    onCollision(colision) {
        if (colision.tag() && colision.tag().startsWith("pared")) {
            this.rebotarEnPared(colision);
        }
    }

    rebotarEnPared(pared) {
        let center = this.rigidBody().collider2D().centerCopy();
        let paredPos = pared.transform().position();
        let paredScale = pared.transform().scale();
        
        let distLeft = Math.abs(center.x - paredPos.x);
        let distRight = Math.abs(center.x - (paredPos.x + paredScale.x));
        let distTop = Math.abs(center.y - paredPos.y);
        let distBottom = Math.abs(center.y - (paredPos.y + paredScale.y));
        
        let minDist = Math.min(distLeft, distRight, distTop, distBottom);
        
        if (minDist === distLeft || minDist === distRight) {
            this.velocidadX *= -1;
            let sep = minDist === distLeft ? -this.radio - 5 : this.radio + 5;
            this.traslate(new Vector2D(sep, 0));
        } else {
            this.velocidadY *= -1;
            let sep = minDist === distTop ? -this.radio - 5 : this.radio + 5;
            this.traslate(new Vector2D(0, sep));
        }
    }
}

class EnemigoPoligono extends Component {
    constructor(x, y, numLados, radio) {
        let collider = new PoligonCollider2D(new Vector2D(x, y));
        collider.createVerticesPoligon(new Vector2D(x, y), numLados, radio);

        let RB = new RigidBody2D(collider, new CollisionFilter(0, 2, [1, 4, 8]));
        let T = new Tranform(new Vector2D(x - radio, y - radio), new Vector2D(radio * 2, radio * 2));
        let sprite = new Sprite(resources.image("rombo"), new Vector2D(resources.image("rombo").naturalWidth, resources.image("rombo").naturalHeight), new Vector2D(0, 0));
        super(T, sprite, RB);

        this.numLados = numLados;
        this.radio = radio;
        this.velocidadRotacion = (Math.random() - 0.5) * 100;
        this.velocidadX = (Math.random() - 0.5) * 120;
        this.velocidadY = (Math.random() - 0.5) * 120;
        this.colorBorde = "hsl(" + (120 + Math.random() * 60) + ", 70%, 50%)";
        this.anguloActual = 0;
        this.anguloAnterior = 0;
    }

    updateFrame(dt, t) {
        this.anguloAnterior = this.anguloActual;
        this.anguloActual += this.velocidadRotacion * dt;
        
        let deltaAngulo = this.anguloActual - this.anguloAnterior;
        if (this._rigidBody) {
            let collider2D = this._rigidBody.collider2D();
            if (collider2D.rotate) {
                collider2D.rotate(deltaAngulo, collider2D.centerCopy());
            }
        }
        this._transform.setAngle(this.anguloActual);

        this.traslate(new Vector2D(this.velocidadX * dt, this.velocidadY * dt));
    }

    drawPost(ctx) {
        let vertices = this.rigidBody().collider2D().verticesRef();
        if (vertices && vertices.length > 2) {
            ctx.strokeStyle = this.colorBorde;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    onCollision(colision) {
        if (colision.tag() && colision.tag().startsWith("pared")) {
            this.rebotarEnPared(colision);
        }
    }

    rebotarEnPared(pared) {
        let center = this.rigidBody().collider2D().centerCopy();
        let paredPos = pared.transform().position();
        let paredScale = pared.transform().scale();
        
        let distLeft = Math.abs(center.x - paredPos.x);
        let distRight = Math.abs(center.x - (paredPos.x + paredScale.x));
        let distTop = Math.abs(center.y - paredPos.y);
        let distBottom = Math.abs(center.y - (paredPos.y + paredScale.y));
        
        let minDist = Math.min(distLeft, distRight, distTop, distBottom);
        
        if (minDist === distLeft || minDist === distRight) {
            this.velocidadX *= -1;
            let sep = minDist === distLeft ? -this.radio - 5 : this.radio + 5;
            this.traslate(new Vector2D(sep, 0));
        } else {
            this.velocidadY *= -1;
            let sep = minDist === distTop ? -this.radio - 5 : this.radio + 5;
            this.traslate(new Vector2D(0, sep));
        }
    }
}

class EnemigoRectangulo extends Component {
    constructor(x, y, ancho, alto) {
        let RB = new RigidBody2D(new RectangleCollider2D(new Vector2D(x, y), ancho, alto), new CollisionFilter(0, 2, [1, 4, 8]));
        let T = new Tranform(new Vector2D(x, y), new Vector2D(ancho, alto));
        let sprite = new Sprite(resources.image("rombo"), new Vector2D(resources.image("rombo").naturalWidth, resources.image("rombo").naturalHeight), new Vector2D(0, 0));
        super(T, sprite, RB);

        this.ancho = ancho;
        this.alto = alto;
        this.velocidadX = (Math.random() - 0.5) * 100;
        this.velocidadY = (Math.random() - 0.5) * 100;
        this.velocidadRotacion = (Math.random() - 0.5) * 50;
        this.colorBorde = "hsl(" + (200 + Math.random() * 60) + ", 70%, 50%)";
        this.anguloActual = 0;
        this.anguloAnterior = 0;
    }

    updateFrame(dt, t) {
        this.anguloAnterior = this.anguloActual;
        this.anguloActual += this.velocidadRotacion * dt;
        
        let deltaAngulo = this.anguloActual - this.anguloAnterior;
        if (this._rigidBody) {
            let collider2D = this._rigidBody.collider2D();
            if (collider2D.rotate) {
                collider2D.rotate(deltaAngulo, collider2D.centerCopy());
            }
        }
        this._transform.setAngle(this.anguloActual);

        this.traslate(new Vector2D(this.velocidadX * dt, this.velocidadY * dt));
    }

    drawPost(ctx) {
        let vertices = this.rigidBody().collider2D().verticesRef();
        if (vertices && vertices.length >= 4) {
            ctx.strokeStyle = this.colorBorde;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(vertices[0].x, vertices[0].y);
            for (let i = 1; i < vertices.length; i++) {
                ctx.lineTo(vertices[i].x, vertices[i].y);
            }
            ctx.closePath();
            ctx.stroke();
        }
    }

    onCollision(colision) {
        if (colision.tag() && colision.tag().startsWith("pared")) {
            this.rebotarEnPared(colision);
        }
    }

    rebotarEnPared(pared) {
        let center = this.rigidBody().collider2D().centerCopy();
        let paredPos = pared.transform().position();
        let paredScale = pared.transform().scale();
        
        let distLeft = Math.abs(center.x - paredPos.x);
        let distRight = Math.abs(center.x - (paredPos.x + paredScale.x));
        let distTop = Math.abs(center.y - paredPos.y);
        let distBottom = Math.abs(center.y - (paredPos.y + paredScale.y));
        
        let minDist = Math.min(distLeft, distRight, distTop, distBottom);
        
        if (minDist === distLeft || minDist === distRight) {
            this.velocidadX *= -1;
            let sep = minDist === distLeft ? -this.ancho/2 - 5 : this.ancho/2 + 5;
            this.traslate(new Vector2D(sep, 0));
        } else {
            this.velocidadY *= -1;
            let sep = minDist === distTop ? -this.alto/2 - 5 : this.alto/2 + 5;
            this.traslate(new Vector2D(0, sep));
        }
    }
}
