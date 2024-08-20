import {
    Composite, AABBCollider2D, CollisionFilter, Resources, Component, Sprite, Tranform,
    Render, RigidBody2D, Vector2D, InputTracker, SysCollision2D, Draw, CircleCollider2D, PoligonCollider2D,
    RectangleCollider2D,Segment2D
} from "./Engine.js";

const ecena = new Composite();
const resources = new Resources();
const sistemaColision = new SysCollision2D();
let inputs;

let preloaded = true;
let created  = true;

function preload(){
    // Definimos el path de la imagen a cargar e instanciar y el tag name que lo identificara
    resources.addImage("./ResourcesTest/PincheRojo.png", "pinche");
    
    preloaded = false;
}

function create(){
    if( !(resources.checkLoadingStatus().totalResources === resources.checkLoadingStatus().totalLoaded) ){
        return;
    }

    let player = new PinchePlayer();
    ecena.add(player);

    created = false;
    Render.create(800, 800);
    inputs = new InputTracker(Render.view());
}   

function update(dt, t){
    if(preloaded){ preload(); }
    if(created){ create(); }

    if( preloaded || created ){ return; }

    //sistemaColision.detecteCollision(ecena);
    ecena.update(dt,t);
    Render.draw(ecena);
    
    inputs.reset(t,0.005);

}

//--------------
//Flujo principal
let last;
let dt; //tiempo transcurrido entre un frame y otro

function loopy(ms) {

    requestAnimationFrame(loopy);

    const t = ms / 1000;
    dt = t - last;
    last = t;

    update(dt, t);
}

requestAnimationFrame(loopy);
//--------------

class PinchePlayer extends Component{
    constructor(){
        let RB = new RigidBody2D(new AABBCollider2D(new Vector2D(80,80), 50, 50), new CollisionFilter());
        let T = new Tranform(new Vector2D(80,80), new Vector2D(50,50));
        let sprite = new Sprite(resources.image("pinche"), new Vector2D(resources.image("pinche").naturalWidth/4, resources.image("pinche").naturalHeight), new Vector2D(0, 0) );
        super(T, sprite, RB);

        this.velocidadRotacion = 0;

        this.lastTime = 0;

    }

    updateFrame(dt,t){
        
       //if( !(this.lastTime + 0.5 < t)){return;}
       //console.log(this.lastTime + 0," --- ", t)

       this.velocidadRotacion += 900 * dt // velocidad de rotacion
       this.rotate(this.velocidadRotacion);
       //this.scale(new Vector2D(1.001,1.001));

        if(inputs.clickIsPressed){
            let position = new Vector2D(0,0); 
            position.x = this.transform().position().x + this.transform().scale().x/2;
            position.y = this.transform().position().y + this.transform().scale().y/2;

            let desplazamiento = Vector2D.res(position, inputs.position);
            desplazamiento.x *=-1;//dt*5;
            desplazamiento.y *=-1//dt*5;
            this.traslate(desplazamiento);
        }

        if(inputs.keysDowns.includes("a")){
            this.scale(new Vector2D(1.04,1.04));
        }
        if(inputs.keysDowns.includes("s")){
            this.scale(new Vector2D(0.95,0.95));
        }

        if(inputs.keysDowns.length > 0){
            console.log("Letras presionadas: ",inputs.keysDowns);
        }
        

        this.lastTime = t;            
    }

    drawPost(ctx){
        Draw.color = "red";
        ctx.restore();
        Draw.drawRectangulo(ctx, new Vector2D(this.AABB().min_x, this.AABB().min_y), new Vector2D(this.AABB().max_x - this.AABB().min_x, this.AABB().max_y - this.AABB().min_y));
    }

}

class enemigos extends Component{
    constructor(){
        let RB = new RigidBody2D(new AABBCollider2D(new Vector2D(80,80), 50, 50), new CollisionFilter());
        let T = new Tranform(new Vector2D(80,80), new Vector2D(50,50));
        let sprite = new Sprite(resources.image("pinche"), new Vector2D(resources.image("pinche").naturalWidth/4, resources.image("pinche").naturalHeight), new Vector2D(0, 0) );
        super(T, sprite, RB);

        this.velocidadRotacion = 0;

        this.lastTime = 0;

    }
}




//----------------------------------------------------------------------
testResources();



function testColliders2D(){

    let rectangle = new RectangleCollider2D(new Vector2D(150,150)); 

    let poligono = new PoligonCollider2D(new Vector2D(150,150,0));
    poligono.createVerticesPoligon(poligono.centerCopy(),5,25);


    let verticesPrueba = [
        {x: 175, y: 175},
        {x: 175, y:125},
        {x:125, y:125},
        {x:125, y:175}
    ]
    let poligono2 = new PoligonCollider2D(new Vector2D(150,150,0), verticesPrueba);
    
    let circle = new CircleCollider2D(new Vector2D(150,150,0),50);
    
    let segmento = new Segment2D(new Vector2D(5,5), new Vector2D(25,15));

    let filterCollision = new CollisionFilter();
    console.log("--->",poligono.NAME());
    console.log("Rectangulo: ",rectangle,
        " Poligono 1: ",poligono ,
        " Poligono 2: ",poligono2, 
        " Circle: ",circle,
        " Segemento: ", segmento,
        "Collision filter: ", filterCollision
    );

}
testColliders2D();

function testResources(){
    let R = new Resources();

    R.addImage("./ResourcesTest/Rombo2.png", "E");
    R.addImage("./ResourcesTest/Rombo2.png", "A");
    R.addAudio("./ResourcesTest/synthetic_explosion_1.flac", "explosion");
    console.log(R.checkLoadingStatus())
    console.log(R.image("E"));
    console.log(R.audio("explosion"));
    console.log("Audios : ",R.allAudio()," Imagenes: ",R.allImage());

    setTimeout(()=> console.log(R.image("E")), 10000)
    setTimeout(()=> console.log(R.checkLoadingStatus()) , 10000)

    setTimeout(() => {
        //R.removeImage("E");
        console.log(R.allImage());
        console.log(R.checkLoadingStatus());

        test(R);

    }, 5000)

}


