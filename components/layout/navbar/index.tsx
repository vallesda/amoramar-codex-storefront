import Link from 'next/link';

import { getNavCollections } from '@/lib/commerce';
import Container from '@/components/ui/container';
import Logo from '@/components/layout/logo';
import OpenCart from '@/components/cart/open-cart';
import { getPrimaryLinks } from '@/components/layout/nav-links';
import MobileMenu from './mobile-menu';

/** Shared primary navigation for desktop and mobile. */
export default async function Navbar() {
  const links = getPrimaryLinks(await getNavCollections());

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Mobile: menu · logo · cart */}
          <div className="flex items-center gap-1 lg:hidden">
            <MobileMenu links={links} brand={<Logo size={36} />} />
          </div>

          <div className="flex min-w-0 items-center gap-6">
            <Logo size={36} />

            <nav aria-label="Principal" className="hidden lg:block">
              <ul className="flex items-center gap-5 text-sm">
                {links.map((link) => (
                  <li
                    key={link.href}
                    className={link.href === '/nosotros' ? 'border-l border-border pl-5' : undefined}
                  >
                    <Link
                      href={link.href}
                      className="-my-2 inline-block whitespace-nowrap py-2 hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <OpenCart />
          </div>
        </div>
      </Container>
    </header>
  );
}
