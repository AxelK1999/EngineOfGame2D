
class mouseControl{

    static elementRefPosition; //si container = null => toma todo el body 

    constructor(down = true, up = true, move = true){ // conteiner es el lienzo/canvas
        
        //estado
        this.position = {X:0,Y:0,Z:0,};
        this.isDown = false;    //mantiene presionado 
        this.pressed = false;   //click
        this.released = false;  //suelta click
    
    
        //eventos
        if(move /*&& mouseControl.elementRefPosition*/)
            document.addEventListener("mousemove", (e)=>{
                //this.mousePosFromEvent(e.clientX, e.clientY);
                this.position.X = e.clientX;
                this.position.Y = e.clientY;
            });


        if(down) 
            document.addEventListener("mousedown", (e)=>{
                this.isDown = true; 
                this.pressed = true; 
            }); 

       
         if(up)
            document.addEventListener("mouseup", (e)=>{
                this.isDown = false;
                this.pressed  = false; 
                this.released = true;
            });

    }

    mousePosFromEvent(clientX, clientY) { 

        //obtenemmos y actualizamos la posicion precisa del mosue sobre el lienzo (en funcion a las dimensiones del mismo y no el body completo)
        const xr = this.elementRefPosition.width / this.elementRefPosition.clientWidth; 
        const yr = this.elementRefPosition.height / this.elementRefPosition.clientHeight; 
        
        this.position.X = (clientX - this.elementRefPosition.clientLeft) * xr; 
        this.position.Y = (clientY - this.elementRefPosition.clientTop) * yr;
    }

    getEstado(){
        return {isDown:this.isDown, pressed:this.pressed, released:this.released};
    }

    getPosicion(){
        return this.position;
    }
    
    reset() { 
        this.released = false; 
        this.pressed = false;
    }

}

export default mouseControl;