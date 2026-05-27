import { cn } from "@/lib/utils";

export function Avatar({
  src,
  name,
  className,
  size = "md",
}: {
  src?: string | null;
  name?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = { sm: "h-7 w-7 text-xs", md: "h-9 w-9 text-sm", lg: "h-12 w-12 text-base" };
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-muted font-medium text-muted-foreground",
        sizes[size],
        className
      )}
    >
      {initials}
    </div>
  );
}
