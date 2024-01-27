//Bolas de objetos (players - enemys - bullet - mapa) esta poderia ser la scena del juego que contiene todo los objetos
// que los carga y actualiza. "utilizado en el blucle principal del juego"

//Patron composite

class Container {

    coleccionFunciones = [];
    position;
    childrens;
    muerto;
    #NAME = "Container";
    name = "Container";

    constructor() {
        this.position = {X:0,Y:0,Z:0};//new Vector(0,0,0); //posicion en pantalla
        //this.propiedadesCanvas = canvas;
        this.childrens = [];
        
        this.muerto = false;
    }

    setNombreBusqueda(name = "Container"){
        this.name = name;
    }

    NAME(){
        return this.#NAME;
    }

    add(child) {
        this.childrens.push(child);
        return child;
    }

    remove(child) {
        this.childrens = this.childrens.filter(c => c !== child);
        return child;
    }


    addFunctionForUpdate(funcion){
        this.coleccionFunciones.push(funcion);
    }

    //Actualiza todos los objetos con sus respectivos metodos update {dt y t --> apuntes(index.js) --> bucles preciso}
    update(dt, t) {

        this.childrens.forEach(child => {
            
            if (child.update) {
                child.update(dt, t);
            }
            
        });

        //Para añadir funciones con eventos para manipular los child
        
        for(let i = 0; i < this.coleccionFunciones.length; i++){
            this.coleccionFunciones[i](this);
        }

    }

    getCantidadHijos(){
        return this.childrens.length;
    }

    buscarEnContenedor(name,contenedor){
        let arrayResultadosBusqueda = [];
        let i_ = contenedor.getCantidadHijos() -1;
       
        for(let i = 0; i < contenedor.getCantidadHijos(); i++){

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

            }else if(i > i_){
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

}

export default Container;
  