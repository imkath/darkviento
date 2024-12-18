document.addEventListener("DOMContentLoaded", () => {
  const confirmModal = document.getElementById("confirm-modal");
  const confirmText = document.getElementById("confirm-text");
  const confirmYes = document.getElementById("confirm-yes");
  const confirmNo = document.getElementById("confirm-no");
  let currentCouponId = null;

  // Definir la disponibilidad de cada cupón (día del mes a partir del cual está activo)
  const availability = {
    "pie-limon": 1,
    "carinos-ilimitados": 1,
    "comida-favorita": 1,
    "tarde-camilo": 1,
    "masaje-relajante": 1,
    "helado-notco": 1,
    "pelicula-eliges": 1,
    "serie-eliges": 1,
    "dia-10": 1,
    "comida-ubereats": 1,
    "invito-cine": 1,
    "dia-lo-que-quieras": 1,
    "desayuno-cama": 1,
    "dia-descanso": 1,
    "sesion-nanais": 1,
    "ticket-sorpresa": 1,
    "caminata-juntas": 19,
    "noche-pelicula": 20,
    "tarde-sudokus": 21,
    "dibujo-especial": 23,
  };

  // Obtener la fecha actual
  const today = new Date();
  const currentMonth = today.getMonth(); // 0 = Enero, 11 = Diciembre
  // Suponiendo que esto sólo aplica en Diciembre:
  const currentRealDay = currentMonth === 11 ? today.getDate() : 999;
  // Si quieres forzar otra fecha para probar:
  // const currentRealDay = 18;

  // Función para obtener el estado inicial de los cupones desde el HTML
  function getCouponsFromHTML() {
    const couponsData = {};
    const couponEls = document.querySelectorAll(".coupon");
    couponEls.forEach((couponEl) => {
      const btn = couponEl.querySelector(".use-coupon-btn");
      if (!btn) return;

      const couponId = btn.dataset.couponId;
      const usesEl = couponEl.querySelector(".coupon-uses");
      const estadoEl = couponEl.querySelector(".coupon-state");

      // Leer usos desde el texto "Usos: X"
      let uses = 1;
      if (usesEl && usesEl.textContent.includes("Usos:")) {
        const parts = usesEl.textContent.split("Usos:")[1].trim();
        uses = parseInt(parts, 10) || 1;
      }

      // Leer estado desde el texto "Estado: ..."
      let estado = "disponible";
      if (estadoEl && estadoEl.textContent.toLowerCase().includes("agotado")) {
        estado = "agotado";
      }

      couponsData[couponId] = { uses, estado };
    });
    return couponsData;
  }

  // Cargar estado de localStorage o desde el HTML
  let coupons = JSON.parse(localStorage.getItem("couponsState"));
  if (!coupons) {
    coupons = getCouponsFromHTML();
    localStorage.setItem("couponsState", JSON.stringify(coupons));
  }

  // Función para aplicar disponibilidad (deshabilitar cupones futuros)
  function applyAvailability() {
    Object.keys(availability).forEach((couponId) => {
      const requiredDay = availability[couponId];
      const couponEl = document
        .querySelector(`.use-coupon-btn[data-coupon-id="${couponId}"]`)
        ?.closest(".coupon");
      if (couponEl) {
        if (currentRealDay < requiredDay) {
          // Aún no ha llegado el día para este cupón
          couponEl.classList.add("disabled");
        } else {
          couponEl.classList.remove("disabled");
        }
      }
    });
  }

  applyAvailability();

  // Función para actualizar la UI (usos y estado) del cupón
  function updateCouponUI(couponId) {
    const couponData = coupons[couponId];
    const couponEl = document
      .querySelector(`.use-coupon-btn[data-coupon-id="${couponId}"]`)
      ?.closest(".coupon");
    if (!couponEl || !couponData) return;

    const usesEl = couponEl.querySelector(".coupon-uses");
    if (usesEl) {
      usesEl.textContent = `Usos: ${couponData.uses}`;
    }

    const estadoEl = couponEl.querySelector(".coupon-state");
    if (couponData.estado === "agotado") {
      couponEl.classList.add("used");
      if (estadoEl) {
        estadoEl.textContent = "Estado: Agotado";
      }
    } else {
      couponEl.classList.remove("used");
      if (estadoEl) {
        estadoEl.textContent = "Estado: Disponible";
      }
    }
  }

  // Inicializar la UI según el estado guardado
  Object.keys(coupons).forEach((cid) => {
    updateCouponUI(cid);
  });

  // Abrir modal al querer usar cupón (sólo si no está disabled)
  document.querySelectorAll(".use-coupon-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const couponEl = e.target.closest(".coupon");
      if (couponEl && couponEl.classList.contains("disabled")) {
        // Si está deshabilitado, no hacer nada
        return;
      }

      currentCouponId = e.target.dataset.couponId;
      const couponData = coupons[currentCouponId];

      if (couponData && couponData.estado === "disponible") {
        const couponTitleEl = couponEl.querySelector(".title");
        if (couponTitleEl) {
          confirmText.textContent = `¿Deseas usar "${couponTitleEl.textContent}"?`;
        } else {
          confirmText.textContent = "¿Deseas usar este cupón?";
        }

        confirmModal.classList.add("show");
      }
    });
  });

  // Confirmar uso del cupón
  confirmYes.addEventListener("click", () => {
    if (currentCouponId && coupons[currentCouponId]) {
      const couponData = coupons[currentCouponId];
      couponData.uses -= 1;
      if (couponData.uses <= 0) {
        couponData.uses = 0;
        couponData.estado = "agotado";
      }
      localStorage.setItem("couponsState", JSON.stringify(coupons));
      updateCouponUI(currentCouponId);
    }
    confirmModal.classList.remove("show");
    currentCouponId = null;
  });

  // Cancelar uso del cupón
  confirmNo.addEventListener("click", () => {
    confirmModal.classList.remove("show");
    currentCouponId = null;
  });
});
