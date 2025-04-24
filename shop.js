const shop = document.getElementById('shop');
const cartDiv = document.getElementById('cart');
const checkoutForm = document.getElementById('checkout-form');

let cart = {};

function renderShop() {
  const products = getProducts();
  shop.innerHTML = '';
  products.forEach((p) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <h3>${p.name}</h3>
      <img src="${p.image}" />
      <p>€${p.price.toFixed(2)}</p>
      <input type="number" min="1" value="1" id="qty-${p.id}" />
      <button onclick="addToCart(${p.id})">Aggiungi al carrello</button>
    `;
    shop.appendChild(div);
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

renderShop();
