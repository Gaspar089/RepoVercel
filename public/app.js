// Esperamos a que el HTML cargue completamente
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('guestbook-form');
    
    // Cargar comentarios al iniciar
    loadComments();

    // Escuchar el envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evita que la página se recargue
        await postComment();
    });
});

// Función para OBTENER los datos (GET)
async function loadComments() {
    const listContainer = document.getElementById('comments-list');
    const loadingDiv = document.getElementById('loading');
    
    try {
        // Hacemos la petición a la API que ya tienes configurada
        const response = await fetch('/api/users'); 
        const data = await response.json();

        // Limpiamos el mensaje de "Cargando"
        loadingDiv.style.display = 'none';
        listContainer.innerHTML = ''; // Limpiar lista actual

        // Como MongoDB devuelve los más viejos primero, invertimos el array
        // para ver los nuevos arriba
        const comments = data.reverse(); 

        comments.forEach(item => {
            // Creamos el HTML de cada tarjeta dinámicamente
            // Nota: Usamos 'item.name' y 'item.email' porque esos son los campos
            // que tu backend espera, aunque visualmente mostraremos "Mensaje"
            // usaremos el campo 'email' para guardar el mensaje y no tocar el backend.
            
            const card = document.createElement('div');
            card.className = 'comment-card';
            
            // Si el dato no tiene fecha, ponemos "Reciente"
            const date = item.date || 'Reciente';

            card.innerHTML = `
                <div class="comment-header">
                    <span>${escapeHtml(item.name)}</span>
                    <span class="comment-date">${date}</span>
                </div>
                <div class="comment-body">
                    ${escapeHtml(item.email)} 
                </div>
            `;
            listContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error cargando comentarios:", error);
        loadingDiv.innerText = "Error al cargar los datos.";
    }
}

// Función para ENVIAR datos (POST)
async function postComment() {
    const nameInput = document.getElementById('username');
    const messageInput = document.getElementById('message');

    const newComment = {
        name: nameInput.value,
        // Tu backend original espera "email", así que mandamos el mensaje ahí
        // para no tener que modificar el archivo users.js
        email: messageInput.value, 
        date: new Date().toLocaleDateString() // Añadimos la fecha actual
    };

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newComment)
        });

        if (response.ok) {
            // Si se guardó bien, limpiamos el formulario y recargamos la lista
            nameInput.value = '';
            messageInput.value = '';
            loadComments(); 
        } else {
            alert('Hubo un error al guardar tu mensaje.');
        }

    } catch (error) {
        console.error("Error enviando:", error);
    }
}

// Pequeña función de seguridad para evitar código malicioso en los textos
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}