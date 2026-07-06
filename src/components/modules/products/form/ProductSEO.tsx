"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProductSEOProps {
  metaTitle: string;
  metaDescription: string;
  onMetaTitleChange: (value: string) => void;
  onMetaDescriptionChange: (value: string) => void;
}

export function ProductSEO({
  metaTitle,
  metaDescription,
  onMetaTitleChange,
  onMetaDescriptionChange,
}: ProductSEOProps) {
  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle>SEO</CardTitle>
        <CardDescription>Search engine metadata for this product page.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="metaTitle">Meta title</Label>
          <Input
            id="metaTitle"
            value={metaTitle}
            onChange={(e) => onMetaTitleChange(e.target.value)}
            placeholder="Defaults to product name if empty"
            maxLength={200}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="metaDescription">Meta description</Label>
          <Textarea
            id="metaDescription"
            rows={3}
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="Brief description for search results"
            maxLength={500}
          />
        </div>
      </CardContent>
    </Card>
  );
}
