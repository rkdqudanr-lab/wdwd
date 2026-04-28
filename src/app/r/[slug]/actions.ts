"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";

export async function submitOrderAction(data: {
  roomId: string;
  slug: string;
  customerName: string;
  items: Array<{
    menuItemId?: string;
    name: string;
    brand_name?: string;
    price?: number;
    kcal?: number;
    quantity: number;
    memo: string;
  }>;
}) {
  const orderToken = randomBytes(16).toString("hex");

  // Create order
  const { data: order, error: orderError } = await supabaseServer
    .from("orders")
    .insert([
      {
        room_id: data.roomId,
        customer_name: data.customerName,
        order_token: orderToken,
        status: "received",
      },
    ])
    .select()
    .single();

  if (orderError || !order) {
    console.error("Order creation failed:", orderError);
    return { error: "주문을 생성하지 못했습니다." };
  }

  // Create order items
  const orderItemsData = data.items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menuItemId || null,
    item_name: item.name,
    brand_name: item.brand_name || null,
    price: item.price || null,
    kcal: item.kcal || null,
    quantity: item.quantity,
    option_text: item.memo || null,
  }));

  const { error: itemsError } = await supabaseServer
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Order items creation failed:", itemsError);
    return { error: "주문 상세 항목을 저장하지 못했습니다." };
  }

  // Redirect to done page
  redirect(`/r/${data.slug}/done?order=${orderToken}`);
}
