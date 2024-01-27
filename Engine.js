 /** @type {HTMLCanvasElement} */

import Container from "./Conteiner.js";
import CanvasRender from "./canvasRenderer.js";
import TecladoControl from "./controls/keyControls.js"
import mouseControl from "./controls/mouseControls.js"

class Utilities{

    static variableCopy(objCopy, obj){
        Object.assign(objCopy, obj);
        return objCopy;
    }

}
class Vector2D {
    x;
    y;

    #NAME = "Vector2D";

    constructor(x = 0, y = 0){

        if(isNaN(x) && isNaN(y)){
            this.x = x;
            this.y = y;
        }else {
            throw new Error(" Los componentes (x,y) del vector deben ser numeros reales o enteros");
        }
       
    }
      
    rotate(angle){
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        
        let x = this.x * cos - this.y * sin;
        let y = this.x * sin + this.y * cos;
      
        return {x, y};
    }

    rotateAbout = function(angle, point) {
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
       
        let x = point.x + ((this.x - point.x) * cos - (this.y - point.y) * sin);
        let y = point.y + ((this.x - point.x) * sin + (this.y - point.y) * cos);
        
        return {x, y};
    };

    static angle(vectorA, vectorB){ 
        //X: Mouse.position.X - player.position.X + player.ancho/2  --> tener en cuate en el vector de parametro
        let distancia = Vector2D.vectorDistance(vectorA, vectorB);
        return Math.atan2(distancia.x, distancia.y); 
    }

    static catetos(VectorA, vectorB){

        //Define la direccion x,y,z del movimiento de un origen a un punto destino al sumar a la posicion
        let angulo = Vector2D.angle(VectorA, vectorB);

        return {x: Math.sin(angulo), y: Math.cos(angulo)};
    
    }

    static vectorDistance(vectorA, vectorB){ //direccion   
        // X += radio1 - radio2    --> esto considerar al crear el vector 
        // Y += radio1 - radio2
        return {x: vectorA.x  - vectorB.x, y : vectorA.y - vectorB.y};
       
    }     

    static distance(vectorA , vectorB){// Hipotenusa
        let distance = Vector2D.vectorDistance(vectorA, vectorB);
        return {x : distance.x * distance.x, y : distance.y * distance.y};

    }

    static productDot(vectorA, vectorB){
        // = 0 => ortogonales entre si => 96 grados etre si
        // != 0 => paralelos entre si

        return vectorA.x * vectorB.x + vectorA.y * vectorB.y;

    }

    static productCross(vectorA,vectorB) {
        return (vectorA.x * vectorB.y) - (vectorA.y * vectorB.x);
    };

    static productCross3(vectorA, vectorB, vectorC) {
        return (vectorB.x - vectorA.x) * (vectorC.y - vectorA.y) - (vectorB.y - vectorA.y) * (vectorC.x - vectorA.x);
    };


    module(){ // Hipotenusa
        return Math.sqrt(this.x * this.x, this.y * this.y);
    }

    static sum( vectorA, vectorB){ //add
        return {x: vectorA.x + vectorB.x, y : vectorA.y + vectorB.y};
    }

   static res( vectorA, vectorB){
        return {x : vectorA.x - vectorB.x, y : vectorA.y - vectorB.y};
    }

    static mult(vector, scalar) {
        return { x: vector.x * scalar, y: vector.y * scalar };
    };

    static div(vector, scalar) {
        return { x: vector.x / scalar, y: vector.y / scalar };
    };

    //negacion
    neg() {
        return { x: -this.x, y: -this.y };
    };

    //Retorna un vector perpendicular. Set `negate` to true for the perpendicular in the opposite direction.
    perp(vector, negate) {
        negate = negate === true ? -1 : 1;
        return { x: negate * -vector.y, y: negate * vector.x };
    };
    NAME(){
        return this.#NAME;
    }

}

class Tranform {

    #position = new Vector2D(0,0); // Posicion en la scena
    #scale = new Vector2D(1,1); // escala a aumentar de sprite y rigidbody
    #angle = 0; // angulo a tener sprite y rigidbody

    #speed = 1;
    #destinyMoveRef;
    //vectorDestinoMoveRef = null;

    #NAME = "Tranform";
    
    //move = null; 

    constructor(position, scale, angle) {
        this.setPosition(position);
        this.setScale(scale);
        this.setAngle(angle);

        this.#destinyMoveRef = this.#position;    
    }

