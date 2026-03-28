function searchProducts(event) {
  event.preventDefault();
  const search = document.getElementById("search").value;
  const regexp = new RegExp(RegExp.escape(search), "i");
  const products = window.products.values()
    .filter((product) => regexp.test(product.title))
    .toArray();

  if (search) {
    renderSearching();

    const max = 5;
    const min = 2;
    const timeout = 1000 * (Math.random() * (max - min) + min);
    setTimeout(() => renderProducts(products, true), timeout);
  } else {
    renderProducts(products, false);
  }
}

function renderSearching() {
  const title = document.getElementById("products-title");
  title.textContent = "Results";

  const productsContainer = document.getElementById("products");
  productsContainer.innerHTML = '<div class="spinner mx-auto"></div>';
}

function toggleShoppingCart() {
  const cart = document.getElementById("shopping-cart-details");
  cart.style.display = cart.style.display === "none" ? "flex" : "none";
}

function renderProducts(products, filtered) {
  const title = document.getElementById("products-title");
  title.textContent = filtered ? "Results" : "New Products";

  const container = document.getElementById("products");
  container.innerHTML =
    products.reduce((acc, product) => acc + renderProduct(product), "") ||
    '<div class="mx-auto">No products found</div>';
}

function renderProduct(product) {
  const titleId = Math.random();
  const cartId = Math.random();
  return `<div class="grid g1 pt2 border-top border-fuchsia" style="grid-template-rows: repeat(2, 1fr); grid-template-columns: min-content auto;" >
            <img alt="Product picture of ${product.title}" src="./products/${product.id}.avif" style="width: 100px; grid-row: 1 / -1; grid-column: 1 / 2;" />
            <div class="flex justify-between">
                <span id="${titleId}">${product.title}</span>
                <span>${priceFormatter.format(product.price)}</span>
            </div>
            <img id="${cartId}" aria-label="Add to cart" aria-labelledby="${cartId} ${titleId}" src="./icons/add-to-cart.svg" class="border-none ml-auto cursor-pointer" onclick="updateCart('${product.id}', 1)" />
        </div>`;
}

function updateCart(productId, difference) {
  window.cart.set(
    productId,
    window.cart.getOrInsert(productId, 0) + difference,
  );

  window.cart.entries().forEach(([key, count]) => {
    if (count === 0) window.cart.delete(key);
  });

  const products = window.cart.values().reduce((acc, v) => acc + v, 0) || "";
  const cartCount = document.getElementById("cart-count");
  cartCount.textContent = products;
  cartCount.ariaLabel = products
    ? `contains ${products} item${products === 1 ? "" : "s"}`
    : "is empty";

  renderCartContent();

  const total = window.cart.entries()
    .reduce(
      (acc, [key, count]) => acc + window.products.get(key).price * count,
      0,
    );
  document.getElementById("cart-total").innerHTML = total
    ? `Total: <b>${priceFormatter.format(total)}</b>`
    : "";
  document.getElementById("cart-checkout").disabled = window.cart.size === 0;
}

function renderCartContent() {
  const container = document.getElementById("cart-content");

  if (window.cart.size > 0) {
    container.innerHTML = window.cart.entries()
      .reduce(
        (acc, [productId, count]) =>
          acc + renderCartProduct(window.products.get(productId), count),
        "",
      );
  } else {
    container.innerHTML = `Your cart is empty`;
  }
}

function renderCartProduct(product, count) {
  const titleId = Math.random();
  const removeId = Math.random();
  return `
    <div class="grid g1 py1" style="grid-template-rows: auto auto; grid-template-columns: auto max-content;">
        <div id="${titleId}" style="grid-column: 1; grid-row: 1 / -1">${product.title}</div>
        <span class="right-align" style="grid-column: 2; grid-row: 1">${count} × ${
    priceFormatter.format(product.price)
  }</span>
        <a id="${removeId}" aria-labelledby="${removeId} ${titleId}" aria-label="Remove" class="font-small right-align" style="grid-column: 2; grid-row: 2" onclick="updateCart('${product.id}', ${-count})">Remove</a>
    </div>
    `;
}

function toggleSidebarMenu(event) {
  event.stopPropagation();

  if (event.target !== event.currentTarget) return;

  const el = event.target;
  const list = el.nextElementSibling;
  list.classList.toggle("hide");
  const isOpen = list.classList.contains("hide");
  el.firstChild.replaceData(0, 1, isOpen ? "+" : "–");
}

// init
const priceFormatter = new Intl.NumberFormat("de-CH", {
  style: "currency",
  currency: "CHF",
});
window.cart = new Map();
window.products = new Map([
  {
    "id": "toucan",
    "title": "Toucan Wireless Split Keyboard with Touchpad",
    "price": 125,
    "category": "Keyboard",
  },
  {
    "id": "hsh46",
    "title": "Wireless HSHS46 (Hotswappable Hillside46) Split Keyboard",
    "price": 90,
    "category": "Keyboard",
  },
  {
    "id": "aluminum-corne",
    "title": "Corne v4 Choc v1 with Aluminum 2-way Case Wired Split Keyboard",
    "price": 88,
    "category": "Keyboard",
  },
  {
    "id": "felix-choc",
    "title": "Wireless FelixKeeb Choc Ortholinear Split Keyboard",
    "price": 180,
    "category": "Keyboard",
  },
  {
    "id": "swoop",
    "title": "Swoop Wired Split Keyboard",
    "price": 80,
    "category": "Keyboard",
  },

  {
    "id": "choc-jade",
    "title": "Silent Choc v1 - Ambients Twilight ",
    "price": .5,
    "category": "Switch",
  },
  {
    "id": "choc-black",
    "title": "Silent Choc v1 - Ambients Nocturnal ",
    "price": .6,
    "category": "Switch",
  },
  {
    "id": "navy",
    "title": "Choc v1 - Kailh Navy",
    "price": .5,
    "category": "Switch",
  },
  {
    "id": "sunrise",
    "title": "Choc v1 - Kailh Sunset",
    "price": .45,
    "category": "Switch",
  },
  {
    "id": "kailh-deep-sea",
    "title": "Quiet MX – Kailh Deep Sea Islet",
    "price": .35,
    "category": "Switch",
  },
].map((product) => [product.id, product]));

renderCartContent();
