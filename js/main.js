// Una sola clase sirve para personajes (rival "General") y para matchups (rival concreto)
class Registro {
  constructor(nombre, rival, victorias, derrotas) {
    this.nombre = nombre;
    this.rival = rival;
    this.victorias = victorias;
    this.derrotas = derrotas;
  }
  registrarResultado(gano) {
    if (gano) {
      this.victorias++;
    } else {
      this.derrotas++;
    }
  }
}

const rivalGeneral = "General";
const limiteFuertePersonaje = 70;
const limiteFuerteMatchup = 60;
const limiteMedio = 40;
const respuestasGanar = ["s", "si", "g", "gano"];
const respuestasPerder = ["n", "no", "p", "perdio"];

const listaPersonajes = [
  new Registro("Ramlethal Valentine", rivalGeneral, 30, 10),
  new Registro("I-No", rivalGeneral, 14, 26),
  new Registro("Sol Badguy", rivalGeneral, 29, 21),
  new Registro("Ky Kiske", rivalGeneral, 21, 29),
  new Registro("Potemkin", rivalGeneral, 33, 17),
];

const listaMatchups = [
  new Registro("Ramlethal Valentine", "Ky Kiske", 18, 12),
  new Registro("Ramlethal Valentine", "Potemkin", 10, 20),
  new Registro("Ramlethal Valentine", "I-No", 15, 15),
  new Registro("Sol Badguy", "Ky Kiske", 12, 8),
  new Registro("Sol Badguy", "Potemkin", 9, 11),
];

//Cálculos y textos (sirven para personajes y matchups)

function calcularWinrate(registro) {
  const total = registro.victorias + registro.derrotas;
  let winrate = 0;
  if (total > 0) {
    winrate = Math.round((registro.victorias / total) * 1000) / 10;
  }
  return winrate;
}

function clasificar(registro) {
  const winrate = calcularWinrate(registro);
  let limiteFuerte = limiteFuerteMatchup;
  if (registro.rival === rivalGeneral) {
    limiteFuerte = limiteFuertePersonaje;
  }

  let nivel = "Debil";
  if (registro.victorias + registro.derrotas === 0) {
    nivel = "Sin partidas";
  } else if (winrate >= limiteFuerte) {
    nivel = "Fuerte";
  } else if (winrate >= limiteMedio) {
    nivel = "Medio";
  }
  return nivel;
}

function resumen(registro) {
  let titulo = registro.nombre;
  if (registro.rival !== rivalGeneral) {
    titulo += " vs " + registro.rival;
  }
  return (
    titulo +
    " | Winrate: " +
    calcularWinrate(registro) +
    "% | V:" +
    registro.victorias +
    " | D:" +
    registro.derrotas +
    " | Nivel: " +
    clasificar(registro)
  );
}

function listar(titulo, lista) {
  let texto = "----- " + titulo + " -----\n";
  let indice = 1;
  for (const registro of lista) {
    texto += indice + ". " + resumen(registro) + "\n";
    indice++;
  }
  return texto;
}

// Entrada
function pedirNumero(mensaje) {
  const texto = (prompt(mensaje) || "").trim();
  const numero = Number(texto);
  const esEntero = texto !== "" && numero % 1 === 0;
  let resultado = -1;
  if (esEntero && numero >= 0) {
    resultado = numero;
  }
  return resultado;
}

function elegir(titulo, lista) {
  const opcion = pedirNumero(listar(titulo, lista));
  let posicion = -1;
  if (opcion >= 1 && opcion <= lista.length) {
    posicion = opcion - 1;
  } else {
    alert("Opción inválida.");
  }
  return posicion;
}

function buscarIndice(lista, nombre, rival) {
  let indiceEncontrado = -1;
  let indice = 0;
  while (indice < lista.length && indiceEncontrado === -1) {
    const registro = lista[indice];
    if (
      registro.nombre.toLowerCase() === nombre.toLowerCase() &&
      registro.rival.toLowerCase() === rival.toLowerCase()
    ) {
      indiceEncontrado = indice;
    }
    indice++;
  }
  return indiceEncontrado;
}

// Acciones
function registrarPartida(lista) {
  const posicion = elegir("¿En cuál quieres registrar una partida?", lista);
  if (posicion !== -1) {
    const registro = lista[posicion];
    const respuesta = (prompt("¿Ganó " + registro.nombre + "? (s/n):") || "")
      .trim()
      .toLowerCase();
    if (respuestasGanar.includes(respuesta)) {
      registro.registrarResultado(true);
      alert("Partida registrada:\n" + resumen(registro));
    } else if (respuestasPerder.includes(respuesta)) {
      registro.registrarResultado(false);
      alert("Partida registrada:\n" + resumen(registro));
    } else {
      alert("Opción inválida.");
    }
  }
}

function buscarPersonaje() {
  const nombre = (prompt("Nombre EXACTO del personaje:") || "").trim();
  const indice = buscarIndice(listaPersonajes, nombre, rivalGeneral);
  if (indice === -1) {
    alert("No se encontró ningún personaje con ese nombre.");
  } else {
    alert(
      "Posición en la lista: " +
        (indice + 1) +
        "\n" +
        resumen(listaPersonajes[indice]),
    );
  }
}

function agregarPersonaje(alPrincipio) {
  const nombre = (prompt("Nombre del nuevo personaje:") || "").trim();
  const victorias = pedirNumero("Victorias iniciales:");
  const derrotas = pedirNumero("Derrotas iniciales:");
  const existe = buscarIndice(listaPersonajes, nombre, rivalGeneral) !== -1;
  const datosValidos = nombre !== "" && Math.min(victorias, derrotas) >= 0;

  if (datosValidos && !existe) {
    const nuevo = new Registro(nombre, rivalGeneral, victorias, derrotas);
    if (alPrincipio) {
      listaPersonajes.unshift(nuevo);
    } else {
      listaPersonajes.push(nuevo);
    }
    alert("Personaje añadido:\n" + resumen(nuevo));
  } else {
    alert(
      "No se pudo añadir: el nombre no puede estar vacío ni repetido, " +
        "y las victorias y derrotas deben ser enteros no negativos.",
    );
  }
}

