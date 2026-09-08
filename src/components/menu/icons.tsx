export function IconCart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20.5" r="1.4" />
      <circle cx="17.5" cy="20.5" r="1.4" />
    </svg>
  );
}

export function IconClose({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

export function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function IconMinus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function IconTrash({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        d="M4 7h16M9 7V4.8A1.3 1.3 0 0 1 10.3 3.5h3.4A1.3 1.3 0 0 1 15 4.8V7M6 7l1 13a2 2 0 0 0 2 1.8h6a2 2 0 0 0 2-1.8l1-13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconPlate({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
    </svg>
  );
}

export function IconPizza({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M12 3 21 19H3L12 3Z" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
      <circle cx="10" cy="15.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="14.5" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPasta({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <circle cx="12" cy="12" r="8.5" />
      <path
        d="M8 9c1.5 1 1.5 2.5 0 3.5s-1.5 2.5 0 3.5M12 8c1.5 1 1.5 2.5 0 3.5s-1.5 2.5 0 3.5M16 9c1.5 1 1.5 2.5 0 3.5s-1.5 2.5 0 3.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconFish({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path
        d="M3 12c3-4 8-6 12-4 3 1.5 4.5 3 6 4-1.5 1-3 2.5-6 4-4 2-9 0-12-4Z"
        strokeLinejoin="round"
      />
      <path d="M15 10.5v3" strokeLinecap="round" />
      <circle cx="7.5" cy="11" r=".8" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconHome({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M4 11.5 12 4l8 7.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTap({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className={className}>
      <path d="M9.5 11.5V5.8a1.3 1.3 0 0 1 2.6 0v5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.1 10.8V4.9a1.3 1.3 0 0 1 2.6 0v6" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M14.7 11V7.3a1.3 1.3 0 0 1 2.6 0v6.3c0 3.3-1.9 5.7-5.1 5.7h-.9c-1.8 0-2.7-.6-3.6-1.9l-2.6-3.8c-.5-.8-.2-1.7.6-2 .6-.2 1.2 0 1.6.6l1.4 1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <path d="M6 3h12l-1.2 14.5A2 2 0 0 1 14.8 19H9.2a2 2 0 0 1-2-1.5L6 3Z" strokeLinejoin="round" />
      <path d="M4 3h16" strokeLinecap="round" />
      <path d="M9.5 3v3M14.5 3v3" strokeLinecap="round" />
    </svg>
  );
}
