"use server";

import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";

export async function createRoomAction(formData: FormData) {
  const title = formData.get("title") as string;
  const storeName = formData.get("storeName") as string;
  const deadlineAtStr = formData.get("deadlineAt") as string;

  if (!title) {
    return { error: "방 제목을 입력해주세요." };
  }

  const slug = randomBytes(4).toString("hex");
  const ownerToken = randomBytes(16).toString("hex");

  let deadlineAt = null;
  if (deadlineAtStr) {
    const [hours, minutes] = deadlineAtStr.split(":");
    const now = new Date();
    now.setHours(parseInt(hours, 10));
    now.setMinutes(parseInt(minutes, 10));
    now.setSeconds(0);
    deadlineAt = now.toISOString();
  }

  const { error } = await supabaseServer
    .from("rooms")
    .insert([
      {
        slug,
        title,
        store_name: storeName,
        deadline_at: deadlineAt,
        owner_token: ownerToken,
        status: "open",
      },
    ]);

  if (error) {
    console.error("Error creating room:", error);
    return { error: "주문방 생성 중 오류가 발생했습니다." };
  }

  // Redirect to admin page
  redirect(`/r/${slug}/admin?key=${ownerToken}`);
}
