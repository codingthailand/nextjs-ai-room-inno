"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  RiAddLine,
  RiAlertLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiRefreshLine,
  RiSearchLine,
} from "@remixicon/react";

import {
  productSchema,
  type ProductFormData,
  type ProductFormValues,
} from "@/lib/product-schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Category = { id: number; name: string };

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: number | null;
  categoryName: string | null;
};

type ProductsResponse = {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
};

type ToastType = "success" | "error";
type ToastItem = { id: number; type: ToastType; message: string };

const thb = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 0,
});

function ToastStack({ toasts }: { toasts: ToastItem[] }) {
  if (toasts.length === 0) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 bottom-4 z-[60] flex w-80 flex-col gap-2"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-start gap-2 rounded-sm border px-4 py-3 text-sm font-medium shadow-lg",
            toast.type === "success"
              ? "border-[#22c55e]/40 bg-[#dcfce7] text-[#166534]"
              : "border-destructive/40 bg-destructive/10 text-destructive"
          )}
        >
          {toast.type === "success" ? (
            <RiCheckLine className="mt-0.5 size-4 shrink-0" />
          ) : (
            <RiAlertLine className="mt-0.5 size-4 shrink-0" />
          )}
          <p>{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

function useToasts() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const push = useCallback((type: ToastType, message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);
  return { toasts, push };
}

function useDebouncedValue(value: string, delayMs: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function ProductSheet({
  open,
  onOpenChange,
  product,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSaved: (message: string) => void;
}) {
  const editing = product !== null;
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useForm<ProductFormValues, unknown, ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: editing
      ? {
          name: product.name,
          description: product.description ?? "",
          price: product.price,
          categoryId: product.categoryId ?? undefined,
        }
      : { name: "", description: "", price: undefined, categoryId: undefined },
  });

  useEffect(() => {
    if (!open) return;
    fetch("/api/admin/categories")
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error();
        setCategories(json.categories as Category[]);
        setCategoriesError(false);
      })
      .catch(() => setCategoriesError(true));
  }, [open]);

  async function onSubmit(values: ProductFormData) {
    setSubmitError(null);
    try {
      const res = await fetch(
        editing ? `/api/admin/products/${product.id}` : "/api/admin/products",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        setSubmitError(json?.error ?? "บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
        return;
      }
      onSaved(editing ? "แก้ไขสินค้าเรียบร้อย" : "เพิ่มสินค้าเรียบร้อย");
    } catch {
      setSubmitError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
    }
  }

  const { isSubmitting, errors } = form.formState;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>{editing ? "แก้ไขสินค้า" : "เพิ่มสินค้า"}</SheetTitle>
          <SheetDescription>
            {editing ? `แก้ไขข้อมูล "${product.name}"` : "กรอกข้อมูลสินค้าใหม่ให้ครบถ้วน"}
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
          className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 pb-6"
        >
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="product-name">ชื่อสินค้า</FieldLabel>
              <Input
                id="product-name"
                placeholder="เช่น iPhone 16 Pro"
                aria-invalid={!!errors.name}
                disabled={isSubmitting}
                {...form.register("name")}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="product-description">รายละเอียด</FieldLabel>
              <Textarea
                id="product-description"
                placeholder="รายละเอียดสินค้า (ไม่บังคับ)"
                rows={4}
                disabled={isSubmitting}
                {...form.register("description")}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="product-price">ราคา (บาท)</FieldLabel>
              <Input
                id="product-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="เช่น 45900"
                aria-invalid={!!errors.price}
                disabled={isSubmitting}
                {...form.register("price")}
              />
              {errors.price && <FieldError>{errors.price.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.categoryId}>
              <FieldLabel htmlFor="product-category">หมวดหมู่</FieldLabel>
              {categoriesError ? (
                <p className="text-sm text-destructive">ไม่สามารถโหลดหมวดหมู่ได้</p>
              ) : (
                <Select
                  id="product-category"
                  aria-invalid={!!errors.categoryId}
                  disabled={isSubmitting || categories.length === 0}
                  {...form.register("categoryId")}
                >
                  <option value="">เลือกหมวดหมู่</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              )}
              {errors.categoryId && (
                <FieldError>{errors.categoryId.message}</FieldError>
              )}
            </Field>
          </FieldGroup>

          {submitError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <RiAlertLine className="mt-0.5 size-4 shrink-0" />
              <p>{submitError}</p>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : null}
              {isSubmitting ? "กำลังบันทึก..." : editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </Button>
            <SheetClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                ยกเลิก
              </Button>
            </SheetClose>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function DeleteDialog({
  product,
  onClose,
  onDeleted,
  onError,
}: {
  product: Product | null;
  onClose: () => void;
  onDeleted: () => void;
  onError: (message: string) => void;
}) {
  const [pending, setPending] = useState(false);

  async function confirmDelete() {
    if (!product) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        onError(json?.error ?? "ลบสินค้าไม่สำเร็จ");
        onClose();
        return;
      }
      onDeleted();
    } catch {
      onError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง");
      onClose();
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={product !== null}
      onOpenChange={(open) => {
        if (!open && !pending) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ลบสินค้า</DialogTitle>
          <DialogDescription>
             ต้องการลบสินค้า{" "}
            <span className="font-semibold text-foreground">
              &quot;{product?.name}&quot;
            </span>{" "}
            ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogCancel asChild>
            <Button variant="outline" disabled={pending}>
              ยกเลิก
            </Button>
          </DialogCancel>
          <DialogAction asChild>
            <Button variant="destructive" onClick={confirmDelete} disabled={pending}>
              {pending ? <Spinner /> : null}
              {pending ? "กำลังลบ..." : "ลบสินค้า"}
            </Button>
          </DialogAction>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductsTable({
  products,
  onEdit,
  onDelete,
}: {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>ชื่อสินค้า</TableHead>
          <TableHead>หมวดหมู่</TableHead>
          <TableHead className="text-right">ราคา</TableHead>
          <TableHead className="w-24 text-right">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="text-muted-foreground">{product.id}</TableCell>
            <TableCell>
              <p className="font-medium">{product.name}</p>
              {product.description && (
                <p className="max-w-md truncate text-xs text-muted-foreground">
                  {product.description}
                </p>
              )}
            </TableCell>
            <TableCell>
              <span className="rounded-sm bg-muted px-2 py-1 text-xs text-muted-foreground">
                {product.categoryName ?? "-"}
              </span>
            </TableCell>
            <TableCell className="text-right font-semibold">
              {thb.format(product.price)}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onEdit(product)}
                  aria-label={`แก้ไข ${product.name}`}
                >
                  <RiEditLine />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  onClick={() => onDelete(product)}
                  aria-label={`ลบ ${product.name}`}
                >
                  <RiDeleteBinLine />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default function ProductsClient() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState<Product | null>(null);
  const { toasts, push } = useToasts();

  const debouncedSearch = useDebouncedValue(search, 350);

  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  useEffect(() => {
    let cancelled = false;
    fetch(
      `/api/admin/products?search=${encodeURIComponent(debouncedSearch)}&page=${page}`
    )
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw new Error(json?.error ?? "โหลดข้อมูลไม่สำเร็จ");
        return json as ProductsResponse;
      })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "โหลดข้อมูลไม่สำเร็จ");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, page, refreshKey]);

  const totalPages = data ? Math.max(Math.ceil(data.total / data.pageSize), 1) : 1;

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setFormOpen(true);
  }

  function handleSaved(message: string) {
    setFormOpen(false);
    setEditing(null);
    setRefreshKey((key) => key + 1);
    setLoading(true);
    push("success", message);
  }

  function handleDeleted() {
    setDeleting(null);
    setRefreshKey((key) => key + 1);
    setLoading(true);
    if (data && data.products.length === 1 && page > 1) {
      setPage((current) => current - 1);
    }
    push("success", "ลบสินค้าเรียบร้อย");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">จัดการสินค้า</h1>
          <p className="text-sm text-muted-foreground">เพิ่ม แก้ไข และลบสินค้า</p>
        </div>
        <Button onClick={openCreate}>
          <RiAddLine />
          เพิ่มสินค้า
        </Button>
      </header>

      <Card>
        <CardHeader>
          <div className="relative">
            <RiSearchLine className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setLoading(true);
              }}
              placeholder="ค้นหาสินค้า..."
              aria-label="ค้นหาสินค้า"
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {!data && loading ? (
            <div className="flex justify-center py-10 text-muted-foreground">
              <Spinner className="size-5" />
            </div>
          ) : !data && error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
              <p className="text-sm text-muted-foreground">{error}</p>
              <Button
                size="sm"
                onClick={() => {
                  setRefreshKey((key) => key + 1);
                  setLoading(true);
                }}
              >
                <RiRefreshLine />
                ลองใหม่
              </Button>
            </div>
          ) : data && data.products.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              {debouncedSearch
                ? "ไม่พบสินค้าที่ค้นหา"
                : "ยังไม่มีสินค้าในระบบ กดปุ่ม \"เพิ่มสินค้า\" เพื่อเพิ่ม"}
            </p>
          ) : (
            <>
              <ProductsTable
                products={data?.products ?? []}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
              {loading && (
                <div className="flex justify-center pt-4">
                  <Spinner className="size-4 text-muted-foreground" />
                </div>
              )}
            </>
          )}
        </CardContent>

        {data && data.products.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
            <p className="text-sm text-muted-foreground">
              ทั้งหมด {data.total} รายการ · หน้า {data.page} จาก {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => {
                  setPage((current) => current - 1);
                  setLoading(true);
                }}
              >
                ก่อนหน้า
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((current) => current + 1);
                  setLoading(true);
                }}
              >
                ถัดไป
              </Button>
            </div>
          </div>
        )}
      </Card>

      <ProductSheet
        key={formOpen ? "open" : "closed"}
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSaved={handleSaved}
      />

      <DeleteDialog
        product={deleting}
        onClose={() => setDeleting(null)}
        onDeleted={handleDeleted}
        onError={(message) => push("error", message)}
      />

      <ToastStack toasts={toasts} />
    </main>
  );
}
