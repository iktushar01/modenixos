"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createCustomerAction, updateCustomerAction } from "@/actions/catalog.actions";
import { Customer } from "@/types/store.types";

interface CustomerFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: Customer | null;
}

export function CustomerFormDialog({ open, onOpenChange, customer }: CustomerFormDialogProps) {
  const isEdit = Boolean(customer);
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [removeAccount, setRemoveAccount] = useState(false);

  useEffect(() => {
    if (open) {
      setName(customer?.name ?? "");
      setEmail(customer?.email ?? "");
      setPhone(customer?.phone ?? "");
      setPassword("");
      setRemoveAccount(false);
    }
  }, [open, customer]);

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
      };

      if (isEdit && customer) {
        const updatePayload: Parameters<typeof updateCustomerAction>[1] = { ...payload };
        if (password.trim()) updatePayload.password = password.trim();
        if (customer.hasAccount && removeAccount) updatePayload.removeAccount = true;
        return updateCustomerAction(customer.id, updatePayload);
      }

      if (!password.trim()) {
        throw new Error("Password is required for new login accounts");
      }

      return createCustomerAction({
        ...payload,
        password: password.trim(),
      });
    },
    onSuccess: () => {
      toast.success(isEdit ? "Customer updated" : "Login account created");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      if (customer?.id) {
        queryClient.invalidateQueries({ queryKey: ["customer", customer.id] });
      }
      onOpenChange(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit customer" : "Create login account"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update profile details or reset the storefront login password."
              : "Create a storefront account so this shopper can log in, save a wishlist, and leave reviews."}
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Full name</Label>
            <Input
              id="customer-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-email">Email</Label>
            <Input
              id="customer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-phone">Phone (optional)</Label>
            <Input
              id="customer-phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 555 0100"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="customer-password">
              {isEdit ? "New password (optional)" : "Password"}
            </Label>
            <Input
              id="customer-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEdit ? "Leave blank to keep current password" : "Minimum 6 characters"}
              minLength={isEdit ? undefined : 6}
              disabled={isEdit && removeAccount}
            />
          </div>
          {isEdit && customer?.hasAccount && (
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5 pr-4">
                <Label htmlFor="remove-account">Disable login</Label>
                <p className="text-xs text-muted-foreground">
                  Removes storefront login access. Order history is kept.
                </p>
              </div>
              <Switch
                id="remove-account"
                checked={removeAccount}
                onCheckedChange={(checked) => {
                  setRemoveAccount(checked);
                  if (checked) setPassword("");
                }}
              />
            </div>
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending || !name.trim() || !email.trim() || (!isEdit && password.trim().length < 6)}
          >
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEdit ? "Save changes" : "Create account"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
