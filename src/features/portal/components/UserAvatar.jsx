import { User } from "lucide-react";

function UserAvatar({ src, alt, className, size = "md" }) {
  const sizeClasses = {
    sm: "size-8",
    md: "size-12", 
    lg: "size-16",
    xl: "size-20"
  };

  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={`${sizeClasses[size]} rounded-full object-cover ${className || ""}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-[#CAB265]/20 border border-[#CAB265]/30 flex items-center justify-center ${className || ""}`}>
      <User className="text-[#CAB265] size-1/2" />
    </div>
  );
}

export default UserAvatar;