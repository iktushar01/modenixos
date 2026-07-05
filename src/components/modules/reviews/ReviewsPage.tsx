"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  getReviewsAction,
  updateReviewAction,
  deleteReviewAction,
} from "@/actions/catalog.actions";
import { Review } from "@/types/store.types";

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["reviews"], queryFn: () => getReviewsAction() });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateReviewAction(id, { status }),
    onSuccess: () => {
      toast.success("Review updated");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => toast.error("Failed to update review"),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ id, productId }: { id: string; productId: string }) =>
      deleteReviewAction(id, productId),
    onSuccess: () => {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: () => toast.error("Failed to delete review"),
  });

  const reviews = (data?.data ?? []) as Review[];

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate product reviews from customers." />
      {isLoading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Customer reviews will appear here for moderation." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="max-w-[160px] truncate">
                  {r.product?.name ?? r.productId}
                </TableCell>
                <TableCell>{r.guestName ?? "—"}</TableCell>
                <TableCell>{r.rating}/5</TableCell>
                <TableCell className="max-w-xs truncate">{r.comment ?? "—"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      r.status === "APPROVED"
                        ? "default"
                        : r.status === "REJECTED"
                          ? "destructive"
                          : "outline"
                    }
                  >
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="space-x-2 text-right">
                  {r.status === "PENDING" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateMutation.mutate({ id: r.id, status: "APPROVED" })}
                        disabled={updateMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateMutation.mutate({ id: r.id, status: "REJECTED" })}
                        disabled={updateMutation.isPending}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {r.status === "APPROVED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMutation.mutate({ id: r.id, status: "REJECTED" })}
                      disabled={updateMutation.isPending}
                    >
                      Unpublish
                    </Button>
                  )}
                  {r.status === "REJECTED" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateMutation.mutate({ id: r.id, status: "APPROVED" })}
                      disabled={updateMutation.isPending}
                    >
                      Approve
                    </Button>
                  )}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive" disabled={deleteMutation.isPending}>
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this review?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the review from your store and the product page.
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            deleteMutation.mutate({ id: r.id, productId: r.productId })
                          }
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
