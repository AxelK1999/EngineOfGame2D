 /** @type {HTMLCanvasElement} */
import CanvasRender from "./canvasRenderer.js";
import TecladoControl from "./keyControls.js"
import mouseControl from "./mouseControls.js"

class Utilities{

    static variableCopy(obj){
        return Object.assign(Object.create(Object.getPrototypeOf(obj)), obj);
    }

    static controlUseVector2DType(vector2D){
        if(vector2D && vector2D.NAME() && vector2D.NAME() === "Vector2D"){
            return true;
        }else{
            throw new Error("I don't know instantiated with a Vector2D or passed as an argument a required Vector2D");
        }
    }

    static controlUseNumberType(arrayNumberVerify){

        if( !Array.isArray(arrayNumberVerify) ){
            if(isNaN(arrayNumberVerify)){
                throw new Error("Argument required of Number type ");
            }
        }else{
            arrayNumberVerify.forEach(element => {
                if(isNaN(element)){
                    throw new Error("Argument required of Number type "); 
                }
            });
        }

        return true;
    }

    static controlUseCollider2DType(collider2D){

        if(collider2D && collider2D.NAME && collider2D.NAME() === "PoligonCollider2D" ||
           collider2D.NAME() === "RectangleCollider2D" || 
           collider2D.NAME() === "CircleCollider2D" || 
           collider2D.NAME() === "AABBCollider2D")
        {

          return true;
        
        }else{
            throw new Error("The collider instance must be one of the types of the Collider2D class:"+ 
                            "PoligonCollider2D or RectangleCollider2D or CircleCollider2D or AABBCollider2D");
        }
    }

    static controlUseCollisionFilterType(collisionFilter){

        if(collisionFilter && collisionFilter.NAME && collisionFilter.NAME() == "CollisionFilter"){
            return true;    
        }else{
            throw new Error("Argument required of CollisionFilter type ");
        }
    }

    static controlUseImageType(image){
        if(image instanceof Image && image.complete){
            return true;
        }else{
            throw new Error("Argument required of Image type and complete loaded"); 
        }
    }

    static controlUseAudioType(audio){
        if(audio instanceof Audio && image.readyState === 4){
            return true;
        }else{
            throw new Error("Argument required of Audio type and complete loaded"); 
        }
    }

    static controlUseAnimationSpriteType(animationSprite){
        if(animationSprite && animationSprite.NAME && animationSprite.NAME() == "AnimationSprite"){
            return true;
        }else{
            throw new Error("Argument required of AnimationSprite type");
        }
    }

    static controlUseStringType(valor){
        if(typeof valor === 'string'){
            return true;
        }else{
            throw new Error("Argument required of string type");
        }
    }

    static controlUseSpriteType(sprite){
        if(sprite && sprite.NAME && sprite.NAME() == "Sprite"){
            return true;
        }else{
            throw new Error("Argument required of Sprite type");
        }
    }

    static controlUseBooleanType(valor){
        if(typeof valor === 'boolean'){
            return true;
        }else{
            throw new Error("Argument required of boolean type");
        }
    }

    static controlUseTranformType(tranform){
        if(tranform && tranform.NAME && tranform.NAME() == "Tranform"){
            return true;
        }else{
            throw new Error("Argument required of Tranform type");
        }
    }

    static controlUseRigidBodyType(rigidBody2D){
        if(rigidBody2D && rigidBody2D.NAME && rigidBody2D.NAME() == "RigidBody2D"){
            return true;
        }else{
            throw new Error("Argument required of RigidBody2D type");
        }
    }

    static controlUseComponentType(component){
        if(component && component.NAME && component.NAME() == "Component"){
            return true;
        }else{
            throw new Error("Argument required of Component type");
        }
    }

    static controlUseCompositeType(Composite){
        if(Composite && Composite.NAME && Composite.NAME() == "Composite"){
            return true;
        }else{
            throw new Error("Argument required of Composite type");
        }
    }


    static controlUseSceneType(scene){
        if(scene && scene.NAME && scene.NAME() == "Scene"){
            return true;
        }else{
            throw new Error("Argument required of Scene type");
        }
    }

}
class Vector2D {
    x;
    y;

    _NAME = "Vector2D";

    constructor(x = 0, y = 0){
        
        if(!isNaN(x) && !isNaN(y)){
            this.x = x;
            this.y = y;
        }else {
            throw new Error("The components (x,y) of the vector must be real numbers or integers");
        }
       
    }
      
    NAME(){
        return this._NAME;
    }

    rotate(angle){
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        
        let x = this.x * cos - this.y * sin;
        let y = this.x * sin + this.y * cos;
      
        return new Vector2D(x, y);
    }

    rotateAbout = function(angle, point) {
        //Rotar alrededor del punto
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
       
        let x = point.x + ((this.x - point.x) * cos - (this.y - point.y) * sin);
        let y = point.y + ((this.x - point.x) * sin + (this.y - point.y) * cos);
        
        return new Vector2D(x, y); 
    };

    static angle(vectorA, vectorB){ 
        //X: Mouse.position.X - player.position.X + player.ancho/2  --> tener en cuenta en el vector de parametro
        let distancia = Vector2D.vectorDistance(vectorA, vectorB);
        return Math.atan2(distancia.x, distancia.y); 
    }

    static catetos(VectorA, vectorB){

        //Define la direccion x,y,z del movimiento de un origen a un punto destino al sumar a la posicion
        let angulo = Vector2D.angle(VectorA, vectorB);

        return new Vector2D(Math.sin(angulo),  Math.cos(angulo)); 
    
    }

    static vectorDistance(vectorA, vectorB){ //direccion   
        // X += radio1 - radio2    --> esto considerar al crear el vector 
        // Y += radio1 - radio2
        return new Vector2D(vectorA.x  - vectorB.x, vectorA.y - vectorB.y); 
   
    }     