function test(R){

    let ecena = new Composite();
    let RB = new RigidBody2D(new AABBCollider2D(new Vector2D(80,80), 50, 50), new CollisionFilter());
    let T1 = new Tranform(new Vector2D(80,80), new Vector2D(50,50));
    let sprite1 = new Sprite(R.image("E"), new Vector2D(R.image("E").naturalWidth, R.image("E").naturalHeight), new Vector2D(0, 0) );
    let C1 = new Component(T1, sprite1, RB);

    let RB2 = new RigidBody2D(new AABBCollider2D(new Vector2D(120,120), 50, 50), new CollisionFilter());
    let T2 = new Tranform(new Vector2D(120,120), new Vector2D(50,50));
    let sprite2 = new Sprite(R.image("E"), new Vector2D(R.image("E").naturalWidth, R.image("E").naturalHeight), new Vector2D(0, 0) );
    let C2 = new Component(T2, sprite2, RB2);


    let RB3 = new RigidBody2D(new CircleCollider2D(new Vector2D(25,25), 20), new CollisionFilter());
    let T3 = new Tranform(new Vector2D(0,0), new Vector2D(50,50));
    let sprite3 = new Sprite(R.image("E"), new Vector2D(R.image("E").naturalWidth, R.image("E").naturalHeight), new Vector2D(0, 0));
    let C3 = new Component(T3, sprite3, RB3);


    C1.drawPost = (ctx)=>{
        Draw.color = "red";
        ctx.restore()
        console.log("centro:", C1.AABB().max_x/2," y:",C1.AABB().max_y/2)
        Draw.drawRectangulo(ctx, new Vector2D(C1.AABB().min_x, C1.AABB().min_y), new Vector2D(C1.AABB().max_x - C1.AABB().min_x, C1.AABB().max_y - C1.AABB().min_y));
    }

    C2.drawPre = (ctx)=>{
        Draw.color = "red";
        Draw.drawRectangulo(ctx, new Vector2D(C2.AABB().min_x, C2.AABB().min_y), new Vector2D(C2.AABB().max_x - C2.AABB().min_x, C2.AABB().max_y - C2.AABB().min_y));
    }

    C3.drawPost = (ctx) =>{
        Draw.color = "red";
        Draw.drawCirculo(ctx, C3.rigidBody().collider2D().centerCopy(), C3.rigidBody().collider2D().radius());
    }

    C1.setTag("C1");
    C2.setTag("C2");
    C3.setTag("C3");

    C1.rotate(45);
    C1.traslate(new Vector2D(50,90));
    C1.scale(new Vector2D(5,5));
    
    C3.traslate(new Vector2D(80,90));

    C1.onCollision = (collision) => {
        console.log("Soy C1, estoy colisionando:", collision);
    }

    C2.onCollision = (collision) => {
        console.log("Soy C2, estoy colisionando:", collision);
    }

    ecena.add(C1);
    ecena.add(C2);
    ecena.add(C3);

    ecena.traslate(new Vector2D(20,60));
    ecena.rotate(45);
    ecena.scale(new Vector2D(1.5,1.5));

    let sysC = new SysCollision2D().detecteCollision(ecena);

    Render.draw(ecena);
}

function draw(){
    let Canvas = new Render();
    
    //canvas.width = 500;
    //canvas.height = 500;
    let context = Canvas.contexto;

    context.strokeStyle = 'blue'; // set the strokeStyle color to 'navy' (for the stroke() call below)
    context.lineWidth = 1;      // set the line width to 3 pixels
    context.beginPath();          // start a new path
    context.moveTo (pol1.verticesRef()[0].x,pol1.verticesRef()[0].y);      // set (150,20) to be the starting point
    for(let i = 1; i<pol1.verticesRef().length; i++){
            context.lineTo(pol1.verticesRef()[i].x,pol1.verticesRef()[i].y);
    }      
    context.lineTo(pol1.verticesRef()[0].x,pol1.verticesRef()[0].y);
    context.stroke(); 

    
    console.log("dasd ",pol1.centerCopy());
    console.log(pol1.verticesCopy());
    pol1.scale(2,2,{x:150,y:150});
    pol1.rotate({x:150,y:150}, 135);
    pol1.traslate({x:2,y:1});
    console.log(pol1.area(true));
    context.beginPath();          // start a new path
    context.moveTo (pol1.verticesRef()[0].x,pol1.verticesRef()[0].y);      // set (150,20) to be the starting point
    for(let i = 1; i<pol1.verticesRef().length; i++){
            context.lineTo(pol1.verticesRef()[i].x,pol1.verticesRef()[i].y);
    }      
    context.lineTo(pol1.verticesRef()[0].x,pol1.verticesRef()[0].y);
    context.stroke(); 


    context.beginPath();
    console.log(pol1.boundsCopy().max_x);
    context.moveTo(pol1.boundsCopy().max_x,pol1.boundsCopy().max_y);
    context.lineTo(pol1.boundsCopy().max_x,pol1.boundsCopy().min_y);      // set (150,20) to be the starting point
    context.lineTo(pol1.boundsCopy().min_x,pol1.boundsCopy().min_y);
    context.lineTo(pol1.boundsCopy().min_x,pol1.boundsCopy().max_y);
    context.lineTo(pol1.boundsCopy().max_x, pol1.boundsCopy().max_y);
    context.stroke();
   
}