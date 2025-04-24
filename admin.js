const form = document.getElementById('product-form');
const list = document.getElementById('product-list');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('product-name').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const description = document.getElementById('product-description').value;
  const category = document.getElementById('product-category').value;
  const stock = parseInt(document.getElementById('product-stock').value);
  const file = document.getElementById('product-image').files[0];

  const reader = new FileReader();
  reader.onloadend = () => {
    const image = reader.result;
    const product = { id: Date.now(), name, price, description, category, stock, image };
    const products = getProducts();
    products.push(product);
    saveProducts(products);
    renderProducts();
    form.reset();
  };
  if (file) reader.readAsDataURL(file);
});

function renderProducts() {
  const products = getProducts();
  list.innerHTML = '';
  products.forEach((p) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <strong>${p.name}</strong> - €${p.price.toFixed(2)}<br/>
      Categoria: ${p.category}<br/>
      <img src="${p.image}" alt="${p.name}" />
      <button onclick="editProduct(${p.id})">Modifica</button>
      <button onclick="deleteProduct(${p.id})">Elimina</button>
      <hr/>
    `;
    list.appendChild(div);
  });
}

function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
  renderProducts();
}

function editProduct(id) {
  const products = getProducts();
  const p = products.find(p => p.id === id);
  if (!p) return;
  document.getElementById('product-name').value = p.name;
  document.getElementById('product-price').value = p.price;
  document.getElementById('product-description').value = p.description;
  document.getElementById('product-category').value = p.category;
  document.getElementById('product-stock').value = p.stock;
  deleteProduct(id);
}

renderProducts();
