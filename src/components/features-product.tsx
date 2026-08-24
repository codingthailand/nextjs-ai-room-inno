/* eslint-disable @typescript-eslint/no-explicit-any */
import CartButton from "@/app/(front)/components/CartButton";
import ProductImage from "@/app/(front)/components/ProductImage";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { MapPin, Store } from "lucide-react";

type Props = {
  products: any[]
}

const SELLER = {
  name: "ทีม COSCI",
  location: "กรุงเทพฯ ประเทศไทย",
  bio: "ผู้พัฒนาและนักออกแบบที่ใส่ใจทุกรายละเอียด",
};

const FeaturesProduct = ({ products }: Props) => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-[0.09em] text-primary">
          สินค้าทั้งหมด
        </p>
        <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight tracking-[0.005em] sm:text-5xl">
          ชิ้นงานจากฝีมือผู้สร้าง
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          สินค้าดิจิทัลและซอฟต์แวร์ทุกชิ้นมาพร้อมเรื่องราวของผู้สร้าง
          พร้อมอัปเดตทันทีหลังชำระเงิน
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="gap-0 py-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden border-b border-border bg-muted">
              <ProductImage
                alt={product.name ?? ""}
                src={
                  product.product_images?.[0]
                    ? `/product-image/${product.product_images[0].image_name}`
                    : null
                }
              />
            </div>

            <CardContent className="flex flex-col gap-4 px-5 py-5">
              <div className="flex flex-wrap gap-2">
                <Badge variant="tertiary" className="text-[11px] font-bold uppercase tracking-[0.09em]">
                  สินค้าดิจิทัล
                </Badge>
                <Badge variant="secondary" className="text-[11px] font-bold uppercase tracking-[0.09em]">
                  Instant Delivery
                </Badge>
              </div>

              <div>
                <h3 className="font-heading text-xl font-semibold leading-snug">
                  {product.name}
                </h3>
                <p className="mt-1 font-mono text-sm text-muted-foreground">
                  #สินค้า {product.id}
                </p>
              </div>

              <p className="font-heading text-2xl font-semibold text-primary">
                {Number(product.price).toLocaleString("th-TH")} บาท
              </p>

              <div className="flex items-center gap-3 border-t border-border pt-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-border-strong bg-warm text-primary">
                  <Store className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {SELLER.name}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {SELLER.location}
                  </p>
                </div>
              </div>

              <CartButton product={product} />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FeaturesProduct;
