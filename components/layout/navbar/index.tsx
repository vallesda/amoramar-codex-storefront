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
        <div className="grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-x-4 md:min-h-20">
          {/* Mobile: menu · logo · cart */}
          <div className="flex items-center gap-1 lg:hidden">
            <MobileMenu links={links} brand={<Logo size={36} />} />
          </div>

          <div className="flex min-h-16 min-w-0 items-center justify-center md:min-h-20 lg:col-start-1 lg:row-start-1 lg:justify-start">
            <Logo size={36} nameClassName="hidden sm:block lg:hidden xl:block" />
          </div>

            <nav aria-label="Principal" className="hidden lg:col-start-2 lg:row-start-1 lg:block lg:justify-self-center">
              <ul className="flex items-center justify-center gap-5 text-sm">
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

          <div className="col-start-3 row-start-1 flex shrink-0 items-center justify-end gap-2">
            <OpenCart />
          </div>
        </div>
      </Container>
    </header>
  );
}
