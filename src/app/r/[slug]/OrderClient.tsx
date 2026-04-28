"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { X, ShoppingBag, Zap } from "lucide-react";
import { submitOrderAction } from "./actions";

type MenuItem = {
  id: string;
  name: string;
  brand_name: string | null;
  category: string | null;
  price: number | null;
  kcal: number | null;
};

type CartItem = {
  menuItemId?: string;
  name: string;
  brand_name?: string;
  price?: number;
  kcal?: number;
  quantity: number;
  memo: string;
};

export default function OrderClient({ 
  room, 
  initialMenuItems 
}: { 
  room: any; 
  initialMenuItems: MenuItem[] 
}) {
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentOrders, setRecentOrders] = useState<Record<string, CartItem[]>>({});
  const [suggestedCart, setSuggestedCart] = useState<CartItem[] | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("wdwd_recent_orders");
      if (stored) {
        setRecentOrders(JSON.parse(stored));
      }
    } catch (e) {}
  }, []);

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    if (recentOrders[val]) {
      setSuggestedCart(recentOrders[val]);
    } else {
      setSuggestedCart(null);
    }
  };

  const applySuggestedCart = () => {
    if (suggestedCart) {
      setCart(suggestedCart);
      setSuggestedCart(null); // 한 번 추천받으면 숨김
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItemId === item.id);
      if (existing) {
        return prev.map((c) => 
          c.menuItemId === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { 
        menuItemId: item.id, 
        name: item.name,
        brand_name: item.brand_name || undefined,
        price: item.price || undefined,
        kcal: item.kcal || undefined,
        quantity: 1, 
        memo: "" 
      }];
    });
  };

  const setQuantity = (index: number, quantity: number) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].quantity = quantity;
      return newCart;
    });
  };

  const removeCartItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMemo = (index: number, memo: string) => {
    setCart((prev) => {
      const newCart = [...prev];
      newCart[index].memo = memo;
      return newCart;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (cart.length === 0) {
      alert("메뉴를 선택해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitOrderAction({
        roomId: room.id,
        slug: room.slug,
        customerName,
        items: cart,
      });

      if (result?.error) {
        alert(result.error);
        setIsSubmitting(false);
      } else {
        // 성공 시 로컬 스토리지 업데이트
        const updatedRecent = { ...recentOrders, [customerName]: cart };
        localStorage.setItem("wdwd_recent_orders", JSON.stringify(updatedRecent));
        // redirect is handled in action
      }
    } catch (err) {
      alert("주문 처리 중 오류가 발생했습니다.");
      setIsSubmitting(false);
    }
  };

  const isExpired = room.deadline_at && new Date(room.deadline_at) < new Date();
  const isClosed = room.status !== 'open' || isExpired;

  if (isClosed) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
        <div className="w-16 h-16 bg-brand-brown/5 rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">😢</span>
        </div>
        <h2 className="text-xl font-bold text-brand-brown mb-2">주문 마감됨</h2>
        <p className="text-brand-brown/60">다음 기회에 참여해주세요!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 space-y-8 flex-1">
        {/* Name Input */}
        <div className="space-y-2">
          <Label htmlFor="customerName">주문자 이름 <span className="text-brand-orange">*</span></Label>
          <Input 
            id="customerName"
            value={customerName}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="이름을 입력하면 최근 주문이 떠요!"
          />
          {suggestedCart && suggestedCart.length > 0 && cart.length === 0 && (
            <div className="mt-2 bg-brand-orange/10 p-3 rounded-xl border border-brand-orange/20 flex items-center justify-between animate-fade-in">
              <div className="text-sm">
                <p className="font-bold text-brand-orange mb-1">최근 주문한 메뉴가 있어요!</p>
                <p className="text-brand-brown truncate max-w-[180px]">
                  {suggestedCart.map(c => `${c.name} ${c.quantity}개`).join(", ")}
                </p>
              </div>
              <Button size="sm" onClick={applySuggestedCart} className="bg-brand-orange hover:bg-brand-orange/90 whitespace-nowrap">
                <Zap className="w-4 h-4 mr-1" />
                그대로 주문
              </Button>
            </div>
          )}
        </div>

        {/* Menu Selection */}
        <div className="space-y-4">
          <Label>메뉴 선택</Label>
          {initialMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-3">
              {initialMenuItems.map((item) => (
                <Card key={item.id} className="overflow-hidden border-brand-brown/10 shadow-none">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      {item.brand_name && <p className="text-xs text-brand-brown/60 mb-0.5">{item.brand_name}</p>}
                      <p className="font-bold text-brand-brown">{item.name}</p>
                      <div className="flex gap-2 text-xs text-brand-brown/60 mt-1">
                        {item.price && <span>{item.price.toLocaleString()}원</span>}
                        {item.kcal && <span>{item.kcal}kcal</span>}
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => addToCart(item)}
                    >
                      담기
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-sm text-brand-brown/60 bg-brand-brown/5 p-4 rounded-xl text-center">등록된 메뉴가 없습니다.</p>
          )}

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button variant="outline" className="w-full">
              직접 입력하기
            </Button>
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => addToCart({ id: 'random', name: '아무거나', brand_name: null, category: null, price: null, kcal: null })}
            >
              아무거나 사줘 🤷‍♂️
            </Button>
          </div>
        </div>
      </div>

      {/* Cart Area */}
      {cart.length > 0 && (
        <div className="bg-white border-t-2 border-brand-brown/10 p-6 sticky bottom-0 left-0 w-full rounded-t-3xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
          <div className="flex items-center gap-2 mb-4 font-bold text-brand-brown">
            <ShoppingBag className="w-5 h-5" />
            <span>선택한 메뉴</span>
          </div>
          <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
            {cart.map((item, index) => (
              <div key={index} className="flex flex-col gap-2 p-3 bg-brand-cream rounded-xl border border-brand-brown/5">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-sm">{item.name}</span>
                  <button onClick={() => removeCartItem(index)} className="text-brand-brown/40 hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <Input 
                    value={item.memo}
                    onChange={(e) => updateMemo(index, e.target.value)}
                    placeholder="요청사항 (예: 얼음 적게)"
                    className="h-8 text-xs w-1/2"
                  />
                  <div className="flex gap-1">
                    {[1, 2, 3].map((qty) => (
                      <button 
                        key={qty}
                        onClick={() => setQuantity(index, qty)} 
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                          item.quantity === qty 
                            ? 'bg-brand-orange text-white' 
                            : 'bg-white border border-brand-brown/10 text-brand-brown/70 hover:bg-brand-brown/5'
                        }`}
                      >
                        {qty}잔
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Button 
            className="w-full h-12 text-lg font-bold" 
            size="lg" 
            onClick={handleSubmit} 
            disabled={isSubmitting}
          >
            {isSubmitting ? "주문 중..." : "주문하기"}
          </Button>
        </div>
      )}
    </div>
  );
}
