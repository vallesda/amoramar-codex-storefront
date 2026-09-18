'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Enhance server-rendered cards; photos remain visible without JavaScript. */
export default function DiscoveryGrid({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting);
      visible.forEach((entry, index) => {
        observer.unobserve(entry.target);
        if (preference.matches) return;
        const animation = entry.target.animate([
          { opacity: 0.35, transform: 'translateY(12px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 420, delay: Math.min(index, 3) * 60, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      });
    }, { threshold: 0.08 });

    // The first screen and already visited rows never wait for an entrance.
    root.querySelectorAll<HTMLElement>('[data-discovery-photo]').forEach(photo => {
      if (photo.getBoundingClientRect().top >= window.innerHeight) observer.observe(photo);
    });
    const stop = () => {
      if (!preference.matches) return;
      observer.disconnect();
      animations.forEach(animation => animation.cancel());
      animations.clear();
    };
    preference.addEventListener('change', stop);
    stop();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', stop);
      animations.forEach(animation => animation.cancel());
    };
  }, [children]);

  return <ul ref={ref} className="grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 md:gap-x-6 lg:grid-cols-4">{children}</ul>;
}
