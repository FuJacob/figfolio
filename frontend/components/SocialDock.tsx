"use client";

import type { PointerEvent } from "react";
import type { IconType } from "react-icons";
import {
  TbBrandGithub,
  TbBrandLinkedin,
  TbBrandX,
  TbBrandYoutube,
  TbMail,
} from "react-icons/tb";

type SocialLink = {
  label: string;
  href: string;
  icon: IconType;
  isFeatured?: boolean;
};

const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "#linkedin",
    icon: TbBrandLinkedin,
    isFeatured: true,
  },
  {
    label: "GitHub",
    href: "#github",
    icon: TbBrandGithub,
  },
  {
    label: "X",
    href: "#x",
    icon: TbBrandX,
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    icon: TbMail,
  },
  {
    label: "YouTube",
    href: "#youtube",
    icon: TbBrandYoutube,
  },
];

/**
 * SocialDock renders the floating portfolio action bar.
 *
 * Keeping the links in data makes the dock easy to update when real profile
 * URLs are available and avoids duplicating styling across each icon button.
 */
export function SocialDock() {
  function stopCanvasInteraction(event: PointerEvent<HTMLElement>) {
    event.stopPropagation();
  }

  return (
    <nav
      aria-label="Social links"
      className="pointer-events-none absolute inset-x-0 bottom-[calc(env(safe-area-inset-bottom)_+_1rem)] z-40 flex justify-center px-3"
      onPointerDown={stopCanvasInteraction}
    >
      <div className="pointer-events-auto flex h-20 max-w-[calc(100%_-_24px)] items-center overflow-hidden rounded-[24px] border border-dock-border/90 bg-dock-surface px-2.5 shadow-[var(--dock-shadow)]">
        <div className="flex h-full items-center">
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map(({ href, icon: Icon, isFeatured, label }) => (
              <a
                key={label}
                aria-label={label}
                className={`grid h-10 w-10 place-items-center rounded-xl text-[1.35rem] text-dock-text outline-none transition-[background-color,transform] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-dock-hover focus-visible:ring-4 focus-visible:ring-canvas-selection/25 active:translate-y-px ${
                  isFeatured ? "bg-dock-hover" : ""
                }`}
                href={href}
              >
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
