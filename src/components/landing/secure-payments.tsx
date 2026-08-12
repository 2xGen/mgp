import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

function VisaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 32" className={className} role="img" aria-label="Visa">
      <rect width="50" height="32" rx="4" fill="#fff" stroke="#E5E7EB" strokeWidth="1" />
      <text
        x="25"
        y="21"
        textAnchor="middle"
        fill="#1A1F71"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="13"
        fontWeight="700"
        fontStyle="italic"
        letterSpacing="1.2"
      >
        VISA
      </text>
    </svg>
  );
}

function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 32" className={className} role="img" aria-label="Mastercard">
      <rect width="50" height="32" rx="4" fill="#fff" stroke="#E5E7EB" strokeWidth="1" />
      <circle cx="20.5" cy="16" r="7.25" fill="#EB001B" />
      <circle cx="29.5" cy="16" r="7.25" fill="#F79E1B" />
      <path
        fill="#FF5F00"
        d="M25 10.55a7.23 7.23 0 0 1 0 10.9 7.23 7.23 0 0 1 0-10.9z"
      />
    </svg>
  );
}

function AmexIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 32" className={className} role="img" aria-label="American Express">
      <rect width="50" height="32" rx="4" fill="#016FD0" />
      <text
        x="25"
        y="20.5"
        textAnchor="middle"
        fill="#fff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10"
        fontWeight="700"
        letterSpacing="0.8"
      >
        AMEX
      </text>
    </svg>
  );
}

/** Stripe brand mark (Simple Icons path) */
function StripeMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-hidden="true">
      <path
        fill="currentColor"
        d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.759 6.104 2.143c-1.534 1.429-2.321 3.316-2.321 5.473 0 4.002 2.444 5.528 6.421 6.984 2.17.822 3.02 1.452 3.02 2.509 0 .96-.84 1.511-2.354 1.511-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"
      />
    </svg>
  );
}

type SecurePaymentsProps = {
  className?: string;
  compact?: boolean;
  align?: 'left' | 'center';
};

export default function SecurePayments({
  className,
  compact = false,
  align = 'center',
}: SecurePaymentsProps) {
  const badgeClass = cn(
    'h-8 w-[50px] shrink-0 overflow-hidden rounded-[4px]',
    compact && 'h-7 w-[44px]'
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      <div
        className={cn(
          'flex flex-wrap items-center gap-x-3 gap-y-2 text-muted-foreground',
          align === 'center' && 'justify-center'
        )}
      >
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <Lock className="h-3.5 w-3.5 text-brand-green" aria-hidden="true" />
          Secure payments
        </span>
        <span className="hidden h-3 w-px bg-border sm:block" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5 text-xs">
          Powered by
          <span className="inline-flex items-center gap-1 font-semibold text-[#635BFF]">
            <StripeMark className="h-3.5 w-3.5" />
            stripe
          </span>
        </span>
      </div>

      <div
        className={cn(
          'flex flex-wrap items-center gap-2',
          align === 'center' && 'justify-center'
        )}
      >
        <VisaIcon className={badgeClass} />
        <MastercardIcon className={badgeClass} />
        <AmexIcon className={badgeClass} />
        {!compact && (
          <span className="text-xs text-muted-foreground">Cards accepted</span>
        )}
      </div>
    </div>
  );
}
