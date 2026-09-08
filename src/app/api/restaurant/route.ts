import { NextResponse } from "next/server";
import { restaurantInfo } from "../../../../server/data/menuData";

export async function GET() {
  return NextResponse.json(restaurantInfo);
}
