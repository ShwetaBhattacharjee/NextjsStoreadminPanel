import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { connectToDB } from "@/lib/mongoDB";
import Product from "@/lib/models/Product";
import Collection from "@/lib/models/Collection";
import Onsale from "@/lib/models/Onsale"; // Import Onsale model

export const GET = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    await connectToDB();

    const product = await Product.findById(params.productId)
      .populate({ path: "collections", model: Collection })
      .populate({ path: "onsales", model: Onsale }); // Populate the onsales field

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": `${process.env.ECOMMERCE_STORE_URL}`,
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (err) {
    console.log("[productId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    const {
      title,
      description,
      media,
      category,
      collections,
      onsales, // onsales field
      tags,
      sizes,
      colors,
      price,
      expense,
    } = await req.json();

    if (!title || !description || !media || !category || !price || !expense) {
      return new NextResponse("Not enough data to create a new product", {
        status: 400,
      });
    }

    // Handle collections
    const addedCollections = collections.filter(
      (collectionId: string) => !product.collections.includes(collectionId)
    );
    const removedCollections = product.collections.filter(
      (collectionId: string) => !collections.includes(collectionId)
    );

    await Promise.all([
      ...addedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $push: { products: product._id },
        })
      ),
      ...removedCollections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Handle onsales
    const addedOnsales = onsales.filter(
      (onsaleId: string) => !product.onsales.includes(onsaleId)
    );
    const removedOnsales = product.onsales.filter(
      (onsaleId: string) => !onsales.includes(onsaleId)
    );

    await Promise.all([
      ...addedOnsales.map((onsaleId: string) =>
        Onsale.findByIdAndUpdate(onsaleId, {
          $push: { products: product._id },
        })
      ),
      ...removedOnsales.map((onsaleId: string) =>
        Onsale.findByIdAndUpdate(onsaleId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      product._id,
      {
        title,
        description,
        media,
        category,
        collections,
        onsales,
        tags,
        sizes,
        colors,
        price,
        expense,
      },
      { new: true }
    ).populate({ path: "collections", model: Collection })
     .populate({ path: "onsales", model: Onsale });

    await updatedProduct.save();

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (err) {
    console.log("[productId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    const product = await Product.findById(params.productId);

    if (!product) {
      return new NextResponse(
        JSON.stringify({ message: "Product not found" }),
        { status: 404 }
      );
    }

    await Product.findByIdAndDelete(product._id);

    // Update collections and onsales by pulling the deleted product
    await Promise.all([
      ...product.collections.map((collectionId: string) =>
        Collection.findByIdAndUpdate(collectionId, {
          $pull: { products: product._id },
        })
      ),
      ...product.onsales.map((onsaleId: string) =>
        Onsale.findByIdAndUpdate(onsaleId, {
          $pull: { products: product._id },
        })
      ),
    ]);

    return new NextResponse(JSON.stringify({ message: "Product deleted" }), {
      status: 200,
    });
  } catch (err) {
    console.log("[productId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
