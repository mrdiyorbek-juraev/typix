import Image from "next/image";

export function TypixLogo({ className }: { className?: string }) {
  return (
    <Image
      src={"/logo.svg"}
      width={32}
      height={32}
      alt="Typix Logo"
      className={className}
    />
  );
}
