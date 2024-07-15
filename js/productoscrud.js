document.addEventListener('DOMContentLoaded', () => {
    const menuProducts = document.getElementById('menu-products');
    const productForm = document.getElementById('form-product');
    const productTitulo = document.getElementById('product-titulo');
    const productImagen = document.getElementById('product-imagen');
    const productCategoria = document.getElementById('product-categoria');
    const productPrecio = document.getElementById('product-precio');
    const productId = document.getElementById('product-id');

    let productos = [];

    // Cargar productos desde localStorage o archivo JSON
    function loadProducts() {
        const productosLocalStorage = JSON.parse(localStorage.getItem('productos'));
        if (productosLocalStorage && productosLocalStorage.length > 0) {
            productos = productosLocalStorage;
            renderProducts(); // Renderizar productos después de cargar
        } else {
            // Si no hay datos en localStorage, cargar desde el archivo JSON
            fetch("./../js/productos.json")
                .then(response => response.json())
                .then(data => {
                    productos = data;
                    sincronizarLocalStorage(); // Guardar inicialmente desde el archivo JSON
                    renderProducts(); // Renderizar productos después de cargar
                })
                .catch(error => console.error('Error al cargar los productos:', error));
        }
    }

    loadProducts();

    // Función para renderizar productos en el menú
    function renderProducts() {
        menuProducts.innerHTML = '';
        productos.forEach(producto => {
            const productDiv = document.createElement('div');
            productDiv.className = 'producto';
            productDiv.innerHTML = `
                <img src="${producto.imagen}" alt="${producto.titulo}">
                <h3>${producto.titulo}</h3>
                <p>Categoría: ${producto.categoria.nombre}</p>
                <p>Precio: $${producto.precio}</p>
                <button onclick="editProduct('${producto.id}')">Editar</button>
                <button onclick="deleteProduct('${producto.id}')">Eliminar</button>
            `;
            menuProducts.appendChild(productDiv);
        });
    }

    // Función para crear o editar un producto
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = productId.value;
        const titulo = productTitulo.value;
        const imagen = productImagen.value;
        const categoria = productCategoria.value;
        const precio = parseFloat(productPrecio.value);

        if (id) {
            // Editar producto existente
            const index = productos.findIndex(p => p.id === id);
            if (index !== -1) {
                productos[index].titulo = titulo;
                productos[index].imagen = imagen;
                productos[index].categoria.nombre = categoria;
                productos[index].precio = precio;
            }
        } else {
            // Crear nuevo producto
            const newProduct = {
                id: `libro-${productos.length + 1}`,
                titulo,
                imagen,
                categoria: {
                    nombre: categoria,
                    id: categoria.toLowerCase()
                },
                precio: precio
            };
            productos.push(newProduct);
        }

        // Actualizar localStorage y renderizar productos
        sincronizarLocalStorage();
        renderProducts();

        // Limpiar formulario y resetear ID oculto
        productForm.reset();
        productId.value = '';
    });

    // Función para editar un producto
    window.editProduct = function(id) {
        const producto = productos.find(p => p.id === id);
        if (producto) {
            productTitulo.value = producto.titulo;
            productImagen.value = producto.imagen;
            productCategoria.value = producto.categoria.nombre;
            productPrecio.value = producto.precio;
            productId.value = producto.id;
        }
    };

    // Función para eliminar un producto
    window.deleteProduct = function(id) {
        productos = productos.filter(p => p.id !== id);
        sincronizarLocalStorage();
        renderProducts();
    };

    // Función para sincronizar productos con localStorage
    function sincronizarLocalStorage() {
        localStorage.setItem('productos', JSON.stringify(productos));
    }
});
