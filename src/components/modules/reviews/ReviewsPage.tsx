"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getReviewsAction, updateReviewAction } from "@/actions/catalog.actions";

export default function ReviewsPage() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["reviews"], queryFn: () => getReviewsAction() });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateReviewAction(id, { status }),
    onSuccess: () => {
      toast.success("Review updated");
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });

  const reviews = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Reviews" description="Moderate product reviews from customers." />
      {isLoading ? <p>Loading...</p> : reviews.length === 0 ? (
        <EmptyState title="No reviews yet" description="Customer reviews will appear here for moderation." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.product?.name ?? r.productId}</TableCell>
                <TableCell>{r.rating}/5</TableCell>
                <TableCell className="max-w-xs truncate">{r.comment}</TableCell>
                <TableCell><Badge variant="outline">{r.status}</Badge></TableCell>
                <TableCell className="space-x-2">
                  {r.status === "PENDING" && (
                    <>
                      <Button size="sm" onClick={() => updateMutation.mutate({ id: r.id, status: "APPROVED" })}>Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => updateMutation.mutate({ id: r.id, status: "REJECTED" })}>Reject</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
