"use client";

import { useState } from "react";
import { Star, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DocActions({
  documentId,
  initialLiked,
  initialBookmarked,
  initialRating,
}: {
  documentId: string;
  initialLiked: boolean;
  initialBookmarked: boolean;
  initialRating?: number;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [rating, setRating] = useState(initialRating || 0);
  const [hover, setHover] = useState(0);

  const toggleLike = async () => {
    const res = await fetch(`/api/documents/${documentId}/like`, { method: "POST" });
    const data = await res.json();
    setLiked(data.liked);
  };

  const toggleBookmark = async () => {
    const res = await fetch(`/api/documents/${documentId}/bookmark`, { method: "POST" });
    const data = await res.json();
    setBookmarked(data.bookmarked);
  };

  const rate = async (value: number) => {
    await fetch(`/api/documents/${documentId}/rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value }),
    });
    setRating(value);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5 mr-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => rate(n)}
            className="p-0.5"
          >
            <Star
              className={cn(
                "h-4 w-4 transition-colors",
                (hover || rating) >= n
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
      <Button variant={liked ? "secondary" : "outline"} size="sm" onClick={toggleLike}>
        <Heart className={cn("h-3.5 w-3.5", liked && "fill-current")} />
        Like
      </Button>
      <Button variant={bookmarked ? "secondary" : "outline"} size="sm" onClick={toggleBookmark}>
        <Bookmark className={cn("h-3.5 w-3.5", bookmarked && "fill-current")} />
        Save
      </Button>
    </div>
  );
}
