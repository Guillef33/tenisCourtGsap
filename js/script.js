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
  precisionDeTiro: 1,
  puntaje: document.querySelector("#resultadoJugadorUno"),
  puntos: 0,
  mensajeTiro: document.querySelector("#tiroPlayerOne"),
};

const jugadorDos = {
  nombre: "jugador Dos",
  node: document.querySelector("#playerTwo"),
  turno: document.querySelector("#turnoPlayerTwo"),
  velocidad: 1,
  precisionDeTiro: 1,
  puntaje: document.querySelector("#resultadoJugadorDos"),
  puntos: 0,
  mensajeTiro: document.querySelector("#tiroPlayerTwo"),
};

let turno = 0;

court.addEventListener("click", manejarClickEnLaCancha);

function manejarClickEnLaCancha(e) {
  let coordenadasTiro = calcularCoordenadasDelClick(e);
  dibujarMarker(coordenadasTiro.x, coordenadasTiro.y);
  animarPelota(coordenadasTiro.x, coordenadasTiro.y);
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

function animarPelota(x, y) {
  gsap.to(ball, {
    top: y + "px",
    left: x + "px",
    duration: 1,
    ease: "linear",
  });
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

  if (zona === "arriba" && jugadorActivo === jugadorUno) {
    mostrarMensajeDeTiro(jugadorUno, "¡Buen tiro jugador Uno!");
    movePlayerToTheBall(y, x, jugadorUno.node);
    jugadorPasivo.turno.style.opacity = 1;
  } else if (zona === "abajo" && jugadorActivo === jugadorDos) {
    mostrarMensajeDeTiro(jugadorDos, "¡Buen tiro jugador Dos!");
    movePlayerToTheBall(y, x, jugadorDos.node);
    jugadorPasivo.turno.style.opacity = 1;
  } else {
    mostrarMensajeDeTiro(
      jugadorActivo,
      `Has fallado el tiro ${
        jugadorActivo === jugadorUno ? "jugador Uno" : "jugador Dos"
      }`
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

function movePlayerToTheBall(x, y, player) {
  gsap.to(player, {
    top: x,
    left: y,
    duration: 1,
    ease: "linear",
  });
}

function reiniciarElPunto(ganador, perdedor) {
  sumarPuntos(ganador);
  resultadoGame.style.opacity = 1;
  resultadoGame.textContent = `Punto para ${ganador.nombre}. El resultado es 15 a 0`;
  jugador.mensajeTiro.style.opacity = 0;
}
