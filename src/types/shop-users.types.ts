export type StoreMemberRole = "ADMIN" | "STAFF" | "VIEWER";
export type StoreAccessRole = "OWNER" | StoreMemberRole;

export interface ShopUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  image?: string | null;
  role: StoreAccessRole;
  isCurrentUser: boolean;
  createdAt?: string;
}

export interface ShopInvitation {
  id: string;
  email: string;
  role: StoreMemberRole;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface ShopUsersData {
  owner: ShopUser;
  members: ShopUser[];
  invitations: ShopInvitation[];
}

export const STORE_MEMBER_ROLE_LABELS: Record<StoreMemberRole, string> = {
  ADMIN: "Shop Admin",
  STAFF: "Staff",
  VIEWER: "Viewer",
};

export const STORE_ACCESS_ROLE_LABELS: Record<StoreAccessRole, string> = {
  OWNER: "Shop Owner",
  ADMIN: "Shop Admin",
  STAFF: "Staff",
  VIEWER: "Viewer",
};