    static distance(vectorA , vectorB){// Hipotenusa
        let distance = Vector2D.vectorDistance(vectorA, vectorB);
        return new Vector2D(distance.x * distance.x, distance.y * distance.y);
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

    static sum( vectorA, vectorB){ 
        return new Vector2D(vectorA.x + vectorB.x,  vectorA.y + vectorB.y); 
    }

   static res( vectorA, vectorB){
        return new Vector2D(vectorA.x - vectorB.x,  vectorA.y - vectorB.y);
    }

    static mult(vector, scalar) {
        return new Vector2D(vector.x * scalar,  vector.y * scalar); 
    };

    static div(vector, scalar) {
        return new Vector2D(vector.x / scalar,  vector.y / scalar); 
    };

    //negacion
    neg() {
        return new Vector2D(-this.x,  -this.y);;
    };

    //Retorna un vector perpendicular. Set `negate` to true for the perpendicular in the opposite direction.
    perp(vector, negate) {
        negate = negate === true ? -1 : 1;
        return new Vector2D(negate * -vector.y,  negate * vector.x);
    };

}
class Vertices2D{

    _points = [];// lista de objetos {x: number, y: number}
    _centre = null; //centro relativo a los vertices --> usado para posicionar los vertices a otro centro no relativo

    #NAME = "Vertices2D";

    constructor(arrayPoints){
        this.setVertices(arrayPoints);
    }

    pointsRef(){
        return this._points;
    }
    pointsCopy(){
        return Utilities.variableCopy(this._points);
    }   
    centreRef(){
        return this._centre;
    }
    centerCopy(){
        return Utilities.variableCopy(this._centre);
    }

    NAME(){
        return this.#NAME;
    }

