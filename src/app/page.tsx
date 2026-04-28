import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Coffee, Store, Zap, ArrowRight } from "lucide-react";
import RecentRooms from "@/components/RecentRooms";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col p-6 items-center justify-center text-center">
      <div className="space-y-6 max-w-sm w-full">
        {/* 로고 및 메인 카피 */}
        <div className="space-y-4">
          <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-orange/10 text-brand-orange mb-4">
            <Coffee className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-brand-brown">
            WDWD
          </h1>
          <p className="text-xl font-bold text-brand-brown/80">
            뭐 마실래?
          </p>
          <p className="text-brand-brown/60 font-medium">
            링크 하나로 음료 주문을 모아보세요.<br />
            카페든 편의점이든, 마실 것만 빠르게!
          </p>
        </div>

        {/* 주요 특징 */}
        <div className="grid grid-cols-1 gap-3 py-6 text-left">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-brown/5">
            <Store className="w-6 h-6 text-brand-orange shrink-0" />
            <span className="font-semibold text-brand-brown">카페, 편의점, 슈퍼 어디든</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-brown/5">
            <Zap className="w-6 h-6 text-brand-mint shrink-0" />
            <span className="font-semibold text-brand-brown">로그인 없이 빠르게 사용 가능</span>
          </div>
        </div>

        {/* 액션 버튼 및 최근 목록 */}
        <div className="space-y-6 pt-4">
          <Link href="/create" className="block">
            <Button size="lg" className="w-full group h-14 text-lg">
              새 주문방 만들기
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <RecentRooms />
        </div>
      </div>
    </main>
  );
}

