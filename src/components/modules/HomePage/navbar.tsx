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
import { Menu, LogOut, User, Loader2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/#product-tour", label: "Product" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
];

const Navbar = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    user ??
    (syncedUser?.success && syncedUser.data
      ? syncedUser.data
      : null);

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

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-background/75 shadow-sm backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative rounded-lg px-3.5 py-2 text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              {link.label}
              <span className="absolute inset-x-3.5 -bottom-px h-px scale-x-0 bg-gradient-to-r from-rose-500 to-violet-500 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <div className="mx-1 hidden h-4 w-px bg-border sm:block" />

          {resolvedUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full border border-border p-0"
                >
                  <Avatar className="h-8 w-8">
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
              <DropdownMenuContent
                className="mt-1 w-56 rounded-xl shadow-md"
                align="end"
              >
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
                  <DropdownMenuItem
                    className="cursor-pointer gap-2 rounded-lg py-1.5"
                    asChild
                  >
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
            <>
              <div className="sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="mt-1 w-40 rounded-xl"
                  >
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                      <Link href="/store/luxe-threads" target="_blank">
                        Try demo
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg font-medium text-primary">
                      <Link href="/register">Sign Up</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="hidden items-center gap-2 sm:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-9 font-medium text-muted-foreground hover:text-foreground"
                >
                  <Link href="/login">Log In</Link>
                </Button>
                <Button size="sm" asChild className="h-9 rounded-lg px-4 font-semibold shadow-sm">
                  <Link href="/store/luxe-threads" target="_blank">
                    Try demo
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className="max-w-md rounded-xl border border-border bg-background p-6 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold tracking-tight">
              Sign out?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-relaxed text-muted-foreground">
              You will be disconnected from your session. Any unsaved page context state configuration might reset.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 sm:gap-2">
            <AlertDialogCancel
              disabled={isLoggingOut}
              className="h-10 rounded-lg border-border font-medium"
            >
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
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Signing out...</span>
                </div>
              ) : (
                "Sign out"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </nav>
  );
};

export default Navbar;
