function getProducts() {
  return JSON.parse(localStorage.getItem('products') || '[]');
}

function saveProducts(products) {
  localStorage.setItem('products', JSON.stringify(products));
}
