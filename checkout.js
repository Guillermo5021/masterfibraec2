// checkout.js
import { db } from "./firebase-config.js";
import {
  collection, addDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * Utilidades del carrito
 * - Se asume que guardas el carrito en localStorage bajo la clave "cart"
 *   con items: [{id, nombre, precio, cantidad, imagen}]
 */
function readCart() {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}
function cartTotal(items) {
  return items.reduce((acc, it) => acc + (Number(it.precio) * Number(it.cantidad)), 0);
}
function renderSummary(items) {
  const cont = document.getElementById("cart-summary");
  const total = document.getElementById("cart-total");
  if (!cont) return;
  cont.innerHTML = items.length
    ? items.map(it => `
      <div class="row mt-sm">
        <div class="col">${it.nombre} x ${it.cantidad}</div>
        <div class="col text-right">$${(Number(it.precio)*Number(it.cantidad)).toFixed(2)}</div>
      </div>`).join("")
    : `<p>No tienes productos en el carrito.</p>`;
  total.textContent = cartTotal(items).toFixed(2);
}

async function sendEmail(order, ownerEmail) {
  // Datos del template de EmailJS
  const payload = {
    // destinatario (tu correo)
    to_email: ownerEmail,
    // datos visibles en el correo
    cliente_nombre: order.cliente.nombre,
    cliente_correo: order.cliente.correo,
    cliente_telefono: order.cliente.telefono,
    cliente_ciudad: order.cliente.ciudad,
    cliente_direccion: order.cliente.direccion,
    cliente_notas: order.cliente.notas || "-",
    total: `$${order.total.toFixed(2)}`,
    // detalle como texto
    detalle: order.items.map(i => `${i.nombre} x ${i.cantidad} = $${(i.precio*i.cantidad).toFixed(2)}`).join("\n"),
    pedido_id: order._id || "(pendiente)"
  };
  // Usa constantes definidas en checkout.html
  return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, payload);
}

async function saveOrder(order) {
  const ref = await addDoc(collection(db, "orders"), {
    ...order,
    createdAt: serverTimestamp(),
    status: "nuevo"
  });
  return ref.id;
}

function clearCart() { localStorage.removeItem("cart"); }

function bindForm() {
  const items = readCart();
  renderSummary(items);

  const form = document.getElementById("checkout-form");
  const msg = document.getElementById("checkout-msg");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "Procesando pedido...";
    const fd = new FormData(form);
    const cliente = {
      nombre:   fd.get("nombre")?.trim(),
      correo:   fd.get("correo")?.trim(),
      telefono: fd.get("telefono")?.trim(),
      ciudad:   fd.get("ciudad")?.trim(),
      direccion:fd.get("direccion")?.trim(),
      notas:    fd.get("notas")?.trim()
    };

    if (!items.length) {
      msg.textContent = "Tu carrito está vacío.";
      return;
    }

    const order = {
      items,
      total: cartTotal(items),
      cliente,
      destinoNotificacion: "guillermosimancas95@gmail.com"
    };

    try {
      // 1) Guardar en Firestore
      const newId = await saveOrder(order);
      order._id = newId;

      // 2) Enviar correo al dueño
      await sendEmail(order, order.destinoNotificacion);

      // 3) Limpiar y confirmar
      clearCart();
      msg.textContent = "¡Pedido recibido! Te contactaremos por WhatsApp o correo.";
      setTimeout(() => window.location.href = "index.html", 1800);
    } catch (err) {
      console.error(err);
      msg.textContent = "Hubo un problema al registrar tu pedido. Intenta nuevamente.";
    }
  });
}

document.addEventListener("DOMContentLoaded", bindForm);
