import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";

async function getNoteCount(userId: string) {
  return prisma.note.count({
    where: { authorId: userId, status: { not: "ARCHIVED" }, isTemplate: false },
  });
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const noteCount = await getNoteCount(session.user.id);

  return (
    <div className="flex min-h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[280px] bg-canvas border-r border-border flex-col fixed h-full">
        <div className="p-stack-lg">
          <Link href="/dashboard" className="font-serif text-headline font-bold text-ink">
            Scholia
          </Link>
        </div>

        <nav className="flex-1 px-stack-md space-y-1">
          <SidebarLink href="/new-note" label="Write" />
          <div className="border-t border-border my-stack-md" />
          <SidebarLink href="/library?filter=knowledge" label="Knowledge" />
          <SidebarLink href="/library?filter=work" label="Work" />
          <SidebarLink href="/library?filter=important" label="Important" />
          <SidebarLink href="/library?filter=reading-list" label="Reading List" />
          <div className="border-t border-border my-stack-md" />
          <SidebarLink href="/library?filter=archive" label="Archive" />
          <SidebarLink href="/settings" label="Settings" />
        </nav>

        <div className="p-stack-lg border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-label font-medium">
              {session.user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <span className="text-body text-ink truncate">{session.user.name || "User"}</span>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-[280px] flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-paper flex items-center justify-between px-stack-lg">
          <div className="flex items-center gap-stack-md flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Search notes..."
                className="w-full border-b border-border py-2 text-body text-ink bg-transparent focus:outline-none focus:border-ink pl-0"
              />
            </div>
          </div>
          <div className="flex items-center gap-stack-md">
            <button type="button" className="text-muted hover:text-ink" aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
            <Link
              href="/new-note"
              className="bg-primary text-white px-4 py-2 rounded-btn text-label font-medium hover:bg-[#005d04]"
            >
              Write
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 text-body text-muted hover:text-ink hover:bg-[#f0f0f0] rounded-btn transition-colors"
    >
      {label}
    </Link>
  );
}
