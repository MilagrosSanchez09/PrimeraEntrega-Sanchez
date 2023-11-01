// Importo los módulos y las clases.
import express from 'express';
import ProductManager from './ProductManager.js';
import CartManager from './CartManager.js';

const app = express();
app.use(express.json());

// Nueva instancia de ProductManager.
const productsFilePath = './src/books.json';
const productsManager = new ProductManager(productsFilePath);

// Nueva instancia de CartManager.
const cartsFilePath = './src/cart.json';
const cartManager = new CartManager(cartsFilePath, productsFilePath);

// Rutas para los productos:
// Para obtener la lista de libros:
app.get('/api/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productsManager.getProducts(limit);
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Se produjo un error al procesar la solicitud.');
  }
});
// Para filtrar por ID.
app.get('/api/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);
    const product = await productsManager.getProductById(productId);
    if (product === 'Not Found') {
      res.status(404).send('Producto no encontrado');
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).send('Se produjo un error al procesar su solicitud.');
  }
});
// Para agregar un producto.
app.post('/api/products', async (req, res) => {
  try {
    const newBook = req.body;
    const result = await productsManager.addProduct(newBook);
    res.json(result);
  } catch (error) {
    console.error('Error al agregar producto:', error);
    res.status(500).send('Se produjo un error al procesar su solicitud.');
  }
});
// Para actualizar un producto.
app.put('/api/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);
    const updatedBooks = req.body;
    const result = await productsManager.updateProduct(productId, updatedBooks);
    res.json(result);
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    res.status(500).send('Se produjo un error al procesar su solicitud.');
  }
});
// Para eliminar un producto.
app.delete('/api/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);
    const result = await productsManager.deleteProduct(productId);
    res.json(result);
  } catch (error) {
    console.error('Error al eliminar el producto:', error);
    res.status(500).send('Se produjo un error al procesar su solicitud.');
  }
});

// Rutas para carritos:
// Para crear nuevos carritos.
app.post('/api/carts', async (req, res) => {
  try {
    console.log('Contenido del cuerpo de la solicitud:', req.body);
    const newCart = req.body;
    const result = await cartManager.createCart(newCart);
    res.json(result);
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).send('Se produjo un error al procesar su solicitud.');
  }
});
// Para filtrar carritos por ID.
app.get('/api/carts/:cid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);
    const cart = await cartManager.getCartById(cartId);
    res.json(cart);
  } catch (error) {
    console.error('Error al obtener el carrito:', error);
    res.status(500).send('Se produjo un error al procesar su solicitud.');
  }
});
// Para agregar productos a un carrito en específico.
app.post('/api/carts/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = parseInt(req.params.cid, 10);
    const productId = parseInt(req.params.pid, 10);
    const quantity = req.body.quantity;

    const cart = await cartManager.getCartById(cartId);

    if (cart === 'Not Found'){
      res.status(404).send('Carrito no encontrado');
    } else {
      const product = await productsManager.getProductById(productId);

      if (product === 'Not Found') {
        res.status(404).send('Producto no encontrado');
      } else {
        const result = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(result);
      }
    }
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(500).send('Se produjo un error al procesar su solicitud.');
  }
});

