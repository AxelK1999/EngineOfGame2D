//El obejeto de esta clase contendra el estado de las teclas presionadas para
//ser verificada y utilizada por el bucle principal del juego => este no alteraria o interrumpiria
//el flujo del juego y al tocar el fram este lo acualiza.

//Maquina de estado de taclas "de no estar en la maquina lo agrega y establece el estado"
/*
class keycontrols{

    constructor(){
        
        this.keys = {};
        
        document.addEventListener("keydown", e =>{
            
            //37-38-39-40 codigo de flechas => para evitar en caso de estar/tener un barra de dezplazamiento que este se desplace por toda la web al presionar las flechas
            // => eliminamos este comportamiento predeterminado con preventDefault(); del navegador al detectar que se estan presionando las mismas.
            
            if ( [37,38,39,40].indexOf(e.keyCode) >= 0 ) {   //indexOf retorna la posicion del elemento en el array y -1 de no encontrarse
                e.preventDefault();
            } 
            console.log(" keydown :  " + e.key);
            //console.log(" keydown :  " + e;
            this.keys[e.keyCode] = true;  // cambiar todo a key o code  //Documentacion web [ Objetos: lo basico --> Objetos ]   "establece una propiedad set"  " => keys[e.code] es get de esa propiedad en el obj"
        }, false);
        
        document.addEventListener("keyup", e => { 
            this.keys[e.keyCode] = false; // cambiar todo a key o code
           //console.log(e.key);
        }, false);
    
    }

    get Space(){
        if(this.key[Space])
            return 2; //salto ej
        else 
          return 0;
    }

    get X(){

        // left arrow or A key 
        if(this.keys[37] || this.keys[65]) return -1;

        // right arrow or D key 
        if(this.keys[39] || this.keys[68])  return 1;

        return 0;
    }

    get Y(){

        // up arrow or W key 
        if(this.keys[38] || this.keys[87]) return -1;

        // down arrow or S key 
        if(this.keys[40] || this.keys[83]) return 1;
        
        return 0;

    }

    key(key, value) { 

        if (value !== undefined) 
            this.keys[key] = value;

        return this.keys[key]; 
    }

    reset () { 
        
        for (let key in this.keys) { 
            this.keys[key] = false;
        }

    }

    //!! Forma escalable !!
    //mas metodos para reccioanr a algun evento de teclado diferente ...

}
*/
class TecladoControl{

    teclasEstado = [];

    constructor(){

        document.addEventListener("keydown", e =>{

            //37-38-39-40 codigo de flechas => para evitar en caso de estar/tener un barra de dezplazamiento que este se desplace por toda la web al presionar las flechas
            // => eliminamos este comportamiento predeterminado con preventDefault(); del navegador al detectar que se estan presionando las mismas.
            
            if ( [37,38,39,40].indexOf(e.keyCode) >= 0 ) {   //indexOf retorna la posicion del elemento en el array y -1 de no encontrarse
                e.preventDefault();
            } 

            let añadirNuevaTacla = true;
            
            for(let i = 0; i < this.teclasEstado.length;i++){

                if(this.teclasEstado[i].key == e.key){
                    i = this.teclasEstado.length;
                    this.teclasEstado[i].presionado = true;
                    añadirNuevaTacla = false;
                }
            
            }

            if(añadirNuevaTacla){
                this.teclasEstado.push({tecla:e.key, codigo:e.code, presionado:true});
            }

        }, false);

        document.addEventListener("keyup", e => {

            for(let i = 0; i < this.teclasEstado.length;i++){

                if(this.teclasEstado[i].key == e.key){
                    i = this.teclasEstado.length;
                    this.teclasEstado[i].presionado = false;
                }
            
            }

        }, false);

    }

    obtenerEstadoTeclado(){
        return this.teclasEstado;
    }

    reset(){
        this.teclasEstado = [];
    }

}

export default TecladoControl; 