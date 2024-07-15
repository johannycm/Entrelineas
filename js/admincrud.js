// Obtener usuarios registrados de localStorage o inicializar si está vacío
let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];

// Función para guardar usuarios registrados en localStorage
function guardarUsuariosRegistrados() {
    localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));
}

// Función para inicializar la lista de usuarios desde localStorage
function initUserList() {
    const userList = document.getElementById("userList");
    userList.innerHTML = "";
    usuariosRegistrados.forEach(user => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div>
                <strong>${user.username}</strong> - ${user.email} (${user.role})
            </div>
            <div class="actions">
                <button class="btn-edit" data-id="${user.id}">Editar</button>
                <button class="btn-delete" data-id="${user.id}">Eliminar</button>
            </div>
        `;
        userList.appendChild(li);
    });
}

// Función para limpiar el formulario de usuario
function clearUserForm() {
    const userForm = document.getElementById("userForm");
    userForm.reset();
    document.getElementById("userId").value = "";
}

// Evento para mostrar el formulario de usuario para añadir nuevo usuario
document.getElementById("addButton").addEventListener("click", function() {
    clearUserForm();
    document.getElementById("userForm").style.display = "block";
});

// Evento para cancelar edición o creación de usuario
document.getElementById("cancelButton").addEventListener("click", function() {
    clearUserForm();
    document.getElementById("userForm").style.display = "none";
});

// Evento para editar usuario
document.getElementById("userList").addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-edit")) {
        const userId = parseInt(event.target.getAttribute("data-id"));
        const userToEdit = usuariosRegistrados.find(user => user.id === userId);
        if (userToEdit) {
            document.getElementById("userId").value = userToEdit.id;
            document.getElementById("userName").value = userToEdit.username;
            document.getElementById("userEmail").value = userToEdit.email;
            // No establecer el campo de contraseña aquí por motivos de seguridad
            document.getElementById("userForm").style.display = "block";
        }
    }
});

// Evento para eliminar usuario
document.getElementById("userList").addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-delete")) {
        const userId = parseInt(event.target.getAttribute("data-id"));
        usuariosRegistrados = usuariosRegistrados.filter(user => user.id !== userId);
        guardarUsuariosRegistrados(); // Guardar cambios en localStorage
        initUserList(); // Actualizar la lista de usuarios en la interfaz
    }
});

// Evento para guardar usuario (crear o actualizar)
document.getElementById("userForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const userId = parseInt(document.getElementById("userId").value);
    const userName = document.getElementById("userName").value.trim();
    const userEmail = document.getElementById("userEmail").value.trim();
    const userPassword = document.getElementById("userPassword").value.trim();

    if (userName === "" || userEmail === "" || userPassword === "") {
        alert("Por favor completa todos los campos.");
        return;
    }

    const newUser = {
        id: userId || new Date().getTime(), // Generar ID si es nuevo usuario
        username: userName,
        email: userEmail,
        password: userPassword,
        role: "user" // Rol por defecto para usuarios registrados
    };

    // Crear o actualizar usuario en la lista de usuarios registrados
    const existingUserIndex = usuariosRegistrados.findIndex(user => user.id === newUser.id);
    if (existingUserIndex !== -1) {
        // Actualizar usuario existente
        usuariosRegistrados[existingUserIndex] = newUser;
    } else {
        // Crear nuevo usuario
        usuariosRegistrados.push(newUser);
    }

    // Guardar usuarios en localStorage y re-cargar la lista de usuarios
    guardarUsuariosRegistrados();
    initUserList();
    clearUserForm();
    document.getElementById("userForm").style.display = "none";
});

// Inicializar la lista de usuarios al cargar la página
document.addEventListener("DOMContentLoaded", function() {
    initUserList();
});

// Función para limpiar el localStorage sin borrar al administrador
function limpiarLocalStorageSinBorrarAdmin() {
    // Obtén la lista de usuarios del localStorage
    let usuariosRegistrados = JSON.parse(localStorage.getItem("usuarios")) || [];

    // Filtra los usuarios para mantener solo al administrador
    usuariosRegistrados = usuariosRegistrados.filter(user => user.username === "admin");

    // Guarda la lista filtrada de nuevo en el localStorage
    localStorage.setItem("usuarios", JSON.stringify(usuariosRegistrados));
}

// Llama a la función cuando lo necesites
limpiarLocalStorageSinBorrarAdmin();
