const shop = document.getElementById('shop');
const cartDiv = document.getElementById('cart');
const checkoutForm = document.getElementById('checkout-form');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const filterSelect = document.getElementById('filter');
const loadMoreBtn = document.getElementById('load-more');

let cart = {};
let productsToShow = 6;
let currentIndex = 0;

function zoomImage(src) {
  window.open(src, "_blank");
}

function renderShop() {
  let products = getProducts();

  const searchTerm = searchInput.value.toLowerCase();
  const categoryFilter = filterSelect.value;
  const sortBy = sortSelect.value;

  if (searchTerm) {
    products = products.filter(p => p.name.toLowerCase().includes(searchTerm));
  }

  if (categoryFilter) {
    products = products.filter(p => p.category === categoryFilter);
  }

  if (sortBy === 'name') {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'price') {
    products.sort((a, b) => a.price - b.price);
  }

  const visible = products.slice(0, currentIndex + productsToShow);
  shop.innerHTML = '';
  visible.forEach((p) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${p.name}</h3>
      <img src="${p.image}" onclick="zoomImage('${p.image}')" style="cursor:pointer;" />
      <p><strong>Categoria:</strong> ${p.category}</p>
      <p>${p.description}</p>
      <p><strong>Disponibilità:</strong> ${p.stock}</p>
      <p>€${p.price.toFixed(2)}</p>
      <input type="number" min="1" value="1" id="qty-${p.id}" />
      <button onclick="addToCart(${p.id})">Aggiungi al carrello</button>
    `;
    shop.appendChild(div);
  });

  loadMoreBtn.style.display = (products.length > visible.length) ? 'block' : 'none';

  updateCategoryFilterOptions(products);
}

function updateCategoryFilterOptions(products) {
  const categories = Array.from(new Set(getProducts().map(p => p.category)));
  filterSelect.innerHTML = '<option value="">Tutte le categorie</option>';
  categories.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    filterSelect.appendChild(opt);
  });
}

function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).value);
  const product = getProducts().find(p => p.id === id);
  if (!product) return;
  if (cart[id]) {
    cart[id].qty += qty;
  } else {
    cart[id] = { ...product, qty };
  }
  renderCart();
}

function renderCart() {
  cartDiv.innerHTML = '';
  let subtotal = 0;
  for (let id in cart) {
    const item = cart[id];
    const total = item.price * item.qty;
    subtotal += total;
    cartDiv.innerHTML += `
      ${item.name} - €${item.price.toFixed(2)} x ${item.qty} = €${total.toFixed(2)}<br/>
    `;
  }

  const shipping = subtotal >= 300 ? 0 : 9;
  const total = subtotal + shipping;

  cartDiv.innerHTML += `<p>Spese di spedizione: €${shipping.toFixed(2)}</p>`;
  cartDiv.innerHTML += `<p><strong>Totale: €${total.toFixed(2)}</strong></p>`;
}

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const company = document.getElementById('company').value;
  const address = document.getElementById('address').value;

  console.log("Ordine da inviare a pagamento:");
  console.log({ cart, email, phone, company, address });

  alert("Simulazione completata: collegare Stripe/PayPal qui.");
});

searchInput.addEventListener('input', renderShop);
sortSelect.addEventListener('change', renderShop);
filterSelect.addEventListener('change', renderShop);
loadMoreBtn.addEventListener('click', () => {
  currentIndex += productsToShow;
  renderShop();
});

renderShop();
