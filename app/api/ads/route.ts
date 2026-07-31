import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/supabase";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.replace("Bearer ", "");

  if (!process.env.ADMIN_SECRET || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { brand_name, product_name, category, image_url, brand_url, date_spotted } = body;

  if (!brand_name || !product_name || !category || !image_url || !brand_url) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const admin = createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await admin
    .from("ads")
    .insert({
      brand_name,
      product_name,
      category,
      image_url,
      brand_url,
      date_spotted: date_spotted || new Date().toISOString().slice(0, 10),
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ad: data }, { status: 201 });
}
