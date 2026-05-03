import { SOCIAL_LINKS } from "../socialLinks";

/**
 * Fixed social dock styled as lightweight app chrome rather than canvas
 * content, so it stays anchored while the composition remains editable.
 */
export function SocialDock() {
  return (
    <nav
      aria-label="Social links"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4"
    >
      <div className="pointer-events-auto flex items-center gap-1 rounded-[1.35rem] border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.12)] backdrop-blur-sm">
        {SOCIAL_LINKS.map((link) => {
          const Icon = link.icon;

          return (
            <a
              key={link.label}
              className="group relative block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              href={link.href}
              rel="noreferrer noopener"
              target="_blank"
            >
              <span className="flex size-9 items-center justify-center rounded-xl text-slate-700 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-950">
                <Icon size={19} stroke={1.8} />
              </span>
              <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 rounded-full bg-slate-950 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
                {link.label}
              </span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
