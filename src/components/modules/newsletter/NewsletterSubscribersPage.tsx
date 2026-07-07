"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { NewsletterNav } from "./NewsletterNav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  deleteNewsletterSubscriberAction,
  getNewsletterSubscribersAction,
  NewsletterSubscriber,
} from "@/actions/newsletter.actions";

function statusClass(status: NewsletterSubscriber["status"]) {
  switch (status) {
    case "ACTIVE":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700";
    case "PENDING":
      return "border-amber-500/30 bg-amber-500/10 text-amber-700";
    case "UNSUBSCRIBED":
      return "border-red-500/30 bg-red-500/10 text-red-700";
    default:
      return "";
  }
}

export default function NewsletterSubscribersPage() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["newsletter-subscribers", search],
    queryFn: () => getNewsletterSubscribersAction({ searchTerm: search || undefined, limit: 50 }),
  });

  const subscribers = data?.data ?? [];

  const removeMutation = useMutation({
    mutationFn: deleteNewsletterSubscriberAction,
    onSuccess: () => {
      toast.success("Subscriber removed");
      queryClient.invalidateQueries({ queryKey: ["newsletter-subscribers"] });
      queryClient.invalidateQueries({ queryKey: ["newsletter-stats"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return (
    <div className="dashboard-page pb-24 sm:pb-0">
      <NewsletterNav />
      <PageHeader eyebrow="Marketing" title="Subscribers" description="Everyone subscribed to your store newsletter." />

      <div className="mb-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email"
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full rounded-xl" />
      ) : (
        <div className="dashboard-panel overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                    No subscribers yet. Share your store and encourage sign-ups from the homepage or footer.
                  </TableCell>
                </TableRow>
              ) : (
                subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusClass(subscriber.status)}>
                        {subscriber.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="capitalize">{subscriber.source}</TableCell>
                    <TableCell>{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeMutation.mutate(subscriber.id)}
                        aria-label="Remove subscriber"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
