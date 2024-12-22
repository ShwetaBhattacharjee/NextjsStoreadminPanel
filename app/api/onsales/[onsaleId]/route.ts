import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { connectToDB } from "@/lib/mongoDB";
import Onsale from "@/lib/models/Onsale";
import Product from "@/lib/models/Product";

export const GET = async (
  req: NextRequest,
  { params }: { params: { onsaleId: string } }
) => {
  try {
    await connectToDB();

    const onsale = await Onsale.findById(params.onsaleId).populate({ path: "products", model: Product });

    if (!onsale) {
      return new NextResponse(
        JSON.stringify({ message: "Onsale not found" }),
        { status: 404 }
      );
    }

    return NextResponse.json(onsale, { status: 200 });
  } catch (err) {
    console.log("[onsaleId_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { onsaleId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    let onsale = await Onsale.findById(params.onsaleId);

    if (!onsale) {
      return new NextResponse("Onsale not found", { status: 404 });
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    onsale = await Onsale.findByIdAndUpdate(
      params.onsaleId,
      { title, description, image },
      { new: true }
    );

    await onsale.save();

    return NextResponse.json(onsale, { status: 200 });
  } catch (err) {
    console.log("[onsaleId_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const DELETE = async (
  req: NextRequest,
  { params }: { params: { onsaleId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectToDB();

    await Onsale.findByIdAndDelete(params.onsaleId);

    await Product.updateMany(
      { onsales: params.onsaleId },
      { $pull: { onsales: params.onsaleId } }
    );

    return new NextResponse("Onsale is deleted", { status: 200 });
  } catch (err) {
    console.log("[onsaleId_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
