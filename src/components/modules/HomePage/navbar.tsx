"use client";

import { syncAuthUserAction } from "@/actions/authActions/_syncAuthUserAction";
import Link from "next/link";
import { ModeToggle } from "@/components/shared/modeToggle";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Menu, LogOut, User, Loader2, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { logoutAction } from "./_logoutAction";
import { getCookie, deleteCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Logo from "@/components/shared/logo/logo";
import type { UserFromCookie } from "@/types/auth.types";
import { APP_NAME } from "@/lib/app-config";

const navLinks = [
  { href: "/#product-tour", label: "Product" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

const utilityLinks = [
  { href: "/login", label: "Log In" },
  { href: "/register", label: "Sign Up" },
  { href: "/store/luxe-threads", label: "Demo store" },
];

const Navbar = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState<UserFromCookie | null>(() => {
    const userCookie = getCookie("user");
    if (!userCookie) return null;

    try {
      return JSON.parse(userCookie as string) as UserFromCookie;
    } catch {
      return null;
    }
  });

  const { data: syncedUser } = useQuery({
    queryKey: ["auth-user-sync"],
    queryFn: syncAuthUserAction,
    enabled: !user,
    staleTime: 60_000,
    retry: false,
  });

  const resolvedUser =
    user ?? (syncedUser?.success && syncedUser.data ? syncedUser.data : null);

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setUser(null);
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    },
    onError: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setUser(null);
      setIsLogoutDialogOpen(false);
      window.location.assign("/");
    },
  });

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="hidden border-b border-border md:block">
        <div className="mkt-section flex h-9 items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Welcome to {APP_NAME} — the operating system for fashion brands
          </span>
          <nav className="flex items-center gap-4">
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="mkt-nav-link transition-colors"
                {...(link.href.startsWith("/store") ? { target: "_blank" } : {})}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="mkt-section">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          <Logo />

          <div className="flex items-center gap-3 md:gap-5">
            <ModeToggle />

            {resolvedUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full border border-border p-0"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={resolvedUser.avatar ?? resolvedUser.image ?? undefined}
                        alt={resolvedUser.name}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                        {resolvedUser.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mt-1 w-56 rounded-xl shadow-md" align="end">
                  <DropdownMenuLabel className="p-2 font-normal">
                    <div className="flex flex-col space-y-0.5">
                      <p className="text-sm font-medium text-foreground">{resolvedUser.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {resolvedUser.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg py-1.5" asChild>
                      <Link href="/profile">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setIsLogoutDialogOpen(true)}
                    disabled={isLoggingOut}
                    className="cursor-pointer gap-2 rounded-lg py-1.5 text-destructive focus:bg-destructive/10 focus:text-destructive"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Button variant="ghost" size="sm" asChild className="h-9 font-medium">
                  <Link href="/login">Log In</Link>
                </Button>
                <Button size="sm" asChild className="h-9 rounded-md px-4 font-semibold">
                  <Link href="/store/luxe-threads" target="_blank">
                    Try demo
                  </Link>
                </Button>
              </div>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden border-t border-border md:block">
        <nav className="mkt-section flex h-11 items-center justify-center gap-8 overflow-x-auto text-xs font-medium uppercase tracking-widest">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="mkt-nav-link whitespace-nowrap transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {mobileOpen && (
        <div className="border-t border-border md:hidden">
          <div className="mkt-section space-y-4 py-4">
            <p className="text-xs text-muted-foreground">
              Welcome to {APP_NAME}
            </p>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1 text-sm font-medium uppercase tracking-wider mkt-nav-link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            {!resolvedUser && (
              <nav className="flex flex-col gap-2 border-t border-border pt-3">
                {utilityLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="py-1 text-sm mkt-nav-link"
                    onClick={() => setMobileOpen(false)}
                    {...(link.href.startsWith("/store") ? { target: "_blank" } : {})}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            )}
          </div>
        </div>
      )}

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold tracking-tight">
              Sign out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              You will be disconnected from your session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 sm:gap-2">
            <AlertDialogCancel disabled={isLoggingOut} className="h-10 rounded-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleLogout();
              }}
              disabled={isLoggingOut}
              className="h-10 rounded-lg bg-destructive font-semibold text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoggingOut ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing out...
                </span>
              ) : (
                "Sign out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Navbar;