    setVertices(arrayPoints){
        //Exsiste un vertice si exsiste una interseccion entre los extremos de dos segmentos
        if(arrayPoints && arrayPoints.length > 2){
            
            this._points = []
            arrayPoints.forEach(point => this._points.push(new Vector2D(point.x, point.y)))
            //this.#points = arrayPoints;
            this._centre = this.calculateCentre();
            
        }else{
            throw new Error("The number of points must be greater than or equal to 3 for the existence of vertices (intersection of two segments) ");
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

        for (var i = 0; i < this._points.length; i++) {
            j = (i + 1) % this._points.length;
            let cross = Vector2D.productCross(this._points[i], this._points[j]);
            let temp = Vector2D.mult(Vector2D.sum(this._points[i], this._points[j]), cross);
            centre = Vector2D.sum(centre, temp);
        }

        return Vector2D.div(centre, 6 * area);
    };
 
    rotate(center, angle) {
        const radians = angle * Math.PI / 180; // Convertir el ángulo a radianes
        const cx = center.x; // Coordenada x del centro
        const cy = center.y; // Coordenada y del centro
      
        // Iterar sobre cada vértice
        this._points = this._points.map(vertex => {
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
            return this._points;

        point = point || this.calculateCentre();

        for (var i = 0; i < this._points.length; i++) {
           let vertex = this._points[i];
           let delta = Vector2D.res(vertex, point);

           this._points[i].x = point.x + delta.x * scaleX;
           this._points[i].y = point.y + delta.y * scaleY;
        }

    };

    traslate(vector2D){
        if(Utilities.controlUseVector2DType(vector2D)){
            for (let i = 0; i < this._points.length; i++) {

                this._points[i].x += vector2D.x;
                this._points[i].y += vector2D.y;
                
            } 
        } 
    }
    
    isConvex() {
        // http://paulbourke.net/geometry/polygonmesh/
        // Copyright (c) Paul Bourke (use permitted)

        var flag = 0,
            n = this._points.length,
            i,
            j,
            k,
            z;

        if (n < 3)
            return null;

        for (i = 0; i < n; i++) {
            j = (i + 1) % n;
            k = (i + 2) % n;
            z = (this._points[j].x - this._points[i].x) * (this._points[k].y - this._points[j].y);
            z -= (this._points[j].y - this._points[i].y) * (this._points[k].x - this._points[j].x);

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
        let j = this._points.length - 1;

        for (var i = 0; i < this._points.length; i++) {
            area += (this._points[j].x - this._points[i].x) * (this._points[j].y + this._points[i].y);
            j = i;
        }

        if (signed)
            return area / 2;

        return Math.abs(area) / 2;
    };
  

}
class Collider2D {

    _centre; //variacionLocalPosicion --> respecto a la posicion de dibujado

    #NAME = "Collider2D";

    density;
    friction;
    sensor;

    constructor(centre){

        if(Utilities.controlUseVector2DType(centre)){
            this._centre = centre;
        }/*else{
            throw new Error("The collider2D has not been instantiated with its Vector2D center position");
        }*/

    }

    centerCopy(){
        return Utilities.variableCopy(this._centre);
    }

    NAME(){
        return this.#NAME;
    }

    moveCenter(vector2D){
        if(Utilities.controlUseVector2DType(vector2D)){
            this._centre = vector2D;
        }
    }

    //masa : number
    //area : number
    setDensity(masa, area){
        //es la cantidad de masa contenido por unidad de area(2D) o volumen(3D). 
        //Una alta densidad indica que las partículas están más cercanas entre sí (mas compacto) => mayor peso y resistencia
        //Una baja densidad => menor peso y menor resistncia(rigidez)
        return masa/area;
    }

    setFiction(fractionForce){
        //fuerza que se opone al movimiento
        this.friction = fractionForce;
    }

    setSensor(boolean){
        this.sensor = boolean
    }

}

class CircleCollider2D extends Collider2D{
    
    #radius = 0;
    #NAME = "CircleCollider2D";

    constructor(centre = new Vector2D(0,0) , radius = 0){

        super(centre);

        if(radius && !isNaN(radius) && radius > 0){
            this.#radius = radius;
        }else{
            throw new Error(" The radius of a CircleCollider2D must be a number greater than 0 ");
        }
        
    }

    radius(){
        return this.#radius;
    }

    scale(number){
        this.#radius *= number;
    }

    traslate(vector2D){
        if(Utilities.controlUseVector2DType(vector2D)){
            this.moveCenter(new Vector2D(this.centerCopy().x + vector2D.x, this.centerCopy().y + vector2D.y));
        }
        
    }

    NAME(){
        return this.#NAME;
    }


    bounds(){
        // Calcular los vértices del cuadro delimitador del círculo
        let topLeft = new Vector2D(this.centerCopy().x - this.#radius, this.centerCopy().y - this.#radius);
        let bottomRight = new Vector2D(this.centerCopy().x + this.#radius, this.centerCopy().y + this.#radius);
        return {min_x: topLeft.x, max_x: bottomRight.x, min_y: topLeft.y, max_y: bottomRight.y} 
    }

}

class PoligonCollider2D extends Collider2D{

    _vertices;
    _radio;
    _bound;
    
    #NAME = "PoligonCollider2D";

    // centre == centro del sprite u objeto
    constructor(centre = new Vector2D(0,0), vertices){
        
        super(centre);
        if(vertices && vertices.NAME && vertices.NAME() == "Vertices2D"){
            
            this.realPositioningToCenterRef(centre, vertices)
            this._vertices = vertices;
            this._bound = this.AABB(vertices.pointsCopy());

        }else if(vertices){

            this._vertices = new Vertices2D(vertices);
            this.realPositioningToCenterRef(centre, this._vertices)
            this._bound = this.AABB(vertices);

        }
    }

    realPositioningToCenterRef(centre, vertices){
        let distance = Vector2D.res(centre, vertices.centreRef());
        vertices.traslate(distance);
    }

    center(){
        return this._vertices.calculateCentre();
    }

    createVerticesPoligon(centre, numSegmentos, radio) {
        this._radio = radio
        const vertices = []; // numSegmentos definir ese tamaño para no crear varios arreglos consumo de recursoso al ajutarse al tamaño
        const angulo = (2 * Math.PI) / numSegmentos;
      
        for (let i = 0; i < numSegmentos; i++) {
          const x = centre.x + radio * Math.cos(angulo * i); // + this.position.x
          const y = centre.y + radio * Math.sin(angulo * i);// + this.position.y
          vertices.push({ x, y }); 
        }
        this._vertices = new Vertices2D(vertices);
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
        return  Utilities.variableCopy({max_x:0, max_y:0, min_x:0, min_y:0},this._bound);
    }

    bounds(){
        return this._bound;
    }

    verticesRef(){
        return this._vertices.pointsRef();
    }

    verticesCopy(){
        return this._vertices.pointsCopy(); 
    }
    //Al ser un atributo primitivo esta es obtenido por valor no por ref.
    radio(){
        return this._radio
    }

    area(signed){
        return this._vertices.area(signed);;
    }

    
    scale(xScale, yScale, point){
        this._vertices.scale(xScale, yScale, point);
        this._bound = this.AABB(this._vertices.pointsRef());
    }

    rotate(angle, center){
        this._vertices.rotate(center, angle);
    }

    traslate(vector2D){
        this._vertices.traslate(vector2D);
        this._bound = this.AABB(this._vertices.pointsRef());
        this.moveCenter(new Vector2D(this.centerCopy().x + vector2D.x, this.centerCopy().y + vector2D.y));
    }

    NAME(){
        return this.#NAME
    }

}

class RectangleCollider2D extends PoligonCollider2D{
    
    //centre : Vector2D
    constructor(position = new Vector2D(0,0) , width = 4, height = 4){
        
        let points = [
            {x: position.x, y: position.y},
            {x: position.x + width, y:position.y},
            {x:position.x + width, y:position.y + height},
            {x:position.x, y:position.y + height}
        ]
        super(new Vector2D(position.x + width/2, position.y + height/2), points);
    }

}

class AABBCollider2D extends RectangleCollider2D{

    //Este collider no puede ser rotado
    #NAME = "AABBCollider2D"

    constructor(position = new Vector2D(0,0), width = 4, height = 4){
        super(position, width, height);
    }

    NAME(){
        return this.#NAME
    }

    rotate(){}
}

class Segment2D{

    point1;
    point2;

    #NAME = "Segment2D";

    constructor(vector2D1 = new Vector2D(0,0), vector2D2 = new Vector2D(0,10)){

        if(vector2D1.NAME && vector2D2.NAME && vector2D2.NAME() === "Vector2D" && vector2D1.NAME() === "Vector2D"){
            this.point1 = vector2D1;
            this.point2 = vector2D2;
        }else{
           throw new Error("The AABBCollider2D has not been instantiated with its Vector2D");
        }

    }

    NAME(){
        return this.#NAME
    }
}

class CollisionFilter {

    //Para el uso de camara => todo los componentes deben tener un rigidbody con AABB, de lo contrario no se pintara.
    // Camara group 999 y category = 1 reservado para la camara y todo los componentes por defecto tendran la masck = 1 para colisionar con la camara y determinar si se encuentra dentro

    // Si el valor es mayor a 0 e igual para dos componentes diferentes => colisionan   
    #group; 
    // Si el grupo es igual a cero o son diferentes entre los componentes => aplica categoria(especifica su id de colision)
    #category; // (-5 camara)
    // Este contendra todas las categorias con las que colisionara si no se aplica grupo
    #mask;

    static #TYPES =  {"COMPONENT": 1, "COMPOSITE": 2}
    #type;

    #NAME = "CollisionFilter";

    constructor(group = 0, category = 2, mask = [1, 2], type = CollisionFilter.TYPES().COMPONENT){

        if(type == 1 || type == 2){
            this.#type = type;
        }else{
            throw new Error("The type must be an enumerable of the TYPES() variable of this same class")
        }

        if(Utilities.controlUseNumberType([group, category]) && Array.isArray(mask)){

            if(!mask.includes(1)){
                mask.push(1); 
            }
            
            this.#category = category;
            this.#group = group;
            this.#mask = mask;    
        
        }   
        
    }

    static TYPES(){
        return CollisionFilter.#TYPES;
    }

    setGroup(group = 0){
        this.#group = group;
    }

    setCategory(category = 1){
        this.#category = category;
    }

    setMask(mask =  [1]){
        this.#mask = mask;
    }

    group(){
        return this.#group;
    }

    category(){
        return this.#category;
    }

    mask(){
        return this.#mask
    }

    NAME(){
        return this.#NAME;
    }

}

class RigidBody2D{

    _collisionFilter;
    _collider2D;
    #NAME = "RigidBody2D"
    //------------ Para motor de fisica -------------
    #type; //static : la fisica no lo afecta dianmic : la fisica lo afecta
    #mass;
    #gravityScale;
    #angleVelocity;
    #linearVelocity;
    #linearDamping;
    #angularDamping;
    #fixedRotation; //rotacion fija
    //------------  ---------   ------- ------------

    constructor(collider2D, collisionFilter){
        
        this.setCollider2D(collider2D);
        this.setColisionFilter(collisionFilter);

        //TODO: instanciacion de atributos utilizados para motor de fisica
    }

    collider2D(){
        return this._collider2D;
    }

    setCollider2D(collider2D){
        if(Utilities.controlUseCollider2DType(collider2D)){
            this._collider2D = collider2D;
        }
    }

    colisionFilter(){
        return this._collisionFilter;
    }

    setColisionFilter(collisionFilter){
        if(Utilities.controlUseCollisionFilterType(collisionFilter)){
            this._collisionFilter = collisionFilter;
        }
    }

    NAME(){
        return this.#NAME;
    }

    //TODO: pendiente para motor de fisica
    applyForce(){}
    applyAngularForce(){}
    body(){
        //objeto usado por matter.js
    }

}

class Tranform {

    _position; // Posicion en la scena
    _scale; // escala a aumentar de sprite y rigidbody
    _angle; // angulo a tener sprite y rigidbody

    _speed = 1;
    _destinyMoveRef;
 
    #NAME = "Tranform";
    
    constructor(position = new Vector2D(0,0), scale = new Vector2D(1,1), angle = 0) {
        this.setPosition(position);
        this.setScale(scale);
        this.setAngle(angle);

        this._destinyMoveRef = this._position;    
    }

    position(){
        return Utilities.variableCopy(this._position);
    }

    setPosition(position){
        if(Utilities.controlUseVector2DType(position)){
            this._position = position;
        }
    }

    scale(){
        return Utilities.variableCopy(this._scale);
    }

    setScale(scale){
        if(Utilities.controlUseVector2DType(scale)){
            this._scale = scale;
        }
    }

    angle(){
        return this._angle;
    }

    setAngle(angle){
        if(Utilities.controlUseNumberType(angle)){
            this._angle = angle;
        }
    }

    //---------- Patron:Strategy (TIPOS DESPLAZAMIENTOS A UN DESTINO) --------------
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

        let directionToDestiny = this.directionDisplacementToDestiny(this._position ,this._destinyMoveRef);
        let desplacement = new Vector2D(0,0);
        desplacement.x = this._position.x + directionToDestiny.x  *  this._speed;
        desplacement.y = this._position.y + directionToDestiny.y  *  this._speed;

        return desplacement;
    }

    circularMoveToDestiny(radio, angle, dt, t){
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

        let directionToDestiny = this.directionDisplacementToDestiny(this._position ,this._destinyMoveRef);
        let moveCircularX = radio * Math.cos(angle * t)* dt; // x = x + radio * cos(angleRadian*t)
        let moveCirculary = radio * Math.sin(angle * t)* dt; //y = y + radio * sen(angleRadian*t)

        let desplacement = new Vector2D(0,0);
        desplacement.x = (this._position.x - directionToDestiny.x * this._speed) + moveCircularX;
        desplacement.y = (this._position.y - directionToDestiny.y * this._speed)  + moveCirculary;

        return desplacement;

    }

    setDestinoMove(vectorDestino){
        if(Utilities.controlUseVector2DType(vectorDestino)){
            this._destinyMoveRef = vectorDestino;
        }
    }

    setSpeed(speed){
        if(Utilities.controlUseNumberType(speed)){
            this._speed = speed;
        }
    }

    speed(){
        return this._speed;
    }

    NAME(){
        return this.#NAME;
    }
  
}

class Resources {
    //Patron: peso mosca

    #images;
    #audios;
    #failedResources;
    #totalResources;
    #totalLoaded;

    constructor() {
      this.#images = [];
      this.#audios = [];
      this.#failedResources = [];
      
      this.#totalLoaded = 0;
      this.#totalResources = 0;
    }
  
    addImage(src, name) {
      const image = new Image();
      image.src = src;
      this.#images.push({name, image});
      this.#totalResources ++;

      image.onload = () => {
        this.updateLoadingStatus();
      };
      
      image.onerror = (event) => {
        console.error(`Error loading image: ${src}`);
        this.#failedResources.push({ src, name, error: event });
        this.updateLoadingStatus();
      };
    }
  
    addAudio(src, name) {
      const audio = new Audio(src);
      this.#audios.push({name, audio});
      this.#totalResources ++;

      audio.addEventListener('canplaythrough', () => {
        this.updateLoadingStatus();
      });

      audio.addEventListener('error', (event) => {
        console.error(`Error loading audio: ${src}`);
        this.#failedResources.push({ src, name, error: event });
        this.updateLoadingStatus();
      });
    }
  
    updateLoadingStatus() {
      //this.#totalResources = this.#images.length + this.#audios.length;
      this.#totalLoaded = this.#images.filter(img => img.image.complete).length +
                          this.#audios.filter(audio => audio.audio.readyState === 4).length;
  
      if (this.#totalLoaded === this.#totalResources && this.#totalLoaded > 0) {
        console.log(`All resources loaded successfully: ${this.#totalLoaded}/${this.#totalResources}`);
      } else {
        console.log(`${this.#totalLoaded}/${this.#totalResources} resources loaded.`);
      }
  
      if (this.#failedResources.length > 0) {
        console.log('Failed to load the following resources:');
        this.#failedResources.forEach(src => {
          console.log(src);
        });
      }
    }

    checkLoadingStatus(){
        let complete = false;
        if(this.#totalResources === this.#totalLoaded + this.#failedResources.length){
            complete = true;
        }
        return {"totalResources": this.#totalResources, "failedResources": this.#failedResources, "totalLoaded": this.#totalLoaded};
    }

    audio(keyName){
        let result;
        this.#audios.forEach(A => {
            if(A.name ===  keyName)
                result =  A.audio;
                return;
        }) 
        return result;
    }

    image(keyName){
        let result;

        this.#images.forEach(img => {
            if(img.name ===  keyName)
                result = img.image
                return
        }) 

        return result;
    }

