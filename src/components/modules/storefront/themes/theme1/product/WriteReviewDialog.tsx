"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPublicReviewAction } from "@/actions/storefront-customer.actions";
import { cn } from "@/lib/utils";

interface WriteReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  storeSlug: string;
  productId: string;
  productName: string;
}

export function WriteReviewDialog({
  open,
  onOpenChange,
  storeSlug,
  productId,
  productName,
}: WriteReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createPublicReviewAction(storeSlug, {
        productId,
        rating,
        comment: comment.trim() || undefined,
        guestName: guestName.trim() || undefined,
        guestEmail: guestEmail.trim() || undefined,
      });
      toast.success("Review submitted for moderation");
      onOpenChange(false);
      setComment("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a review</DialogTitle>
          <p className="text-sm text-muted-foreground">{productName}</p>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRating(n)}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded border text-sm font-semibold",
                    rating === n
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input hover:bg-muted",
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewName">Your name</Label>
            <Input
              id="reviewName"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewEmail">Email (optional)</Label>
            <Input
              id="reviewEmail"
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reviewComment">Comment</Label>
            <Textarea
              id="reviewComment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit review
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
