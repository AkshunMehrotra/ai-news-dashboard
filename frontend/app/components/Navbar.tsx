import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-900 flex justify-between items-center">
      
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">
        <Image
          src="/batman.png"
          alt="Batman Logo"
          width={40}
          height={40}
        />
        <h1 className="text-xl font-bold">AI Dashboard</h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex gap-4">
        <Link href="/">News</Link>
        <Link href="/favorites">Favorites</Link>
      </div>

    </nav>
  );
}