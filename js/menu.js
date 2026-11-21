
/* =========================================
   RICCA PIZZA — CATÁLOGO Y FILTROS
========================================= */

const pizzaTraditional = [
  "Hawaiana",
  "Tres quesos",
  "Choriqueso",
  "Champiñón",
  "Salchicha de pavo",
  "Mole rojo",
  "Mole verde",
  "Al pastor",
  "Alambre",
  "Pierna B.B.Q.",
  "Atún",
  "Pepperoni",
  "Rajas con elote",
  "Papacarne",
  "Pulpo"
];

const pizzaSweet = [
  "Chocolate con nuez",
  "Zarzamora con queso Philadelphia",
  "Arroz con leche"
];

const products = [];

function addPizzaProducts(names, category) {
  names.forEach((name) => {
    const weekendOnly = name === "Pulpo";

    products.push({
      id: `${category}-${name}-complete`,
      name,
      category,
      presentation: "complete",
      presentationName: "Pizza completa",
      price: 192,
      emoji: "🍕",
      visual: "whole-pizza",
      description: weekendOnly
        ? "Pizza completa. Disponible únicamente los fines de semana."
        : "Pizza completa para disfrutar y compartir.",
      badge: weekendOnly ? "Solo fines de semana" : ""
    });

    products.push({
      id: `${category}-${name}-slice`,
      name,
      category,
      presentation: "slice",
      presentationName: "Rebanada",
      price: 24,
      emoji: "🍕",
      visual: "slice-pizza",
      description: weekendOnly
        ? "Rebanada de pizza. Disponible únicamente los fines de semana."
        : "Una rebanada para disfrutar tu sabor favorito.",
      badge: weekendOnly ? "Solo fines de semana" : ""
    });
  });
}

addPizzaProducts(pizzaTraditional, "traditional");
addPizzaProducts(pizzaSweet, "sweet");

products.push({
  id: "drinks",
  name: "Bebidas",
  category: "drinks",
  presentation: "single",
  presentationName: "Bebida",
  price: 22,
  emoji: "🥤",
  visual: "drink",
  description: "Acompaña tu pizza con una bebida.",
  badge: ""
});

products.push(
  {
    id: "gelatinas",
    name: "Gelatinas",
    category: "desserts",
    presentation: "single",
    presentationName: "Postre",
    price: 25,
    emoji: "🍮",
    visual: "dessert",
    description: "Un postre para darle un toque dulce a tu momento.",
    badge: ""
  },
  {
    id: "flanes",
    name: "Flanes",
    category: "desserts",
    presentation: "single",
    presentationName: "Postre",
    price: 40,
    emoji: "🍮",
    visual: "dessert",
    description: "Disfruta un delicioso flan.",
    badge: ""
  },
  {
    id: "tartas",
    name: "Tartas",
    category: "desserts",
    presentation: "single",
    presentationName: "Postre",
    price: 40,
    emoji: "🥧",
    visual: "dessert",
    description: "Una opción dulce para acompañar tu visita.",
    badge: ""
  },
  {
    id: "pasteles",
    name: "Pasteles",
    category: "desserts",
    presentation: "single",
    presentationName: "Postre",
    price: 60,
    emoji: "🎂",
    visual: "dessert",
    description: "Un toque especial para cerrar con algo dulce.",
    badge: ""
  }
);

/* =========================================
   ELEMENTOS DEL DOM
========================================= */

const menuGrid = document.getElementById("menuGrid");
const menuFilters = document.getElementById("menuFilters");
const menuCount = document.getElementById("menuCount");
const presentationFilters = document.getElementById("presentationFilters");

const productModal = document.getElementById("productModal");
const modalClose = document.getElementById("modalClose");
const modalVisual = document.getElementById("modalVisual");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");
const modalPrice = document.getElementById("modalPrice");
const modalConfirm = document.getElementById("modalConfirm");

let activeCategory = "all";
let activePresentation = "all";
let lastFocusedElement = null;

const categories = [
  { id: "all", label: "Todo el menú" },
  { id: "traditional", label: "Pizzas tradicionales" },
  { id: "sweet", label: "Pizzas dulces" },
  { id: "drinks", label: "Bebidas" },
  { id: "desserts", label: "Postres" }
];

const formatPrice = (price) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0
  }).format(price);
};

/* =========================================
   FILTROS DE CATEGORÍAS
========================================= */

function renderCategoryFilters() {
  menuFilters.innerHTML = categories.map((category) => `
    <button
      class="category-button ${activeCategory === category.id ? "active" : ""}"
      type="button"
      data-category="${category.id}"
      aria-pressed="${activeCategory === category.id}"
    >
      ${category.label}
    </button>
  `).join("");

  menuFilters.querySelectorAll("[data-category]").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      activePresentation = "all";
      renderMenu();
    });
  });
}

