type IconProps = {
  className?: string;
};

export function CartIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 4h2l2.4 10.2a2 2 0 001.95 1.55h7.8a2 2 0 001.95-1.55L21 7H7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="19" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

export function PackageIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 12v9M4 7.5l8 4.5 8-4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SettingsIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 15.5A3.5 3.5 0 1012 8.5a3.5 3.5 0 000 7z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a1 1 0 00.2 1.1l.03.03a1.8 1.8 0 11-2.55 2.55l-.03-.03a1 1 0 00-1.1-.2 1 1 0 00-.6.92V20a1.8 1.8 0 11-3.6 0v-.05a1 1 0 00-.65-.93 1 1 0 00-1.08.21l-.03.03a1.8 1.8 0 11-2.55-2.55l.03-.03a1 1 0 00.2-1.1 1 1 0 00-.92-.6H4a1.8 1.8 0 110-3.6h.05a1 1 0 00.93-.65 1 1 0 00-.21-1.08l-.03-.03a1.8 1.8 0 112.55-2.55l.03.03a1 1 0 001.1.2h.02a1 1 0 00.58-.92V4a1.8 1.8 0 113.6 0v.05a1 1 0 00.65.93h.02a1 1 0 001.08-.21l.03-.03a1.8 1.8 0 112.55 2.55l-.03.03a1 1 0 00-.2 1.1v.02a1 1 0 00.92.58H20a1.8 1.8 0 110 3.6h-.05a1 1 0 00-.93.65V15z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SearchIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 16l4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MenuIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StoreIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 10h16v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M3 10l2-5h14l2 5M9 14h6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BriefcaseIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M3 12h18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AlertTriangleIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 4l9 15H3l9-15z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function SparklesIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M19 15l.8 1.8L22 17.6l-2.2.8L19 20.2l-.8-1.8-2.2-.8 2.2-.8.8-1.8zM5 14l.7 1.4 1.4.7-1.4.7L5 18.2l-.7-1.4-1.4-.7 1.4-.7L5 14z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LeafIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20 4c-8 0-13 4.2-13 11 0 2.8 2.2 5 5 5 6.8 0 11-5 11-13v-3h-3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M7 17c3-3 6.2-5.1 10-6.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function FruitIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 6c0-2.2 1.3-3.5 3.5-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 7c1.4-2 3.4-2.9 5.5-2.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function InfoIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 10.5v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="7.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function MailIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path d="M8 3h8v18H8z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="17.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function MapPinIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 21s7-5.6 7-11a7 7 0 10-14 0c0 5.4 7 11 7 11z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function EyeIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function EyeOffIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 3l18 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.6 10.6a2 2 0 102.8 2.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M6.2 6.2C4 7.9 2.5 10.5 2.5 12c0 0 3.5 6 9.5 6 1.9 0 3.5-.6 4.9-1.5M9.2 4.4A10 10 0 0112 4c6 0 9.5 6 9.5 6-.6.9-1.4 2.1-2.6 3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UnlockIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 10V8a3 3 0 016 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function KeyIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="8" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 12h8M16 12v-2M19 12v-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LogoutIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 4H6a2 2 0 00-2 2v12a2 2 0 002 2h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 16l4-4-4-4M18 12H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DashboardIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="13"
        y="3"
        width="8"
        height="5"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="13"
        y="10"
        width="8"
        height="11"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="3"
        y="13"
        width="8"
        height="8"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function BannerIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="8" cy="10" r="1.5" fill="currentColor" />
      <path
        d="M5 17l5-5 3 3 2-2 4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrainIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M9 5a3 3 0 00-3 3v1a3 3 0 00-2 2.8A3 3 0 007 15v1a3 3 0 003 3h4a3 3 0 003-3v-1a3 3 0 002-2.8A3 3 0 0017 9V8a3 3 0 00-3-3H9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 7v10M14 7v10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function TicketIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 8a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 000 4v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2a2 2 0 000-4V8z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 8v8M12 8v8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function UsersIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="16" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4 19a5 5 0 0110 0M13.5 19a4 4 0 014-3.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArrowLeftIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M19 12H5M11 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CameraIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 8h3l1.4-2h7.2L17 8h3a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="14" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function LockIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8.5 10V7.5a3.5 3.5 0 117 0V10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function LinkIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M10 14l4-4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M8 16H6a4 4 0 010-8h2M16 8h2a4 4 0 010 8h-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function WalletIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M4 7a2 2 0 012-2h11a2 2 0 012 2v2H6a2 2 0 00-2 2V7z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="9"
        width="16"
        height="10"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="15.5" cy="14" r="1" fill="currentColor" />
    </svg>
  );
}

export function TruckIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 6h11v9H3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14 9h3l3 3v3h-6V9z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="18" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function CreditCardIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M3 10h18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M7 15h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BankIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M3 9l9-5 9 5H3z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 10v7M9 10v7M15 10v7M19 10v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M3 19h18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
