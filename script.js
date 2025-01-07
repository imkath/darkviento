particlesJS.load("snow-container", "particles-snow.json", function () {
  console.log("Particles.js cargado con nieve");
});

// Determinar el día actual y si estamos en diciembre de 2024
const today = new Date();
const currentMonth = today.getMonth(); // 0=Enero, 11=Diciembre
const currentYear = today.getFullYear(); // Año actual

// Verificar si estamos en diciembre de 2024
const isDecember2024 = currentMonth === 11 && currentYear === 2024;

// Configurar el día actual permitido
const currentRealDay = isDecember2024 ? today.getDate() : 24; // En diciembre 2024 sigue restringido, luego desbloquear todos

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
  } else if (actionType === "link" || actionType === "newpage") {
    // Abrir link en nueva pestaña
    if (url) {
      window.open(url, "_blank"); // Siempre abre en una nueva pestaña
    }
  }
}

// Configurar qué días están disponibles
days.forEach((day) => {
  const dayNumber = parseInt(day.dataset.day, 10);

  if (isDecember2024 && dayNumber > currentRealDay) {
    // Solo en diciembre de 2024 deshabilitar días futuros
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
// Mensajes de Philippa
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

// Función para mostrar mensaje aleatorio
function showRandomMessage() {
  // Seleccionar un mensaje aleatorio
  const randomMessage = messages[Math.floor(Math.random() * messages.length)];

  // Configurar el contenido del globo
  messageBubble.textContent = randomMessage;

  // Mostrar el globo
  messageBubble.style.display = "block";

  // Ocultar después de 4 segundos
  setTimeout(() => {
    messageBubble.style.display = "none";
  }, 4000);
}

// Función para reproducir el GIF de Philippa
function playGif() {
  const originalSrc = "./assets/img/Phili.png";
  const gifSrc = "./assets/img/Phili.gif";

  // Cambiar a gif
  philippaImage.src = gifSrc;

  // Volver a la imagen original después de 2.5 segundos
  setTimeout(() => {
    philippaImage.src = originalSrc;
  }, 2500);
}

// Evento de click en Philippa (desktop y mobile)
philippaImage.addEventListener("click", () => {
  showRandomMessage(); // Mostrar mensaje aleatorio
  playGif(); // Reproducir gif
});
