import Link from "next/link";
import { TrendingUp } from "lucide-react";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: { icon: "w-8 h-8", iconInner: "w-4 h-4", text: "text-lg" },
  md: { icon: "w-10 h-10", iconInner: "w-5 h-5", text: "text-xl" },
  lg: { icon: "w-12 h-12", iconInner: "w-6 h-6", text: "text-2xl" },
};

export function Logo({
  className = "",
  showText = true,
  size = "md",
}: LogoProps) {
  const sizes = sizeClasses[size];

  return (
    <Link href="/" className={`inline-flex items-center gap-2 ${className}`}>
      <div
        className={`${sizes.icon} rounded-xl bg-emerald-600 flex items-center justify-center`}
      >
        <TrendingUp
          className={`${sizes.iconInner} text-white`}
          strokeWidth={2.5}
        />
      </div>
      {showText && (
        <span className={`${sizes.text} font-bold text-gray-900`}>
          TradeSmart
        </span>
      )}
    </Link>
  );
}
