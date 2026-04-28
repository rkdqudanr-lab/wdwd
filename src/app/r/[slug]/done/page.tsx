import { supabaseServer } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default async function OrderDonePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order: string }>;
}) {
  const { slug } = await params;
  const { order: orderToken } = await searchParams;

  if (!orderToken) {
    notFound();
  }

  // Fetch order details
  const { data: order, error } = await supabaseServer
    .from("orders")
    .select(`
      *,
      order_items (*)
    `)
    .eq("order_token", orderToken)
    .single();

  if (error || !order) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen p-6 items-center justify-center text-center">
      <div className="w-20 h-20 bg-brand-mint/10 text-brand-mint rounded-full flex items-center justify-center mb-6 mx-auto">
        <CheckCircle2 className="w-10 h-10" />
      </div>
      
      <h1 className="text-2xl font-bold text-brand-brown mb-2">주문이 완료되었습니다!</h1>
      <p className="text-brand-brown/60 mb-8">{order.customer_name}님의 주문이 정상적으로 접수되었습니다.</p>

      <div className="w-full bg-brand-cream rounded-2xl p-6 mb-8 text-left border border-brand-brown/10">
        <h2 className="font-semibold text-brand-brown mb-4">주문 내역</h2>
        <ul className="space-y-3">
          {order.order_items.map((item: { id: string; item_name: string; quantity: number; option_text?: string | null; price?: number | null }) => (
            <li key={item.id} className="flex justify-between items-start text-sm">
              <div>
                <p className="font-medium">{item.item_name} <span className="text-brand-brown/60 font-normal">x{item.quantity}</span></p>
                {item.option_text && <p className="text-xs text-brand-brown/60 mt-0.5">요청사항: {item.option_text}</p>}
              </div>
              {item.price && <span className="font-medium text-brand-brown/80">{(item.price * item.quantity).toLocaleString()}원</span>}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-3 w-full">
        <Link href={`/r/${slug}/edit/${orderToken}`} className="block">
          <Button variant="outline" className="w-full">
            내 주문 수정하기 (준비 중)
          </Button>
        </Link>
        <Link href={`/r/${slug}`} className="block">
          <Button className="w-full group">
            다른 사람 주문하러 가기
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
