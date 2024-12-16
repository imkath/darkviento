particlesJS.load("snow-container", "particles-snow.json", function () {
  console.log("Particles.js cargado con nieve");
});

// Determinar el día actual (si es diciembre)
const today = new Date();
const currentMonth = today.getMonth(); // 0=Enero, 11=Diciembre
const currentRealDay = currentMonth === 11 ? today.getDate() : 0;

// Para pruebas:
// const currentRealDay = 10;

const days = document.querySelectorAll(".day");
const modals = document.querySelectorAll(".modal");
let currentModal = null;

// Función para ejecutar la acción según el tipo de card
function executeAction(dayElem, dayNumber) {
  const actionType = dayElem.getAttribute("data-action");
  const url = dayElem.getAttribute("data-url");

  if (!actionType || actionType === "modal") {
    // Abrir modal
    openModal(dayNumber);
  } else if (actionType === "link") {
    // Abrir link en la misma pestaña
    if (url) {
      window.location.href = url;
    }
  } else if (actionType === "newpage") {
    // Abrir link en nueva pestaña
    if (url) {
      window.open(url, "_blank");
    }
  }
}

// Configurar qué días están disponibles
days.forEach((day) => {
  const dayNumber = parseInt(day.dataset.day, 10);
  if (dayNumber > currentRealDay) {
    // Día futuro: deshabilitado
    day.classList.add("disabled");
  } else {
    // Día actual o pasado: habilitado
    day.addEventListener("click", () => {
      if (!day.hasAttribute("data-clicked")) {
        // Primera vez que se clica este día
        day.setAttribute("data-clicked", "true");
        day.classList.add("shake");
        // Esperamos 2.5s antes de ejecutar la acción
        setTimeout(() => {
          day.classList.remove("shake");
          executeAction(day, dayNumber);
        }, 2500);
      } else {
        // Subsecuentes clics: ejecutar acción directamente
        executeAction(day, dayNumber);
      }
    });
  }
});

function openModal(dayNumber) {
  const modal = document.getElementById(`modal-day-${dayNumber}`);
  if (modal) {
    modal.classList.add("show");
    currentModal = modal;
  }
}

// Cerrar modales al clickear la X
modals.forEach((modal) => {
  const closeBtn = modal.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("show");
    currentModal = null;
  });
});

// Cerrar modal al hacer click fuera del contenido
window.addEventListener("click", (e) => {
  if (currentModal && e.target === currentModal) {
    currentModal.classList.remove("show");
    currentModal = null;
  }
});

// Philippa
// Mensajes aleatorios
const messages = [
  "Miau miau",
  "Quiero churu",
  "Hola mamá",
  "Te amo",
  "Dame comida",
  "Soy una reina",
  "¿Qué miras?",
  "Más cariños",
];

// Elementos de Philippa
const philippaImage = document.getElementById("philippa-image");
const messageBubble = document.querySelector(".philippa__message");

// Función para mostrar un mensaje aleatorio
function showRandomMessage() {
  // Seleccionar mensaje aleatorio
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // Configurar mensaje en el globo
  messageBubble.textContent = randomMessage;

  // Mostrar el globo
  messageBubble.style.display = "block";

  // Ocultar el globo después de 3 segundos
  setTimeout(() => {
    messageBubble.style.display = "none";
  }, 4000);
}

// Función para reproducir GIF en mobile
function playGif() {
  const originalSrc = "./assets/img/Phili.png";
  const gifSrc = "./assets/img/Phili.gif";

  // Cambiar a gif
  philippaImage.src = gifSrc;

  // Volver a la imagen original después de 2.5 segundos
  setTimeout(() => {
    philippaImage.src = originalSrc;
  }, 2500); // Duración del gif en ms
}

// Event listener para clic en la imagen
philippaImage.addEventListener("click", () => {
  // Mostrar mensaje
  showRandomMessage();

  // Reproducir GIF en mobile o desktop
  playGif();
});
