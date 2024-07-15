let productos = [];
let productosEnCarrito = [];

// Cargar productos desde localStorage o archivo JSON
function cargarProductosIniciales() {
    const productosLocalStorage = JSON.parse(localStorage.getItem('productos'));
    if (productosLocalStorage && productosLocalStorage.length > 0) {
        productos = productosLocalStorage;
        cargarProductos(productos);
    } else {
        fetch("./../js/productos.json")
            .then(response => response.json())
            .then(data => {
                productos = data;
                sincronizarLocalStorage(); // Guardar inicialmente desde el archivo JSON
                cargarProductos(productos);
            })
            .catch(error => console.error('Error al cargar los productos:', error));
    }
}

// Función para cargar productos en el contenedor
function cargarProductos(productosElegidos) {
    const contenedorProductos = document.querySelector("#contenedor-productos");
    const botonesCategorias = document.querySelectorAll(".boton-categoria");
    const tituloPrincipal = document.querySelector("#titulo-principal");
    let botonesAgregar = document.querySelectorAll(".producto-agregar");
    const numerito = document.querySelector("#numerito");

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Agregar</button>
            </div>
        `;
        contenedorProductos.append(div);
    });

    actualizarBotonesAgregar();

    // Función para actualizar los botones de agregar al carrito
    function actualizarBotonesAgregar() {
        botonesAgregar = document.querySelectorAll(".producto-agregar");

        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    }

    // Función para agregar productos al carrito (simulación)
    function agregarAlCarrito(e) {
        Toastify({
            text: "Producto agregado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #2f2d2d, #151414)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            },
            offset: {
                x: '1.5rem',
                y: '1.5rem'
            }
        }).showToast();

        
        const idBoton = e.currentTarget.id;
        const productoAgregado = productos.find(producto => producto.id === idBoton);

        // Agregar producto al carrito
        if (productosEnCarrito.some(producto => producto.id === idBoton)) {
            const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
            productosEnCarrito[index].cantidad++;
        } else {
            productoAgregado.cantidad = 1;
            productosEnCarrito.push(productoAgregado);
        }

        sincronizarCarritoLocalStorage();
        cargarProductosCarrito(); // Actualizar carrito
        actualizarNumeritoCarrito();
    }

// Función para actualizar el numerito del carrito en la interfaz
    function actualizarNumeritoCarrito() {
    const numerito = document.querySelector("#numerito");
    const totalProductos = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = totalProductos.toString();
    console.log("Numerito actualizado:", totalProductos);
}

    // Event listener para botones de categoría
    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonesCategorias.forEach(boton => boton.classList.remove("active"));
            e.currentTarget.classList.add("active");

            if (e.currentTarget.id != "todos") {
                const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
                tituloPrincipal.innerText = productosBoton.length > 0 ? productosBoton[0].categoria.nombre : "";
                cargarProductos(productosBoton);
            } else {
                tituloPrincipal.innerText = "Todos los productos";
                cargarProductos(productos);
            }
        });
    });
}

// Función para sincronizar productos en el carrito con localStorage
function sincronizarCarritoLocalStorage() {
    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

// Función para cargar productos en el carrito desde localStorage
function cargarProductosCarrito() {
    productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
    const contenedorCarritoProductos = document.querySelector("#carrito-productos");
    const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
    const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
    let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
    const contenedorTotal = document.querySelector("#total");
    const botonComprar = document.querySelector("#carrito-acciones-comprar");

    if (productosEnCarrito.length > 0) {
        contenedorCarritoVacio.classList.add("disabled");
        contenedorCarritoProductos.classList.remove("disabled");
        contenedorCarritoAcciones.classList.remove("disabled");
        contenedorCarritoComprado.classList.add("disabled");

        contenedorCarritoProductos.innerHTML = "";

        productosEnCarrito.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
                <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="carrito-producto-titulo">
                    <small>Título</small>
                    <h3>${producto.titulo}</h3>
                </div>
                <div class="carrito-producto-cantidad">
                    <small>Cantidad</small>
                    <p>${producto.cantidad}</p>
                </div>
                <div class="carrito-producto-precio">
                    <small>Precio</small>
                    <p>$${producto.precio}</p>
                </div>
                <div class="carrito-producto-subtotal">
                    <small>Subtotal</small>
                    <p>$${producto.precio * producto.cantidad}</p>
                </div>
                <button class="carrito-producto-eliminar" id="${producto.id}"><i class="bi bi-trash-fill"></i></button>
            `;
            contenedorCarritoProductos.append(div);
        });

        actualizarBotonesEliminar();
        actualizarTotal();

    } else {
        contenedorCarritoVacio.classList.remove("disabled");
        contenedorCarritoProductos.classList.add("disabled");
        contenedorCarritoAcciones.classList.add("disabled");
        contenedorCarritoComprado.classList.add("disabled");
    }
}

// Función para actualizar los botones de eliminar producto del carrito
function actualizarBotonesEliminar() {
    botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

// Función para eliminar un producto del carrito
function eliminarDelCarrito(e) {
    Toastify({
        text: "Producto eliminado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #2f2d2d, #151414)",
            borderRadius: "2rem",
            textTransform: "uppercase",
            fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem',
            y: '1.5rem'
        }
    }).showToast();

    const idBoton = e.currentTarget.id;
    productosEnCarrito = productosEnCarrito.filter(producto => producto.id !== idBoton);
    sincronizarCarritoLocalStorage();
    cargarProductosCarrito();
}

// Función para vaciar el carrito
function vaciarCarrito() {
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'question',
        html: `Se van a borrar ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            productosEnCarrito = [];
            sincronizarCarritoLocalStorage();
            cargarProductosCarrito();
        }
    });
}

// Función para actualizar el total del carrito
function actualizarTotal() {
    const contenedorTotal = document.querySelector("#total");
    const totalCalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);
    contenedorTotal.innerText = `$${totalCalculado}`;
}

// Función para comprar el carrito
function comprarCarrito() {
    Swal.fire({
        title: '¡Compra realizada!',
        icon: 'success',
        text: 'Gracias por tu compra.',
        confirmButtonText: 'Aceptar'
    }).then(() => {
        productosEnCarrito = [];
        sincronizarCarritoLocalStorage();
        cargarProductosCarrito();
    });
}

// Inicialización al cargar la página
cargarProductosIniciales();
cargarProductosCarrito();
