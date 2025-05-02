const playerOne = document.querySelector("#playerOne");
const playerTwo = document.querySelector("#playerTwo");
const ball = document.querySelector("#ball");
const court = document.querySelector("#court");
const marker = document.querySelector("#clickMarker");
const turnoPlayerOne = document.querySelector("#turnoPlayerOne");
const turnoPlayerTwo = document.querySelector("#turnoPlayerTwo");
const tiroPlayerOne = document.querySelector("#tiroPlayerOne");
const tiroPlayerTwo = document.querySelector("#tiroPlayerTwo");
const resultadoJugadorUno = document.querySelector("#resultadoJugadorUno");
const resultadoJugadorDos = document.querySelector("#resultadoJugadorDos");
const ladoArriba = document.querySelector("#ladoArriba");
const ladoAbajo = document.querySelector("#ladoAbajo");

let turno = 0;
let puntosJugadorUno = 0;
let puntosJugadorDos = 0;

court.addEventListener("click", handleCourtClick);


function ladoQueFueClickeado (x, y) {
  const arribaRect = ladoArriba.getBoundingClientRect();
  const abajoRect = ladoAbajo.getBoundingClientRect();

  const estaEnLadoArriba =
    x >= arribaRect.left &&
    x <= arribaRect.right &&
    y >= arribaRect.top &&
    y <= arribaRect.bottom;

  const estaEnLadoAbajo =
    x >= abajoRect.left &&
    x <= abajoRect.right &&
    y >= abajoRect.top &&
    y <= abajoRect.bottom;

  if (estaEnLadoArriba) {
    console.log("Clic en ladoArriba");

    procesarTurno(estaEnLadoArriba, x, y );
  } else if (estaEnLadoAbajo) {
    console.log("Clic en ladoAbajo");
    procesarTurno(estaEnLadoAbajo, x, y );
  } else {
    console.log("Clic fuera de los lados");
  }
}


function handleCourtClick(e) {
  const x = e.clientX;
  const y = e.clientY;

  ladoQueFueClickeado(x, y);

  marker.style.opacity = 1;
  marker.style.left = x + "px";
  marker.style.top = y + "px";

  gsap.to(ball, {
    top: marker.style.top,
    left: marker.style.left,
    duration: 1,
    ease: "linear",
  });

}

function sumarPuntos () {
  if (turno % 2 === 0) {
    puntosJugadorDos++;
    resultadoJugadorDos.textContent = puntosJugadorUno;
    turnoPlayerTwo.style.opacity = 1;
    turnoPlayerTwo.textContent = "El jugador dos ha ganado, porque erraste"
  } else {
    puntosJugadorDos++;
    resultadoJugadorUno.textContent = puntosJugadorUno;
    turnoPlayerOne.style.opacity = 1;
    turnoPlayerOne.textContent = "El jugador uno ha ganado, porque erraste"

  }

  
}



function procesarTurno(lado, x, y) {
  if (turno % 2 === 0) {
    turnoPlayerOne.style.opacity = 0;
    turnoPlayerTwo.style.opacity = 1;

    movePlayerToTheBall(y, x, playerOne);

    if (lado) {
      mostrarMensaje(tiroPlayerOne, "Buen tiro");
    } else {
      mostrarMensaje(tiroPlayerOne, "Has fallado, tiraste fuera de pista");
      puntosJugadorDos++;
      resultadoJugadorDos.textContent = puntosJugadorDos;
    }

  } else {
    // Turno Jugador 2
    turnoPlayerOne.style.opacity = 1;
    turnoPlayerTwo.style.opacity = 0;

    movePlayerToTheBall(y, x, playerTwo);

    if (lado) {
      mostrarMensaje(tiroPlayerTwo, "Buen tiro");
    } else {
      mostrarMensaje(tiroPlayerTwo, "Has fallado, tiraste fuera de pista");
    
    }
  }

  turno++;
}

function movePlayerToTheBall(x, y, player) {
  gsap.to(player, {
    top: x,
    left: y,
    duration: 1,
    ease: "linear",
  });
}

function mostrarMensaje(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.opacity = 1;
  setTimeout(() => {
    elemento.style.opacity = 0;
  }, 1000);
}

function playerCanReach() {}

function theBallCrossTheNet() {}

function theBallIsIn() {}

// playerTwo.addEventListener("click", () => {
//   const animateBall = gsap.to(ball, {
//     top: "70px",
//     left: "100px",
//     duration: 1,
//     ease: "linear",
//   });
// });

// playerOne.addEventListener("click", () => {
//   const animateBall = gsap.to(ball, {
//     top: "420px",
//     left: "240px",
//     duration: 1,
//     ease: "linear",
//   });
// });
