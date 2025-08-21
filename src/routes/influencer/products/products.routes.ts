import express from 'express';
import addProductController from '../../../controllers/influencer/products/addProduct.controller.js';
import updateProductController from '../../../controllers/influencer/products/updateProduct.controller.js';
import deleteProductController from '../../../controllers/influencer/products/deleteProduct.controller.js';
import { validateAddProduct, validateUpdateProduct } from '../../../validation/influencer/products.validation.js';

const productsRouter = express.Router();

// Add a new product (requires authentication)
productsRouter.post("/", validateAddProduct, addProductController);

// Update an existing product by ID (requires authentication)
productsRouter.put("/:productId", validateUpdateProduct, updateProductController);

// Delete a specific product by ID (requires authentication)
productsRouter.delete("/:productId", deleteProductController);

export default productsRouter; 