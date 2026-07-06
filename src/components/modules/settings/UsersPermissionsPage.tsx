"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, User } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getShopUsersAction,
  inviteShopUserAction,
  removeShopUserAction,
  revokeShopInvitationAction,
} from "@/actions/shop-users.actions";
import {
  STORE_ACCESS_ROLE_LABELS,
  STORE_MEMBER_ROLE_LABELS,
  ShopUser,
  StoreMemberRole,
} from "@/types/shop-users.types";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: StoreMemberRole[] = ["ADMIN", "STAFF", "VIEWER"];

export default function UsersPermissionsPage() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<StoreMemberRole | "">("");

  const { data, isLoading } = useQuery({
    queryKey: ["shop-users"],
    queryFn: getShopUsersAction,
  });


  const inviteMutation = useMutation({
    mutationFn: inviteShopUserAction,
    onSuccess: (result: { type: string }) => {
      toast.success(
        result?.type === "invitation"
          ? "Invitation sent successfully"
          : "User added to your shop",
      );
      setDialogOpen(false);
      setEmail("");
      setRole("");
      queryClient.invalidateQueries({ queryKey: ["shop-users"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to add user"),
  });

  const removeMutation = useMutation({
    mutationFn: removeShopUserAction,
    onSuccess: () => {
      toast.success("User removed");
      queryClient.invalidateQueries({ queryKey: ["shop-users"] });
    },
    onError: () => toast.error("Failed to remove user"),
  });

  const revokeMutation = useMutation({
    mutationFn: revokeShopInvitationAction,
    onSuccess: () => {
      toast.success("Invitation revoked");
      queryClient.invalidateQueries({ queryKey: ["shop-users"] });
    },
    onError: () => toast.error("Failed to revoke invitation"),
  });

  const canSubmit = email.trim().length > 0 && role !== "";
  const canManage = data?.owner.isCurrentUser ?? false;

  const handleAddUser = () => {
    if (!canSubmit || !role) return;
    inviteMutation.mutate({ email: email.trim(), role });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Users & Permissions"
        action={
          canManage ? (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          {data?.owner && (
            <UserRow user={data.owner} disableRemove />
          )}

          {data?.members.map((member) => (
            <UserRow
              key={member.id}
              user={member}
              canManage={canManage}
              onRemove={() => removeMutation.mutate(member.id)}
              removing={removeMutation.isPending}
            />
          ))}

          {data?.invitations.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between border-t px-4 py-4 sm:px-6"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{invite.email}</p>
                    <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-700">
                      Pending invite
                    </Badge>
                    <RoleBadge role={invite.role} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Invitation expires {new Date(invite.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {canManage ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={() => revokeMutation.mutate(invite.id)}
                  disabled={revokeMutation.isPending}
                >
                  Revoke
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>Add shop users</DialogTitle>
            <DialogDescription>
              Enter an email address. If the user already has an account, they are added immediately.
              Otherwise, an invitation email is sent.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                placeholder="Email or Phone"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Select value={role} onValueChange={(v) => setRole(v as StoreMemberRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {STORE_MEMBER_ROLE_LABELS[opt]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddUser}
              disabled={!canSubmit || inviteMutation.isPending}
            >
              {inviteMutation.isPending ? "Adding..." : "Add user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!canManage && !isLoading && (
        <p className="text-sm text-muted-foreground">
          Only the shop owner can invite or remove users.
        </p>
      )}
    </div>
  );
}

function UserRow({
  user,
  onRemove,
  removing,
  disableRemove,
  canManage,
}: {
  user: ShopUser;
  onRemove?: () => void;
  removing?: boolean;
  disableRemove?: boolean;
  canManage?: boolean;
}) {
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center justify-between border-t px-4 py-4 first:border-t-0 sm:px-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-10 w-10">
          {user.image ? <AvatarImage src={user.image} alt={user.name} /> : null}
          <AvatarFallback>{initials || <User className="h-4 w-4" />}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">
              {user.name}
              {user.isCurrentUser ? " (You)" : ""}
            </p>
            <RoleBadge role={user.role} emphasized={user.role === "OWNER"} />
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {!disableRemove && canManage && onRemove ? (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={onRemove}
          disabled={removing}
        >
          Remove
        </Button>
      ) : (
        <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
          Remove
        </Button>
      )}
    </div>
  );
}

function RoleBadge({
  role,
  emphasized,
}: {
  role: ShopUser["role"];
  emphasized?: boolean;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(
        emphasized
          ? "border-foreground bg-foreground text-background"
          : "border-primary/30 bg-primary/10 text-primary",
      )}
    >
      {STORE_ACCESS_ROLE_LABELS[role]}
    </Badge>
  );
}
