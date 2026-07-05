"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { APP_NAME, LOGO_DARK, LOGO_LIGHT } from "@/lib/app-config";

const Logo = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const src =
    mounted && resolvedTheme === "dark" ? LOGO_DARK : LOGO_LIGHT;

  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src={src}
        alt={`${APP_NAME} logo`}
        width={40}
        height={40}
        className="h-10 w-10 rounded-md object-contain md:h-11 md:w-11"
        priority
      />
    </Link>
  );
};

export default Logo;
