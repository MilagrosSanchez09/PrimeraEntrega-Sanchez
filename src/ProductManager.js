// Importo los módulos.
import fs from 'fs';

// Creamos la clase ProductManager
class ProductManager {
    constructor(filePath) {
        this.products = [];
        this.newId = 1;
        this.booksFilePath = filePath;
        this.initialize()
    }

    // Función asíncrona para inicializar.
    async initialize() {
        try {
            const booksData = await fs.readFile(this.booksFilePath, 'utf-8');
            this.products = JSON.parse(booksData);
            this.newId = Math.max(...this.products.map((product) => product.id)) + 1;
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('No se han encontrado los archivos, se asignará un ID a cada elemento agregado.');
                await this.saveProductsToFile();
            } else {
                throw error;
            }
        }
    }

    async readProductsFile() {
        this.product = await fs.promise.readFile(this.path);
    }

    // Método para validar los campos que se deben completar para cada libro.
    isValidProduct(product) {
        const requiredFields = ['title', 'author', 'category', 'description', 'price', 'status', 'thumbnail', 'code', 'stock'];
        return requiredFields.every((field) => product[field]);
    }

    // Método para validar que los 'code' no se dupliquen.
    isProductCodeDuplicate(code) {
        return this.products.some((prod) => prod.code === code);
    }

    // Función asíncrona para agregar un producto.
    async addProduct(product) {
        await this.readProductsFile();
        if (!this.isValidProduct(product)) {
            return 'Todos los campos son obligatorios.';
        }
        if (this.isProductCodeDuplicate(product.code)) {
            return 'Este libro ya fue agregado';
        }

        // Valor true para el estado de los productos que se agreguen.
        product.status = true;

        product.id = this.newId++;
        this.products.push(product);
        await this.saveProductsToFile();
        return 'El producto ha sido agregado correctamente';
    }

    // Función asíncrona para actualizar un libro por ID.
    async updateProduct(id, updateFields) {
        const productIndex = this.products.findIndex((prod) => prod.id === id);
        if (productIndex === -1) {
            return 'Producto no encontrado';
        }

        const productToUpdate = this.products[productIndex];
        const allowedKeys = Object.keys(productToUpdate);
        const disallowedKeys = ['id'];

        if (Object.keys(updateFields).length === 0) {
            return 'No se proporcionaron campos para actualizar.';
        }

        for (const key in updateFields) {
            if (!allowedKeys.includes(key) || disallowedKeys.includes(key)) {
                delete updateFields[key];
            }
        }

        Object.assign(productToUpdate, updateFields);
        this.products[productIndex] = productToUpdate;
        await this.saveProductsToFile();
        return 'Producto actualizado correctamente';
    }

    // Función asíncrona para eliminar un libro por ID.
    async deleteProduct(id) {
        try {
            await this.readProductsFile();
            const index = this.products.findIndex((prod) => prod.id === id);
            if (index === -1) {
                return 'Este libro no se ha encontrado';
            }
            this.products.splice(index, 1);
            await this.saveProductsToFile();
            return 'El producto ha sido eliminado correctamente';
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw 'Se produjo un error al intentar eliminar el producto por ID.';
        }
    }

    // Método para obtener la lista de productos.
    async getProducts(limit) {
        try {
            await this.readProductsFile(); // Leer productos desde el archivo.
            if (limit) {
                if (!isNaN(limit)) {
                    return this.product.slice(0, parseInt(limit, 10));
                } else {
                    throw 'El parámetro limit debe ser un número válido.';
                }
            } else {
                return this.products;
            }
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw 'Se produjo un error al obtener la lista de productos.';
        }
    }

    // Método para buscar un libro por ID.
    async getProductById(id) {
        try {
            await this.readProductsFile(); // Leer productos desde el archivo.
            const product = this.products.find((prod) => prod.id === id);
            if (!product) {
                throw 'Producto no encontrado';
            }
            return product;
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw 'Se produjo un error al buscar el producto por ID.';
        }
    }

    // Función asíncrona para guardar los datos de los libros.
    async saveProductsToFile() {
        console.log(this.booksFilePath);
        await fs.promises.writeFile(this.booksFilePath, JSON.stringify(this.products, null, 2), 'utf-8');
    }
}

// Exporto la clase.
export default ProductManager;
