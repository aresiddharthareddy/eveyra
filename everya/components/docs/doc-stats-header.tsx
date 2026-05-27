import { Star, Users, Clock, BookOpen } from "lucide-react";
import { formatCount, formatRating } from "@/lib/utils";
import type { DocStats } from "@/types";

export function DocStatsHeader({ stats }: { stats: DocStats }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
        <span className="font-medium text-foreground">{formatRating(stats.avgRating)}</span>
      </span>
      <span className="flex items-center gap-1.5">
        <Users className="h-3.5 w-3.5" />
        {formatCount(stats.readerCount)} readers
      </span>
      <span className="flex items-center gap-1.5">
        <BookOpen className="h-3.5 w-3.5" />
        {formatCount(stats.readingMinutesTotal)} mins read
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5" />
        {stats.readingMinutes} min read
      </span>
    </div>
  );
}