/* =========================================
   FILTRO DE PRESENTACIONES
========================================= */

function updatePresentationFilters() {
  const showPresentationFilters =
    activeCategory === "traditional" ||
    activeCategory === "sweet";

  // Ocultar completamente los filtros cuando no sean pizzas.
  presentationFilters.hidden = !showPresentationFilters;

  // Evita que el CSS de la vista móvil fuerce su visualización.
  presentationFilters.style.display = showPresentationFilters
    ? ""
    : "none";

  if (!showPresentationFilters) {
    activePresentation = "all";
  }

  presentationFilters.querySelectorAll("[data-presentation]").forEach((button) => {
    const isActive = button.dataset.presentation === activePresentation;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function setupPresentationFilters() {
  presentationFilters.querySelectorAll("[data-presentation]").forEach((button) => {
    button.addEventListener("click", () => {
      activePresentation = button.dataset.presentation;
      renderMenu();
    });
  });
}

/* =========================================
   OBTENER PRODUCTOS VISIBLES
========================================= */

function getVisibleProducts() {
  return products.filter((product) => {
    const matchesCategory =
      activeCategory === "all" ||
      product.category === activeCategory;

    const matchesPresentation =
      activePresentation === "all" ||
      product.presentation === activePresentation;

    return matchesCategory && matchesPresentation;
  });
}

/* =========================================
   TARJETAS DE PRODUCTOS
========================================= */

function createProductCard(product) {
  const card = document.createElement("article");
  card.className = "menu-card";

  const visual = document.createElement("div");
  visual.className = `product-visual ${product.presentation === "complete" ? "whole-pizza" : ""}`;

  const emoji = document.createElement("span");
  emoji.className = "product-emoji";
  emoji.textContent =
    product.presentation === "complete" ? "" : product.emoji;

  visual.appendChild(emoji);

  if (product.badge) {
    const badge = document.createElement("span");
    badge.className = "product-badge";
    badge.textContent = product.badge;
    visual.appendChild(badge);
  }

  const content = document.createElement("div");
  content.className = "product-content";

  const type = document.createElement("span");
  type.className = "product-type";
  type.textContent = product.presentationName;

  const title = document.createElement("h3");
  title.textContent = product.name;

  const description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.description;

  const bottom = document.createElement("div");
  bottom.className = "product-bottom";

  const price = document.createElement("span");
  price.className = "product-price";
  price.textContent = formatPrice(product.price);

  const detailButton = document.createElement("button");
  detailButton.className = "product-detail-button";
  detailButton.type = "button";
  detailButton.textContent = "Ver detalles";
  detailButton.addEventListener("click", () => openProductModal(product));

  bottom.append(price, detailButton);
  content.append(type, title, description, bottom);
  card.append(visual, content);

  return card;
}

/* =========================================
   MOSTRAR MENÚ
========================================= */

function renderMenu() {
  renderCategoryFilters();
  updatePresentationFilters();

  const visibleProducts = getVisibleProducts();

  menuGrid.replaceChildren();

  if (visibleProducts.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "menu-empty";
    emptyMessage.textContent = "No hay productos en esta categoría.";
    menuGrid.appendChild(emptyMessage);
  } else {
    const fragment = document.createDocumentFragment();

    visibleProducts.forEach((product) => {
      fragment.appendChild(createProductCard(product));
    });

    menuGrid.appendChild(fragment);
  }

  menuCount.textContent =
    `${visibleProducts.length} opciones en esta selección`;
}

/* =========================================
   MODAL DE PRODUCTO
========================================= */

function openProductModal(product) {
  lastFocusedElement = document.activeElement;

  modalVisual.textContent =
    product.presentation === "complete" ? "🍕" : product.emoji;

  modalTitle.textContent = product.name;

  modalDescription.textContent =
    `${product.description} Presentación: ${product.presentationName.toLowerCase()}.`;

  modalPrice.textContent = formatPrice(product.price);

  productModal.classList.add("is-open");
  productModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  modalClose.focus();
}

function closeProductModal() {
  if (!productModal.classList.contains("is-open")) return;

  productModal.classList.remove("is-open");
  productModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus === "function"
  ) {
    lastFocusedElement.focus();
  }
}

modalClose.addEventListener("click", closeProductModal);
modalConfirm.addEventListener("click", closeProductModal);

productModal.addEventListener("click", (event) => {
  if (event.target === productModal) {
    closeProductModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProductModal();
  }
});

/* =========================================
   INICIALIZACIÓN
========================================= */

setupPresentationFilters();
renderMenu();