    statusImage(keyName){
        let result;

        this.#images.forEach(img => {
            if(img.name ===  keyName)
                result = img.image.complete
                return
        }) 

        return result;
    }

    statusAudio(keyName){
        let complete;
        this.#audios.forEach(A => {
            if(A.name ===  keyName)
                complete = A.audio.readyState === 4 ? true : false;
                return;
        }) 
        return complete;
    }

    allAudio(){
        return this.#audios;
    }

    allImage(){
        return this.#images;
    }

    removeAudio(keyName){
        this.#audios.forEach( (element, indice) => {
            if(element.name === keyName){
              this.#audios.splice(indice, 1);
              this.#totalResources --;
              return;
            }
        })
    }

    removeImage(keyName){
        this.#images.forEach( (element, indice) => {
            if(element.name === keyName){
              this.#images.splice(indice, 1);
              console.log(indice);
              this.#totalResources --;
              return;
            }
        })
    }

    failedResources(){
        let copyFailedResources
        return Utilities.variableCopy(copyFailedResources, this.#failedResources)
    }

}

class Sprite{

    _image;
    #nroFrame; // total de frame de sprite
    // --- Valor establecido segun estado en maquina de estado-----
    #startFrame;// inicio de una animacion dentro de una imagen de sprites com muchas animaciones
    #endFrame; // fin de una animacion --> de ser undefailed startFrame y endFrame => se animara recorriendo todo los frame de la imagen
    //------------------------------
    #currentFrame; // usado para pintar un frame (sprite especifico de la imagen de sprites)
    _scale; // dimenciones de corte (alto y ancho desde la pocicion offset)
    _offset;//posicion x e y dentro de imagen donde sera punto de partida de corte 
    #NAME = "Sprite";

