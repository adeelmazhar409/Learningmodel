import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "NeuroPath",
    template: "%s | NeuroPath",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-shell">
      <style>{`
        .auth-shell {
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          position: relative;
          overflow: hidden;
          background: var(--ink);
        }

        /* Subtle ambient glow */
        .auth-shell::before {
          content: '';
          position: fixed;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 500px;
          background: radial-gradient(
            ellipse,
            rgba(217, 79, 43, 0.08) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .auth-card {
          width: 100%;
          max-width: 440px;
          background: var(--surface);
          border: 1px solid var(--edge);
          border-radius: 24px;
          padding: 40px 36px;
          position: relative;
          z-index: 1;
          animation: riseIn 0.6s ease both;
        }

        /* Top accent line */
        .auth-card::before {
          content: '';
          position: absolute;
          top: -1px;
          left: 20%;
          right: 20%;
          height: 1px;
          background: linear-gradient(
            to right,
            transparent,
            var(--flame),
            transparent
          );
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          margin-bottom: 32px;
        }

        .auth-logo-orb {
          width: 30px;
          height: 30px;
          background: linear-gradient(145deg, var(--ember), #8c2410);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08),
            0 4px 12px rgba(217,79,43,0.28);
          flex-shrink: 0;
        }

        .auth-logo-orb svg {
          width: 13px;
          height: 13px;
        }

        .auth-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 600;
          color: var(--text);
          letter-spacing: 0.01em;
        }

        .auth-footer {
          margin-top: 28px;
          text-align: center;
          font-size: 13px;
          color: var(--whisper);
        }

        .auth-footer a {
          color: var(--ember);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.2s;
        }

        .auth-footer a:hover {
          opacity: 0.8;
        }

        @media (max-width: 480px) {
          .auth-card {
            padding: 32px 22px;
            border-radius: 18px;
          }
        }
      `}</style>

      <div className="auth-card">
        {/* Logo */}
        <Link href="/" className="auth-logo">
          <div className="auth-logo-orb">
            <svg viewBox="0 0 20 20" fill="white">
              <path
                d="M10 2.5c-1.2 0-2.3.4-3.1 1.1L4.5 5.7A4.5 4.5 0 0 0 3 9v2a4.5 4.5 0 0 0 1.5 3.3l2.4 2.1A4.5 4.5 0 0 0 10 17.5c1.2 0 2.3-.4 3.1-1.1l2.4-2.1A4.5 4.5 0 0 0 17 11V9a4.5 4.5 0 0 0-1.5-3.3L13.1 3.6A4.5 4.5 0 0 0 10 2.5z"
                opacity=".25"
              />
              <path d="M7 7h2.5v6H7V7zm3.5 0H13l-1.5 3 1.5 3h-2.5V7z" />
            </svg>
          </div>
          <span className="auth-logo-name">NeuroPath</span>
        </Link>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}
