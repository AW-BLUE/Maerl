'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavItem {
  name: string;
  href: string;
}

export default function ProjectNavigation({ slug }: { slug: string }) {
  const pathname = usePathname();

  const items = [
    {
      name: 'Project Home',
      href: `/projects/${slug}`,
    },
    {
      name: 'Theory of Change',
      href: `/projects/${slug}/theory-of-change`,
    },
    {
      name: 'Logframe',
      href: `/projects/${slug}/logframe`,
    },
  ];

  return (
    <ul className='flex gap-1 text-sm'>
      {items.map((item: NavItem) => {
        return (
          <li
            key={item.name}
            className={` ${pathname === item.href && 'active'} group inline-block leading-4 transition-all`}
          >
            <Link
              href={item.href}
              className='inline-block rounded-md border border-transparent px-4 py-2 text-foreground/80 transition-all ease-in-out hover:border-foreground/20 group-[.active]:border-slate-800 group-[.active]:bg-sky-800/50 group-[.active]:text-foreground'
            >
              {item.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
