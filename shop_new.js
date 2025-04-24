
const shop = document.getElementById('shop');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');
const filterSelect = document.getElementById('filter');
const loadMoreBtn = document.getElementById('load-more');

const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-img");
const modalClose = document.querySelector(".close");

modalClose.onclick = () => modal.style.display = "none";
window.onclick = function(event) {
  if (event.target == modal) modal.style.display = "none";
};

let cart = JSON.parse(localStorage.getItem('cart') || '{}');
let productsToShow = 6;
let currentIndex = 0;

function zoomImage(src) {
  modal.style.display = "block";
  modalImg.src = src;
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
    div.classList.add('product');
    div.innerHTML = `
      <div class="product-image">
        <img src="${p.image}" onclick="zoomImage('${p.image}', event)" />
      </div>
      <div class="product-details">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p><strong>Categoria:</strong> ${p.category}</p>
        <p><strong>Disponibilità:</strong> ${p.stock}</p>
        <p class="product-price">€${p.price.toFixed(2)}</p>
        <input type="number" min="1" value="1" id="qty-${p.id}" />
        <button onclick="addToCart(${p.id})">Aggiungi al carrello</button>
      </div>
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
  localStorage.setItem('cart', JSON.stringify(cart));
  alert("Prodotto aggiunto al carrello.");
}

searchInput.addEventListener('input', renderShop);
sortSelect.addEventListener('change', renderShop);
filterSelect.addEventListener('change', renderShop);
loadMoreBtn.addEventListener('click', () => {
  currentIndex += productsToShow;
  renderShop();
});

renderShop();
