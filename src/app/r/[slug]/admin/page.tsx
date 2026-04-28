import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AdminClient from "./AdminClient";

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;

  if (!key) {
    notFound();
  }

  // Fetch room
  const { data: room, error: roomError } = await supabaseServer
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (roomError || !room || room.owner_token !== key) {
    notFound();
  }

  // Fetch all orders
  const { data: orders, error: ordersError } = await supabaseServer
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("room_id", room.id)
    .order("created_at", { ascending: true });

  if (ordersError) {
    console.error("Error fetching orders:", ordersError);
  }

  return (
    <div className="flex flex-col min-h-screen bg-brand-cream">
      <AdminClient room={room} orders={orders || []} ownerToken={key} />
    </div>
  );
}
