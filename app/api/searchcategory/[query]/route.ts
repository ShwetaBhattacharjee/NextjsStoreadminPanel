import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { make?: string, model?: string, price?: string }}) => {
    try {
      await connectToDB();
  
      const { make, model, price } = params;
  
      // Build search criteria based on the available parameters
      const searchCriteria: any = {};
      if (make) searchCriteria.make = { $regex: make, $options: "i" };
      if (model) searchCriteria.model = { $regex: model, $options: "i" };
      if (price) searchCriteria.price = price; // Exact match for price
  
      // Perform search using the dynamic criteria
      const searchedProducts = await Product.find(searchCriteria);
  
      return NextResponse.json(searchedProducts, { status: 200 });
    } catch (err) {
      console.log("[search_GET]", err);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  };
  