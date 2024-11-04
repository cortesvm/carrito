//Generalmente VS Code si instanciamos un objeto de una clase con el modificador export nos suguiere directamente la importacion
import {Carrito} from "./Carrito.js";

// Reemplaza con tu URL la mia https://jsonblob.com/api/1301521218346541056
const apiUrl = 'https://jsonblob.com/api/1296178912269557760';

//Instancio la clase Carrito y guardo su referencia en una const
const carrito = new Carrito({});

//Function principal llamada cuando se interactua con los botones mas y menos de la pagina
function actualizarCarrito(sku, incremento) {
    // Actualizo la cantidad de articulos en el Carrito.js
    const cantidadInput = document.getElementById('cantidad-' + sku);
    const cantidadActual = parseInt(cantidadInput.value)

    // No se permiten cantidades negativas
    if (cantidadActual === 0 && incremento === -1) return;

    const cantidad = cantidadActual + incremento;
    cantidadInput.value = cantidad;

    carrito.actualizarUnidades(sku, cantidad);

    // Actualizo el Total Parcial
    const infoProducto = carrito.obtenerInformacionProducto(sku);
    const td = document.getElementById('total-producto-' + sku );
    const totalProducto = cantidad * infoProducto.price;
    td.innerHTML = totalProducto.toFixed(2) + '€';

    // Actualizo el Carrito HTML
    const car = carrito.obtenerCarrito();

    const cuerpoTabla = document.getElementById('cuerpoTablaCarrito');
    // Limpio la tabla
    cuerpoTabla.innerHTML = "";

    // Añado los nuevos productos
    car.products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${product.quantity} x ${product.title}</td>`
            + `<td>${product.quantity} x ${product.price}€</td>`;

        cuerpoTabla.appendChild(row);
    });

    // Actualizo el total final
    document.getElementById('totalFinal').innerText = `${car.total}€`;
}


// Function usaba para obtener los productos de la API y tambien para añadirlos al index.html
async function obtenerProductos(){
    try {
        // Obtener los productos de la API
        const response = await fetch(apiUrl);
        const data = await response.json();

        // Initializar los precios en el carrito
        carrito.cargarListaProductosDisponibles(data.products);

        // Mostrar por pantalla los productos disponibles
        const cuerpoTabla = document.getElementById('cuerpoTablaProductos');
        data.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${product.title}</td>`
                + `<td><button id="menos-${product.SKU}">-</button><input type="number" value="0" id="cantidad-${product.SKU}"><button id="mas-${product.SKU}">+</button></td>`
                + `<td>${product.price}€</td>`
                + `<td id="total-producto-${product.SKU}">0</td>`;

            cuerpoTabla.appendChild(row);

            // ver: https://www.w3schools.com/jsref/met_document_addeventlistener.asp
            // Añadir listeners para escucar eventos en los botones
            document.getElementById('menos-' + product.SKU).addEventListener("click", function(){ actualizarCarrito(product.SKU, -1)});
            document.getElementById('mas-' + product.SKU).addEventListener("click", function(){ actualizarCarrito(product.SKU, 1)});
        });

        return data.products;
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Lanza el fetch para conseguir articulos cuando al pagina es ha cargado
window.onload = obtenerProductos();

// Online encontre este tambien
// ver: https://dev.to/obere4u/domcontentloaded-vs-windowonload-9mc
//document.addEventListener('DOMContentLoaded', obtenerProductos);