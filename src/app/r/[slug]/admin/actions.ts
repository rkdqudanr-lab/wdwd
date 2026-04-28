"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleRoomStatusAction(roomId: string, ownerToken: string, slug: string, newStatus: string) {
  const { data: room } = await supabaseServer
    .from("rooms")
    .select("owner_token")
    .eq("id", roomId)
    .single();

  if (!room || room.owner_token !== ownerToken) {
    return { error: "권한이 없습니다." };
  }

  const { error } = await supabaseServer
    .from("rooms")
    .update({ status: newStatus })
    .eq("id", roomId);

  if (error) {
    return { error: "상태 변경 중 오류가 발생했습니다." };
  }

  revalidatePath(`/r/${slug}`);
  revalidatePath(`/r/${slug}/admin`);
  
  return { success: true };
}
