import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createRoomAction } from "./actions";

export default async function CreateRoomPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const defaultTitle = typeof resolvedParams.title === "string" ? resolvedParams.title : "";
  const defaultStoreName = typeof resolvedParams.storeName === "string" ? resolvedParams.storeName : "";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center px-6 py-4 border-b border-brand-brown/10">
        <Link href="/" className="p-2 -ml-2 text-brand-brown/60 hover:text-brand-brown transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold mr-6">새 주문방 만들기</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <form action={createRoomAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">방 제목 <span className="text-brand-orange">*</span></Label>
            <Input 
              id="title" 
              name="title" 
              placeholder="예: 오늘 3시 메가커피 주문" 
              defaultValue={defaultTitle}
              required 
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName">구매 장소</Label>
            <Input 
              id="storeName" 
              name="storeName" 
              placeholder="예: 메가커피, 스타벅스, GS25" 
              defaultValue={defaultStoreName}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadlineAt">마감 시간</Label>
            <Input 
              id="deadlineAt" 
              name="deadlineAt" 
              type="time" 
            />
            <p className="text-xs text-brand-brown/50">오늘 기준으로 설정됩니다. 비워두면 무제한입니다.</p>
          </div>

          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full">
              방 만들기
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