    _animations = [];

    constructor(image, xyScale, xyOffset = new Vector2D(0,0), nroFrame = 0) {
        
        this.setImage(image)

        if(!xyScale){
            xyScale = new Vector2D(image.naturalWidth , image.naturalHeight)
        }

        this.setScale(xyScale);
        this.setOffset(xyOffset);
        this.setNroFrame(nroFrame)

        //sprite de imagen actual (posiciones)
        this.#currentFrame = 0;
    }

    addAnimation(animationSprite){
        if(Utilities.controlUseAnimationSpriteType(animationSprite)){
            this._animations.push(animationSprite);
        }
    }

    setCurrentAnimation(tagName){
        let newCurrentAnimation = this.animation(tagName);
        if(!newCurrentAnimation){
            return false;
        }

        this._offset = newCurrentAnimation.offset();
        this._scale = newCurrentAnimation.scale();
        this.#endFrame = newCurrentAnimation.endFrame();
        this.#startFrame = newCurrentAnimation.startFrame();

        this.#currentFrame = newCurrentAnimation.startFrame();

        return true;
    }

    removeAnimation(tagName){
        this._animations.forEach( (animation, indice) => {
            if(animation.tag() === tagName){
              this._animations.splice(indice, 1);
              return;
            }
        })
    }

    updateFrame(){
        if(this.#currentFrame < this.#endFrame){
            this.#currentFrame++;
        }else{
            this.#currentFrame = this.#startFrame;
        } 
    }

    animation(tagName){
        let result = null;

        this._animations.forEach(animacion => {
            if(animacion.tag() === tagName){
                result = animacion;
                return;
            }
        })

        return result;

    }

    setNroFrame(nroFrame){
        if(Utilities.controlUseNumberType(nroFrame) && nroFrame >= 0){
            this.#nroFrame = nroFrame;
        }
    }

    setImage(image){
        if(Utilities.controlUseImageType(image)){
            this._image = image;
        }
    }

    image(){
        return this._image;
    }

    offset(){
        return Utilities.variableCopy(this._offset);
    }

    setOffset(xyOffset){
        if(Utilities.controlUseVector2DType(xyOffset)){
            this._offset = xyOffset;
        }
    }

    scale(){
        return Utilities.variableCopy(this._scale);
    }

    setScale(xyScale){
        if(Utilities.controlUseVector2DType(xyScale)){
            this._scale = xyScale;
        }
    }

    frames(){
        return this.#nroFrame;
    }

    NAME(){
        return this.#NAME;
    }

    startFrame(){
        return this.#startFrame;
    }

    endFrame(){
        return this.#endFrame;
    }

    setStartFrame(number){
        if(Utilities.controlUseNumberType(number)){
            this.#startFrame = number;
        }
    }

    setEndFrame(number){
        if(Utilities.controlUseNumberType(number)){
            this.#endFrame = number;
        }
    }

}

class AnimationSprite{
    
    #NAME = "AnimationSprite";

    #tag;
    #starFrame;
    #endFrame;

    #scale;
    #offset

    constructor(startFrame, endFrame, tagName, xyScale, xyOffset = new Vector2D(0,0)){

        this.setTag(tagName);
        this.setStartFrame(startFrame);
        this.setEndFrame(endFrame);
        this.setOffset(xyOffset);
        this.setScale(xyScale);

    }


    setTag(tagName){
        if(Utilities.controlUseStringType(tagName)){
            this.#tag = tagName;
        }
    }

    tag(){
        return this.#tag;
    }

    startFrame(){
        return this.#starFrame;
    }

    endFrame(){
        return this.#endFrame;
    }

    setStartFrame(number){
        if(Utilities.controlUseNumberType(number)){
            this.#starFrame = number;
        }
    }

    setEndFrame(number){
        if(Utilities.controlUseNumberType(number)){
            this.#endFrame = number;
        }
    }

