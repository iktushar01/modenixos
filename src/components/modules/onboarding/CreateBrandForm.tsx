"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createStoreAction } from "@/actions/store.actions";
import { APP_NAME } from "@/lib/app-config";

const schema = z.object({
  brandName: z.string().min(2, "Brand name is required"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
  country: z.string().min(2),
  currency: z.string().length(3),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const slugify = (text: string) =>
  text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-");

export default function CreateBrandForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { currency: "USD" },
  });

  const brandName = watch("brandName");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createStoreAction(data);
      toast.success("Brand created successfully!");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Failed to create brand. Slug may already be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <CardTitle>Create your brand</CardTitle>
        <CardDescription>Welcome to {APP_NAME}. Set up your fashion brand to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              {...register("brandName")}
              onChange={(e) => {
                register("brandName").onChange(e);
                if (brandName === undefined || !watch("slug")) {
                  setValue("slug", slugify(e.target.value));
                }
              }}
            />
            {errors.brandName && <p className="text-sm text-destructive">{errors.brandName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Store URL Slug</Label>
            <Input id="slug" {...register("slug")} placeholder="my-brand" />
            {errors.slug && <p className="text-sm text-destructive">{errors.slug.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} placeholder="United States" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" {...register("currency")} placeholder="USD" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} rows={3} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Brand"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
