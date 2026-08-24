"use client"

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCartStore } from "@/lib/cart-store";
import { ShoppingBasket, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CartList() {
  const router = useRouter();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalPrice = useCartStore((state) => state.totalPrice());

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <div className="flex size-14 items-center justify-center rounded-full border border-border-strong bg-warm text-primary">
          <ShoppingBasket className="size-6" />
        </div>
        <h1 className="mt-6 font-heading text-3xl font-semibold">ตะกร้าสินค้าว่างเปล่า</h1>
        <p className="mt-3 text-muted-foreground">
          ยังไม่มีสินค้าในตะกร้า ลองเลือกชิ้นงานที่ชื่นชอบจากผู้สร้างของเราก่อน
        </p>
        <Button className="mt-8" onClick={() => router.replace("/product")}>
          ไปช้อปสินค้า
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.09em] text-primary">
          รายการสั่งซื้อ
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold sm:text-4xl">
          ตะกร้าสินค้า
        </h1>
      </div>

      <div className="mt-8 overflow-hidden rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-warm hover:bg-warm">
              <TableHead className="text-xs font-bold uppercase tracking-[0.08em]">รหัสสินค้า</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-[0.08em]">ชื่อสินค้า</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-[0.08em]">ราคา</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-[0.08em]">จำนวน</TableHead>
              <TableHead className="text-xs font-bold uppercase tracking-[0.08em]">รวม</TableHead>
              <TableHead className="text-right text-xs font-bold uppercase tracking-[0.08em]">เครื่องมือ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((i) => (
              <TableRow key={i.productId}>
                <TableCell>
                  <Badge variant="outline" className="font-mono text-xs">
                    {i.productId}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {Number(i.price).toLocaleString("th-TH")} บาท
                </TableCell>
                <TableCell>{i.qty}</TableCell>
                <TableCell className="font-semibold text-primary">
                  {(i.price * i.qty).toLocaleString("th-TH")} บาท
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    aria-label={`ลบ ${i.name}`}
                    onClick={() => removeItem(i.productId)}
                  >
                    <Trash className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-6 flex flex-col items-end gap-4 border-t border-border pt-6">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">รวมทั้งหมด</p>
          <div className="font-heading text-3xl font-semibold text-foreground">
            {totalPrice.toLocaleString("th-TH")} <span className="text-lg text-muted-foreground">บาท</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={clearCart}>
            ลบสินค้าทั้งหมด
          </Button>
          <Button
            onClick={() => {
              clearCart();
              router.replace("/product");
            }}
          >
            ยืนยันการสั่งซื้อ
          </Button>
        </div>
      </div>
    </div>
  );
}
