// Función principal asincrónica que se ejecuta al cargar la página
async function main() {
  // Obtener el contenedor donde se mostrarán los campeones
  const divCampeones = document.getElementById("champeons");

  try {
    // Hacer una solicitud a la API RESTful para obtener la información de los campeones
    const response = await fetch("http://localhost:3000/");
    const campeones = await response.json();

    // Acumulador de elementos HTML para las tarjetas de campeones
    let htmlCampeones = "";

    // Iterar sobre los campeones y construir las tarjetas
    campeones.forEach((champeon, i) => {
      htmlCampeones += `
          <div class="card" id='${i}'>
            <img src="${champeon.image}" alt="${champeon.name} Image">
            <div class="card-info">
              <h2>${champeon.name}</h2>
              <h3>${champeon.title}</h3>
              <h4>${champeon.tags.join(", ")}</h4>
              <p>${champeon.description}</p>
              <button onclick="editarCampeon('${champeon._id}')">Editar</button>
              <button onclick="eliminarCampeon('${
                champeon._id
              }')">Eliminar</button>
            </div>
          </div>
        `;
    });

    // Insertar todas las tarjetas en el contenedor
    divCampeones.innerHTML = htmlCampeones;
  } catch (error) {
    console.error(error);
  }
}

// Función para manejar la eliminación de un campeón
async function eliminarCampeon(id) {
  try {
    // Hacer una solicitud DELETE a la API RESTful para eliminar el campeón por ID
    const response = await fetch(`http://localhost:3000/champeon/${id}`, {
      method: "DELETE",
    });

    // Volver a cargar las tarjetas después de la eliminación
    main();
  } catch (error) {
    console.error(error);
  }
}

// Función para abrir el modal de edición
function abrirModalEditar() {
  const editModal = document.getElementById("editModal");
  editModal.style.display = "block";
}

// Función para abrir el modal de agregar nuevo campeón
function abrirModalAgregar() {
  const addModal = document.getElementById("addModal");
  addModal.style.display = "block";
}

// Función para cerrar el modal de edición
function cerrarModalEdicion() {
  const editModal = document.getElementById("editModal");
  if (editModal) {
    editModal.style.display = "none";
  } else {
    console.error("Modal de edición no encontrado");
  }
}

// Función para cerrar el modal de agregar nuevo campeón
function cerrarModalAgregar() {
  const addModal = document.getElementById("addModal");
  if (addModal) {
    addModal.style.display = "none";
  } else {
    console.error("Modal de agregar nuevo campeón no encontrado");
  }
}

// Función para manejar la edición de un campeón
async function editarCampeon(id) {
  // Obtener el formulario de edición y los campos
  const editForm = document.getElementById("editForm");
  const editName = document.getElementById("editName");
  const editTitle = document.getElementById("editTitle");
  const editTags = document.getElementById("editTags");
  const editDescription = document.getElementById("editDescription");
  const editImage = document.getElementById("editImage");

  // Obtener la información actual del campeón
  const campeon = await obtenerCampeonPorId(id);

  // Abrir el modal antes de agregar el evento al formulario
  abrirModalEditar();

  // Agregar evento de submit al formulario
  editForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    // Crear un objeto con los datos del formulario
    const formData = {
      name: editName.value,
      title: editTitle.value,
      tags: editTags.value.split(",").map((tag) => tag.trim()),
      description: editDescription.value,
      image: editImage.value,
    };

    try {
      // Enviar una solicitud PATCH al servidor para actualizar el campeón
      await fetch(`http://localhost:3000/champeon/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Cerrar el modal después de la edición
      cerrarModalEdicion();

      // Volver a cargar las tarjetas después de la edición
      main();
    } catch (error) {
      console.error(error);
    }
  });
}

// Función para agregar un nuevo campeón
async function agregarNuevoCampeon() {
  const nuevoCampeon = {
    name: document.getElementById("newName").value,
    title: document.getElementById("newTitle").value,
    tags: document
      .getElementById("newTags")
      .value.split(",")
      .map((tag) => tag.trim()),
    description: document.getElementById("newDescription").value,
    image: document.getElementById("newImage").value,
  };

  try {
    // Enviar una solicitud POST al servidor para agregar el nuevo campeón
    const response = await fetch("http://localhost:3000/champeon/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(nuevoCampeon),
    });

    if (response.ok) {
      console.log("Nuevo campeón agregado con éxito");
      // Cerrar el modal después de agregar un nuevo campeón
      cerrarModalAgregar();
      // Volver a cargar la lista de campeones
      main();
    } else {
      console.error("Error al agregar nuevo campeón");
    }
  } catch (error) {
    console.error(error);
  }
}

// Evento que se ejecuta cuando el DOM ha cargado completamente
document.addEventListener("DOMContentLoaded", function () {
  // Obtener el botón de agregar y agregar un evento para abrir el modal de agregar
  const addButton = document.querySelector("button");
  addButton.addEventListener("click", abrirModalAgregar);
});

// Función para obtener la información de un campeón por su ID
async function obtenerCampeonPorId(id) {
  try {
    // Hacer una solicitud a la API RESTful para obtener un campeón por ID
    const response = await fetch(`http://localhost:3000/${id}`);

    // Verificar si el campeón no fue encontrado (status 404)
    if (response.status === 404) {
      console.log("Campeon no encontrado");
      return null;
    }

    // Leer el cuerpo de la respuesta como texto
    const responseBody = await response.text();
    console.log("Cuerpo de la respuesta:", responseBody);

    // Analizar el cuerpo como JSON manualmente
    const campeon = JSON.parse(responseBody);
    return campeon;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Ejecutar la función principal al cargar la página
main();
