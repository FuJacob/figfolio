import type { Icon } from "@tabler/icons-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconBrandYoutube,
  IconMail,
} from "@tabler/icons-react";

export type SocialLink = {
  href: string;
  icon: Icon;
  label: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/fujacob/",
    icon: IconBrandLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/fujacob/",
    icon: IconBrandGithub,
  },
  {
    label: "X",
    href: "https://x.com/fujacobb/",
    icon: IconBrandX,
  },
  {
    label: "Email",
    href: "mailto:jjacobfu@gmail.com",
    icon: IconMail,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@jjacobfu",
    icon: IconBrandYoutube,
  },
];
