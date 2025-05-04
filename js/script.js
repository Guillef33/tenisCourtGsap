const ball = document.querySelector("#ball");
const court = document.querySelector("#court");
const marker = document.querySelector("#clickMarker");
const ladoArriba = document.querySelector("#ladoArriba");
const ladoAbajo = document.querySelector("#ladoAbajo");

const resultadoGame = document.querySelector("#resultadoGame");

const jugadorUno = {
  nombre: "jugador Uno",
  node: document.querySelector("#playerOne"),
  turno: document.querySelector("#turnoPlayerOne"),
  velocidad: 1,
  potenciaTiro: 1,
  puntaje: document.querySelector("#resultadoJugadorUno"),
  puntos: 0,
  mensajeTiro: document.querySelector("#tiroPlayerOne"),
  initialX: 0,
  initialY: 0,
  prevX: 0,  
  prevY: 0,  

  actualizarPosicion: function () {
    const rect = this.node.getBoundingClientRect();
    this.prevX = this.initialX;
    this.prevY = this.initialY;
    this.initialX = rect.left;
    this.initialY = rect.top;
  }
};

const jugadorDos = {
  nombre: "jugador Dos",
  node: document.querySelector("#playerTwo"),
  turno: document.querySelector("#turnoPlayerTwo"),
  velocidad: 1,
  potenciaTiro: 2,
  puntaje: document.querySelector("#resultadoJugadorDos"),
  puntos: 0,
  mensajeTiro: document.querySelector("#tiroPlayerTwo"),
  initialX:  0,
  initialY: 0,
  prevX: 0,  
  prevY: 0, 

  actualizarPosicion: function () {
    const rect = this.node.getBoundingClientRect();
    this.prevX = this.initialX;
    this.prevY = this.initialY;
    this.initialX = rect.left;
    this.initialY = rect.top;
  }
};

let turno = 0;

// Inicializar posiciones de ambos jugadores
function inicializarPosiciones() {
  jugadorUno.actualizarPosicion();
  jugadorDos.actualizarPosicion();
  console.log("Posiciones inicializadas:", 
              "J1:", jugadorUno.initialX, jugadorUno.initialY, 
              "J2:", jugadorDos.initialX, jugadorDos.initialY);
}

// Llamar a inicializarPosiciones cuando carga la página
document.addEventListener('DOMContentLoaded', inicializarPosiciones);

court.addEventListener("click", manejarClickEnLaCancha);


function manejarClickEnLaCancha(e) {
  let coordenadasTiro = calcularCoordenadasDelClick(e)
  


  dibujarMarker(coordenadasTiro.x, coordenadasTiro.y);
  const zona = evaluarZonaTiro(coordenadasTiro.x, coordenadasTiro.y);
  turnos(coordenadasTiro.x, coordenadasTiro.y, zona);
}

function calcularCoordenadasDelClick(e) {
  return {
    x: e.clientX,
    y: e.clientY,
  };
}

function dibujarMarker(x, y) {
  marker.style.opacity = 1;
  marker.style.left = x + "px";
  marker.style.top = y + "px";
}



function evaluarZonaTiro(x, y) {
  const arribaRect = document
    .querySelector("#ladoArriba")
    .getBoundingClientRect();
  const abajoRect = document
    .querySelector("#ladoAbajo")
    .getBoundingClientRect();

  const enArriba =
    x >= arribaRect.left &&
    x <= arribaRect.right &&
    y >= arribaRect.top &&
    y <= arribaRect.bottom;

  const enAbajo =
    x >= abajoRect.left &&
    x <= abajoRect.right &&
    y >= abajoRect.top &&
    y <= abajoRect.bottom;

  if (enArriba) return "arriba";
  if (enAbajo) return "abajo";
  return "fuera";
}

  function manejarTurno(jugadorActivo, jugadorPasivo, zona, x, y) {
    jugadorActivo.turno.style.opacity = 1;
    jugadorPasivo.turno.style.opacity = 0;
    jugadorPasivo.mensajeTiro.style.opacity = 0;
  
    if ((zona === "arriba" && jugadorActivo === jugadorUno) || 
        (zona === "abajo" && jugadorActivo === jugadorDos)) {
      
      animarPelota(x, y, jugadorActivo.potenciaTiro, zona, jugadorActivo);
      mostrarMensajeDeTiro(jugadorActivo, `¡Buen tiro ${jugadorActivo.nombre}!`);
      moverJugadorHaciaLaPelota(y, x, jugadorActivo.node, jugadorActivo.velocidad);
      jugadorPasivo.turno.style.opacity = 1;
    } else {
      mostrarMensajeDeTiro(
        jugadorActivo,
        `Has fallado el tiro ${jugadorActivo.nombre}`
      );
      reiniciarElPunto(jugadorPasivo, jugadorActivo);
      jugadorPasivo.turno.style.opacity = 0;
    }
  }

