
/*

Parámetros de drawImage():

1) image - La propia imagen que queremos recortar y mostrar en el navegador.
2) sx (eje x de la imagen de origen): este parámetro indica desde dónde desea recortar o comenzar a recortar la imagen desde el eje x.
3) sy (imagen de origen eje y) - Este parámetro dice desde dónde desea recortar o comenzar a recortar la imagen desde el eje y.
4) sWidth - El ancho de la imagen a partir de sx.
5) sHeight - La altura de la imagen a partir de sy.
6) dx - El punto desde el que empezar a dibujar la imagen en la pantalla desde el eje x.
7) dy - El punto desde el que empezar a dibujar la imagen en la pantalla desde el eje y.
8) dWidth - La longitud de las imágenes que deben mostrarse en la pantalla.
9) dHeight - La altura de las imágenes que deben mostrarse en la pantalla.

*/

class CanvasRender {

    constructor(ancho, alto) {
        
        let contenedorCanvas = document.getElementById("contenedorCanvas") ;
        console.log(contenedorCanvas);
        
        const canvas = document.createElement("canvas");
        contenedorCanvas.appendChild(canvas);
        this.ancho = canvas.width = 500;
        this.alto = canvas.height = 500;

        this.view = canvas;
        this.contexto = canvas.getContext("2d");
    }

    render(conteiner,clear = true) {
        const ctx = this.contexto;
        
        //Dibuja todos lo gameObject segun el tipo
        function renderRect(conteiner) {

            conteiner.childrens.forEach(child => {
                
                ctx.save();

                //Un contenedor puede contener otros contenedores => si es contenedor que pinte sus hijos
                if (child.childrens){
                    renderRect(child);
                }

                /*
                Afecta las coredenadas de figura a figura dibujada "No usar"
                if (child.posicion)  {
                        ctx.translate(Math.round(child.posicion.X), Math.round(child.posicion.Y));
                }*/
                if(child.renderizar && child.renderizar == true){

                    if(child.sprite && child.sprite != null){
                        
                        ctx.drawImage(child.sprite.imagen,
                                    child.sprite.currentFrameSprite * child.sprite.altoYanchoSprite.X,
                                    0, 
                                    child.sprite.altoYanchoSprite.X, 
                                    child.sprite.altoYanchoSprite.Y, child.posicion.X, 
                                    child.posicion.Y, 
                                    child.altoYancho.X, 
                                    child.altoYancho.Y);
                    
                    }    

                    if(child.draw){
                        child.draw(ctx);
                    }

                }

                ctx.restore();
                
            });

        }
           
        //clear alternativa
        if(clear){

           //Efecto en desplazamietno 
           ctx.fillStyle = "rgba(0,0,0,0.1)";  
           ctx.fillRect(0, 0, this.ancho, this.alto);          
           //ctx.clearRect(0, 0, this.ancho, this.alto);

        }
        
        //no es bucle recursivo
        renderRect(conteiner);

    }

}

export default CanvasRender;