    offset(){
        return Utilities.variableCopy(new Vector2D(),this.#offset);
    }

    setOffset(xyOffset){
        if(Utilities.controlUseVector2DType(xyOffset)){
            this.#offset = xyOffset;
        }
    }

    scale(){
        return Utilities.variableCopy(this.#scale);
    }

    setScale(xyScale){
        if(Utilities.controlUseVector2DType(xyScale)){
            this.#scale = xyScale;
        }
    }

    NAME(){
        return this.#NAME;
    }

}

class Component{

    _life;  //TODO: destroy (Tener en cuenta el patron pool de objetos para mayor rendimiento cuando la agregacion y eliminacion es frecuente)
    _render;
    _layer = 0; // Define la profundiad de pintado respecto a otros elementos
   
    _rigidBody;
    _transform;
    _sprite;

    _animations = [];
    _events = [];

    #NAME = "Component";//nombre de clase
    #tag; //nombre por el cual se buscara en los contenedores (debe cambiarlo el ususario segun su necesidad)

    constructor(transform, sprite, rigidBody){
        
       if(sprite){
        this.setSprite(sprite);
        this._render = true;
       }else{
        this._render = false;
       }

       if(rigidBody){
        this.setRigidBody(rigidBody);
       }

       this.setTransform(transform)
   
        this._life = true;

    }

    setTransform(transform){
        if(Utilities.controlUseTranformType(transform)){
            this._transform = transform;
        }
    }

    setSprite(sprite){
        if(Utilities.controlUseSpriteType(sprite)){
            this._sprite = sprite;
        }
    }

    setRigidBody(rigidBody){
        if(Utilities.controlUseRigidBodyType(rigidBody)){
            this._rigidBody = rigidBody;
        }
    }

    transform(){
        return Utilities.variableCopy(this._transform);
    }

    rigidBody(){
        return Utilities.variableCopy(this._rigidBody);
    }

    sprite(){
        //let copySprite = {};
        return Utilities.variableCopy(this._sprite);
        //return this.#sprite;
    }

    tag(){
        return this.#tag;
    }

    setTag(tagName){
        if(Utilities.controlUseStringType(tagName)){
            this.#tag = tagName;
        }
    }

    NAME(){ return this.#NAME; }

    setLife(life){
        if(Utilities.controlUseBooleanType(life)){
            this._life = life;
        }
    }

    destroy(){
        this._life = false;
    }

    life(){ return this._life; }

    setRender(boolean){
        if(Utilities.controlUseBooleanType(boolean)){
            this._render = boolean;
        }
    }

    render(){ return this._render; }

    setLayer(number){
        if(Utilities.controlUseNumberType(number)){
            this._layer = number;
        }
    }

    layer(){ return this._layer; }

    #update(dt,t){

        this.updateFrame(dt,t);
        //eventos de mouse
        //eventos de taclado
        //eventos touch

    }

    updateFrame(dt,t){ }
   
    chekStates(){/*maquina de estados*/ }

    drawPre(ctx){}
    drawPost(ctx){}
    onCollision(colision){}
    onEnterColision(colision){}
    onExitColision(colision){}

    scale(scale){

        let scaledraw = new Vector2D(this._transform.scale().x * scale.x, this._transform.scale().y * scale.y)
        this._transform.setScale( scaledraw );

        if(this._rigidBody){
            let collider2D = this._rigidBody.collider2D();
            if(collider2D.NAME() === "CircleCollider2D"){
                collider2D.scale(scale.x);
                collider2D.moveCenter( new Vector2D(this._transform.position().x + this._transform.scale().x/2, this._transform.position().y + this._transform.scale().y/2));   
            }else{
                collider2D.scale(scale.x, scale.y, this._transform.position());
            }
        }

        //let scaledraw = new Vector2D(this._transform.scale().x * scale.x, this._transform.scale().y * scale.y)
        //this._transform.setScale( scaledraw );
    }

    rotate(angleRad){

        if(this._rigidBody){
            let collider2D = this._rigidBody.collider2D();
            if(collider2D.rotate){
                collider2D.rotate(angleRad ,collider2D.centerCopy());
            }
        }
        
        this._transform.setAngle(angleRad); //Angulo que tomara los sprites al ser pintados
     
    }

    traslate(desplacemnt){
        if(this._rigidBody){
            let collider2D = this._rigidBody.collider2D();
            collider2D.traslate(desplacemnt)
        }
        
        this._transform.setPosition(new Vector2D(this._transform.position().x + desplacemnt.x, this._transform.position().y + desplacemnt.y) );
    }

    AABB(){
       /*if(this.#rigidBody.collider2D() && this.#rigidBody.collider2D().bounds()){
            return this.#rigidBody.collider2D().bounds();

        }else if(this.#sprite){
            return {min_x : this.#transform.position().x, 
                    min_y : this.#transform.position().y, 
                    max_x : , 
                    max_y: }

        }else{

        }*/

        return this._rigidBody.collider2D().bounds();

    }

    filterCollision(){
        return this._rigidBody.colisionFilter();
    }

}

class Composite {

    _childrens = [];
    _life;
    #NAME = "Composite";
    #tag;

    _bound;
    _collisionFilter;

    _collisionBetweenChildrens = true;

    constructor(childrens) {
        if(childrens && Array.isArray(childrens)){
            this._childrens = childrens;
        }
    }

    setTag(tagName){
        this.#tag = tagName;
    }

    tag(){
        return this.#tag;
    }

    setLife(life){
        if(Utilities.controlUseBooleanType(life)){
            this._life = life;
        }
    }

    life(){
        return this._life;
    }

    NAME(){
        return this.#NAME;
    }

    add(child) {
        this._childrens.push(child);
        return child;
    }

    remove(child) {
        this._childrens = this._childrens.filter(c => c !== child);
        return child;
    }

    rotate(angleRad){
        this._childrens.forEach(element => element.rotate(angleRad));
    }

    scale(scale){
        this._childrens.forEach(element => element.scale(scale));
    }

    traslate(desplacement){
        this._childrens.forEach(element => element.traslate(desplacement));
    }

    findElement(tagName){
        let result;

        this._childrens.forEach(element => {
            if(element.tag() === tagName){
                result = element;
                return;
            }
        })

        return result;
    }

    findElements(tagName){
        return this._childrens.filter(element => element.tag() === tagName);
    }

    update(dt, t) {
        this._childrens.forEach(child => {
            
            if (child.update) {  child.update(dt, t);  }
            
        });

        this.updateFrame(dt, t);
    }

    updateFrame(dt, t){
        //Acciones sobre soposite y sus hijos definido por el usuario
    }

    NumberOfChildren(){
        return this._childrens.length;
    }

    calculateAABB(components) {
        // Inicializar límites con valores extremos para garantizar que se actualicen correctamente
        let minX = Number.POSITIVE_INFINITY;
        let minY = Number.POSITIVE_INFINITY;
        let maxX = Number.NEGATIVE_INFINITY;
        let maxY = Number.NEGATIVE_INFINITY;
    
        // Función para actualizar los límites con base en un vector (punto)
        function updateBounds(point) {
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
        }
    
        components.forEach(c => {
            //min_x, min_y, max_x, max_y}
            
            let topLeft = new Vector2D(c.AABB().min_x, c.AABB().min_y);
            let bottomRight = new Vector2D(c.AABB().max_x, c.AABB().max_y);

            updateBounds(topLeft);
            updateBounds(bottomRight);
        });

        return {min_x: minX , min_y: minY, max_x: maxX, max_y: maxY};
        // Recorrer cada polígono para actualizar los límites
        /*polygons.forEach(polygon => {
            polygon.forEach(vertex => {
                updateBounds(vertex);
            });
        });*/
    
        // Recorrer cada círculo para actualizar los límites
        /*circles.forEach(circle => {
            let { center, radius } = circle;
            // Calcular los vértices del cuadro delimitador del círculo
            let topLeft = new Vector2D(center.x - radius, center.y - radius);
            let bottomRight = new Vector2D(center.x + radius, center.y + radius);
            // Actualizar los límites con estos vértices
            updateBounds(topLeft);
            updateBounds(bottomRight);
        });*/
    
        // Crear y retornar el AABB con los límites calculados
        //return new AABB(minX, minY, maxX, maxY);
    }

    AABB(){

        if(this._bound){
            this._bound = this.calculateAABB(this._childrens)    
        }

        return this._bound;
    }

    setBounds(topLeft, bottomRight){
        if(Utilities.controlUseVector2DType(topLeft) && Utilities.controlUseVector2DType(bottomRight)){
            this._bound = {min_x: topLeft.x , min_y: topLeft.y, max_x: bottomRight.x, max_y: bottomRight.y}
        }
        
    }

    setCollisionBetweenChildrens(boolean){
        if(Utilities.controlUseBooleanType(boolean)){
            this._collisionBetweenChildrens = boolean;
        }
    }

    collisionBetweenChildrens(){
        return this._collisionBetweenChildrens;
    }

    colisionFilter(){
        return this._collisionFilter;
    }

    setColisionFilter(collisionFilter){
        if(Utilities.controlUseCollisionFilterType(collisionFilter)){
            this._collisionFilter = collisionFilter;
        }
    }

    childrens(){
        return this._childrens;
    }

}

class SysCollision2D{

    _collision2D = [];
    _notifyCollision;

    checkCondicionFilterCollision(collisionFilter1, collisionFilter2){
        if(collisionFilter1.group() > 0 && collisionFilter1.group() === collisionFilter2.group()){
            return true;

        }else if(collisionFilter1.group() < 0 || collisionFilter2.group() < 0){
            return false

        }else if(collisionFilter1.group() !== collisionFilter2.group() || (collisionFilter1.group() === collisionFilter2.group() && collisionFilter1.group() === 0) ){
            if (collisionFilter1.mask().includes(collisionFilter2.category()) || collisionFilter2.mask().includes(collisionFilter1.category())){
                return true;
            }
        }
    }

    detecteCollision(composite, updateStateOfCollisionChild = true){
        this._notifyCollision = updateStateOfCollisionChild;

        if(composite.collisionBetweenChildrens()){
            composite.childrens().forEach( (child, indice) => {
                console.log("cumple condicion de colision");//TODO
                if(child.NAME && child.NAME() ==="Composite" && child.collisionBetweenChildrens()){
                    this.detecteCollision(child);
                }

                if( indice + 1 > composite.NumberOfChildren() ){
                    return;
                }

                let C = composite.childrens();
                console.log("indice:", indice," Indice segun for",indice + 1, " Numero childs", composite.NumberOfChildren())
                for(let j = indice + 1; j < composite.NumberOfChildren(); j++){

                    console.log("Componentes a evaluar collision",C[indice],C[j]);
                    console.log(C[indice].NAME(),C[j].NAME());

                    if(C[indice].NAME() === "Component" && C[j].NAME() === "Component"){
                        this.checkCollisionBetweenComponents(C[indice],C[j]);
                        console.log("Somos dos componentes a colisionar");
        
                    }else if(C[indice].NAME() === "Component" && C[j].NAME() === "Composite"){
                        this.checkCollisionBetweenCompositeAndComponent(C[j], C[indice]);

                    }else if(C[indice].NAME() === "Composite" && C[j].NAME() === "Component"){
                        this.checkCollisionBetweenCompositeAndComponent(C[indice], C[j]); 

                    }else if(C[indice].NAME() === "Composite" && C[j].NAME() === "Composite"){
                        this.checkCollisionBetweenComposite(c[indice],c[j]);
                    }
                    
                }
        
            })
        }

        this._notifyCollision = true;
        return this._collision2D;
    }

    checkCollisionBetweenComponents(Component1, Component2){

        if(this.checkCondicionFilterCollision( Component1.filterCollision(), Component2.filterCollision() ) ){
            if(!this.checkCollisionAABB(Component1.AABB(),Component2.AABB())){
                return;
            }

            if( this.verifyCollision(Component1.rigidBody().collider2D(), Component2.rigidBody().collider2D()) ){
                
                this._collision2D.push({Component1, Component2}); // Registro de colisiones
                console.log("Estan colisionando");
                if(this._notifyCollision){
                    Component1.onCollision(Component2);
                    Component2.onCollision(Component1);
                }

            }
        }

        //this.checkCollisionBetweenContainerAndComponent(component1.parts, component2);
        //this.checkCollisionBetweenContainerAndComponent(component2.parts, component1);
        //this.checkCollisionBetweenContainers(component1.parts, component2.parts);

    }

    checkCollisionBetweenCompositeAndComponent(composite, component){

        if( this.checkCondicionFilterCollision(composite.filterCollision(), component.filterCollision()) ){
            if(!this.checkCollisionAABB(composite.AABB(), component.AABB())){
                return;
            }
        }

        for(let i = 0; i < composite.childrens().length; i++){
            let child = composite.childrens()[i];

            if(child.NAME()  == "Component"){
                     
                this.checkCollisionBetweenComponents(child, component);

            }else if(child.NAME()  == "Composite"){
                this.checkCollisionBetweenCompositeAndComponent(child, component);
            }
        }

    }

    checkCollisionBetweenComposite(composite1, composite2){

        if( this.checkCondicionFilterCollision(composite1.filterCollision(), composite2.filterCollision()) ){
            if(!this.checkCollisionAABB(composite1.AABB(), composite2.AABB())){
                return;
            }
        }
        
        for (let child_C1 = 0; child_C1 < composite1.childrens().length; child_C1++) {
            let childC1 = composite1.childrens()[child_C1];

            if(childC1.NAME()  == "Composite"){
                this.checkCollisionBetweenComposite(childC1, composite2);

            }else{
                for (let child_C2 = 0; child_C2 < composite2.childrens().length; child_C2++) {
                    let childC2 = composite2.childrens()[child_C2];

                    if(childC2.NAME()  == "Composite"){
                        this.checkCollisionBetweenComposite(childC2, composite1);

                    }else{
                        if(childC2.NAME() == "Component" && childC1.NAME()  == "Component"){
                            this.checkCollisionBetweenComponents(childC1, childC2);
                        }       
                    } 
                }
            }
        }

    }

    verifyCollision(collider2D1, collider2D2){
       
        if(collider2D1.NAME() === "AABBCollider2D" && collider2D2.NAME() === "AABBCollider2D"){
            return true;
        }else if(collider2D1.NAME() === "CircleCollider2D" && collider2D2.NAME() === "AABBCollider2D"){
            return this.checkCollisionBetweenAabbAndCircle(collider2D2, collider2D1);
        }else if(collider2D1.NAME() === "AABBCollider2D" && collider2D2.NAME() === "CircleCollider2D"){
            return this.checkCollisionBetweenAabbAndCircle(collider2D1, collider2D2);
        }else if(collider2D1.NAME() === "CircleCollider2D" && collider2D2.NAME() === "CircleCollider2D"){
            return this.checkCollisionBetweenCircles(collider2D1, collider2D2);
        }//Pendiente interseccion entre poligonos

        return false;

    }

    checkCollisionAABB(bound1, bound2){
        return (
            bound1.max_x >= bound2.min_x && bound1.min_x <= bound2.max_x &&
            bound1.max_y >= bound2.min_y && bound1.min_y <= bound2.max_y
        );
    }

    checkCollisionBetweenAabbAndCircle(box, circle){ 
        const { min_x, min_y, max_x, max_y } = box.bounds;
        const radius = circle.radius();
        const center = circle.centerCopy();

        const cx = center.x;
        const cy = center.y;
        const r = radius;

        // Determinar el punto más cercano en el AABB al centro del círculo
        let px = cx;
        let py = cy;

        // Verificar los límites horizontales
        if (px < min_x) px = min_x; // Círculo está a la izquierda del AABB
        if (px > max_x) px = max_x; // Círculo está a la derecha del AABB

        // Verificar los límites verticales
        if (py < min_y) py = min_y; // Círculo está por debajo del AABB
        if (py > max_y) py = max_y; // Círculo está por encima del AABB

        let distancia = Math.sqrt( (cx - px)*(cx - px) + (cy - py)*(cy - py) );
        if ( distancia < r ) {
            return true;
        }else{
            return false;
        }       
    }

    checkCollisionBetweenCircles(circle1, circle2){
        const r1 = circle1.radius();
        const center1 = circle1.centerCopy();
        const cx1 = center1.x;
        const cy1 = center1.y;

        const r2 = circle2.radius();
        const center2 = circle2.centerCopy();
        const cx2 = center2.x;
        const cy2 = center2.y;
    
        let distancia = Math.sqrt( (cx1 - cx2)*(cx1 - cx2) + (cy1 - cy2)*(cy1 - cy2) );
        if ( distancia < r1 + r2 ) {
           return true;
        }else{
            return false;
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

class Scene extends Composite{
    #otherScenes = [];
    #NAME = "Scene";
    #tag;

    #update(){

    }

    preload(){

    }

    create(){

    }


    updateFrame(){

    }

    addScene(Scene){
        if(Utilities.controlUseSceneType(Scene)){
            this.#otherScenes.push(Scene);
        }
    }

    removeScene(tagName){
        this.#otherScenes = this.#otherScenes.filter(s => s.tag() !== tagName);
    }

    tag(){
        return this.#tag;
    }

    setTag(tagName){
        if(Utilities.controlUseStringType(tagName)){
            this.#tag = tagName;
        }
    }

    NAME(){
        return this.#NAME;
    }

    transitionScene(tagName){
        return this.#otherScenes.find(s => s.tag() === tagName);
    }

    resetScene(){
        this.#otherScenes = [];
    }



}



class Draw{

    static color;
    puntos = [];
    anchoLinea;

    #NAME = "Dibujo";

    constructor(){}

    NAME(){
        return this.#NAME;
    }

    // ------ funciones de dibujo (Opcional uso) -------
    
    static drawCirculo(ctx, pos, radio = 0){

            if(Utilities.controlUseVector2DType(pos) && Utilities.controlUseNumberType(radio)){
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, radio, 0, 2 * Math.PI, false);
                ctx.fill();
            }
    }

    static drawRectangulo(ctx, pos, widthHeight){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.strokeRect(pos.x, pos.y, widthHeight.x, widthHeight.y);
        ctx.fill();
    }

    drawLienea(ctx, vectorPunto = [], ancholinea = 1){

    }

    //... mas figuras de ser necesario
    // ---------------------------------------------------


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



// --------------------------- Sector Pruebas --------------------------------
//{ "key": 6,tipe:"compuesto", sprite: {"urlSprite": "./resources/enemyesSprites/Rombo2.png", "nroFrameSprite": 0, "alto": 134, "ancho": 168}, tranform : { "alto": 134, "ancho": 168, "radio": 50, "velocityX": 7, "velocityY": 7, "anguloRotacion": 0.3}, config :{ "life": 500, "color": " ", "keyParticula": 2,"damage": 2,"tipeMove":"lineal"}, 

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

    R.addImage("./resources/enemyesSprites/Rombo2.png", "E");
    R.addImage("./resources/enemyesSprites/Rombo2.png", "A");
    R.addAudio("./resources/efectSong/synthetic_explosion_1.flac", "explosion");
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
testResources();

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
    CanvasRender.create(800, 800);
    CanvasRender.render(ecena);

   
}



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
