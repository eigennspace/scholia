import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import Link from "next/link";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const tags = await prisma.tag.findMany({
    where: { OR: [{ userId: session.user.id }, { userId: null }] },
    include: { _count: { select: { notes: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-[720px] mx-auto px-stack-lg py-stack-xl">
      <h1 className="font-serif text-headline font-bold text-ink mb-stack-lg">Settings</h1>

      <section className="mb-stack-xl">
        <h2 className="text-subheading font-serif font-bold text-ink mb-stack-md">Tags</h2>
        {tags.length === 0 ? (
          <p className="text-body text-muted">No tags yet. Tags appear when you publish notes.</p>
        ) : (
          <div className="border border-border rounded-btn overflow-hidden">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between px-stack-lg py-stack-md border-b border-border last:border-b-0">
                <div>
                  <span className="text-body text-ink font-medium">{tag.name}</span>
                  <span className="text-label text-muted ml-2">{tag._count.notes} notes</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-subheading font-serif font-bold text-ink mb-stack-md">Account</h2>
        <div className="border border-border rounded-btn p-stack-lg">
          <p className="text-body text-ink">{session.user.email}</p>
          <p className="text-label text-muted">{session.user.name}</p>
        </div>
      </section>

      <div className="mt-stack-xl">
        <Link href="/library" className="text-primary hover:underline">&larr; Back to library</Link>
      </div>
    </div>
  );
}
