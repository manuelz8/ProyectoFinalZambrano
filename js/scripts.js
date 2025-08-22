// POPUP
// Mostrar popup a los 3 segundos

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const clienteGuardado = localStorage.getItem("cliente");
    if (!clienteGuardado) {
      const userModal = document.getElementById("userModal");
      userModal.classList.add("show");
      userModal.style.display = "block";
    }
  }, 3000);

  const userForm = document.getElementById("userForm");
  userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value;
    const email = document.getElementById("emailUsuario").value;

    localStorage.setItem("cliente", JSON.stringify({ nombre, email }));

    const userModal = document.getElementById("userModal");
    userModal.classList.remove("show");
    userModal.style.display = "none";
  });
});

// PRODUCTOS

// Traer los productos desde la API

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    const grid = document.querySelector(".products-container .row");

    const productosPrincipales = data.slice(0, 12);

    productosPrincipales.forEach((producto) => {
      const card = document.createElement("div");
      card.classList.add("producto", "col");
      card.innerHTML = `
            <div class="producto-img-container">
              <img src="${producto.image}" class="card-img-top" alt="..." />
            </div>
            <div class="card-body">
                <h3 class="card-title">${producto.title}</h3>
                <h4 class="product-price">$ ${producto.price}</h4>
            </div>
            <button class="add-to-cart">Añadir al carrito</button>
            `;
      const addToCartBtn = card.querySelector(".add-to-cart");
      addToCartBtn.addEventListener("click", () => {
        addToCart({
          id: producto.id,
          nombre: producto.title,
          imagen: producto.image,
          precio: producto.price,
        });
      });
      grid.appendChild(card);
    });
  })
  .catch((error) => console.log("Ocurrio un error", error));

// CARRITO

// Funcion para abrir y cerrar el carrito
const cart = document.querySelector("#cart-drawer");
const toggleCart = document.querySelectorAll(".toggle-cart");

toggleCart.forEach((btn) => {
  btn.addEventListener("click", () => {
    cart.classList.toggle("show");
  });
});

// Array que almacena los productos del carrito

let productosCarrito = [];

// Funcion para guardar el carrito en localStorage

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(productosCarrito));
}

// Funcion para cargar el carrito desde localStorage

document.addEventListener("DOMContentLoaded", () => {
  const carritoGuardado = localStorage.getItem("carrito");
  if (carritoGuardado) {
    productosCarrito = JSON.parse(carritoGuardado);
    renderCarrito();
  } else {
    renderCarrito();
  }
});

// Funcion para agregar al carrito

function addToCart(producto) {
  const item = productosCarrito.find(
    (elemento) => elemento.id === Number(producto.id)
  );

  if (item) {
    item.cantidad++;
  } else {
    productosCarrito.push({
      id: Number(producto.id),
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: producto.precio,
      cantidad: 1,
    });
  }

  renderCarrito();
  guardarCarrito();
  cart.classList.add("show");
}

// Funcion para renderizar el carrito

const cartBody = document.querySelector(".offcanvas-body");
const checkoutBtn = document.querySelector("#goToCheckout");

function renderCarrito() {
  let totalCarrito = 0;
  cartBody.innerHTML = "";

  if (productosCarrito.length == 0) {
    cartBody.innerHTML = `<h3 class="empty-state">No hay articulos en el carrito</h3>`;
    checkoutBtn.setAttribute("disabled", "true");
  } else {
    checkoutBtn.removeAttribute("disabled");
  }

  productosCarrito.forEach((item) => {
    const itemDiv = document.createElement("div");
    let totalItem = Number(item.precio * item.cantidad);
    itemDiv.classList.add("cart-item");
    itemDiv.innerHTML = `
    <div class="cart-item-img">
        <img src="${item.imagen}">
    </div>
    <div class="cart-item-info">
        <h3>${item.nombre}</h3>
        <p class="cart-item-price">$${item.precio}</p>
        <div class="cart-item-qty-wrapper">
            <div class="selector">
                <span class="cantidad-menos">-</span>
                <span class="cart-item-qty">${item.cantidad}</span>
                <span class="cantidad-mas">+</span>
            </div>
            <span class="item-total-price">$${totalItem}</span>
        </div>
    </div>
    `;

    cartBody.appendChild(itemDiv);

    const menosCantidadBtn = itemDiv.querySelector(".cantidad-menos");
    const masCantidadBtn = itemDiv.querySelector(".cantidad-mas");
    const contadorCantidad = itemDiv.querySelector(".cart-item-qty");

    menosCantidadBtn.addEventListener("click", () => {
      disminuirCantidad(item.id);
    });

    masCantidadBtn.addEventListener("click", () => {
      aumentarCantidad(item.id);
    });

    totalCarrito += totalItem;
  });

  const totalCompra = document.querySelector(".cart-total");
  totalCompra.innerHTML = `$${totalCarrito}`;
}

// Funcion para eliminar un item del carrito. Basicamente se crea un nuevo array

function removeItem(id) {
  productosCarrito = productosCarrito.filter((item) => item.id !== id);
  renderCarrito();
  guardarCarrito();
}

// Funcion para actualizar cantidades del carrito y eliminar el item del carrito

function disminuirCantidad(id) {
  const item = productosCarrito.find((elemento) => elemento.id === id);
  if (!item) {
    return;
  } else {
    item.cantidad--;
  }

  if (item.cantidad <= 0) {
    removeItem(id);
  } else {
    renderCarrito();
    guardarCarrito();
  }
}

function aumentarCantidad(id) {
  const item = productosCarrito.find((elemento) => elemento.id === id);
  if (!item) {
    return;
  } else {
    item.cantidad++;
    renderCarrito();
    guardarCarrito();
  }
}

// Ir al checkout

const finishBtn = document.querySelector("#finishPurchase");

checkoutBtn.addEventListener("click", () => {
  cartBody.innerHTML = `
    <form id="checkoutForm">
        <div class="mb-3">
            <label for="nombre" class="form-label">Nombre y apellido</label>
            <input type="text" class="form-control" id="nombre" required>
        </div>
        <div class="mb-3">
            <label for="email" class="form-label">Correo Electronico</label>
            <input type="email" class="form-control" id="email" required>
        </div>
        <div class="mb-3">
            <label for="direccion" class="form-label">Direccion</label>
            <input type="text" class="form-control" id="direccion" required>
        </div>
    </form>
  `;
  checkoutBtn.style.display = "none";
  finishBtn.style.display = "block";

  const cliente = JSON.parse(localStorage.getItem("cliente") || "null");
  if (cliente) {
    document.getElementById("nombre").value = cliente.nombre || "";
    document.getElementById("email").value = cliente.email || "";
  }

  // Finalizar compra
  checkoutForm = document.querySelector("#checkoutForm");
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();
    Swal.fire({
      title: "Orden confirmada!",
      text: "Te estaremos contactando en breve",
      icon: "success",
    });

    productosCarrito = [];
    localStorage.clear();
    renderCarrito();

    checkoutBtn.style.display = "block";
    finishBtn.style.display = "none";
  });
});
