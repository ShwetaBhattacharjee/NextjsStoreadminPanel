import mongoose from "mongoose";



// Define the schema for the Product model
const ProductSchema = new mongoose.Schema({
  title: String, // Product title (e.g., "Laptop", "T-shirt")
  description: String, // Detailed description of the product
  media: [String], // Array of media URLs or file paths (images, videos, etc.) related to the product
  category: String, // Category of the product (e.g., 'Electronics', 'Clothing')
  collections: [{ type: mongoose.Schema.Types.ObjectId, ref: "Collection" }], // List of references to collections the product belongs to
  onsales: [{ type: mongoose.Schema.Types.ObjectId, ref: "onsale" }], // List of references to sales that the product is part of
  tags: [String], // Array of tags associated with the product (e.g., 'New', 'Best Seller')
  sizes: [String], // Available sizes for the product (e.g., 'Small', 'Medium', 'Large')
  colors: [String], // Available colors for the product (e.g., 'Red', 'Blue', 'Black')

  // Price of the product as a decimal (using MongoDB Decimal128 type for high precision)
  price: {
    type: mongoose.Schema.Types.Decimal128,
    get: (v: mongoose.Schema.Types.Decimal128) => {
      return parseFloat(v.toString()); // Convert the Decimal128 value to a float
    }
  },

  // Expense to produce or acquire the product, also stored as a Decimal128
  expense: {
    type: mongoose.Schema.Types.Decimal128,
    get: (v: mongoose.Schema.Types.Decimal128) => {
      return parseFloat(v.toString()); // Convert the Decimal128 value to a float
    }
  },

  createdAt: {
    type: Date,
    default: Date.now, // Sets the default value for creation date to the current date and time
  },

  updatedAt: {
    type: Date,
    default: Date.now, // Sets the default value for last updated date to the current date and time
  },
}, { toJSON: { getters: true } }); // Enables getter functions when converting the document to JSON

// Define the Product model using the schema
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

// Export the Product model to be used in other parts of the application
export default Product;
