import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import OrderClient from "./OrderClient";

export default async function RoomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: room, error: roomError } = await supabaseServer
    .from("rooms")
    .select("*")
    .eq("slug", slug)
    .single();

  if (roomError || !room) {
    notFound();
  }

  const { data: menuItems, error: menuError } = await supabaseServer
    .from("menu_items")
    .select("*")
    .eq("room_id", room.id)
    .eq("is_available", true)
    .order("display_order", { ascending: true })
    .order("name", { ascending: true });

  if (menuError) {
    console.error("Error fetching menu items:", menuError);
  }

  return (
    <div className="flex flex-col min-h-screen pb-24">
      {/* Header */}
      <header className="px-6 py-4 border-b border-brand-brown/10 bg-white sticky top-0 z-10">
        <h1 className="text-xl font-bold text-brand-brown">{room.title}</h1>
        {room.store_name && (
          <p className="text-sm text-brand-brown/60 mt-1">{room.store_name}</p>
        )}
        {room.deadline_at && (
          <p className="text-xs font-semibold text-brand-orange mt-2">
            마감: {new Date(room.deadline_at).toLocaleTimeString("ko-KR", { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </header>

      {/* Main Form Client Component */}
      <main className="flex-1">
        <OrderClient room={room} initialMenuItems={menuItems || []} />
      </main>
    </div>
  );
}