// Se recorre al revés para que splice no desordene los índices pendientes
function quitarMatchupsDe(nombre) {
  for (let i = listaMatchups.length - 1; i >= 0; i--) {
    const matchup = listaMatchups[i];
    if (matchup.nombre === nombre || matchup.rival === nombre) {
      listaMatchups.splice(i, 1);
    }
  }
}

//No estoy 100% seguro de que esto maneje todos los casos correctamente pero Ticher me dijo que estaba bastante bien, asi que lo dejare
function quitarPersonaje(alPrincipio) {
  if (listaPersonajes.length === 0) {
    alert("No hay personajes que eliminar.");
  } else {
    let eliminado;
    if (alPrincipio) {
      eliminado = listaPersonajes.shift();
    } else {
      eliminado = listaPersonajes.pop();
    }
    quitarMatchupsDe(eliminado.nombre);
    alert("Se ha eliminado a " + eliminado.nombre + ".");
  }
}

function matchupsDe(nombre) {
  const encontrados = [];
  for (const matchup of listaMatchups) {
    if (matchup.nombre.toLowerCase() === nombre.toLowerCase()) {
      encontrados.push(matchup);
    }
  }
  return encontrados;
}

function consultarMatchups() {
  const nombre = (prompt("Nombre del personaje:") || "").trim();
  if (buscarIndice(listaPersonajes, nombre, rivalGeneral) === -1) {
    alert("El personaje no existe.");
  } else {
    alert(listar("Matchups de " + nombre, matchupsDe(nombre)));
  }
}

function guardarMatchup(nombre, rival) {
  const existe = buscarIndice(listaMatchups, nombre, rival) !== -1;

  if (nombre !== rival && !existe) {
    const nuevo = new Registro(nombre, rival, 0, 0);
    listaMatchups.push(nuevo);
    alert("Matchup creado:\n" + resumen(nuevo));
  } else {
    alert(
      "No se pudo crear: el rival debe ser distinto y el matchup no puede existir ya.",
    );
  }
}

function crearMatchup() {
  const posicionPersonaje = elegir("Personaje a analizar:", listaPersonajes);
  if (posicionPersonaje !== -1) {
    const posicionRival = elegir("Rival:", listaPersonajes);
    if (posicionRival !== -1) {
      guardarMatchup(
        listaPersonajes[posicionPersonaje].nombre,
        listaPersonajes[posicionRival].nombre,
      );
    }
  }
}

//  Menús 
// Cancelar o dejar vacío un prompt da Number(...) = 0, que es la opción de volver/salir
function menuPersonajes() {
  let opcion = -1;
  while (opcion !== 0) {
    opcion = Number(
      prompt(
        "----- Personajes -----\n" +
          "1. Mostrar lista\n" +
          "2. Buscar por nombre\n" +
          "3. Añadir al final\n" +
          "4. Añadir al inicio\n" +
          "5. Quitar el último\n" +
          "6. Quitar el primero\n" +
          "7. Registrar partida\n" +
          "0. Volver",
      ),
    );

    switch (opcion) {
      case 1:
        alert(listar("Personajes", listaPersonajes));
        break;
      case 2:
        buscarPersonaje();
        break;
      case 3:
        agregarPersonaje(false);
        break;
      case 4:
        agregarPersonaje(true);
        break;
      case 5:
        quitarPersonaje(false);
        break;
      case 6:
        quitarPersonaje(true);
        break;
      case 7:
        registrarPartida(listaPersonajes);
        break;
      case 0:
        alert("Volviendo al menú principal.");
        break;
      default:
        alert("Opción inválida.");
    }
  }
}

function menuMatchups() {
  let opcion = -1;
  while (opcion !== 0) {
    opcion = Number(
      prompt(
        "----- Matchups -----\n" +
          "1. Mostrar lista\n" +
          "2. Consultar los de un personaje\n" +
          "3. Registrar partida\n" +
          "4. Crear matchup nuevo\n" +
          "0. Volver",
      ),
    );

    switch (opcion) {
      case 1:
        alert(listar("Matchups", listaMatchups));
        break;
      case 2:
        consultarMatchups();
        break;
      case 3:
        registrarPartida(listaMatchups);
        break;
      case 4:
        crearMatchup();
        break;
      case 0:
        alert("Volviendo al menú principal.");
        break;
      default:
        alert("Opción inválida.");
    }
  }
}

// Programa principal
let salir = false;

while (!salir) {
  const opcion = Number(
    prompt(
      "----- Winrate de personajes de Guilty Gear -----\n" +
        "1. Gestionar personajes\n" +
        "2. Gestionar matchups\n" +
        "0. Salir",
    ),
  );

  switch (opcion) {
    case 1:
      menuPersonajes();
      break;
    case 2:
      menuMatchups();
      break;
    case 0:
      salir = confirm("¿Estás seguro que quieres salir?");
      break;
    default:
      alert("Opción inválida.");
  }
}

alert("Gracias por usar el programa.");

console.log(listar("Instancias de Personaje", listaPersonajes));
console.log(listar("Instancias de Matchup", listaMatchups));

console.log("----- Verificación de métodos -----");
if (listaPersonajes.length > 0) {
  console.log("Antes:", resumen(listaPersonajes[0]));
  listaPersonajes[0].registrarResultado(true);
  console.log("Después:", resumen(listaPersonajes[0]));
}