// Libros a agregar.
const books = [
  {
    "title": "Dark Memory",
    "author": "Christine Feehan",
    "category": "Romance",
    "description": "Safia Meziane has trained since birth to protect her tribe, the family she holds so dear. All along she told herself the legends she was raised with were simply that. But now, she must call upon all of her skills to fight what lies ahead. Evil has come to their small town on the coast of Algeria, evil that Safia can feel but cannot see.",
    "price": 14.99,
    "status": true,
    "thumbnail": "https://m.media-amazon.com/images/I/51YkE0EzAWL.jpg",
    "code": "B1",
    "stock": 23
  },
  {
    "title": "Fourth Wing",
    "author": "Rebecca Yarros",
    "category": "Fantasy",
    "description": "Suspenseful, sexy, and with incredibly entertaining storytelling, the first in Yarros' Empyrean series will delight fans of romantic, adventure-filled fantasy.' —Booklist, starred review",
    "price": 14.99,
    "status": true,
    "thumbnail": "https://images.cdn3.buscalibre.com/fit-in/360x360/4d/28/4d28ac1183866f21e774e25142d9a409.jpg",
    "code": "B2",
    "stock": 15
  },
  {
    "title": "V for Vendetta (New Edition",
    "author": "Alan Moore",
    "category": "Comic",
    "description": "A powerful story about loss of freedom and individuality, V FOR VENDETTA takes place in atotalitarian England following a devastating war that changed the face of the planet. In a world without political freedom, personal freedom and precious little faith in anything, comes a mysterious man in a white porcelain mask who fightspolitical oppressors through terrorism and seemingly absurd acts in this gripping tale of the blurred lines between ideological good and evil.",
    "price": 9.2,
    "status": true,
    "thumbnail": "https://http2.mlstatic.com/D_NQ_NP_705973-MLA50789601982_072022-O.webp",
    "code": "B3",
    "stock": 7
  },
  {
    "title": "Fantastic Beasts and Where to Find Them",
    "author": "J.K. Rowling",
    "category": "Fiction",
    "description": "An approved textbook at Hogwarts School of Witchcraft and Wizardry since its first publication, Fantastic Beasts and Where to Find Them is an indispensable guide to the magical beasts of the wizarding world. It showcases a menagerie of magical creatures, explained enchantingly by noted magizoologist, Newt Scamander, who you may remember from the film series of the same name. The shelves of the Hogwarts Library are also home to many more fascinating books. If you have enjoyed Fantastic Beasts",
    "price": 5.99,
    "status": true,
    "thumbnail": "https://m.media-amazon.com/images/I/51XXxJ0uQzL.jpg",
    "code": "B4",
    "stock": 13
  },
  {
    "title": "Never Lie",
    "author": "Freida McFadden",
    "category": "Fiction",
    "description": "Newlyweds Tricia and Ethan are searching for the house of their dreams. But when they visit the remote manor that once belonged to Dr. Adrienne Hale, a renowned psychiatrist who vanished without a trace four years earlier, a violent winter storm traps them at the estate... with no chance of escape until the blizzard comes to an end. In search of a book to keep her entertained until the snow abates, Tricia happens upon a secret room. One that contains audio transcripts from every single patient Dr. Hale has ever interviewed. As Tricia listens to the cassette tapes, she learns about the terrifying chain of events leading up to Dr. Hale's mysterious disappearance. Tricia plays the tapes one by one, late into the night. With each one, another shocking piece of the puzzle falls into place, and Dr. Adrienne Hale's web of lies slowly unravels. And then Tricia reaches the final cassette. The one that reveals the entire horrifying truth",
    "price": 41.48,
    "status": true,
    "thumbnail": "https://th.bing.com/th/id/OIP.SpEExoJHk49l3HGW5ZoyhgAAAA?pid=ImgDet&rs=1",
    "code": "B5",
    "stock": 17
  },
  {
    "title": "Mr. Mercedes",
    "author": "Stephen King",
    "category": "Fiction",
    "description": "A cat-and-mouse suspense thriller featuring a retired homicide detective who's haunted by the few cases he left open, and by one in particular - the pre-dawn slaughter of eight people among hundreds gathered in line for the opening of a jobs fair when the economy was guttering out. Without warning, a lone driver ploughed through the crowd in a stolen Mercedes. The plot is kicked into gear when Bill Hodges receives a letter in the mail, from a man claiming to be the perpetrator. He taunts Hodges with the notion that he will ...",
    "price": 2.07,
    "status": true,
    "thumbnail": "https://m.media-amazon.com/images/I/51XXxJ0uQzL.jpg",
    "code": "B6",
    "stock": 10
  },
  {
    "title": "Icebreaker",
    "author": "Hannah Grace",
    "category": "Romance",
    "description": "Anastasia Allen has worked her entire life for a shot at Team USA. A competitive figure skater since she was five years old, a full college scholarship thanks to her place on the Maple Hills skating team, and a schedule that would make even the most driven person weep, Stassie comes to win.",
    "price": 11.34,
    "status": true,
    "thumbnail": "https://m.media-amazon.com/images/I/713UXYBviuL.jpg",
    "code": "B7",
    "stock": 15
  }
]

// Defino la función addBooks
// Modifica la función addBooks en app.js
async function addBooks(productManager, books) {
  try {
    // Lee los libros existentes desde el archivo JSON
    await productManager.readProductsFile();

    for (const book of books) {
      book.id = productManager.newId++;
      // Agrega cada libro a la lista de productos
      const result = await productManager.addProduct(book);
      console.log(result);
    }

    await productManager.saveProductsToFile();
  } catch (error) {
    console.error('Error al agregar libros:', error);
  }
}


/*async function addBooks(productManager, books) {
  for (const book of books) {
    productManager.addProduct(book);
  }
}
*/


// Inicializa ProductManager, y se agregan los libros.
productsManager.initialize()
    .then(() => {
        addBooks(productsManager, books);
        return cartManager.initialize();
    })
    .then(() => {
      app.listen(8080, () => {
        console.log('Servidor de gestión de productos y carritos escuchando en el puerto 8080');
      });
    })
    .catch((error) => {
        console.error('Error al inicializar: ', error);
    });

