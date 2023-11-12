'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Breadcrumbs from '../breadcrumbs';

export default function NavMenu() {
  const pathname = usePathname();

  const adminNav = [
    {
      name: 'Impact Indicators',
      href: '/dashboard/impactindicators',
    },
    {
      name: 'Admin',
      href: '/dashboard/admin',
    },
  ];

  const navStyle =
    'inline-block py-4 text-foreground/50 border-b border-transparent hover:border-foreground/80 group-[.active]:text-foreground group-[.active]:border-b group-[.active]:border-foreground/80';

  return (
    <div className='w-full border-b border-foreground/10'>
      <nav className='max-w-6xl mx-auto flex justify-between items-center'>
        <Breadcrumbs />
        <ul className='flex justify-between items-center gap-6'>
          {adminNav.map((item) => {
            return (
              <li
                key={item.name}
                className={pathname === item.href ? 'group active' : 'group'}
              >
                <Link href={item.href} className={navStyle}>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
