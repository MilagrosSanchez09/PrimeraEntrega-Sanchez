import fs from 'fs';

class CartManager {
    constructor(cartFilePath, bookFilePath) {
        this.carts = [];
        this.newCartId = 1;
        this.products = [];
        this.cartsFilePath = cartFilePath;
        this.booksFilePath = bookFilePath;
        this.initialize();
    }

    async initialize() {
        try {
            const cartsData = await fs.promises.readFile(this.cartsFilePath, 'utf-8');
            this.carts = JSON.parse(cartsData);
            const maxId = Math.max(...this.carts.map((cart) => cart.id));
            this.newCartId = maxId >= 1 ? maxId + 1 : 1;

            const productsData = await fs.promises.readFile(this.booksFilePath, 'utf-8');
            this.products = JSON.parse(productsData);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('Archivo de carritos no encontrado. Se le asignará un ID único a cada carrito.');
                this.newCartId = 1;
                await this.saveCartsToFile();
            } else {
                throw error;
            }
        }
    }

    // Función asíncrona para crear un nuevo carrito de compras y asignarles un nuevo ID.
    async createCart() {
        try {
            const newCart = {
                id: this.newCartId,
                products: []
            };

            this.newCartId++;
            this.carts.push(newCart);
            await this.saveCartsToFile();
            return newCart;
        } catch (error) {
            console.error('Error al crear un carrito:', error);
        }
    }

    async loadCartsFromFile() {
        try {
            const cartsData = await fs.promises.readFile(this.cartsFilePath, 'utf-8');
            this.carts = JSON.parse(cartsData);
            return this.carts;
        } catch (error) {
            return [];
        }
    }


    // Función asíncrona para obtener carrito por ID.
    async getCartById(cartId) {
        await this.loadCartsFromFile();
        const cart = this.carts.find((cart) => cart.id == cartId);
        if (cart) {
            return cart;
        } else {
            return 'Not Found';
        }
    }

    // Función asíncrona para agregar productos al carrito.
    async addProductToCart(cartId, productId) {
        const cart = this.carts.find((cart) => cart.id === cartId);
        if (!cart) {
            throw 'No se ha encontrado el carrito';
        }
        console.log('productId:', productId);
        const product = this.products.find((prod) => prod.id === productId);
        console.log('product:', product);
        if (!product) {
            throw 'No se ha encontrado el libro';
        }

        const existingProduct = cart.products.find((item) => item.product === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: productId, quantity: 1 });
        }

        await this.saveCartsToFile();
        return cart;
    }

    // Función para guardar los cambios del carrito.
    async saveCartsToFile() {
        try {
            await fs.promises.writeFile(this.cartsFilePath, JSON.stringify(this.carts, null, 2), 'utf-8');
        } catch (error) {
            console.error('Error al guardar el carrito:', error)
        }
    }
}

export default CartManager;
