"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Copy, Share, AlertCircle, RefreshCw } from "lucide-react";
import { toggleRoomStatusAction } from "./actions";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  item_name: string;
  quantity: number;
  price?: number | null;
  option_text?: string | null;
};

type Order = {
  id: string;
  customer_name: string;
  order_items: OrderItem[];
};

type Room = {
  id: string;
  slug: string;
  title: string;
  status: string;
  store_name?: string | null;
};

export default function AdminClient({ room, orders, ownerToken }: { room: Room, orders: Order[], ownerToken: string }) {
  const [activeTab, setActiveTab] = useState<"users" | "menus">("users");
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const router = useRouter();

  // 내가 만든 방 목록 저장 (최근 만든 주문방 보기 기능용)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wdwd_my_rooms");
      const myRooms = stored ? JSON.parse(stored) : [];
      
      // 이미 목록에 있는지 확인
      const exists = myRooms.some((r: { slug: string }) => r.slug === room.slug);
      if (!exists) {
        const newRoom = {
          slug: room.slug,
          title: room.title,
          ownerToken: ownerToken,
          createdAt: new Date().toISOString()
        };
        // 최신순으로 정렬하기 위해 앞에 추가하고 최대 5개까지만 유지
        const updatedRooms = [newRoom, ...myRooms].slice(0, 5);
        localStorage.setItem("wdwd_my_rooms", JSON.stringify(updatedRooms));
      }
    } catch (e) {
      console.error("Failed to save room to local storage", e);
    }
  }, [room.slug, room.title, ownerToken]);

  // Group by menu
  const menuCounts: Record<string, number> = {};
  let totalQuantity = 0;
  let totalPrice = 0;

  orders.forEach(o => {
    o.order_items.forEach(item => {
      const key = item.item_name;
      menuCounts[key] = (menuCounts[key] || 0) + item.quantity;
      totalQuantity += item.quantity;
      if (item.price) {
        totalPrice += (item.price * item.quantity);
      }
    });
  });

  const handleCopyText = () => {
    let text = "";
    orders.forEach(o => {
      text += `${o.customer_name} - `;
      const itemsText = o.order_items.map(item => {
        let str = `${item.item_name} ${item.quantity}`;
        if (item.option_text) str += ` (${item.option_text})`;
        return str;
      }).join(", ");
      text += itemsText + "\n";
    });
    
    text += `\n총 ${orders.length}명 / ${totalQuantity}개`;
    if (totalPrice > 0) {
      text += ` / ${totalPrice.toLocaleString()}원`;
    }

    navigator.clipboard.writeText(text).then(() => {
      alert("카톡용 텍스트가 복사되었습니다. 카톡에 바로 붙여넣기 하세요!");
    }).catch(err => {
      console.error("복사 실패", err);
      alert("복사에 실패했습니다.");
    });
  };

  const handleRecreate = () => {
    const params = new URLSearchParams({
      title: room.title || "",
      storeName: room.store_name || "",
    });
    router.push(`/create?${params.toString()}`);
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/r/${room.slug}`;
    navigator.clipboard.writeText(url).then(() => {
      alert("공유 링크가 복사되었습니다.");
    });
  };

  const toggleStatus = async () => {
    setIsChangingStatus(true);
    const newStatus = room.status === "open" ? "closed" : "open";
    const res = await toggleRoomStatusAction(room.id, ownerToken, room.slug, newStatus);
    if (res.error) {
      alert(res.error);
    }
    setIsChangingStatus(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white px-6 py-4 border-b border-brand-brown/10 sticky top-0 z-10 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-brand-brown">관리자 화면</h1>
            <p className="text-sm text-brand-brown/60 truncate max-w-[200px]">{room.title}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopyLink} className="h-9 px-3">
              <Share className="w-4 h-4 mr-1" />
              링크 공유
            </Button>
            <Button size="sm" variant={room.status === 'open' ? 'danger' : 'secondary'} onClick={toggleStatus} disabled={isChangingStatus} className="h-9">
              {room.status === 'open' ? '주문 마감' : '다시 열기'}
            </Button>
          </div>
        </div>
        
        {/* 다시 만들기 버튼 (핵심 기능) */}
        <Button onClick={handleRecreate} className="w-full font-bold h-12 text-md" variant="secondary">
          <RefreshCw className="w-5 h-5 mr-2" />
          어제꺼 그대로 다시 만들기
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-2 mb-6 bg-brand-brown/5 p-1 rounded-xl">
          <button
            className={`py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'users' ? 'bg-white shadow-sm text-brand-brown' : 'text-brand-brown/50'}`}
            onClick={() => setActiveTab('users')}
          >
            주문자별 보기
          </button>
          <button
            className={`py-2 text-sm font-bold rounded-lg transition-colors ${activeTab === 'menus' ? 'bg-white shadow-sm text-brand-brown' : 'text-brand-brown/50'}`}
            onClick={() => setActiveTab('menus')}
          >
            메뉴별 집계
          </button>
        </div>

        {/* Tab Content */}
        {orders.length === 0 ? (
          <div className="text-center py-12 text-brand-brown/40">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>아직 들어온 주문이 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'users' && orders.map(order => (
              <div key={order.id} className="bg-white p-4 rounded-2xl border border-brand-brown/10 shadow-sm">
                <div className="flex justify-between items-center mb-3 pb-3 border-b border-brand-brown/5">
                  <span className="font-bold text-lg">{order.customer_name}</span>
                </div>
                <ul className="space-y-2">
                  {order.order_items.map(item => (
                    <li key={item.id} className="flex flex-col text-sm">
                      <div className="flex justify-between">
                        <span>{item.item_name} x {item.quantity}</span>
                        {item.price && <span className="text-brand-brown/60">{(item.price * item.quantity).toLocaleString()}원</span>}
                      </div>
                      {item.option_text && <span className="text-xs text-brand-orange mt-1">↳ {item.option_text}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {activeTab === 'menus' && (
              <div className="bg-white p-4 rounded-2xl border border-brand-brown/10 shadow-sm">
                <ul className="space-y-3 divide-y divide-brand-brown/5">
                  {Object.entries(menuCounts).map(([menuName, count], idx) => (
                    <li key={idx} className="flex justify-between pt-3 first:pt-0">
                      <span className="font-medium">{menuName}</span>
                      <span className="font-bold text-brand-orange">{count}개</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Summary Footer Area */}
        {orders.length > 0 && (
          <div className="mt-8 bg-brand-orange/10 p-5 rounded-2xl border border-brand-orange/20">
            <h3 className="font-bold text-brand-brown mb-3">총 주문 요약</h3>
            <div className="flex justify-between text-sm mb-1">
              <span>참여 인원</span>
              <span className="font-bold">{orders.length}명</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span>총 주문 개수</span>
              <span className="font-bold">{totalQuantity}개</span>
            </div>
            <div className="flex justify-between text-sm mt-3 pt-3 border-t border-brand-orange/20">
              <span className="font-bold">총 예상 금액</span>
              <span className="font-bold text-lg text-brand-orange">{totalPrice.toLocaleString()}원</span>
            </div>
            <Button className="w-full mt-4 bg-[#FEE500] text-[#000000] hover:bg-[#FEE500]/90" onClick={handleCopyText}>
              <Copy className="w-4 h-4 mr-2" />
              카톡에 복사
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
