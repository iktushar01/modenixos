"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  Globe,
  Mail,
  MapPin,
  Phone,
  Plus,
  Search,
  Store,
  Trash2,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createDashboardOrderAction,
  getProductsAction,
} from "@/actions/catalog.actions";
import { useMyStore } from "@/hooks/useMyStore";
import { formatPrice } from "@/lib/currency";
import { ORDER_STATUS_OPTIONS } from "@/lib/orders";
import { Product } from "@/types/store.types";
import { cn } from "@/lib/utils";

type LineItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export default function CreateOrderPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: store } = useMyStore();
  const currency = store?.currency ?? "USD";


  const [orderType, setOrderType] = useState<"in_shop" | "online">("in_shop");
  const [status, setStatus] = useState("DELIVERED");
  const [items, setItems] = useState<LineItem[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [taxPercent, setTaxPercent] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState<"full" | "partial">("full");
  const [paidAmount, setPaidAmount] = useState(0);
  const [orderNote, setOrderNote] = useState("");
  const [markFraud, setMarkFraud] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const { data: productsRes } = useQuery({
    queryKey: ["products-picker", productSearch],
    queryFn: () =>
      getProductsAction({
        limit: "20",
        status: "ACTIVE",
        ...(productSearch.trim() ? { searchTerm: productSearch.trim() } : {}),
      }),
    enabled: pickerOpen,
  });

  const products = productsRes?.data ?? [];

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const computedDiscount = useMemo(() => {
    if (discountAmount > 0) return discountAmount;
    if (discountPercent > 0) return (subtotal * discountPercent) / 100;
    return 0;
  }, [discountAmount, discountPercent, subtotal]);

  const computedTax = useMemo(() => {
    if (taxAmount > 0) return taxAmount;
    if (taxPercent > 0) return ((subtotal - computedDiscount) * taxPercent) / 100;
    return 0;
  }, [taxAmount, taxPercent, subtotal, computedDiscount]);

  const grandTotal = Math.max(0, subtotal - computedDiscount + computedTax + deliveryCharge);

  const createMutation = useMutation({
    mutationFn: createDashboardOrderAction,
    onSuccess: () => {
      toast.success("Order created successfully");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-stats"] });
      router.push("/dashboard/orders");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create order"),
  });

  const addProduct = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.discountPrice ?? product.price,
          quantity: 1,
          image: product.images[0],
        },
      ];
    });
    setPickerOpen(false);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity } : i)));
  };

  const handleCreate = () => {
    if (!store?.slug) {
      toast.error("Store not loaded");
      return;
    }
    if (!customer.name.trim() || !customer.email.trim()) {
      toast.error("Customer name and email are required");
      return;
    }
    if (items.length === 0) {
      toast.error("Add at least one product");
      return;
    }

    createMutation.mutate({
      slug: store.slug,
      status,
      items,
      customerName: customer.name.trim(),
      customerEmail: customer.email.trim(),
      customerPhone: customer.phone.trim() || undefined,
      shippingAddress: {
        line1: customer.address.trim() || "In-store pickup",
        city: orderType === "in_shop" ? "In shop" : "Online",
        postalCode: "00000",
        country: store.country || "US",
      },
      subtotal,
      shipping: deliveryCharge,
      discount: computedDiscount,
      total: grandTotal,
      paymentMethod: paymentStatus === "full" ? "PAID" : "PARTIAL",
      orderNote: orderNote.trim() || undefined,
      paidAmount: paymentStatus === "partial" ? paidAmount : grandTotal,
      markFraud,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">Create Order</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" asChild>
            <Link href="/dashboard/orders">Cancel</Link>
          </Button>
          <Button onClick={handleCreate} disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <SectionCard title="Products">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-medium">No Products Added</p>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Start building this order by adding products from your inventory.
                </p>
                <Button className="mt-4" onClick={() => setPickerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs">
                        N/A
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price, currency)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                        className="h-8 w-16"
                      />
                      <span className="w-20 text-right text-sm font-medium">
                        {formatPrice(item.price * item.quantity, currency)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => updateQuantity(item.productId, 0)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setPickerOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Order Summary">
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryField label="Discount">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Percentage</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        value={discountPercent || ""}
                        onChange={(e) => {
                          setDiscountPercent(Number(e.target.value) || 0);
                          setDiscountAmount(0);
                        }}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {currency}
                      </span>
                      <Input
                        type="number"
                        min={0}
                        value={discountAmount || ""}
                        onChange={(e) => {
                          setDiscountAmount(Number(e.target.value) || 0);
                          setDiscountPercent(0);
                        }}
                        className="pl-12"
                      />
                    </div>
                  </div>
                </div>
              </SummaryField>

              <SummaryField label="VAT / Tax">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Percentage</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        min={0}
                        value={taxPercent || ""}
                        onChange={(e) => {
                          setTaxPercent(Number(e.target.value) || 0);
                          setTaxAmount(0);
                        }}
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {currency}
                      </span>
                      <Input
                        type="number"
                        min={0}
                        value={taxAmount || ""}
                        onChange={(e) => {
                          setTaxAmount(Number(e.target.value) || 0);
                          setTaxPercent(0);
                        }}
                        className="pl-12"
                      />
                    </div>
                  </div>
                </div>
              </SummaryField>

              <SummaryField label="Delivery">
                <div className="space-y-2">
                  <Select defaultValue="default">
                    <SelectTrigger>
                      <SelectValue placeholder="Select zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default zone</SelectItem>
                      <SelectItem value="inside">Inside city</SelectItem>
                      <SelectItem value="outside">Outside city</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {currency}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={deliveryCharge || ""}
                      onChange={(e) => setDeliveryCharge(Number(e.target.value) || 0)}
                      className="pl-12"
                    />
                  </div>
                </div>
              </SummaryField>

              <SummaryField label="Payment">
                <div className="space-y-2">
                  <div className="flex rounded-lg border p-1">
                    {(["full", "partial"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPaymentStatus(type)}
                        className={cn(
                          "flex-1 rounded-md px-3 py-1.5 text-sm transition-colors",
                          paymentStatus === type
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {type === "full" ? "Fully Paid" : "Partial"}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                      {currency}
                    </span>
                    <Input
                      type="number"
                      min={0}
                      value={paymentStatus === "full" ? grandTotal : paidAmount || ""}
                      onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                      disabled={paymentStatus === "full"}
                      className="pl-12"
                    />
                  </div>
                </div>
              </SummaryField>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="rounded-lg bg-primary/5 px-6 py-4 text-right">
                <p className="text-sm text-muted-foreground">Grand Total</p>
                <p className="text-2xl font-bold text-primary">
                  {formatPrice(grandTotal, currency)}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Add Note">
            <div className="space-y-2">
              <Label htmlFor="order-note">Order Note</Label>
              <Textarea
                id="order-note"
                placeholder="Add any notes for this order..."
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                rows={4}
              />
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Order Information">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Order Type</Label>
                <div className="flex rounded-lg border p-1">
                  {([
                    { value: "in_shop" as const, label: "In shop", icon: Store },
                    { value: "online" as const, label: "Online", icon: Globe },
                  ]).map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setOrderType(value)}
                      className={cn(
                        "flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                        orderType === value
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Order Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Customer Information">
            <div className="space-y-3">
              <IconInput
                icon={User}
                placeholder="Enter customer name"
                value={customer.name}
                onChange={(v) => setCustomer((c) => ({ ...c, name: v }))}
              />
              <IconInput
                icon={Mail}
                type="email"
                placeholder="Enter customer email"
                value={customer.email}
                onChange={(v) => setCustomer((c) => ({ ...c, email: v }))}
              />
              <IconInput
                icon={Phone}
                placeholder="Enter customer phone"
                value={customer.phone}
                onChange={(v) => setCustomer((c) => ({ ...c, phone: v }))}
              />
              <IconInput
                icon={MapPin}
                placeholder="Enter customer address"
                value={customer.address}
                onChange={(v) => setCustomer((c) => ({ ...c, address: v }))}
              />

              <div className="rounded-lg bg-primary/5 p-4">
                <Button variant="outline" className="w-full border-primary/30 text-primary" disabled>
                  <Search className="mr-2 h-4 w-4" />
                  Check Customer Validity
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  To check customer validity, set up a delivery provider or add courier credentials in
                  Delivery Support.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Mark as fraud?</p>
                  <p className="text-xs text-muted-foreground">
                    Flag this customer based on their behavior for future order safety.
                  </p>
                </div>
                <Switch checked={markFraud} onCheckedChange={setMarkFraud} />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Add product</DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="space-y-2">
            {products.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No products found</p>
            ) : (
              products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => addProduct(product)}
                  className="flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                >
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs">
                      N/A
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock} · {formatPrice(product.discountPrice ?? product.price, currency)}
                    </p>
                  </div>
                  <Plus className="h-4 w-4 shrink-0 text-primary" />
                </button>
              ))
            )}
          </div>
          </DialogBody>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Accordion type="single" collapsible defaultValue="open" className="rounded-xl border bg-card">
      <AccordionItem value="open" className="border-0">
        <AccordionTrigger className="px-4 py-3 hover:no-underline [&>svg]:hidden">
          <span className="font-semibold">{title}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function SummaryField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2 rounded-lg border p-3">
      <p className="text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

function IconInput({
  icon: Icon,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  icon: React.ComponentType<{ className?: string }>;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-9"
      />
    </div>
  );
}
