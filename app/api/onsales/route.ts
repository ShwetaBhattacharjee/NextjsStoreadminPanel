import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

import Onsale from "@/lib/models/Onsale";

export const POST = async (req: NextRequest) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await connectToDB();

    const { title, description, image } = await req.json();

    const existingOnsale = await Onsale.findOne({ title });

    if (existingOnsale) {
      return new NextResponse("Onsale already exists", { status: 400 });
    }

    if (!title || !image) {
      return new NextResponse("Title and image are required", { status: 400 });
    }

    const newOnsale = await Onsale.create({
      title,
      description,
      image,
    });

    await newOnsale.save();

    return NextResponse.json(newOnsale, { status: 200 });
  } catch (err) {
    console.log("[onsale_POST]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const GET = async (req: NextRequest) => {
  try {
    await connectToDB();

    const onsales = await Onsale.find().sort({ createdAt: "desc" });

    return NextResponse.json(onsales, { status: 200 });
  } catch (err) {
    console.log("[onsale_GET]", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic";