    position(){
        return Utilities.variableCopy(new Vector2D(),this.#position);
    }

    setPosition(position){
        if(position && position.NAME == "Vector2D"){
            this.#position = position;
        }
    }

    scale(){
        return Utilities.variableCopy(new Vector2D(), this.#scale);
    }

    setScale(scale){
        if(scale && scale.NAME == "Vector2D"){
            this.#scale = scale;
        }
    }

    angle(){
        return this.#angle;
    }

    setAngle(angle){
        if( angle && isNaN(angle) ){
            this.#angle = angle;
        }
    }

    //----------  TIPOS MOVIMIENTOS A UN DESTINO --------------
    directionDisplacementToDestiny(origen, destino){
        
        /*
        //Distancia en X e Y entre el jugador y este enemigo (pitagoras => ditancia total (hipotenuza) ente dos objetos)
        this.distance = {
            // x : (this.x + this.sprite.ancho/2 == radio) y:(this.y + this.sprite.alto/2 == radio) --> posicion del punto centro del objeto

            x: ((this.position.X + this.scale.X/2) + this.radio) - ( (this.destinoMove.position.X + this.destinoMove.scale.X/2) + this.destinoMove.radio),
            y: ((this.position.Y + this.scale.Y/2) + this.radio) - ( (this.destinoMove.position.Y + this.destinoMove.scale.Y/2) + this.destinoMove.radio),
        }
        const angle = Math.atan2(this.distance.x, this.distance.y); // Pitagoras
        
        return {
            X:this.velocity.X * Math.sin(angle),
            Y:this.velocity.Y * Math.cos(angle) 
        };
        */

        //let vectorOrigen = new Vector(this.centro.X + this.radio, this.centro.Y + this.radio, 0);        
        
        return Vector2D.catetos(origen,destino); 
    }

    linearMoveToDestiny(dt, t){
        /*
            //let destino = new Vector(this.tranformDestinoMove.centro.X + this.tranformDestinoMove.radio,this.tranformDestinoMove.centro.Y + this.tranformDestinoMove.radio, 0);
            let speed = this.getVelocidadEnDireccionDestino(this.vectorDestinoMoveRef);

            this.position.X = this.position.X - speed.X ;
            this.position.Y = this.position.Y - speed.Y ;
        */

        let directionToDestiny = this.directionDisplacementToDestiny(this.#position ,this.#destinyMoveRef);
        let desplacement = new Vector2D(0,0);
        desplacement.x = this.#position.x + directionToDestiny.x  *  this.#speed;
        desplacement.y = this.#position.y + directionToDestiny.y  *  this.#speed;

        return desplacement;
    }

    moveCircularToDestiny(radio, angle, dt, t){
            //-----------------------------------------------
            //let destino = new Vector(this.tranformDestinoMove.centro.X + this.tranformDestinoMove.radio,this.tranformDestinoMove.centro.Y + this.tranformDestinoMove.radio, 0);
            //->let speed = this.getVelocidadEnDireccionDestino(this.vectorDestinoMoveRef);
            
            // if (this.frameGame % 10 === 0)//velocidad de movimiento circular
            //Parametrica de la circunferencia:
            //->let moveCircularX = this.radioMovimientoCircular * Math.cos(this.anguloRotacionRadian * t)*dt; // x = x + radio * cos(angleRadian*t)
            //->let moveCirculary = this.radioMovimientoCircular * Math.sin(this.anguloRotacionRadian * t)*dt; //y = y + radio * sen(angleRadian*t)
            
            //"PITAGORAS"
            //--> Suma la speed '+' =>  gana distancia(huye).  '-' => pierde distancia(persige) hasta tomar posicion del player {this.x - this.speed.x *50*dt}    
            //->this.position.X = (this.position.X - speed.X) + moveCircularX; // sin el moveCircularX => movimiento rectilineo uniforme en x 
            //->this.position.Y = (this.position.Y - speed.Y) + moveCirculary; // sin el moveCircularY => movimiento rectilineo uniforme en Y
            // TODO: Al alcanzar la posicion del player => rota alrededor del mismo con los moveCircularX,moveCircularY.
            //console.log("Angulo: ",this.anlgeRotation);
            //console.log("Distancia: ",Math.sqrt(this.distance.x * this.distance.x + this.distance.y * this.distance.y));
            //---------------------------------------------------------------------------------------------

        let directionToDestiny = this.directionDisplacementToDestiny(this.#position ,this.#destinyMoveRef);
        let moveCircularX = radio * Math.cos(angle * t)* dt; // x = x + radio * cos(angleRadian*t)
        let moveCirculary = radio * Math.sin(angle * t)* dt; //y = y + radio * sen(angleRadian*t)

        let desplacement = new Vector2D(0,0);
        desplacement.x = (this.#position.x - directionToDestiny.x * this.#speed) + moveCircularX;
        desplacement.y = (this.#position.y - directionToDestiny.y * this.#speed)  + moveCirculary;

        return desplacement;

    }

    //Los contenedores son creados en una funcion(mapa/ecena/creadora de encenario) quien armara todo y pasara a los contenedores lo que requieran (ej: player)
    //Su contenedor ejecutara este metodo una vez antes de utilizar el update luego
    setDestinoMove(vectorDestino){
        this.#destinyMoveRef = vectorDestino; // Vector centro de GameObject (Player)
    }
  
}

class Dibujo{

    color;
    puntos = [];
    anchoLinea;

    #NAME = "Dibujo";

    constructor(){}

    NAME(){
        return this.#NAME;
    }

    // ------ funciones de dibujo (Opcional uso) -------
    
    drawCirculo(ctx, pos = new Vector(0,0,0), radio = 0){
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(pos.X, pos.Y, radio, 0, 2 * Math.PI, false);
            ctx.fill();
    }

    drawRectangulo(ctx, pos = new Vector(0,0,0), altoAncho = new Vector(0,0,0)){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.fillRect(pos.X, pos.Y, altoAncho.X, altoAncho.Y);
        ctx.fill();
    }

    drawLienea(ctx, vectorPunto = [], ancholinea = 1){

    }

    //... mas figuras de ser necesario
    // ---------------------------------------------------


}
  
class Sprite{

    #image;
    #nroFrame; // total de frame
    // --- Valor establecido segun estado en maquina de estado-----
    startFrame;// inicio de una animacion dentro de una imagen de sprites com muchas animaciones
    endFrame; // fin de una animacion --> de ser undefailed startFrame y endFrame => se animara recorriendo todo los frame de la imagen
    //------------------------------
    currentFrame; // usado para pintar un frame (sprite especifico de la imagen de sprites)
    #frameGame;
    #scale; // dimenciones de corte
    #offset;//posicion x e y dentro de imagen donde sera punto de partida de corte 
    #NAME = "Sprite";
    
    //TODO : definir animaciones
    //animations;
    constructor(image, scale, offset, nroFrame = 0) {
        
        if(image && image.src){
            this.#image = image;
        }else{
            throw new Error(" The instance of a Sprite requires a correctly instantiated Image ");
        }

        this.setScale(scale);
        this.setOffset(offset);

        if(nroFrame && isNaN(nroFrame) && nroFrame >= 0){
            this.#nroFrame = nroFrame;
        }

        //sprite de imagen actual (posiciones)
        this.currentFrame = 0;

        //velocidad de animaciones o dibujado
        this.#frameGame = 0;
    }

    offset(){
        return Utilities.variableCopy(new Vector2D(),this.#offset);
    }

    setOffset(offset){
        if(offset && offset.NAME == "Vector2D"){
            this.#offset = offset;
        }else{
            //TODO: ver si lanzar error o tratar de otro modo
            throw new Error(" offset in the image of a sprite must be a Vector2D ");
        }
    }

    scale(){
        return Utilities.variableCopy(new Vector2D(),this.#scale);
    }

    setScale(scale){
        if(scale && scale.NAME == "Vector2D"){
            this.#scale = scale;
        }else{
            this.#scale = new Vector2D(1,1);
        }
    }

    frames(){
        return this.#nroFrame;
    }

    NAME(){
        return this.#NAME;
    }

}

class Animation{}


class Sonido{

    audio;
    #NAME = "Sonido";

    constructor(urlAudio, volumen = 1, repetir = false){

        this.audio = new Audio(urlAudio);
        this.audio.loop = repetir;
        this.audio.volume = volumen; // 0 a 1

        this.audio.addEventListener("abort",()=>{ console.log("La carga del recurso de audio se ha detenido, pero no por un error"); });
        this.audio.addEventListener("error",()=>{ console.log("La carga del recurso de audio multimedia se ha detenido, resultado de un error"); });
        this.audio.addEventListener("suspend",()=>{ console.log("La carga del recurso de audio multimedia se a suspendidio intencionalmente"); });
        
        this.audio.addEventListener("waiting",()=>{ 
            console.log("Reproducción detenido por ausencia (temporal) de datos"); 
            console.log("Estado de en red: ");
            
            switch(this.audio.networkState){
                case 0: console.log("No hay datos aún");break;
                case 1: console.log("No está descargando información");break;
                case 2: console.log("Está descargando información");break;
                case 3: console.log("No se encontró fuente .src");break;
                default : break;
            }

            /*.preload   ---> string	
            auto: (valor por defecto)
            metadata: sólo deben precargarse los metadatos
            none: no debe precargarse nada.

            ---------------------------------------------
            .readyState  --> numero	
            HAVE_NOTHING (0) - Sin información
            HAVE_METADATA (1) - Hay metadatos, sólo de búsqueda.
            HAVE_CURRENT_DATA (2) - Datos suficientes para punto actual.
            HAVE_FUTURE_DATA (3) - Datos suficientes para saltos cercanos.
            HAVE_ENOUGH_DATA (4) - Datos suficientes para saltos sin cortes

           */
        });

        this.audio.addEventListener("stalled",()=>{ console.log("El navegador intenta obtener datos de un recurso de audio pero no los recibe"); });

    }

    getUrl(){
        return this.audio.src;
    }

    getTiempoDuracion(){
        return this.audio.duration;
    }

    getTiempoReproduccionActual(){
        return this.audio.currentTime;
    }

    pausar(){
        //Pausa el sonido, con la posibilidad de reanudarlo
        this.audio.paused();
    }

    muteo(){
        if(this.audio.muted)
            this.audio.muted = false;
        else
            this.audio.muted = true;
    }

    reproducir(){
        //Comienza a reproducir (o reanuda) el audio en cuestión
        this.audio.play();
    }

    setVolumen(volumen = 1){
        this.audio.volume = volumen;
    }
    
    NAME(){
        return this.#NAME;
    }

}
//TODO
class Resources {
  constructor() {
    this.images = [];
    this.audios = [];
    this.failedResources = [];
  }

  addImage(src, name) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.images.push({name, image});
      this.checkLoadingStatus();
    };
    
    image.onerror = (event) => {
      console.error(`Error loading image: ${src}`);
      this.failedResources.push({ src, name, error: event });
      this.checkLoadingStatus();
    };
  }

  addAudio(src, name) {
    const audio = new Audio(src);
    audio.addEventListener('canplaythrough', () => {
      this.audios.push({name, audio});
      this.checkLoadingStatus();
    });
    audio.addEventListener('error', (event) => {
      console.error(`Error loading audio: ${src}`);
      this.failedResources.push({ src, name, error: event });
      this.checkLoadingStatus();
    });
  }

  checkLoadingStatus() {
    const totalResources = this.images.length + this.audios.length;
    const totalLoaded = this.images.filter(img => img.complete).length +
                        this.audios.filter(audio => audio.readyState === 4).length;

    if (totalLoaded === totalResources) {
      console.log('All resources loaded successfully.');
    } else {
      console.log(`${totalLoaded}/${totalResources} resources loaded.`);
    }

    if (this.failedResources.length > 0) {
      console.log('Failed to load the following resources:');
      this.failedResources.forEach(src => {
        console.log(src);
      });
    }
  }
}

/* // Uso de la clase Resources
const resourceManager = new Resources();

resourceManager.addImage('imagen1.jpg');
resourceManager.addImage('imagen2.jpg');
resourceManager.addAudio('audio1.mp3');
resourceManager.addAudio('audio2.mp3');
resourceManager.addImage('imagen3.jpg'); // Introducir un error intencional

// Luego de que todos los recursos se intenten cargar, llamar a checkLoadingStatus
resourceManager.checkLoadingStatus(); */

class Vertices2D{

    #points;// lista de objetos {x: number, y: number}
    #centre = null; //centro relativo a los vertices --> usado para posicionar los vertices a otro centro no relativo

    #NAME = "Vertices2D";

    constructor(arrayPoints){
        
        this.setVertices(arrayPoints);

    }

    verticesRef(){
        return this.#points;
    }
    verticesCopy(){
        return Utilities.variableCopy([],this.#points);
    }   
    centreRef(){
        return this.#centre;
    }
    centerCopy(){
        return Utilities.variableCopy(new Vector2D(),this.#centre);
    }

    NAME(){
        return this.#NAME;
    }

    setVertices(arrayPoints){
        //Exsiste un vertice si exsiste una interseccion entre los extremos de dos segmentos
        if(arrayPoints && arrayPoints.length > 2){
            
            this.#points = arrayPoints;
            
            //TODO: revisar si calculo 
            this.#centre = this.calculateCentre();
            //this.setCentro(centro);
        }else{
            throw new Error(" The number of points must be greater than or equal to 3 for the existence of vertices (intersection of two segments) ");
        }
        
    }

    /*
    Vertices.inertia = function(vertices, mass) {
        var numerator = 0,
            denominator = 0,
            v = vertices,
            cross,
            j;

        // find the polygon's moment of inertia, using second moment of area
        // from equations at http://www.physicsforums.com/showthread.php?t=25293
        for (var n = 0; n < v.length; n++) {
            j = (n + 1) % v.length;
            cross = Math.abs(Vector.cross(v[j], v[n]));
            numerator += cross * (Vector.dot(v[j], v[j]) + Vector.dot(v[j], v[n]) + Vector.dot(v[n], v[n]));
            denominator += cross;
        }

        return (mass / 6) * (numerator / denominator);
    };
    */
    calculateCentre() {
        let area = this.area(true);
        let centre = { x: 0, y: 0 };
        
        let j;

        for (var i = 0; i < this.#points.length; i++) {
            j = (i + 1) % this.#points.length;
            let cross = Vector2D.productCross(this.#points[i], this.#points[j]);
            let temp = Vector2D.mult(Vector2D.sum(this.#points[i], this.#points[j]), cross);
            centre = Vector2D.sum(centre, temp);
        }

        return Vector2D.div(centre, 6 * area);
    };
 
    rotate(center, angle) {
        const radians = angle * Math.PI / 180; // Convertir el ángulo a radianes
        const cx = center.x; // Coordenada x del centro
        const cy = center.y; // Coordenada y del centro
      
        // Iterar sobre cada vértice
        this.#points = this.#points.map(vertex => {
          const { x, y } = vertex;
      
          // Calcular las coordenadas relativas al centro
          const rx = x - cx;
          const ry = y - cy;

          // Aplicar la rotación a las coordenadas relativas
          const cosTheta = Math.cos(radians);
          const sinTheta = Math.sin(radians);
          const rotatedX = rx * cosTheta - ry * sinTheta;
          const rotatedY = ry * cosTheta + rx * sinTheta;
      
          // Sumar las coordenadas del centro a las coordenadas rotadas para obtener las coordenadas absolutas
          const absoluteX = rotatedX + cx;
          const absoluteY = rotatedY + cy;
      
          return { x: absoluteX, y: absoluteY };
        });
      
      }
    
    scale(scaleX, scaleY, point) {
        if (scaleX === 1 && scaleY === 1)
            return this.#points;

        point = point || this.calculateCentre();

        for (var i = 0; i < this.#points.length; i++) {
           let vertex = this.#points[i];
           let delta = Vector2D.res(vertex, point);

           this.#points[i].x = point.x + delta.x * scaleX;
           this.#points[i].y = point.y + delta.y * scaleY;
        }

    };

    traslate(vector2D){

        for (let i = 0; i < this.#points.length; i++) {

            this.#points[i].x += vector2D.x;
            this.#points[i].y += vector2D.y;
            
          } 
    }
    
    isConvex() {
        // http://paulbourke.net/geometry/polygonmesh/
        // Copyright (c) Paul Bourke (use permitted)

        var flag = 0,
            n = this.#points.length,
            i,
            j,
            k,
            z;

        if (n < 3)
            return null;

        for (i = 0; i < n; i++) {
            j = (i + 1) % n;
            k = (i + 2) % n;
            z = (this.#points[j].x - this.#points[i].x) * (this.#points[k].y - this.#points[j].y);
            z -= (this.#points[j].y - this.#points[i].y) * (this.#points[k].x - this.#points[j].x);

            if (z < 0) {
                flag |= 1;
            } else if (z > 0) {
                flag |= 2;
            }

            if (flag === 3) {
                return false;
            }
        }

        if (flag !== 0){
            return true;
        } else {
            return null;
        }
    };

    area (signed) {
        let area = 0;
        let j = this.#points.length - 1;

        for (var i = 0; i < this.#points.length; i++) {
            area += (this.#points[j].x - this.#points[i].x) * (this.#points[j].y + this.#points[i].y);
            j = i;
        }

        if (signed)
            return area / 2;

        return Math.abs(area) / 2;
    };
  

}

class Collider2D {

    #centre; //variacionLocalPosicion --> respecto a la posicion de dibujado

    #NAME = "collider2D";
    name = "collider2D";

    //Para uso mediante metodos:
    densidad;
    friccion;
    sensor;
    restitucion;

    constructor(centre){

        if(centre && centre.NAME() == "Vector2D"){
            this.#centre = centre;
        }else{
            throw new Error(" The collider2D has not been instantiated with its Vector2D center position");
        }

    }

    centerCopy(){
        return Utilities.variableCopy(new Vector2D(),this.#centre);
    }

    NAME(){
        return this.#NAME;
    }

}

class PoligonCollider2D extends Collider2D{

    #vertices;
    #radio;
    #bound;
    
    #NAME = "PoligonCollider2D";

    // centre == centro del sprite u objeto
    constructor(centre, sides, radio, vertices){
        
        super(centre);
        
        if(vertices && vertices.NAME == "Vertices2D" && vertices.length > 2){
            
            this.realPositioningToCenterRef(centre, vertices)
            this.#vertices = vertices;
            this.#bound = this.AABB(vertices.verticesCopy());

        }else if(vertices /*&& vertices.length > 2*/){

            console.log("entreee: ",vertices.length);
            this.#vertices = new Vertices2D(vertices);
            this.realPositioningToCenterRef(centre, this.#vertices)
            this.#bound = this.AABB(vertices);

        }/*else if(vertices){
            throw new Error(" The number of vertices must be greater than 2 in order to form a polygon. ");
        }*/ // TODO: Ya es contemplado por el constructor de la clase vertice nro. Vertices > 2 

        if(!this.#vertices || this.#vertices.length === 0){
            if(sides && radio /*&& sides > 2 && radio >= 0*/ ){
                this.radio = radio;
                this.#vertices = new Vertices2D(this.createVerticesPoligon(centre,sides,radio));
                this.#bound = this.AABB(this.#vertices.verticesCopy());
            }/*else{
                throw new Error(" The number of vertices must be greater than 2 in order to form a polygon. ");
            }*/
        }
    }

    realPositioningToCenterRef(centre, vertices){
        let distance = Vector2D.res(centre, vertices.centreRef());
        vertices.traslate(distance);
    }

    createVerticesPoligon(centre, numSegmentos, radio) {
        const vertices = []; // numSegmentos definir ese tamaño para no crear varios arreglos consumo de recursoso al ajutarse al tamaño
        const angulo = (2 * Math.PI) / numSegmentos;
      
        for (let i = 0; i < numSegmentos; i++) {
          const x = centre.x + radio * Math.cos(angulo * i); // + this.position.x
          const y = centre.y + radio * Math.sin(angulo * i);// + this.position.y
          vertices.push({ x, y }); 
        }
        return vertices;
    }

    AABB(vertices){
       let min_x = Infinity;
       let max_x = -Infinity;
       let min_y = Infinity;
       let max_y = -Infinity;
       
       for(let i=0; i < vertices.length; i++){
            let x = vertices[i].x;
            let y = vertices[i].y;

            if(x < min_x )
                min_x = x;
            if(y < min_y)
                min_y = y;
        
            if(x > max_x )
                max_x = x;
            if(y > max_y)
                max_y = y;
       }
       return {min_x, min_y, max_x, max_y};
    }

    boundsCopy(){
        return  Utilities.variableCopy({max_x:0, max_y:0, min_x:0, min_y:0},this.#bound);
    }

    verticesRef(){
        return this.#vertices.verticesRef();
    }

    verticesCopy(){
        return this.#vertices.verticesCopy(); 
    }
    //Al ser un atributo primitivo esta es obtenido por valor no por ref.
    radio(){
        return this.#radio
    }

    area(signed){
        return this.#vertices.area(signed);;
    }
   
    scale(xScale, yScale, point){
        this.#vertices.scale(xScale, yScale, point);
    }

    rotate(center, angle){
        this.#vertices.rotate(center, angle);
    }

    traslate(vector2D){
        this.#vertices.traslate(vector2D);
    }

}

class RectangleCollider2D extends PoligonCollider2D{
    
    #NAME = "RectangleCollider2D";

    constructor(centre, width = 4, height = 4){
        
        let points = [
            {x: centre.x + width/2, y: centre.y + height/2},
            {x: centre.x + width/2, y:centre.y - height/2},
            {x:centre.x - width/2, y:centre.y - height/2},
            {x:centre.x - width/2, y:centre.y + height/2}
        ]
        
        super(centre,0,0,points);
    }

    NAME(){
        return this.#NAME;
    }

}

class CircleCollider2D extends Collider2D{
    
    #radio = 0;
    #NAME = "CircleCollider2D";

    constructor(centre ,radio = 0){

        super(centre);

        if(radio && !isNaN(radio) && radio > 0){
            this.radio = radio;
        }else{
            throw new Error(" The radius of a CircleCollider2D must be a number greater than 0 ");
        }
        
    }

    radio(){
        return this.#radio;
    }

    NAME(){
        return this.#NAME;
    }

}
 
//Definir cual sera cinfiguracion por defecto
class CollisionFilter {

    group;
    category;
    mask;

    #NAME = "CollisionFilter";
    name = "CollisionFilter"; 

    constructor(group, category, mask){

        if(group, category, mask){

            this.category = category;
            this.group = group;
            this.mask = mask;    
        
        }else{
            //TODO: Ver si cambiar formato de valores
            this.category = 0x0001;
            this.mask = 0xFFFFFFFF;
            this.group = 0; 
            
        }     
        
    }

}

class RigidBody2D{

    collisionFilter;
    #collider2D;

    //------------ Para motor de fisica -------------
    type; //static : la fisica no lo afecta dianmic : la fisica lo afecta
    mass;
    gravityScale;
    angleVelocity;
    linearVelocity;
    linearDamping;
    angularDamping;
    fixedRotation; //rotacion fija
    //------------  ---------   ------- ------------

    constructor(collider2D, collisionFilter){
        
        if(collisionFilter && collisionFilter.NAME == "CollisionFilter"){
            this.collisionFilter = collisionFilter;
        }else{
            this.collisionFilter = new CollisionFilter(); //configuracion por defecto
        }

        if(collider2D && collider2D.NAME() === "PoligonCollider2D" || collider2D.NAME() === "RectangleCollider2D" || collider2D.NAME() === "CircleCollider2D"){
            this.#collider2D = collider2D;
        }

        //TODO: instanciacion de atributos utilizados para motor de fisica
        
    }

    collider(){
        return this.#collider2D;
    }

    //TODO: pendiente para motor de fisica
    applyForce(){

    }
    applyAngularForce(){

    }

}

class Component{

    life;  //TODO: destroy (Tener en cuenta el patron pool de objetos para mayor rendimiento cuando la agregacion y eliminacion es frecuente)
    render;
    //nroLayer; 
   
    collisionFilter;

    parts;
    rigidBody;
    tranform;

    sprite;
    dibujo = new Dibujo();// Ver nombre y si quetar o no
    song;

    static keyboard = new TecladoControl();
    static mouse = new mouseControl(); 

    #NAME = "Component";//nombre de clase
    name = "Component"; //nombre por el cual se buscara en los contenedores (debe cambiarlo el ususario segun su necesidad)

    frameGame = 0;

    constructor(tranform, sprite, rigidBody){
        
        this.collisionFilter = new CollisionFiler();

        if(sprite && sprite != null){
            if(sprite.NAME() == "Sprite"){
                this.sprite = sprite;
            }
        }

        this.deteccionColision = boolDeteccionColision;
   
        if(ComponenteColision && ComponenteColision != null)
            this.ajustarDimensionesDetectarColision(ComponenteColision);

        this.life = 1;
        this.renderizar = true;

    }

    setNombreBusqueda(name = "GameObject"){
        this.name = name;
    }

    NAME(){
        return this.#NAME;
    }

    #update(dt,t){

        this.centro = new Vector(this.posicion.X + this.altoYancho.X/2, this.posicion.Y + this.altoYancho.Y/2, 0);

        this.frameGame++;
        this.updateFrame(dt,t);
        this.escucharMouseEventosEnObj(dt,t); //AREGLAR


    }

    updateFrame(dt,t){
        //acciones a ralizar en cada frame definidas por el usuario
    }
    //------------------ Eventos producidos sobre el objeto por el mouse --------------------

    mouseSobreObj(){
        //acciones definidas por el usuario
    }
    mousePresedEnObj(){
        //acciones definidas por el usuario
    }

    mouseClickEnObj(){
        //acciones definidas por el usuario
    }
    
    #escucharMouseEventosEnObj(dt,t){
        let M = new CirculoColision( 1,new Vector(GameObject.mouse.position.X, GameObject.mouse.position.Y, 0) );
        let mouseObjeto = new GameObject(new Tranform(),null,M,true);
        mouseObjeto.setNombreBusqueda("mouse");//Ver por nombre de clase en actualizarEstadoPorColision

        let estadoColision = this.verificarColision(mouseObjeto,this);
        let estadoMouse = GameObject.mouse.getEstado();

       if(this.frameGame % 1.5 == 0){

            if(estadoColision && estadoMouse.isDown){
                this.mousePresedEnObj();
            }else if(estadoColision && estadoMouse.pressed){
                this.mouseClickEnObj()
            }else if(estadoColision){
                this.mouseSobreObj();
            }
        }
    }

    //----------------------------------------------------------------------------------------

    maquiaEstado(){ 
        //Cambios de estados definidas por el usuario
    }

    ajustarDimensionesDetectarColision(ComponenteColision){
        // Arreglar añadiendo atributo a comoponentes de "posActual" = posTranform + veriacionLocalPos
       if(ComponenteColision.NAME() == "CirculoColision"){
            ComponenteColision.variacionLocalPosicion =  ComponenteColision.variacionLocalPosicion.sumar(this.centro);    
            this.dimencionColision = ComponenteColision;
       }else if(ComponenteColision.NAME() == "RectanguloColision"){
            ComponenteColision.variacionLocalPosicion =  ComponenteColision.variacionLocalPosicion.sumar(this.posicion);
            this.dimencionColision = ComponenteColision;
       }else{ 
            this.dimencionColision = null; 
       }

    }

    setSonido(urlAudio){
        this.sonido = new Sonido(urlAudio);
    }

    setLife(vidaObjeto){
        this.life = vidaObjeto;
    }

    setRender(boolean){
        this.renderizar = boolean;
    }
    
    draw(ctx){/* uso de objeto dibujo en clases hijas */}

    //parametro: obejeto a analizar por un evento o cambio de estado producto de ca,bio de estado de objeto especifico
    //actualizarEstadoPorEvento(GameObject){/* Segun el estado del obejto y el de otro cambiar de estado */}
    
    //Parametro : objeto con el que colisiono
    actualizarEstadoPorColision(GameObject){/*cambio de estado de propiedades producto de colisionar con algun objeto en especifico*/}
   
    onColission(colision){}
    onEnterColision(colision){}
    onExitColision(colision){}

    //Parametro: objeto a analizar si se colisiono con el o no
    verificarColision(GameObject){// ver y terminar
        
        let colisiono = false;

        if(GameObject.dimencionColision.NAME() == "CirculoColision" && this.dimencionColision.NAME() == "CirculoColision"){
            colisiono = this.collisionEntreCircle(GameObject.dimencionColision,this.dimencionColision);
            
        }else if(GameObject.dimencionColision.NAME() == "RectanguloColision" && this.dimencionColision.NAME() == "RectanguloColision"){
            colisiono = this.colisionEntreRect(GameObject.dimencionColision,this.dimencionColision);
             
        }else if(GameObject.dimencionColision.NAME() == "RectanguloColision" && this.dimencionColision.NAME() == "CirculoColision"){
            colisiono = this.colisionRectConCircle(GameObject.dimencionColision,this.dimencionColision);
               
        }else if(GameObject.dimencionColision.NAME() == "CirculoColision" && this.dimencionColision.NAME() == "RectanguloColision"){
            colisiono = this.colisionRectConCircle(this.dimencionColision, GameObject.dimencionColision);
        }

        if(colisiono){
            this.actualizarEstadoPorColision(GameObject);
        }

       // console.log(this.N+"  --  "+GameObject.N+" --- estado Colision: "+colisiono);

        return colisiono;
    }

//TODO : VER
    scale(scale){
        //actualizar rigibody
        //actualizar sprite
    }

    rotate(angleRad, point){
        //actualizar rigibody
        //actualizar sprite
    }

    traslate(position){
        //tranform
        //actualizar rigibody
        //actualizar sprite
    }

}

class Collision2D{

    #collision2D;
    #notifyCollision;

    detecteColision(components, updateStateOfCollisionChild = true){

        //if(!container.childrens){ return []; }
        //let childrens = container.childrens;
        
        this.#collision2D = [];
        this.#notifyCollision = updateStateOfCollisionChild;

        c = components;

        for(i = 0; i < components.length; i++){
  
            if(c[i].filterColision().group >= 0){

                if(c[i].filterColision().type == "Container"){    
                    
                    if(c[i].filterColision().collisionBetweenChildren){ 
                        detecteColision(c[i].childrens); 
                    }
                }
            
                for(j = i+1; j < components.length; j++){
                    
                    if(c[i].filterColision().type == "component" && c[j].filterColision().type == "component"){
                        this.checkCollisionBetweenComponents(c[i],c[j]);
        
                    }else if(c[i].filterColision().type == "Component" && c[j].filterColision().type == "Container"){
                        this.checkCollisionBetweenContainerAndComponent(c[i],c[j]);

                    }else if(c[i].filterColision().type == "Container" && c[j].filterColision().type == "Component"){
                        this.checkCollisionBetweenContainerAndComponent(c[j],c[i]); 

                    }else if(c[i].filterColision().type == "Container" && c[j].filterColision().type == "Container"){
                        this.checkCollisionBetweenContainers(c[i],c[j]);
                    }
            
                }           
            }
        }

        this.#notifyCollision = true;
        return this.#collision2D;

    } 

    checkCollisionBetweenComponents(Component1, Component2){

        if(this.CheckCondicionFilterCollision( Component1.filterCollision(), Component2.filterCollision() ) ){

            if( this.verifyCollision(Component1.getCollider2D(), Component2.getCollider2D()) ){
                
                this.#collision2D.push({Component1, component2}); // Registro de colisiones

                if(this.#notifyCollision){
                    Component1.onCollision(Component2);
                    Component2.onCollision(Component1);
                }

            }
        }

        this.checkCollisionBetweenContainerAndComponent(component1.parts, component2);
        this.checkCollisionBetweenContainerAndComponent(component2.parts, component1);
        this.checkCollisionBetweenContainers(component1.parts, component2.parts);

    }

    checkCollisionBetweenContainerAndComponent(container, component){

        if( !this.CheckCondicionFilterCollision(container.filterCollision(), component.filterCollision()) ){
            return;
        }

        for(let i = 0; i < container.childrens.length; i++){
            let child = container.childrens[i];

            if(child.filterCollision().type  == "Component"){
                     
                this.checkCollisionBetweenComponents(child, component);

            }else if(child.filterCollision().type  == "Container"){

                if( this.CheckCondicionFilterCollision(child.filterCollision(), component.filterCollision()) ){
                    this.checkCollisionBetweenContainerAndComponent(child, component);
                }
            }
        }

    }

    checkCollisionBetweenContainers(container1, container2){

        if( !this.CheckCondicionFilterCollision(container1.filterCollision(), container2.filterCollision()) ){
            return;
        }
        
        for (let child_C1 = 0; child_C1 < container1.childrens.length; child_C1++) {
            let childC1 = container1.childrens[child_C1];

            if(childC1.filterCollision().type  == "Container"){
                this.checkCollisionBetweenContainers(childC1, container2);

            }else{
                for (let child_C2 = 0; child_C2 < container2.childrens.length; child_C2++) {
                    let childC2 = container2.childrens[child_C2];

                    if(childC2.filterCollision().type  == "Container"){
                        this.checkCollisionBetweenContainers(childC2, container1);

                    }else{
                        if(childC2.filterCollision().type  == "Component" && childC1.filterCollision().type  == "Component"){
                            this.checkCollisionBetweenComponents(childC1, childC2);
                        }       
                    } 
                }
            }
        }

    }


    verifyCollision(collider2D1, collider2D2){
        //TODO: Terminar
        if(collider2D1.nameClass() == "AABB" && collider2D2.nameClass() == "AABB"){

        }else if(collider2D1.nameClass() == "Circle2D" && collider2D2.nameClass() == "AABB"){

        }

        return false;

    }

    //checkAABB(bounds1, bounds2) :  boolean
    checkCollisionAABB(bound1, bound2){ //Interseccion entre rectangle2D que no puede ser rotado

    }

    checkCollisionBetweenAabbAndCircle(bound, circle){ //Interseccion entre rectangle2D and circle2D
        /*
        
            // Círculo con centro en (cx,cy) y radio r
            // Rectángulo con esquina superior izquierda en (x,y) ancho w y algo h
            // Punto (en verde) del perímetro del rectángulo más cercano a la circunferencia en (px,py)
            px = cx; // En principio son iguales
            if ( px < x ) px = x;
            if ( px > x + w ) px = x + w;
            py = cy;
            if ( py < y ) py = y;
            if ( py > y + h ) py = y + h;
            distancia = sqrt( (cx - px)*(cx - px) + (cy - py)*(cy - py) );
            if ( distancia < r ) {
                // Colisión detectada
            }
        
        */
    }

    checkCollisionBetweenCircles(circle1, circle2){ //Interseccion entre circle2D
        // círculo 1 con centro en (cx1,cy1) y radio r1
        // círculo 2 con centro en (cx2,cy2) y radio r2
        distancia = sqrt( (cx1 - cx2)*(cx1 - cx2) + (cy1 - cy2)*(cy1 - cy2) );
        if ( distancia < r1 + r2 ) {
            // Colisión detectada
        }
    }

    //------------------ EN DESARROLLO ---------------------
    //https://www.codeproject.com/Articles/15573/2D-Polygon-Collision-Detection
    //collisionBetweenPolygons(Poligon2D,Poligon2D) : { pointsIntersection:Point[], collisioned:boolean }
    doPolygonsIntersect (a, b) {
        var polygons = [a, b];
        var minA, maxA, projected, i, i1, j, minB, maxB;
    
        for (i = 0; i < polygons.length; i++) {
    
            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            var polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {
    
                // grab 2 vertices to create an edge
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];
    
                // find the line perpendicular to this edge
                var normal = { x: p2.y - p1.y, y: p1.x - p2.x };
    
                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < a.length; j++) {
                    projected = normal.x * a[j].x + normal.y * a[j].y;
                    if (isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    if (isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }
    
                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b[j].x + normal.y * b[j].y;
                    if (isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    if (isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }
    
                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    //CONSOLE("polygons don't intersect!");
                    return false;
                }
            }
        }
        return true;
    };

    collisionBetweenPolygonAndCircle(){

    }
    // : pointsIntersection
    intersectBetweenSegments(){}

    //-----------------------------------------------

}

class ContentinerComponent extends Container{

    maxHijos;
    frameGame;

    #NAME = "ContenedorGameobject";// nombre de clase
    name = "ContenedorGameobject";// nombre por el cual se buscara en un contenedor

    colisionEntreHijosEsteCont = true;
    // Utilizado para no detectar y recorrer por colisiones o si entre hijos de un mismo contenedor. --> esto mejora rendimiento y cantidad de objetos soportados
    // (Ej cuando false : entre paredes donde solo es necesario con otro contenedor de players o bullets).
    
    NAME(){
        return this.#NAME;
    }

    update(dt,t){

        for(let child = 0; child < this.childrens.length; child++){

            if(this.childrens[child].update) {
                this.childrens[child].update(dt, t);
            }
            this.updateEstadoObjetoCrear(this.childrens[child]);

            if(this.colisionEntreHijosEsteCont){

                for(let child_1 = child; child_1 < this.childrens.length; child_1++){
                    
                    if(child_1 != child){
                        this.actualizarEstadoColisionEntreHijos(this.childrens[child],this.childrens[child_1]);
                    }
                }

            }

        }

        //Para añadir funciones con eventos para manipular los child
        for(let i = 0; i < this.coleccionFunciones.length; i++){
            this.coleccionFunciones[i](this);
        }

        this.actualizarEstadoVida();
    }

    actualizarEstadoVida(){
        if(this.childrens.length == 0){
            this.muerto = true;
        }

        for(let i = 0; i<this.childrens.length; i++){
            if(this.childrens[i].Life){
                if(this.childrens[i].Life > 0){
                    this.muerto = false;
                    i = this.childrens.length; 
                }

            }else if(this.childrens[i].childrens){
                 if(this.childrens[i].muerto == false){
                    this.muerto = false;
                    i = this.childrens.length; 
                }
                
            }
        }
    }

    updateEstadoObjetoCrear(hijo){
        
        let creacionesDeHijo = [];

        if(hijo.obtenerObjetoGenerar){
            creacionesDeHijo = hijo.obtenerObjetoGenerar();

            for(let i = 0; i < creacionesDeHijo.length; i++){
                if(creacionesDeHijo[i].crear){
                    this.add(creacionesDeHijo[i]);
                }
            }

        }

    }
    //TODO: Redefinir los IF y nombres de metodos pero mismo esquema logico de verificacion de colisiones:
    //------------- sistema de colisiones "En clase Collision" ------------
    actualizarEstadoColisionEntreHijos(hijo1,hijo2){
        
        
        if(hijo1.childrens && hijo1.NAME() == "ContenedorGameobject" && hijo2.childrens && hijo2.NAME() == "ContenedorGameobject"){
            this.actualizarEstadosColisionEntreConteiners(hijo1,hijo2);
            
        }else if(hijo1.childrens && (hijo1.NAME() == "ContenedorGameobject" || hijo1.NAME() == "Container") &&  hijo2.NAME() != "ContenedorGameobject" && hijo2.NAME() != "Container" ){
            this.actualizarColisionEntreContainerHijo(hijo2, hijo1);

        }else if( (hijo1.NAME() != "ContenedorGameobject" && hijo1.NAME() != "Container") && hijo2.childrens && (hijo2.NAME() == "ContenedorGameobject" || hijo2.NAME() == "Container")){
            this.actualizarColisionEntreContainerHijo(hijo1, hijo2);
           
        }else if(hijo1.NAME() != "ContenedorGameobject" && hijo2.NAME() != "ContenedorGameobject"){
            if(hijo1.deteccionColision == true && hijo2.deteccionColision == true){
              
                if(hijo2.verificarColision(hijo1))
                    hijo1.actualizarEstadoPorColision(hijo2);

            }
                                  
        }
                        
    }

    actualizarColisionEntreContainerHijo(hijo, container){

        for(let i = 0; i < container.childrens.length;i++){

            if(container.childrens[i].NAME() != "ContenedorGameobject" && !container.childrens[i].childrens){
            
                if(container.childrens[i].deteccionColision == true && hijo.deteccionColision == true){
                    if(hijo.verificarColision(container.childrens[i]))
                        container.childrens[i].actualizarEstadoPorColision(hijo);
                }
                
            }else{
                if(hijo.deteccionColision == true){
                    actualizarColisionEntreContainerHijo(hijo, container.childrens[i]);
                }
            }

        } 

    } 

    actualizarEstadosColisionEntreConteiners(conteiner1,conteiner2){
        
            for (let child_C1 = 0; child_C1 < conteiner1.childrens.length; child_C1++) {
                if(conteiner1.childrens[child_C1].childrens){
                    this.actualizarEstadosColision(conteiner1.childrens[child_C1], conteiner2);
                }else{
                        for (let child_C2 = 0; child_C2 < conteiner2.childrens.length; child_C2++) {
    
                            if(conteiner2.childrens[child_C2].childrens){
                                this.actualizarEstadosColision(conteiner2.childrens[child_C2], conteiner1);
                            }else{
                            
                                if(conteiner1.childrens[child_C1].deteccionColision == false ){
                                    child_C2 = conteiner2.childrens.length;
                                }else{
    
                                    if(conteiner2.childrens[child_C2].deteccionColision == true && conteiner1.childrens[child_C1].deteccionColision == true){
                                       conteiner2.childrens[child_C2].verificarColision(conteiner1.childrens[child_C1]);
                                       conteiner1.childrens[child_C1].verificarColision(conteiner2.childrens[child_C2]);
                                    }
                                   
                                }
                            } 
                        }
    
                    }
            }
    }

    //-----------------------------------------------

}

class Scene{

    static contenedorObjetos = new ContenedorGameobject();

    update(dt,t){
        Ecenario.contenedorObjetos.update(dt,t);
    }

    static buscarObjeto(name){
        return Ecenario.contenedorObjetos.buscarEnContenedor(name , Ecenario.contenedorObjetos);
    }

    add(hijo){
        Ecenario.contenedorObjetos.add(hijo);
    }


    /*
    buscarEnContenedor(name,contenedor){

        let arrayResultadosBusqueda = [];
        let i_ = contenedor.length;
       
        for(let i = 0; i < this.contenedor.length; i++){

            if(i == i_){

                if(contenedor.childrens[i].name == name){
                    arrayResultadosBusqueda.push(contenedor.childrens[i]);
                }else if(contenedor.childrens[i].childrens && (contenedor.childrens[i].NAME() == "ContenedorGameobject" || contenedor.childrens[i].NAME() == "Container") ){
                   
                    let array = this.buscarEnContenedor(name,contenedor.childrens[i]);
                    if(array.length > 0){
                        arrayResultadosBusqueda = arrayResultadosBusqueda.concat(array);
                    }

                }

                i = contenedor.length;

            }else{

                if(contenedor.childrens[i].name == name){
                    arrayResultadosBusqueda.push(contenedor.childrens[i]);
                }else if(contenedor.childrens[i].childrens && (contenedor.childrens[i].NAME() == "ContenedorGameobject" || contenedor.childrens[i].NAME() == "Container") ){
                   
                    let array = this.buscarEnContenedor(name,contenedor.childrens[i]);
                    if(array.length > 0){
                        arrayResultadosBusqueda = arrayResultadosBusqueda.concat(array);
                    }

                }

                if(contenedor.childrens[i_].name == name){
                    arrayResultadosBusqueda.push(contenedor.childrens[i_]);
                }else if(contenedor.childrens[i_].childrens && (contenedor.childrens[i_].NAME() == "ContenedorGameobject" || contenedor.childrens[i_].NAME() == "Container") ){
                   
                    let array = this.buscarEnContenedor(name, contenedor.childrens[i_]);
                    if(array.length > 0){
                        arrayResultadosBusqueda = arrayResultadosBusqueda.concat(array);
                    }
                    
                }

            }

            i_--;
                  
        }

        return arrayResultadosBusqueda;

    }
    */
}

class Camara{

    static #posicionEnfocar;
    static #altoAnchoVisualizacion;// alto ancho Cavnas
    
   static getAltoAnchoVisualizacion(){
        // pasar por valor no por referencia
        return new Vector(this.#altoAnchoVisualizacion.X, this.#altoAnchoVisualizacion.Y, this.#altoAnchoVisualizacion.Z);
    }

    static setPosicionEnfoque(vector){
        if(vector.NAME && vector.NAME() == "Vector")
            this.#posicionEnfocar = vector;
    }

    static getPosicionEnfoque(){
        // pasar por valor no por referencia
        return new Vector(this.#posicionEnfocar.X,this.#posicionEnfocar.Y,this.#posicionEnfocar.Z);
    }

    static setAltoAnchoVisualizacion(vector){
        if(vector.NAME && vector.NAME() == "Vector")
            this.#altoAnchoVisualizacion = vector;
    }

    static updateCam(ctx){
        
    }

    static desplazar(nuevaPosEnfocar, velocidad){

    }

    temblar(){

    }
}


//---------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------


class Player extends GameObject {

     defensa = 0;
     life = 1;
     velocityAttack = 0.15;
     nameBullet = "null";
     dead;

     arrayUrlSprites =[];
     arrayFunctionsUpdate = [];

    constructor(tranform, urlImagen, nroFrameSprite, vectorAltoAnchoSprite) {

        super(tranform, urlImagen, nroFrameSprite, vectorAltoAnchoSprite);
        this.dead = false;

    }

    update(dt, t) {

        this.position.X += this.velocity.X * this.keyControl.X;
        this.position.Y += this.velocity.Y * this.keyControl.Y;
   

        this.frameGame++;

        if (this.frameGame % 3 === 0){ //velocidad de animacion
            this.currentFrameSprite = this.currentFrameSprite > this.nroFrameSprite ? this.currentFrameSprite = 0 : this.currentFrameSprite + 1;
           // this.currentFrameSprite = this.currentFrameSprite > this.nroFrameSprite ? this.currentFrameSprite = 0 : this.currentFrameSprite + 1;
        }

        for(let i=0; i < this.arrayFunctionsUpdate.length;i++){
            this.arrayFunctionsUpdate[i](this);
        }

    }

    //De ser dibujos de canvas => crear funcion draw y listo

    setEquipameinto(defensa, life, velocityAttack, nameBullet) {

        this.defensa = defensa;
        this.life = life;
        this.velocityAttack = velocityAttack
        this.nameBullet = nameBullet;

    }

    //El contenedor tendra un set control que se ejecutara una sola ves => todo los child que tengan el metodo seran ejecutados.
    setControls(keyControl){ // por ref
        this.keyControl = keyControl;
    }

    updateLife(damage){
        //let dif = damage - this.defensa; //daño siempre debe ser mayor 

        this.life -= damage;
        if(this.life <= 0)
            this.dead = true;

    }

    getLife(){
        return this.life;
    }

    getDead(){
        return this.dead;
    }
    

}
/*
class Particula extends Sprite {
    // ver funciones para contrucotr draw
    constructor(tranform,timeLife){
        
        super(tranform, null, 0 , null);
        this.timeLife = timeLife;
    }

    constructor(tranform, Image, nroFrameSprite, DimensionesCadaSprite, timeLife) {
        
        this.timeLife = timeLife;
        // VelocidadEje * (Math.random()- 0.5)  --> el random *0.5 es para que se mueva en cualquir direccion(puede alterarse en el parametro de velocidad del tranform)
        super(tranform, color, Image, nroFrameSprite, DimensionesCadaSprite);
        //this.type = "particle"; //para el canvasRender
    
        /*
        NOTAS:
        opcional uso : this.rotation = Math.random() * 6.2;
        -----------
        Para la posiciones en X = mouse.x e Y=mouse.y con el mouse/similares, su referencia es toda la ventana de navegador =>. 
        this.x = x - this.width / 2;
        this.y = y - this.height / 2;
        -----------
        
        
    }

    //objeto sound
    setSoundCreation(urlSong){
        this.sound = new Audio();
        this.sound.src = urlSong;
    }

    playSound(){
        this.sound.play()
    }

    stopSound(){
        this.sound.paused();
    }

    setSprite(urlImagen, nroSprites, vectorAltoAnchoCadaSprite){
        this.imagen = new Image();
        this.imagen.src = urlImagen;
        this.altoSprite = vectorAltoAnchoCadaSprite.Y;
        this.anchoSprite = vectorAltoAnchoCadaSprite.X;
        this.nroFrameSprite = nroSprites;
    }


    update(dt, t) {
        // Con this.velocity --> se definira el movimiento (hacia un destino, despercion) es dercir la direcciones de movimiento
        this.position.X = this.position.X + this.velocity.X * dt;
        this.position.Y = this.position.Y + this.velocity.Y * dt;

        this.frameGame++;


        if (this.frameGame % 1 === 0) {
            this.timeLife--;
        }

        //Tiempo entre frameSprites
        if(this.nroFrameSprite > 0 && this.frameGame % 10 === 0){
            this.currentFrameSprite++;
        }

        //Caso que el time life soporte mas de un ciclo de animacion
        if(this.nroFrameSprite === this.currentFrameSprite)
            this.currentFrameSprite = 0;

    }

    getLife(){
        if(this.timeLife <= 0)
            return true; //dead
        else 
            return false;//not dead
    }

}*/

/*
class Bullet extends Sprite {
    //nameBullet --> utilizado para comparar y saber a que equipamiento del player corresponde

    carcateristicas = { daño: 1, timeLife: 100, nameBullet: "sample", keyParticle: 1 }; //añadir mas caracteristicas de ser nesesario, como aumento en velocidad etc.
    //TODO
    constructor(tranform, urlImagen, nroFrameSprite, vectorAltoAnchoSprite) {
                //esto
        super(tranform, urlImagen, nroFrameSprite, vectorAltoAnchoSprite);
      

    }
    //todo
    setCaracteristicas(daño){

    }

    generarBullet(sprite, daño, timeLife, name, keyParticle){
        
        sprite.daño = daño;
        sprite.timeLife = timeLife;
        sprite.name = name;
        sprite.key = keyParticle;


        sprite.update = function(dt, t){
            this.position.X = this.position.X + this.velocity.X * dt;
            this.position.Y = this.position.Y + this.velocity.Y * dt;

            this.timeLife--;
        }


        sprite.getLife = function(){
            
            if(this.timeLife <= 0)
                return true; //dead
            else 
                return false;//not dead
        
        }

        return sprite;

    }

    update() {

        this.position.X = this.position.X + this.velocity.X * dt;
        this.position.Y = this.position.Y + this.velocity.Y * dt;

        this.timeLife--;
    }

    getLife(){
        if(this.timeLife <= 0)
            return true; //dead
        else 
            return false;//not dead
    }

}
*/
class Enemy extends Sprite {


    //TODO : Crear Maquina de Estados

    life;
    damage;
    name;
    keyParticleDestruction; // Utilizado para instanciar las particulas al ser destruido

    draw = null;
    dead = 0;

    //Utilizado para movimiento circular
    //radioMovimientoCircular = 1200;
    //anguloRotacionRadian = Math.PI*3;
    //-------------------------------

    coleccionFuncionesUpdate = [];
    coleccionSprites = [];

    constructor(tranform, urlImage, nroFrameSprite, vectorAltoAnchoSprite){
        super(tranform, urlImage, nroFrameSprite, vectorAltoAnchoSprite);
    }

    setEquipameinto(life, damage, name, keyParticulaDestruccion){

        this.life = life;
        this.damage = damage;
        this.name = name;
        this.keyParticleDestruction = keyParticulaDestruccion;
    
    }

    update(dt, t) {

        this.frameGame++;
        
        if (this.frameGame % 3 === 0 && this.imagen != null && this.nroFrameSprite > 0 ) //velocidad de animacion
            this.currentFrameSprite = this.currentFrameSprite > this.nroFrameSprite ? this.currentFrameSprite = 0 : this.currentFrameSprite + 1;

        if(this.move != null){
            this.move(dt,t);            
        }

        for(let i = 0; i < this.coleccionFuncionesUpdate.length; i++)
            this.coleccionFuncionesUpdate[i](this);
    }
  
    updateLife(damage){
        //let dif = damage - this.defensa; //daño siempre debe ser mayor 
        this.life -= damage;
        if(this.life <= 0)
            this.dead = true;
   
    }

    getLife(){
        return this.life;
    }
}


/*NOTA: Tener un Contenedor Scene que represente el mapa => dentro en una funcion que se inicialicen y creen player-enemigos - controles -etc todo
        lo que estara presente en el scene (incluyendo sus contenedores bullet-enemys - etc) => no en el inicio la creaciones (Cada ecenario es un mapa o mundo aparte de los demas)  

  NOTA: si se quiere tener enemigos que disparen => anadir una funcion en el contenedor secene que recorra el contenedor de enemigos y verifique que child son los que disparan y ver
      si dispararo o no (es decir, si su estado de bullet es true o false y que tipo es => añadir en el contenedor de bullet).
      => child tiene metodo que retorna estado y tipo de bullet(u objeto bullet => solo es añadido luego).



*/
//----------------------------------------------------------------------------------------------------------------------------


//----------------------  Contenedores (Cada contenedor gestiona que cuando y como pintar en pantalla sus objetos) ------------

//Conteiner ver como mover todos sus hijos al mover conteiner
//Ver escalado

// todo los contenedores conocen al Player y controles

class contenedorBullets extends Container {

    contenedor_particulas;
    BD;

    //TODO: Pendiente: lista de configuracion aca segun lo que tenga equipado el player (ya sea por powers up o equipamiento) Ver tambien esto en player
    constructor(mouseControl, player, ConteinerParticle) {

        super();
        this.contenedor_particulas = ConteinerParticle; // ref
        //this.type = "contBullets";
        //bullet añadidas por el player (tambien es valido añadir bullet de enemigos en este contenedor no probocados por eventos de perifericos)
        this.mouseControl = mouseControl;
        this.player = player //referencia al player.


        this.ultimaAccionTime = 0;
        this.BD = new Controlador();

    }



    update(dt, t) {

        for (let i = 0; i < this.childrens.length; i++) {

            if (this.childrens[i].update) {
                this.childrens[i].update(dt, t);
            }

            if (this.childrens[i].getLife()) { //dead

                //Solo se contempla un Sprite no varias particulas => Opcional for 
                this.generarEfectoDestuctionBullet(i);
                this.childrens.splice(i, 1);
            
            }

        } 
        this.generateBulletPlayer(dt, t); //Requiere de mouseControl, player
    }

    // Ver y hacer mas claro los nombres de las funciones generar
    generateBulletPlayer(dt, t){

        //Para mas de un jugador en pantalla => if(keyControl.KeyPresed === players[i].keysMove)  => definir un for para iterar entre players
        //Al hacer click y pasar una pqeuña catidad de tiempo entre bullet creados de instancia otra 
        
        if (this.mouseControl.pressed && (t - this.ultimaAccionTime) > this.player.velocityAttack) {

            this.ultimaAccionTime = t; // Para velocidad de generado de bullet t --> time current 

            const angleClickRespectoPlayer = Math.atan2(this.mouseControl.position.x - (this.player.position.X + this.player.scale.X / 2), this.mouseControl.position.y - (this.player.position.Y + this.player.scale.Y / 2));
            let configuracionBullet = this.BD.buscarEnJSON(this.BD.bulletsConfguraciones, this.player.nameBullet);

            let positionRespawn = {
                X: this.player.position.X + this.player.scale.X/2,
                Y: this.player.position.Y + this.player.scale.Y/2,
                Z: 0
            }

            // Definir con funciones segun el tipo de bala(ya que puede variar en movimiento-etc) => la funcion a ejecutar switch
            this.generarBulletEnConteiner(configuracionBullet, angleClickRespectoPlayer, positionRespawn);
    
        }
    }

    
    generarBulletEnConteiner(configuracionBullet, angleDirectionOrigenDestino, positionRespawn){
        
        //puede ser utilizado para disparo de enemigos
        //bullet con movimiento en una direccion => no persigen
       
        const velocity = {
            //Determina el tipo de movimiento como su velocidad de moviemiento
            X: Math.sin(angleDirectionOrigenDestino) * configuracionBullet.velocidadMov,
            Y: Math.cos(angleDirectionOrigenDestino) * configuracionBullet.velocidadMov
        }
       
        let tranform = new Tranform(positionRespawn, {X: configuracionBullet.scaleAncho, Y: configuracionBullet.scaleAlto} , configuracionBullet.radio, velocity);
        let sprite = new Sprite(tranform, configuracionBullet.urlSprite, configuracionBullet.nroFrameSprite, {X: configuracionBullet.anchoSprite,Y:configuracionBullet.altoSprite});
      
        this.add( this.generarObjectBullet(sprite, configuracionBullet.daño, configuracionBullet.life, configuracionBullet.key, configuracionBullet.keyParticle ) );
        
    }

    //----- Objeto Bullet ----
    generarObjectBullet(sprite, daño, timeLife, name, keyParticle){
        //Crea lo que seria el Objeto bullet
        
        //Atributos:
        sprite.BULLET = "BULLET "; //clave para ser reconocido como objeto bullet en collision
        sprite.daño = daño;
        sprite.timeLife = timeLife;
        sprite.name = name;
        sprite.keyParticle = keyParticle;

        //metodos:
        sprite.update = function(dt, t){
            this.position.X = this.position.X + this.velocity.X * dt;
            this.position.Y = this.position.Y + this.velocity.Y * dt;

            this.timeLife--;
        }


        sprite.getLife = function(){
            
            if(this.timeLife <= 0)
                return true; //dead
            else 
                return false;//not dead
        
        }

        return sprite;

    }
    //-----------------------

    generarEfectoDestuctionBullet(keyChildBullet){
            
            let typeParticle = this.BD.buscarEnJSON( this.BD.particulasConfiguraciones, this.childrens[keyChildBullet].keyParticle );

            let imagen = new Image();
            imagen.src = typeParticle.urlSprite;

            let tranform = new Tranform(this.childrens[keyChildBullet].position, {X: typeParticle.ancho, Y: typeParticle.alto}, typeParticle.radio, {X:typeParticle.velocidadMov, Y:typeParticle.velocidadMov});
            let sprite = new Sprite(tranform, typeParticle.urlSprite, typeParticle.nroFrameSprite, {X:typeParticle.anchoSprite,Y:typeParticle.altoSprite});
            
            
            let particula = this.contenedor_particulas.generarObjectParticula(sprite, typeParticle.timeLife);
            particula.setSoundCreation(typeParticle.urlSong);

            this.contenedor_particulas.add(particula);
    
    }


    actualizarEstadoPorColision(key, objeto) {

        if (objeto instanceof Player) { //ref de player
            objeto.updateLife(this.childrens[key].carcateristicas.daño);
        }

        //Nota: añadir/considerar todo aquello a lo que un bullet puede hacer daño aqui.
        if (this.contenedor_particulas != null){ 
            this.generarEfectoDestuctionBullet(key);
        }

        this.childrens.slice(key, 1);
    }



}

class contenedorParticulas extends Container {

    constructor() {
        super();

        //this.type = "contentParticulas"; //TODO : ver para reconocer nombre de clase y borrar los type

    }

    update(dt, t) {

        for (let i = 0; i < this.childrens.length; i++) {

            if (this.childrens[i].update) {
                this.childrens[i].update(dt, t);

                if (this.childrens[i].getLife()) {
                    this.childrens.splice(i, 1);
                }
            }
        }

    }

    generarObjectParticula(sprite, timeLife){

        if(sprite.frameGame == undefined){
            sprite.frameGame = 0;
        }

        sprite.timeLife = timeLife + Math.random()*50;
              
        sprite.setSoundCreation = function setSoundCreation(urlSong){
            this.sound = new Audio();
            this.sound.src = urlSong;
            this.playSound();
        }

        sprite.playSound = function playSound(){
            this.sound.play()
        }

        sprite.stopSound = function stopSound(){
            this.sound.paused();
        }

       
        sprite.update = function update(dt, t) {
            // Con this.velocity --> se definira el movimiento (hacia un destino, despercion) es dercir la direcciones de movimiento
            this.position.X = this.position.X + this.velocity.X*dt;
            this.position.Y = this.position.Y + this.velocity.Y*dt;

            this.frameGame++;

            if (this.frameGame % 1 === 0) {
              this.timeLife--;
            }

            //Tiempo entre frameSprites
            if(this.nroFrameSprite > 0 && this.frameGame % 10 === 0){
                this.currentFrameSprite++;
            }

            /*Caso que el time life soporte mas de un ciclo de animacion
          //  if(this.nroFrameSprite === this.currentFrameSprite)
                this.currentFrameSprite = 0;*/

        }

        sprite.getLife = function getLife(){
            if(this.timeLife <= 0)
                return true; //dead
            else 
                return false;//not dead
        }


        return sprite;

    }

}


//Controlador quien interactuara con las BD
class Controlador {

    constructor() {
        //....
    }


    buscarEnJSON(arrayDeObejtosJSON, clave) {

        for (let i = 0; i < arrayDeObejtosJSON.length; i++) {
            if (arrayDeObejtosJSON[i].key == clave)
                return arrayDeObejtosJSON[i];
        }

    }

    getBdEnemys(){
        return this.enemys;
    }

    // BD enemigos: //Pendie si dispara o no y rotacion de escudos(otros enemigos)
    // NOTA: Alto y ancho es la dimension independiente de la dimension del sprite
    enemys = [
            { "key": 1,tipe:"simple", sprite : {"urlSprite": "null", "nroFrameSprite": -1, "alto": 20, "ancho": 20}, tranform : {"alto": 20, "ancho": 20, "radio": 40,"velocityX": 3, "velocityY": 3, "anguloRotacion": 5}, config: {"life": 100, "color": "random", "keyParticula": 2 ,"damage": 1,"tipeMove":"lineal"} },
            { "key": 2,tipe:"simple", sprite : {"urlSprite": "null", "nroFrameSprite": -1, "alto": 40, "ancho": 40}, tranform : {"alto": 40, "ancho": 40, "radio": 40, "velocityX": 3, "velocityY": 3, "anguloRotacion": 0}, config :{"life": 200, "color": "random", "keyParticula": 2 ,"damage": 1,"tipeMove":"lineal"} },
            { "key": 3,tipe:"simple", sprite : {"urlSprite": "./resources/enemyesSprites/Rombo2.png", "nroFrameSprite": 0, "alto": 134, "ancho": 168}, tranform : { "alto": 134, "ancho": 168, "radio": 50, "velocityX": 7, "velocityY": 7, "anguloRotacion": 0.3}, config :{ "life": 35, "color": " ", "keyParticula": 2,"damage": 10,"tipeMove":"lineal"} },
            { "key": 4,tipe:"simple", sprite : {"urlSprite": "./resources/enemyesSprites/PincheAmarillo.png", "nroFrameSprite": 2, "alto": 194, "ancho": 185}, tranform : {"alto": 194, "ancho": 185, "radio": 50, "velocityX": 5, "velocityY": 5, "anguloRotacion": 0}, config: {"life": 15, "color": " ", "keyParticula": 2 ,"damage": 1,"tipeMove":"circular"} },
            { "key": 6,tipe:"compuesto", sprite: {"urlSprite": "./resources/enemyesSprites/Rombo2.png", "nroFrameSprite": 0, "alto": 134, "ancho": 168}, tranform : { "alto": 134, "ancho": 168, "radio": 50, "velocityX": 7, "velocityY": 7, "anguloRotacion": 0.3}, config :{ "life": 500, "color": " ", "keyParticula": 2,"damage": 2,"tipeMove":"lineal"}, 
               childProtection:{life:15, nro:3, radioOfDist:1200, sprite:null, color: 'blue'}},
            { "key": 5,tipe:"compuesto", sprite: {"urlSprite": "./resources/enemyesSprites/Rombo2.png", "nroFrameSprite": 0, "alto": 134, "ancho": 168}, tranform : { "alto": 134, "ancho": 168, "radio": 50, "velocityX": 7, "velocityY": 7, "anguloRotacion": 0.3}, config :{ "life": 500, "color": " ", "keyParticula": 2,"damage": 10,"tipeMove":"lineal"}, 
               childProtection:{life:15, nro:4, radioOfDist:1100, sprite : {"urlSprite": "./resources/enemyesSprites/PincheAmarillo.png", "nroFrameSprite": 2, "alto": 194, "ancho": 185}, color: 'null'}}
        ]
        //-------------------

    //------------------------------------- BD de Bullets Fire-base ----------------------------------------------------------
    bulletsConfguraciones = [
            { "key": "simple", "urlSprite": "./resources/bullet/bulletCaramelo.png", "nroFrameSprite": 1, "altoSprite": 40, "anchoSprite": 40, "scaleAlto": 40, "scaleAncho": 40, "radio": 20, "life": 200, "daño": 1, "color": "null", "velocidadMov": 500, "anguloRotacion": 0, "keyParticle": 1 }
        ]
        //-------------------------------------------------------------------------------------------------------------


    // Radio en random o nada    
    particulasConfiguraciones = [
        { "key": 1, "urlSprite": "./resources/efectExplosion/boom.png", "urlSong": "./resources/efectSong/synthetic_explosion_1.flac", "nroFrameSprite": 1, "altoSprite": 179, "anchoSprite": 200, "alto": 200, "ancho": 179, "radio": 100, "color": "null", "velocidadMov": 0, "anguloRotacion": 0, "nroParticles": 1,"timeLife":40},
        { "key": 2, "urlSprite": "null","urlSong":" ", "nroFrameSprite": -1, "altoSprite": 20, "anchoSprite": 20, "alto": 20, "ancho": 20, "radio": Math.random()*20, "color": "blue", "velocidadMov": 80, "anguloRotacion": 0,"nroParticles": 15, "timeLife":60}
    ]

    //cargar de BD equipamiento e abances del player
    cargarPlayer(){
        
    }


}


class contenedorEnemys extends Container {

    maxChildrens = 6; //TODO: debe ser actualizado por "actualizarEstadoIndiceGeneracionPosible" al igual que velocidad que ahora esta en 100
    frameGameEnemyes = 0;
    BD;
    AutoGeneratedEnemies = false;
    particulasConteiner;

    constructor(render, conteinerParticle) {
        
        super(); 
        //this.addFunctionForUpdate(this.updateConteinerDead);
        this.addFunctionForUpdate(this.validateConteinerChildSteteLife)
        this.BD = new Controlador();
        this.render = render;
        this.particulasConteiner = conteinerParticle;// evitar por referencia
    }

   
    //------------------  funciones de creacion de los diferentes tipos de enemigos -----------------------------
   
    //hacerlo para creacion de culquier tipo de enemigo (IDEA: switch para los diferentes tipos de enemigos)
    generateRandomEnemy(controladorBdEnemys, destinoMove) {

        //---------------------------------------
        // Time entre respawneo y child < max de child para generar
        if ( !(this.frameGameEnemyes % 100 === 0 && this.childrens.length < this.maxChildrens) ){
            return;
        }

        if(controladorBdEnemys == null){
            return;
        }

        //-------------------------------------

        //dividir en dos funciones 
        let posicionInicial = this.obtenerPosicionRespawn();
        let configuracion = controladorBdEnemys.buscarEnJSON(controladorBdEnemys.getBdEnemys(), this.obtenerIndxRandomEnemyGenerate());

        let tranform = new Tranform({ X: posicionInicial.X, Y: posicionInicial.Y, Z: 0 }, { Y: configuracion.tranform.alto, X: configuracion.tranform.ancho },
            configuracion.tranform.radio,
            {X: configuracion.tranform.velocityX, Y: configuracion.tranform.velocityY, Z:1}
        );
        
        tranform.rotation = configuracion.tranform.anguloRotacion;
        //------------------------------------------
        //console.log("Configuracion creacion Enemy: "+" Life ="+configuracion.config.life+" damage ="+configuracion.config.damage+"  name="+configuracion.config.name +"  key Particula="+ configuracion.config.keyParticula);    
        //Optimizar  con array de funciones o estrucutra condicional segun tipo de enemigos (definido en la BD:controladorBdEnemys)
        
        //------ Tipo enemigo a crear -------
        let enemy;

         //Evitar objetos por referencia en lo posible

        if(configuracion.sprite.urlSprite != "null" && configuracion.childProtection == undefined){
            enemy = this.generateEnemySprite(configuracion.config, configuracion.sprite, tranform, destinoMove);
        }else if(configuracion.childProtection == undefined){
            enemy = this.generateCircleEnemy(configuracion.config, tranform, destinoMove);
        }else if(configuracion.tipe == "compuesto"){
            enemy = this.generateProtectionCircleEnemy(configuracion.config,
                                                      configuracion.childProtection,
                                                      configuracion.sprite,
                                                      tranform,
                                                      destinoMove);
       }
        this.add(enemy);
    }
   
    generateCircleEnemy( config = {life:10, color:"random",keyParticula:2,damage:5,tipeMove:"lineal" },
                         tranform,
                         destinoTranformMove 
    ){

    
        let enemy = new Enemy(tranform, "null", 0, { X: 0, Y:0 });

        enemy.setEquipameinto(config.life, config.damage, config.name, config.keyParticula);
        enemy.setDestinoMove(destinoTranformMove);
        enemy = this.asingTipoMove(config.tipeMove, enemy);

        let color; // Para evitar que sea el color por referencia y todos tengan el mismo color por ello.
        
        if(config.color === "random"){
            color = "rgb("+Math.random()*150+","+ Math.random()*100 +","+Math.random()*80+")";
        }else
            color = config.color;

        enemy.updateLife = function(damage){
            this.life -= damage;
            this.radio = this.life;
            if(this.life <= 0)
                this.dead = true;
            
        } 

        enemy.draw = function drawCricle(ctx){
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.position.X, this.position.Y, this.radio, 0, 2 * Math.PI, false);
            ctx.fill();
        }

        enemy.nroFrameSprite = -1;// indica que no es un sprite al canvas render
       
        return enemy;

    }

    generateEnemySprite(config = {life:10, color:"random", keyParticula:2, damage:5, tipeMove:"lineal" },
                        sprite,
                        tranform,
                        destinoTranformMove
                       ){
        
        let enemy = new Enemy(
                tranform, 
                (new Image().src = sprite.urlSprite),
                sprite.nroFrameSprite, 
                { Y: sprite.alto, X: sprite.ancho }
            );

        enemy.setEquipameinto(config.life, config.damage, config.name, config.keyParticula);
        enemy.setDestinoMove(destinoTranformMove);
        enemy = this.asingTipoMove(config.tipeMove,enemy);
       
        return enemy;
    }

    //TODO: Factrorizar
    generateProtectionCircleEnemy(
        config = {life:10, color:"yellow", keyParticula:2, damage: 1, tipeMove:"lienal"},
        protectionConfig = {life: 15, nro :4, radioOfDist :1250, sprite : null, color : "yellow" },
        sprite = {urlSprite:null,nroFrameSprite:null, alto:null, ancho:null,},
        tranform,
        destinoTranformMove
        ){
        
        let enemyConteiner = new Container();

        let enemy = this.generateEnemySprite(config, sprite, tranform, destinoTranformMove);
        enemy.move = null;
        enemyConteiner.add(enemy);
        enemy.name = "father";
     
        //Para evitar que las propiedades del enemy sprite se vean afectado por lo que sigue (por la referencia)
        let configCopia = Object.assign({},config);
        configCopia.tipeMove = "circular";
        configCopia.life = protectionConfig.life;
        configCopia.color = protectionConfig.color;

        let angles  =  [ Math.PI, Math.PI*2, Math.PI*7/4, Math.PI*7/6, Math.PI*4/3, Math.PI*5/3, Math.PI*3/4, Math.PI*8/4 ];
        let indiceAngle = 0;
        
        for(let i = 0; i < protectionConfig.nro;i++){
            
            let x = enemy.position.X + enemy.scale.X/2; 
            let y = enemy.position.Y + enemy.scale.Y/2; 
            
            let childEnemyEscudo;
   
            if(protectionConfig.sprite != null){
             
                    childEnemyEscudo = this.generateEnemySprite(configCopia,
                                        protectionConfig.sprite,
                                        new Tranform({X:x,Y:y},{X:tranform.radio,Y:tranform.radio,Z:0},tranform.radio/2, {X: tranform.velocity.X*2,Y:tranform.velocity.Y*2,Z:0}),
                                        enemy); 
            }else
                {
                    childEnemyEscudo = childEnemyEscudo = this.generateCircleEnemy(
                    configCopia,
                    new Tranform({X:x,Y:y},{X:tranform.radio/2,Y:tranform.radio/2,Z:0},tranform.radio/2, {X: tranform.velocity.X*2,Y:tranform.velocity.Y*2,Z:0}),
                    enemy);
                }

            if(indiceAngle > angles.length*2)
                indiceAngle = 0;

            childEnemyEscudo.anguloRotacionRadian = angles[indiceAngle];

            if(i%2 == 0)
                childEnemyEscudo.radioMovimientoCircular = protectionConfig.radioOfDist;
            else if(i%2 == 1){
                childEnemyEscudo.radioMovimientoCircular = -1*protectionConfig.radioOfDist;
                indiceAngle++;
            }
            childEnemyEscudo.name = "child";
            enemyConteiner.add(childEnemyEscudo);
             
        }

        //------ creacion de contenedor Enemy compuesto  Esto en funcion aparte --------
            
            enemyConteiner.position = tranform.position;
            enemyConteiner.isLife = true;

            enemyConteiner.particulasConteiner = this.particulasConteiner;
            enemyConteiner.render = this.render;
            enemyConteiner.BD = this.BD;
            
            enemyConteiner.actualizarEstadoPorColision = this.actualizarEstadoPorColision;
            enemyConteiner.updateEnemyForDañagePlayer = this.updateEnemyForDañagePlayer;
            enemyConteiner.generarParticula = this.generarParticula;
            
           
            //enemyConteiner.addFunctionForUpdate(this.autoDestructionFatherDead);

            function updatePositionChildrens(conteiner){

                let speed = enemy.calculeSpeedToDestinoDirection();
                 
                for(let i = 0; i < conteiner.childrens.length; i++){
                    conteiner.childrens[i].position.X = conteiner.childrens[i].position.X - speed.X;
                    conteiner.childrens[i].position.Y = conteiner.childrens[i].position.Y - speed.Y;  
                } 
            }

            enemyConteiner.addFunctionForUpdate(updatePositionChildrens);
            enemyConteiner.addFunctionForUpdate(this.conteinerEnemyProtectionIsDeadUpdate);
        //---------------------------------------------------------------------
        
        return enemyConteiner;
    }

    conteinerEnemyProtectionIsDeadUpdate(conteiner){
        
        if(conteiner.childrens[0]){
            if(conteiner.childrens[0].name != "father"){
                console.log("entro1");
                conteiner.isLife = false;
            }
        }

    }

    //Optimizar
    validateConteinerChildSteteLife(conteiner){
        
       for(let i = 0; i < conteiner.childrens.length;i++){
            if(conteiner.childrens[i].childrens && conteiner.childrens[i].isLife == false ){
                conteiner.childrens.splice(i, 1);
            }else if(conteiner.childrens[i].childrens && conteiner.childrens[i].childrens.length == 0){
                conteiner.childrens.splice(i, 1);
            }
       }
    }

    asingTipoMove(tipoMove = "lineal", enemy){

        switch(tipoMove){
            case "lineal": enemy.move = enemy.moveRectilineo; break;
            case "circular" : enemy.move = enemy.moveCircular; break;
        }

        return enemy;
    }

    
    obtenerPosicionRespawn() {

        const radio = Math.random() * 100;
        let RespawnX, RespawnY;

        if (Math.random() < 0.5) {
            RespawnX = Math.random() < 0.5 ? 0 - radio : this.render.view.width + radio;
            RespawnY = Math.random() * this.render.view.height;
        } else {
            RespawnY = Math.random() < 0.5 ? 0 - radio : this.render.view.height + radio;
            RespawnX = Math.random() * this.render.view.width;
        }

        return { X: RespawnX, Y: RespawnY };
    }


    indicePosiblesEnemysGenerar = [1,2,4,5,6];

    obtenerIndxRandomEnemyGenerate() {

        let index = this.indicePosiblesEnemysGenerar[Math.floor(Math.random() * this.indicePosiblesEnemysGenerar.length)];
        //TODO: control de enemigos tipos o ver si se controlara
        return index;
    }

    actualizarEstadoIndiceGeneracionPosible() {
        let maxKeyEnemys = BD.enemys.length; // 0 a N
        //cada tanto tiempo o cada tantos enemigos eliminados
    }

    //------------------------------------FIN Gestion Generador------------------------------------------------------------------

    /*updateConteinerDead(childrens){
        for(let i = 0; i < childrens.length;i++ ){
            if(childrens[i].childrens && childrens[i].childrens.length == 0)
                childrens.splice(i, 1);
            
        }
    }*/

    //TODO: organizar en funciones las sentencias dentro de cada if
    actualizarEstadoPorColision(key, objeto) {

        if (objeto instanceof Player) {
            objeto.life -= this.childrens[key].damage;

        } else if (objeto.BULLET) {
            this.updateEnemyForDañagePlayer(key, objeto);
        }

    }
    
    //Organizar y dividir por funciones
    updateEnemyForDañagePlayer(key, bullet){
         
         this.childrens[key].updateLife(bullet.daño);

        if ( this.childrens[key].dead/*this.childrens[key].life <= 0*/) {

                let child = this.childrens[key];
                
                let respawnPosition = {
                        X: child.scale.X / 2 + child.position.X,
                        Y: child.scale.Y / 2 + child.position.Y,
                        Z: 0
                }
            
                let cfgParticula = this.BD.buscarEnJSON(this.BD.particulasConfiguraciones, this.childrens[key].keyParticleDestruction);
               
             /*   
            for (let a = 0; a < cfgParticula.nroParticles; a++) {
                        
                        let tranform = new Tranform(
                            respawnPosition,
                            {X: cfgParticula.ancho, Y: cfgParticula.alto},
                            cfgParticula.radio,// atributo no utilizado 
                            {X:  (Math.random()-0.5)*25, Y: (Math.random()-0.5)*25}//atributo no utilizado
                        );

                
                //if verificando que no tenga propiedades  undefined => de haber reportar y teminar     
                let particle;    
                if(cfgParticula.urlSprite == "null"){
                    
                    //let tranf = Object.assign({},tranform);

                    particle = this.particulasConteiner.generarObjectParticula(tranform, cfgParticula.timeLife)
                    particle.nro = a;
                    let color;
                    if(child.color && child.color != undefined){
                        color = child.color; 
                    }else{
                        color = "blue";   
                    }
                    
                    particle.draw = function(ctx){
                        ctx.fillStyle = color;
                        ctx.beginPath();
                        ctx.arc(this.position.X, this.position.Y, this.radio, 0, 2 * Math.PI, false);
                        ctx.fill();
                    }

                }else{
                   let sprite = new Sprite(tranform,cfgParticula.urlSprite,cfgParticula.nroFrameSprite, {X: cfgParticula.anchoSprite,Y:cfgParticula.altoSprite});
                   particle = this.particulasConteiner.generarObjectParticula(sprite,cfgParticula.timeLife);
                }
                
                    particle.radio = Math.random() * 20 + 4;
                    this.particulasConteiner.add(particle); 
                    //Ver en tranform velocidad y radio segun lo comentado a continuacion:
                    //contenedorParticulas.add(new Particula(lastx, lasty, Math.random() * 20, "rgb(229, 152, 102)", Math.random() * 250, Math.random() * 400 + 15));
            }
            */
            for (let a = 0; a < cfgParticula.nroParticles; a++){
                                                                                                 //IMPORTANTE: de lo contrario toma por referencia      
                this.particulasConteiner.add( Object.assign({}, this.generarParticula(cfgParticula,  Object.assign({},respawnPosition))) );
            }
                this.childrens.splice(key, 1);

        }
    }

    generarParticula(cfgParticula, respawnPosition){
        
                        
        let tranform = new Tranform(
            respawnPosition,//de lo contrario tiene la misma referencia
            {X: cfgParticula.ancho, Y: cfgParticula.alto},
            cfgParticula.radio,// atributo no utilizado 
            {X:(Math.random()-0.5) * 250, Y:(Math.random()-0.5) * 250}//atributo no utilizado
        );

        //if verificando que no tenga propiedades  undefined => de haber reportar y teminar     
        let particle;    
        if(cfgParticula.urlSprite == "null"){
        
            //let tranf = Object.assign({},tranform);

            particle = this.particulasConteiner.generarObjectParticula(tranform, cfgParticula.timeLife)
        
            let color;

            //if(child.color && child.color != undefined){
            //   color = child.color; 
            //}else{
             color = "blue";   
            //}
        
            particle.draw = function(ctx){
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(this.position.X, this.position.Y, this.radio, 0, 2 * Math.PI, false);
                ctx.fill();
            }
            //particle.frameGame = 0;

        }else{
            let sprite = new Sprite(tranform,cfgParticula.urlSprite,cfgParticula.nroFrameSprite, {X: cfgParticula.anchoSprite,Y:cfgParticula.altoSprite});
            particle = this.particulasConteiner.generarObjectParticula(sprite,cfgParticula.timeLife);
        }
    
        particle.radio = Math.random() * 20 + 4;
         return particle;
        //Ver en tranform velocidad y radio segun lo comentado a continuacion:
        //contenedorParticulas.add(new Particula(lastx, lasty, Math.random() * 20, "rgb(229, 152, 102)", Math.random() * 250, Math.random() * 400 + 15));
        
    }


}



// --------------------------- Sector Pruebas --------------------------------
//{ "key": 6,tipe:"compuesto", sprite: {"urlSprite": "./resources/enemyesSprites/Rombo2.png", "nroFrameSprite": 0, "alto": 134, "ancho": 168}, tranform : { "alto": 134, "ancho": 168, "radio": 50, "velocityX": 7, "velocityY": 7, "anguloRotacion": 0.3}, config :{ "life": 500, "color": " ", "keyParticula": 2,"damage": 2,"tipeMove":"lineal"}, 


let pol1 = new RectangleCollider2D(new Vector2D(150,150),50,50); //new PoligonCollider2D(new Vector2D(150,150,0),4,30);


console.log(pol1);

function draw(){
    let Canvas = new CanvasRender();
    console.log(Canvas);
    
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

draw();

/*
function loopy(ms) {

    requestAnimationFrame(loopy);

    const t = ms / 1000;
    dt = t - last;
    last = t;

    //----Sentencias---

    scena.update(dt,t);
    //-------

    render.render(Ecenario.contenedorObjetos);
}

requestAnimationFrame(loopy);
*/