function turnos(x, y, zona) {
  if (turno % 2 === 0) {
    manejarTurno(jugadorUno, jugadorDos, zona, x, y);
  } else {
    manejarTurno(jugadorDos, jugadorUno, zona, x, y);
  }

  turno++;
}

function mostrarMensajeDeTiro(jugador, mensaje) {
  jugador.mensajeTiro.textContent = mensaje;
  jugador.mensajeTiro.style.opacity = 1;
}

function sumarPuntos(jugador) {
  jugador.puntos = jugador.puntos + 1;
  jugador.puntaje.textContent = jugador.puntos;
}

function moverJugadorHaciaLaPelota(x, y, marker, velocidad) {
  gsap.to(marker, {
    top: x,
    left: y,
    duration: velocidad,
    ease: "linear",
  });
}



  // Función mejorada para animar el pique de la pelota
  function animarPelota(targetX, targetY, potenciaTiro, zona, jugadorActivo) {
    const ballRect = ball.getBoundingClientRect();
    const ballX = ballRect.left;
    const ballY = ballRect.top;
    
    jugadorActivo.actualizarPosicion();
    
    // Calculamos la dirección del tiro
    const dx = targetX - jugadorActivo.initialX;
    const dy = targetY - jugadorActivo.initialY;
    
    // Normalizamos el vector de dirección
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const dirX = dx / magnitude;
    const dirY = dy / magnitude;
    
    let bounceX, bounceY;
    
    if (zona === "arriba") {
      // Si el tiro es hacia arriba, el rebote sube
      bounceX = targetX + dirX * 150;
      bounceY = targetY - Math.abs(dirY) * 150; 
    } else if (zona === "abajo") {
      // Si el tiro es hacia abajo, el rebote baja
      bounceX = targetX + dirX * 150;
      bounceY = targetY + Math.abs(dirY) * 150; 
    }
    
    console.log("Tiro:", targetX, targetY);
    console.log("Jugador:", jugadorActivo.nombre, jugadorActivo.initialX, jugadorActivo.initialY);
    console.log("Dirección:", dirX, dirY);
    console.log("Rebote:", bounceX, bounceY);
    
   
    const tl = gsap.timeline();
    
    tl.to(ball, {
      top: targetY + "px",
      left: targetX + "px",
      duration: potenciaTiro * 0.5,
      ease: "power1.out"
    })
    // .to(ball, {
    //   top: bounceX + "px",
    //   left: bounceY + "px",
    //   duration: potenciaTiro * 0.3,
    //   ease: "power2.out"
    // });
       
    return tl;
  }


  function reiniciarElPunto(ganador, perdedor) {
    sumarPuntos(ganador);
    resultadoGame.style.opacity = 1;
    resultadoGame.textContent = `Punto para ${ganador.nombre}. El resultado es 15 a 0`;
    perdedor.mensajeTiro.style.opacity = 0;
    perdedor.turno.style.opacity = 0;
    ganador.turno.style.opacity = 0;
  
    console.log(jugadorUno.prevY);
    console.log(jugadorUno.prevX);
  
    setTimeout(() => {
      jugadorUno.node.style.top = `${jugadorUno.prevY + 20}px`;
      jugadorUno.node.style.left = `${jugadorUno.prevX}px`; 
      jugadorDos.node.style.top = `${jugadorDos.prevY}px`; 
      jugadorDos.node.style.left = `${jugadorDos.prevX}px`; 
    
      turno = 0;
      resultadoGame.style.opacity = 0;
  
      // gsap.to(ball, {
      //   // bottom: 20,
      //   left: jugadorUno.initialX,
      //   top: jugadorUno.initialY,
      //   duration: 1,
      //   ease: "linear",
      // });
  
    }, 1000);
  }
  
