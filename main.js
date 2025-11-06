// ====== Estado y helpers ======
const CART_KEY = 'mf_cart';
const USER_KEY = 'mf_user';

let CART = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
let USER = JSON.parse(localStorage.getItem(USER_KEY) || 'null');

function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(CART)); updateCartBadge(); }
function saveUser(){ localStorage.setItem(USER_KEY, JSON.stringify(USER)); }
function currency(n){ return '$' + Number(n).toFixed(2); }

function updateCartBadge(){
  const badge = document.getElementById('cart-count');
  if (badge) badge.textContent = CART.reduce((a,i)=>a+i.qty,0) || 0;
}
updateCartBadge();

// ====== Acciones de carrito ======
function addToCart(productId, goCart=false){
  const p = (typeof PRODUCTS!=='undefined') ? PRODUCTS.find(x=>x.id===productId) : null;
  if(!p) return alert('Producto no encontrado');
  const idx = CART.findIndex(x=>x.id===p.id);
  if (idx>=0) CART[idx].qty += 1;
  else CART.push({ id:p.id, name:p.name, price:p.price, qty:1 });
  saveCart();
  if (goCart) location.href = 'cart.html';
}

function removeFromCart(productId){
  CART = CART.filter(x=>x.id!==productId);
  saveCart();
  renderCartTable();
}

function changeQty(productId, delta){
  const item = CART.find(x=>x.id===productId);
  if(!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart();
  renderCartTable();
}

function cartTotal(){
  return CART.reduce((sum,i)=>sum + i.price*i.qty, 0);
}

// ====== Render carrito (cart.html) ======
function renderCartTable(){
  const wrap = document.getElementById('cartTable');
  if(!wrap) return;

  if (CART.length===0){
    wrap.innerHTML = '<div class="alert alert-info">Tu carrito está vacío. <a href="shop.html" class="alert-link">Ir a la tienda</a></div>';
    return;
  }

  let rows = CART.map(i => `
    <tr>
      <td>${i.name}</td>
      <td>${currency(i.price)}</td>
      <td class="text-center">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" onclick="changeQty('${i.id}',-1)">−</button>
          <span class="btn btn-light disabled">${i.qty}</span>
          <button class="btn btn-outline-secondary" onclick="changeQty('${i.id}',1)">+</button>
        </div>
      </td>
      <td>${currency(i.price*i.qty)}</td>
      <td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="removeFromCart('${i.id}')">Eliminar</button></td>
    </tr>
  `).join('');

  wrap.innerHTML = `
    <div class="table-responsive">
      <table class="table align-middle">
        <thead><tr><th>Producto</th><th>Precio</th><th class="text-center">Cantidad</th><th>Total</th><th></th></tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr><th colspan="3" class="text-end">Total</th><th>${currency(cartTotal())}</th><th></th></tr></tfoot>
      </table>
    </div>
  `;

  const form = document.getElementById('checkoutForm');
  const btnWA = document.getElementById('btnWA');
  const btnClear = document.getElementById('btnClear');
  if (btnClear) btnClear.onclick = ()=>{ CART=[]; saveCart(); renderCartTable(); };

  if (btnWA){
    btnWA.onclick = ()=>{
      const resumen = CART.map(i=>`• ${i.name} x${i.qty} - ${currency(i.price*i.qty)}`).join('\n')
        + `\n\nTotal: ${currency(cartTotal())}`;
      const url = `https://wa.me/593984413924?text=${encodeURIComponent('Pedido Master Fibra:\n'+resumen)}`;
      window.open(url,'_blank');
    };
  }

  if (form){
    if (USER){
      form.name.value   = USER.name||'';
      form.email.value  = USER.email||'';
      form.idnum.value  = USER.idnum||'';
      form.phone.value  = USER.phone||'';
      form.address.value= USER.address||'';
    }

    form.onsubmit = async (e)=>{
      e.preventDefault();

      USER = {
        name:   form.name.value.trim(),
        email:  form.email.value.trim(),
        idnum:  form.idnum.value.trim(),
        phone:  form.phone.value.trim(),
        address:form.address.value.trim()
      };
      saveUser();

      const total = cartTotal().toFixed(2);
      const pedido = { ...USER, cart: CART, total, fecha: new Date().toISOString() };

      // 🔥 Firebase
      const okFirebase = await (window.saveOrderToFirebase ? saveOrderToFirebase(pedido) : false);

      // ✉️ EmailJS
      const okEmail = await (window.sendEmailNotification ? sendEmailNotification(pedido) : false);

      // ✅ Mostrar modal
      const msgBox = document.getElementById('orderModalMsg');
      if (okFirebase && okEmail){
        msgBox.textContent = `Gracias ${USER.name}, tu pedido fue registrado correctamente. Recibirás una copia en tu correo.`;
      } else if (okFirebase){
        msgBox.textContent = `El pedido se guardó correctamente, pero no se pudo enviar el correo.`;
      } else {
        msgBox.textContent = `Hubo un problema al procesar tu pedido. Verifica tu conexión.`;
      }

      const modal = new bootstrap.Modal(document.getElementById('orderModal'));
      modal.show();

      // 🔗 PayPal
      const paypalLink = `https://paypal.me/ElvisGomez1985/${total}`;
      window.open(paypalLink, '_blank');
    };
  }
}
