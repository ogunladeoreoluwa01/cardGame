"use client";

import * as React from "react";
import { CheckIcon, ClipboardIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CopyButtonProps extends ButtonProps {
  link: string;
  text: string;
  cta:string;
}

export async function copyToClipboardWithMeta(value: string) {
  navigator.clipboard.writeText(value);
}

export function CopyButton({
  link,
  text,
  cta,
  className,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      const timer = setTimeout(() => {
        setHasCopied(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [hasCopied]);

  const handleCopy = (value: string) => {
    copyToClipboardWithMeta(value);
    setHasCopied(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          
          variant={variant}
          className={cn(
            "relative z-10 ",
            className
          )}
          {...props}
        >
          <span className="sr-only">Copy</span>
          {hasCopied ? (
            <CheckIcon className="h-3 w-3" />
          ) : (
            <ClipboardIcon className="h-3 w-3" />
          )}
          <span className="ml-2 text-zinc-50">{cta}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center">
        <DropdownMenuItem onClick={() => handleCopy(link)}>
          Copy Invite Link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleCopy(text)}>
          Copy Invite Code
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
