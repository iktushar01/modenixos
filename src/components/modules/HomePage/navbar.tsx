"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/shared/modeToggle";
import Logo from "@/components/shared/logo/logo";
import { StartFreeLink } from "./StartFreeLink";
import { useMarketingAuthUser } from "@/hooks/useMarketingAuthUser";
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
import { Sheet, SheetContent } from "@/components/ui/sheet";
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
import { useMutation } from "@tanstack/react-query";
import { logoutAction } from "./_logoutAction";
import { deleteCookie } from "cookies-next";
import {
  LogOut,
  Menu,
  User,
  Loader2,
  LayoutDashboard,
  Package,
  Truck,
  BarChart3,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "#product-tour", label: "Product", icon: LayoutDashboard },
  { href: "#features", label: "Features", icon: Package },
  { href: "#how-it-works", label: "How it works", icon: Truck },
  { href: "#pricing", label: "Pricing", icon: BarChart3 },
  { href: "#faq", label: "FAQ", icon: HelpCircle },
] as const;

function scrollToSection(href: string) {
  const id = href.replace(/^#/, "");
  if (!id) return;
  const el = document.getElementById(id);
  if (el) {
    const headerOffset = 72;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  }
}

export default function Navbar() {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const user = useMarketingAuthUser();
  const resolvedUser = user;

  const { mutate: handleLogout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setIsLogoutDialogOpen(false);
      setMobileOpen(false);
      window.location.assign("/");
    },
    onError: () => {
      deleteCookie("user");
      deleteCookie("accessToken");
      deleteCookie("refreshToken");
      deleteCookie("better-auth.session_token");
      deleteCookie("better-auth.session_data");
      setIsLogoutDialogOpen(false);
      setMobileOpen(false);
      window.location.assign("/");
    },
  });

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      className={cn(
        "sticky top-0 z-[60] w-full transition-all duration-500",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/65 shadow-sm"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(true)}
            className="h-9 w-9 rounded-lg"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="group relative flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground hover:bg-primary/5"
              >
                <Icon className="h-4 w-4 group-hover:text-primary transition-colors" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="right" className="w-full sm:w-[76px]">
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                      closeMobile();
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-primary/5"
                  >
                    <Icon className="h-5 w-5 group-hover:text-primary transition-colors" aria-hidden />
                    {link.label}
                  </Link>
                );
              })}
              <div className="mt-auto pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 mb-3 px-1">
                  <ModeToggle />
                </div>
                <div className="flex flex-col gap-2 px-1">
                  {resolvedUser ? (
                    <Button
                      variant="outline"
                      onClick={() => setIsLogoutDialogOpen(true)}
                      disabled={isLoggingOut}
                      className="w-full text-sm"
                    >
                      {isLoggingOut ? "Signing out..." : "Log out"}
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        asChild
                        className="w-full text-sm justify-start"
                      >
                        <Link href="/login">Log in</Link>
                      </Button>
                      <Button asChild className="w-full text-sm">
                        <StartFreeLink>Start free</StartFreeLink>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

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
                      <Link href="/login">Log In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="cursor-pointer rounded-lg font-medium text-primary">
                      <StartFreeLink>Start free</StartFreeLink>
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
                  <Link href="/login">Log in</Link>
                </Button>
                <Button size="sm" asChild className="h-9 rounded-lg px-4 font-semibold shadow-sm">
                  <StartFreeLink>Start free</StartFreeLink>
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


