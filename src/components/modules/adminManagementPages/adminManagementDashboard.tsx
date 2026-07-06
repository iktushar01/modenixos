"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getAdminStoresAction, getAdminUsersAction, getAdminAnalyticsAction, suspendStoreAction } from "@/actions/catalog.actions";

export default function AdminManagementDashboard() {
  const queryClient = useQueryClient();
  const { data: analytics } = useQuery({ queryKey: ["admin-analytics"], queryFn: getAdminAnalyticsAction });
  const { data: storesRes } = useQuery({ queryKey: ["admin-stores"], queryFn: () => getAdminStoresAction() });
  const { data: usersRes } = useQuery({ queryKey: ["admin-users"], queryFn: () => getAdminUsersAction() });

  const suspendMutation = useMutation({
    mutationFn: ({ id, isSuspended }: { id: string; isSuspended: boolean }) => suspendStoreAction(id, isSuspended),
    onSuccess: () => {
      toast.success("Store updated");
      queryClient.invalidateQueries({ queryKey: ["admin-stores"] });
    },
  });

  const stores = (storesRes?.data ?? []) as Array<{
    id: string; brandName: string; slug: string; plan: string; isSuspended: boolean; isPublished: boolean;
    mrr?: number; subscriptionStatus?: string;
    owner: { name: string; email: string }; _count: { products: number; orders: number };
  }>;
  const users = (usersRes?.data ?? []) as Array<{ id: string; name: string; email: string; role: string; store?: { brandName: string } | null }>;

  return (
    <div className="space-y-8">
      <PageHeader title="Platform Management" description="Manage all stores and users on ModenixOS." />
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Stores", value: analytics?.stores ?? 0 },
          { label: "Users", value: analytics?.users ?? 0 },
          { label: "Orders", value: analytics?.orders ?? 0 },
          { label: "MRR", value: `$${(analytics?.mrr ?? 0).toFixed(0)}` },
          { label: "Commission", value: `$${(analytics?.totalCommission ?? 0).toFixed(2)}` },
        ].map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm">{s.label}</CardTitle></CardHeader>
            <CardContent><div className="text-2xl font-bold">{s.value}</div></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>All Stores</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Brand</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.map((store) => (
                <TableRow key={store.id}>
                  <TableCell>{store.brandName}</TableCell>
                  <TableCell>{store.owner.email}</TableCell>
                  <TableCell><Badge variant="outline">{store.plan}</Badge></TableCell>
                  <TableCell>{store._count.products}</TableCell>
                  <TableCell>
                    {store.isSuspended ? <Badge variant="destructive">Suspended</Badge> : <Badge variant="outline">Active</Badge>}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant={store.isSuspended ? "default" : "destructive"}
                      onClick={() => suspendMutation.mutate({ id: store.id, isSuspended: !store.isSuspended })}
                    >
                      {store.isSuspended ? "Unsuspend" : "Suspend"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>All Users</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Store</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                  <TableCell>{user.store?.brandName ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
