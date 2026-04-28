"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { List, ChevronRight, Clock } from "lucide-react";

type MyRoom = {
  slug: string;
  title: string;
  ownerToken: string;
  createdAt: string;
};

export default function RecentRooms() {
  const [rooms, setRooms] = useState<MyRoom[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wdwd_my_rooms");
    if (stored) {
      setRooms(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  if (!isLoaded || rooms.length === 0) {
    return (
      <Button variant="outline" size="lg" className="w-full text-brand-brown/40" disabled>
        <List className="w-5 h-5 mr-2" />
        최근 만든 주문방이 없습니다
      </Button>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-brand-brown/60 px-1 flex items-center gap-2">
        <Clock className="w-4 h-4" />
        최근 관리 중인 주문방
      </h3>
      <div className="space-y-2">
        {rooms.map((room) => (
          <Link 
            key={room.slug} 
            href={`/r/${room.slug}/admin?key=${room.ownerToken}`}
            className="flex items-center justify-between p-4 bg-white border border-brand-brown/10 rounded-2xl hover:border-brand-orange/30 transition-colors shadow-sm group"
          >
            <div className="flex flex-col text-left overflow-hidden">
              <span className="font-bold text-brand-brown truncate">{room.title}</span>
              <span className="text-xs text-brand-brown/40">
                {new Date(room.createdAt).toLocaleDateString()}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-brown/20 group-hover:text-brand-orange transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
