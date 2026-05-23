"use client";

import { Share2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";

/**
 * "Share QB Elite App" profile tile. Uses Web Share API when supported
 * (mobile Safari/Chrome), falls back to clipboard copy.
 */
export function ShareTile() {
  const { toast } = useToast();

  async function onShare() {
    const url = "https://www.qbeliteapp.com";
    const text =
      "🏈 Check out QB Elite — quarterback training, mechanics, mindset.";
    const navAny = navigator as Navigator & {
      share?: (data: { title: string; text: string; url: string }) => Promise<void>;
    };
    if (navAny.share) {
      try {
        await navAny.share({ title: "QB Elite", text, url });
        return;
      } catch {
        // user canceled or unsupported — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      toast({ title: "Link copied", description: "Share it anywhere." });
    } catch {
      toast({
        title: "Couldn't share",
        description: "Try long-pressing the link in your browser.",
        variant: "destructive",
      });
    }
  }

  return (
    <button
      type="button"
      onClick={onShare}
      className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 text-left shadow-[0_4px_10px_rgba(167,174,193,0.21)] active:opacity-90"
    >
      <Share2 className="h-5 w-5 text-primary" strokeWidth={1.75} />
      <span className="flex-1 text-base font-medium text-foreground">
        Share QB Elite App
      </span>
    </button>
  );
}
