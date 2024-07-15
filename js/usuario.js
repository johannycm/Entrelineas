    document.addEventListener("DOMContentLoaded", function() {
    const signInForm = document.querySelector("#signInForm");
    const signUpForm = document.querySelector("#signUpForm");
    const signInMessage = document.querySelector("#signInMessage");
    const signUpMessage = document.querySelector("#signUpMessage");

    // Usuario administrador pre-registrado (simulado)
    const adminUser = {
        id: new Date().getTime(), // Asignar un ID único
        username: "admin",
        password: "admin",
        role: "admin" // Rol de administrador
    };

    // Comprobar si ya hay usuarios registrados en localStorage
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Guardar usuario administrador en localStorage (si no existe)
    if (!usuariosRegistrados.some(user => user.username === adminUser.username)) {
        usuariosRegistrados.push(adminUser);
        localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));
    }

    // Manejar el envío del formulario de inicio de sesión
    signInForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const username = document.querySelector("#signInUsername").value.trim().toLowerCase(); // Normalizar nombre de usuario
        const password = document.querySelector("#signInPassword").value;

        // Buscar usuario en localStorage
        const usuario = usuariosRegistrados.find(user => user.username === username && user.password === password);

        if (usuario) {
            // Guardar el rol del usuario en sessionStorage
            sessionStorage.setItem("role", usuario.role);

            // Redirigir según el rol del usuario
            if (usuario.role === "admin") {
                window.location.href = "./admincrub.html";
            } else {
                window.location.href = "./menu.html";
            }
        } else {
            // Mostrar mensaje de error si las credenciales son incorrectas
            signInMessage.innerHTML = `<div class="error">Usuario o contraseña incorrectos.</div>`;
        }
    });

    // Manejar el envío del formulario de registro
    signUpForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const firstName = document.querySelector("#firstName").value.trim();
        const lastName = document.querySelector("#lastName").value.trim();
        const username = document.querySelector("#username").value.trim().toLowerCase(); // Normalizar nombre de usuario
        const email = document.querySelector("#email").value.trim();
        const password = document.querySelector("#password").value;
        const confirmPassword = document.querySelector("#confirmPassword").value;

        // Validación básica (puedes agregar más validaciones según tus necesidades)
        if (password !== confirmPassword) {
            signUpMessage.innerHTML = `<div class="error">Las contraseñas no coinciden.</div>`;
            return;
        }

        // Verificar si el usuario ya está registrado
        if (usuariosRegistrados.some(user => user.username === username)) {
            signUpMessage.innerHTML = `<div class="error">El usuario ${username} ya está registrado.</div>`;
            return;
        }

        // Crear objeto de usuario con role "user"
        const newUser = {
            id: new Date().getTime(), // Generar un ID único
            firstName,
            lastName,
            username,
            email,
            password,
            role: "user" // Asignar el rol "user"
        };

        // Guardar usuario en localStorage
        usuariosRegistrados.push(newUser);
        localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));

        // Mostrar mensaje de éxito
        signUpMessage.innerHTML = `<div class="success">Registro exitoso.</div>`;
    });

    // Cambiar entre pestañas (tabs)
    const tabLinks = document.querySelectorAll(".tab-link");
    tabLinks.forEach(link => {
        link.addEventListener("click", function() {
            const tabId = this.dataset.tab;
            const tabs = document.querySelectorAll(".tab-content");
            tabs.forEach(tab => {
                if (tab.id === tabId) {
                    tab.classList.add("active");
                } else {
                    tab.classList.remove("active");
                }
            });
            tabLinks.forEach(link => link.classList.remove("active"));
            this.classList.add("active");
        });
    });
    });
