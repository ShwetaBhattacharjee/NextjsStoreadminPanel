import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import Onsale from "@/lib/models/Onsale"; // Assuming you have an Onsale model



// POST handler for adding new products
export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const {
      title,
      description,
      media,
      category,
      collections,
      onsales,  // Add onsales for handling on sale items
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a product", {
        status: 400,
      });
    }

    

    // Create the new product
    const newProduct = await Product.create({
      title,
      description,
      media,
      category,
      collections,
      onsales, // Include onsales data
      tags,
      sizes,
      colors,
      price,
      expense,
    });

    await newProduct.save();

    // Handle Collections association
    if (collections) {
      for (const collectionId of collections) {
        const collection = await Collection.findById(collectionId);
        if (collection) {
          collection.products.push(newProduct._id);
          await collection.save();
        }
      }
    }

    // Handle Onsales association
    if (onsales) {
      for (const onsaleId of onsales) {
        const onsale = await Onsale.findById(onsaleId);
        if (onsale) {
          onsale.products.push(newProduct._id);
          await onsale.save();
        }
      }
    }

    return NextResponse.json(newProduct, { status: 200 });
  } catch (err) {
    console.log("[products_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// GET handler for fetching all products
export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const products = await Product.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "collections", model: Collection })
      .populate({ path: "onsales", model: Onsale }); // Include onsales population

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log("[products_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// POST handler for Onsale
export const createOnsale = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const { title, description, media, price, products } = await req.json();

    if (!title || !description || !media || !price) {
      return new NextResponse("Not enough data to create an onsale", {
        status: 400,
      });
    }

    const newOnsale = await Onsale.create({
      title,
      description,
      media,
      price,
      products,
    });

    await newOnsale.save();

    if (products) {
      for (const productId of products) {
        const product = await Product.findById(productId);
        if (product) {
          product.onsales.push(newOnsale._id);
          await product.save();
        }
      }
    }

    return NextResponse.json(newOnsale, { status: 200 });
  } catch (err) {
    console.log("[onsales_POST]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// GET handler for Onsales
export const getOnsales = async (req: NextRequest) => {
  try {
    await connectToDB();

    const onsales = await Onsale.find()
      .sort({ createdAt: "desc" })
      .populate({ path: "products", model: Product });

    return NextResponse.json(onsales, { status: 200 });
  } catch (err) {
    console.log("[onsales_GET]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
