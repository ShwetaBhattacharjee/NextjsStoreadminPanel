// Defines the type for a collection

type CollectionType = {
  _id: string; // Unique identifier for the collection
  title: string; // Title of the collection
  description: string; // Description of the collection
  image: string; // URL or path to the collection image
  products: ProductType[]; // List of products in the collection
}

// Defines the type for items on sale
type OnSaleType = {
  _id: string; // Unique identifier for the sale item
  title: string; // Title of the sale item
  description: string; // Description of the sale item
  image: string; // URL or path to the sale item image
  products: ProductType[]; // List of products currently on sale
}

// Defines the type for a product
type ProductType = {
  
  _id: string; // Unique identifier for the product
  title: string; // Product title
  description: string; // Product description
  media: [string]; // Array of media URLs or file paths for the product (images, videos, etc.)
  category: string; // Category of the product (e.g., electronics, clothing)
  collections: [CollectionType]; // List of collections the product belongs to
  OnSales: [OnSaleType]; // List of sales the product is currently part of
  tags: [string]; // Tags associated with the product (e.g., 'new', 'sale', 'bestseller')
  sizes: [string]; // Available sizes for the product
  colors: [string]; // Available colors for the product
  price: number; // Price of the product
  expense: number; // Cost to produce or acquire the product
  createdAt: Date; // Date when the product was created
  updatedAt: Date; // Date when the product was last updated
}

// Defines the type for an order column (high-level order data)
type OrderColumnType = {
  _id: string; // Unique identifier for the order
  customer: string; // Customer's name or ID
  products: number; // Total number of products in the order
  totalAmount: number; // Total amount of the order
  createdAt: string; // Date and time when the order was created
}

// Defines the type for an item in an order (details of each item in the order)
type OrderItemType = {
  product: ProductType; // The product being ordered
  color: string; // The selected color for the product
  size: string; // The selected size for the product
  quantity: number; // Quantity of the product ordered
}

// Defines the type for a customer
type CustomerType = {
  clerkId: string; // Unique identifier for the customer in the clerk system
  name: string; // Customer's full name
  email: string; // Customer's email address
}
