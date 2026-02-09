"use client";
import Link from "next/link";

const Header = () => {
  return (
    <header className="space-y-2 text-center">
      <h1 className="font-bold text-3xl tracking-tight">
        Typix Editor PlayGround
      </h1>
      <p className="text-muted-foreground">
        A modern, extensible rich-text editor built on Lexical.{" "}
        <Link
          className="text-primary underline underline-offset-4"
          href="/docs"
        >
          View Documentation
        </Link>
      </p>
    </header>
  );
};

export default Header;
