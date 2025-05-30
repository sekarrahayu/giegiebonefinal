const cartItemsElement = document.getElementById('cart-items');
  const orderButton = document.querySelector('.modal-footer .btn-primary');
  let cart = [];

  // Setup p<i class="bi bi-telephone-fill"></i>lus/minus buttons
  document.querySelectorAll('.card-body').forEach(card => {
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    const qtySpan = card.querySelector('.quantity');

    let qty = 1;

    plusBtn.addEventListener('click', () => {
      qty++;
      qtySpan.innerText = qty;
    });

    minusBtn.addEventListener('click', () => {
      if (qty > 1) {
        qty--;
        qtySpan.innerText = qty;
      }
    });

    // Add to cart
    const addToCartBtn = card.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function () {
      const title = this.getAttribute('data-name');
      const price = parseInt(this.getAttribute('data-price'));
      const quantity = parseInt(qtySpan.innerText);

      const existingItem = cart.find(item => item.title === title);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({ title, price, quantity });
      }

      updateCartModal();
      qty = 1;
      qtySpan.innerText = qty;
    });
  });

  function updateCartModal() {
    if (cart.length === 0) {
      cartItemsElement.innerHTML = 'Keranjang Kosong';
      return;
    }

    let total = 0;
    let itemsHTML = cart.map((item, index) => {
      const itemTotal = item.price * item.quantity;
      total += itemTotal;
      return `
        <div class="cart-item d-flex justify-content-between align-items-center">
          <div>
            <strong>${item.title}</strong><br>
            Jumlah: ${item.quantity}<br>
            Harga: Rp. ${itemTotal.toLocaleString('id-ID')}
          </div>
          <button class="btn btn-sm btn-danger remove-item" data-index="${index}">Hapus</button>
        </div>
        <hr>
      `;
    }).join('');

    itemsHTML += `<div><strong>Total: Rp. ${total.toLocaleString('id-ID')}</strong></div>`;
    cartItemsElement.innerHTML = itemsHTML;

    document.querySelectorAll('.remove-item').forEach(button => {
      button.addEventListener('click', function () {
        const index = parseInt(this.getAttribute('data-index'));
        cart.splice(index, 1);
        updateCartModal();
      });
    });
  }

  function openCartModal() {
  const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
  modal.show();
}


  orderButton.addEventListener('click', () => {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  let message = "Hallo! Saya ingin memesan produk berikut:%0A";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    message += `- ${item.title} x${item.quantity} = Rp. ${subtotal.toLocaleString('id-ID')}%0A`;
  });

  message += `%0ATotal: Rp. ${total.toLocaleString('id-ID')}`;

  const phoneNumber = "6285892271272"; // Ganti dengan nomor WA kamu
  const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  // Reset keranjang
  cart = [];
  updateCartModal();

  // Tutup modal
  const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
  modal.hide();

  // Redirect ke WhatsApp
  window.open(waUrl, '_blank');
});
