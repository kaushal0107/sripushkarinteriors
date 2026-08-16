import Link from "next/link";

import { Button } from "@/components/ui";
import { nav } from "@/data/site";

export default function NotFound() {
  return (
    <section className="flex min-h-[70svh] items-center py-32">
      <div className="container-page">
        <p className="text-eyebrow uppercase text-brass-600">404</p>
        <h1 className="mt-5 max-w-2xl text-h1 text-balance">
          That page has been taken down to the studs.
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-500 text-pretty">
          The link you followed does not exist any more. The old site had a few
          pages that never got finished — this is probably one of them.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Button href="/">Back to home</Button>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="underline underline-offset-4 hover:text-ink-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
