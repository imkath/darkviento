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
