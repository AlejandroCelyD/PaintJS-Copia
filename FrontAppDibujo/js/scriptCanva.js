const canvas = document.querySelector("canvas"),
botonesHerramientas = document.querySelectorAll(".herramienta"),
rellenarFigura = document.querySelector("#rellenarFigura"),
deslizadorTamano = document.querySelector("#deslizadorTamano"),
botonesColores = document.querySelectorAll(".colores .opcion"),
selectorColor = document.querySelector("#selectorColor"),
borrarTablero = document.querySelector(".borrarTablero"),
guardarImagen = document.querySelector(".guardarImagen"),
ctx = canvas.getContext("2d");

let anteriorPosicionX, anteriorPosicionY, copiaInst,
pintando = false,
herramientaSeleccionada = "pincel",
anchoPincel =  5;
colorSeleccionado = "#000";

const seleccionarFondoTablero = () => {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorSeleccionado;
}

window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    seleccionarFondoTablero();
})

const dibujarRectangulo = (e) => {
    if(!rellenarFigura.checked){
        return ctx.strokeRect(e.offsetX, e.offsetY, anteriorPosicionX - e.offsetX, anteriorPosicionY - e.offsetY);
    }
    ctx.fillRect(e.offsetX, e.offsetY, anteriorPosicionX - e.offsetX, anteriorPosicionY - e.offsetY);
}

const dibujarCirculo = (e) => {
    ctx.beginPath();
    let radio = Math.sqrt(Math.pow((anteriorPosicionX - e.offsetX), 2) + Math.pow((anteriorPosicionY - e.offsetY), 2));
    ctx.arc(anteriorPosicionX, anteriorPosicionY, radio, 0, 2*Math.PI);
    rellenarFigura.checked ? ctx.fill() : ctx.stroke();
}

const dibujarTriangulo = (e) => {
    ctx.beginPath();
    ctx.moveTo(anteriorPosicionX, anteriorPosicionY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.lineTo(anteriorPosicionX*2 - e.offsetX, e.offsetY);
    ctx.closePath();
    rellenarFigura.checked ? ctx.fill() : ctx.stroke();
}

const empezarADibujar = (e) => {
    pintando = true;
    anteriorPosicionX = e.offsetX;
    anteriorPosicionY = e.offsetY;
    ctx.beginPath();
    ctx.lineWidth = anchoPincel;
    ctx.strokeStyle = colorSeleccionado;
    ctx.fillStyle = colorSeleccionado;
    copiaInst = ctx.getImageData(0, 0, canvas.width, canvas.height)
}

const pintar = (e) => {
    if(!pintando) return;

    ctx.putImageData(copiaInst, 0, 0)

    if(herramientaSeleccionada === "pincel" || herramientaSeleccionada === "borrador"){
        ctx.strokeStyle = herramientaSeleccionada === "borrador" ? "#fff": colorSeleccionado; 
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }else if(herramientaSeleccionada === "rectangulo"){
        dibujarRectangulo(e);
    }else if(herramientaSeleccionada === "circulo"){
        dibujarCirculo(e);
    }else if(herramientaSeleccionada === "triangulo"){
        dibujarTriangulo(e);
    }
    
}

botonesHerramientas.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector(".opcionesDeDibujo .active").classList.remove("active");
        btn.classList.add("active");
        herramientaSeleccionada = btn.id;
        console.log(herramientaSeleccionada);
    });
});

deslizadorTamano.addEventListener("change", () => anchoPincel = deslizadorTamano.value);
botonesColores.forEach(btn => {
    btn.addEventListener("click", ()=>{
        document.querySelector(".opcionesDeDibujo .selected").classList.remove("selected");
        btn.classList.add("selected");
        colorSeleccionado = window.getComputedStyle(btn).getPropertyValue("background-color");
    });
});

selectorColor.addEventListener("change", () => {
    selectorColor.parentElement.style.background = selectorColor.value;
    selectorColor.parentElement.click();
});

borrarTablero.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    seleccionarFondoTablero();
})

guardarImagen.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = canvas.toDataURL();
    link.click();
})

canvas.addEventListener("mousedown", empezarADibujar);
canvas.addEventListener("mouseup", () => pintando = false);
canvas.addEventListener("mousemove", pintar);
