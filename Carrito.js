export class Carrito {

    // Uso la propriedad productos como registro de lo que hay en el carrito
    constructor(productos) {
        this.productos = productos;
    }

    // Cargo todos los productos retornados por la API para tener toda la informacion necesaria aqui
    cargarListaProductosDisponibles(productos) {
        for (let i = 0; i < productos.length; i++) {
            this.productos[productos[i].SKU] = { title : productos[i].title, price : productos[i].price, quantity : 0};
        }

        console.log(this.productos);
    }

    // Actualiza el número de unidades que se quieren comprar de un producto
    actualizarUnidades(sku, unidades) {
        this.productos[sku].quantity = unidades;
    }

    // Devuelve los datos de un producto además de las unidades seleccionadas
    // Por ejemplo
    // {
    //   "sku": "0K3QOSOV4V",
    //   "quantity": 3
    // }

    obtenerInformacionProducto(sku) {
        if (this.productos[sku]) {
            return {
                sku: sku,
                quantity: this.productos[sku].quantity,
                price: this.productos[sku].price
            };
        }
        return null;
    }

    // Devuelve información de los productos añadidos al carrito
    // Además del total calculado de todos los productos
    // Por ejemplo:
    // {
    //   "total": "5820",
    //   "currency: "€",
    //   "products" : [
    //     {
    //       "sku": "0K3QOSOV4V"
    //       ..
    //     }
    //    ]}
    // }

    obtenerCarrito() {
        let total = 0;
        let products = [];

        for (const sku in this.productos) {
            const quantity = this.productos[sku].quantity;
            if (quantity === 0) continue;

            const price = this.productos[sku].price;
            const title = this.productos[sku].title;

            total += price * quantity;
            products.push({ sku, title, quantity, price});
        }

        return {
            total: total.toFixed(2),
            currency: "€",
            products: products
        };
    }
}

