// Flat-style SVG illustrations inspired by the cozy Korean indie illustration aesthetic
// from the design references — warm, soft, rounded, charming

export function ReaderCharacter({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Couch */}
      <rect x="8" y="72" width="124" height="38" rx="16" fill="#C85A28" />
      <rect x="4" y="60" width="26" height="52" rx="13" fill="#A84820" />
      <rect x="110" y="60" width="26" height="52" rx="13" fill="#A84820" />
      {/* Cushion highlight */}
      <rect x="18" y="76" width="104" height="8" rx="4" fill="rgba(255,200,150,0.2)" />
      {/* Character body curled */}
      <ellipse cx="70" cy="68" rx="26" ry="18" fill="#F4EAC8" />
      {/* Head */}
      <circle cx="70" cy="44" r="20" fill="#F4EAC8" />
      {/* Eyes — wide and round, illustrated style */}
      <circle cx="63" cy="41" r="4.5" fill="white" />
      <circle cx="77" cy="41" r="4.5" fill="white" />
      <circle cx="64" cy="42" r="2.5" fill="#2C1C0C" />
      <circle cx="78" cy="42" r="2.5" fill="#2C1C0C" />
      <circle cx="64.8" cy="41.2" r="1" fill="white" />
      <circle cx="78.8" cy="41.2" r="1" fill="white" />
      {/* Smile */}
      <path d="M64 50 Q70 55 76 50" stroke="#C85A28" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Hair tufts */}
      <circle cx="58" cy="27" r="5" fill="#D4A030" />
      <circle cx="70" cy="24" r="6" fill="#D4A030" />
      <circle cx="82" cy="27" r="5" fill="#D4A030" />
      {/* Book */}
      <rect x="48" y="57" width="44" height="30" rx="4" fill="#3C5A44" />
      <line x1="70" y1="57" x2="70" y2="87" stroke="rgba(244,234,200,0.4)" strokeWidth="2" />
      {/* Book lines */}
      <line x1="54" y1="65" x2="68" y2="65" stroke="rgba(244,234,200,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="54" y1="71" x2="68" y2="71" stroke="rgba(244,234,200,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="54" y1="77" x2="65" y2="77" stroke="rgba(244,234,200,0.3)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="65" x2="86" y2="65" stroke="rgba(244,234,200,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="71" x2="86" y2="71" stroke="rgba(244,234,200,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Blush */}
      <circle cx="58" cy="47" r="4" fill="rgba(200,90,40,0.2)" />
      <circle cx="82" cy="47" r="4" fill="rgba(200,90,40,0.2)" />
      {/* Small stars around */}
      <path d="M118 18 l2 6 l6 2 l-6 2 l-2 6 l-2-6 l-6-2 l6-2 Z" fill="#D4A030" opacity="0.6" />
      <circle cx="24" cy="30" r="2.5" fill="#D4A030" opacity="0.4" />
      <circle cx="28" cy="22" r="1.5" fill="#D4A030" opacity="0.3" />
    </svg>
  );
}

export function CatByWindow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Window frame outer */}
      <rect x="8" y="8" width="104" height="90" rx="10" fill="#2E4535" />
      {/* Window panes */}
      <rect x="16" y="16" width="42" height="36" rx="4" fill="#243B2C" />
      <rect x="62" y="16" width="42" height="36" rx="4" fill="#243B2C" />
      <rect x="16" y="56" width="42" height="34" rx="4" fill="#243B2C" />
      <rect x="62" y="56" width="42" height="34" rx="4" fill="#243B2C" />
      {/* Moon in top-right pane */}
      <circle cx="84" cy="32" r="13" fill="#D4A030" opacity="0.85" />
      <circle cx="90" cy="27" r="11" fill="#2E4535" />
      {/* Stars in top-left pane */}
      <circle cx="28" cy="24" r="2" fill="rgba(244,234,200,0.7)" />
      <circle cx="40" cy="30" r="1.5" fill="rgba(244,234,200,0.5)" />
      <circle cx="35" cy="20" r="1" fill="rgba(244,234,200,0.4)" />
      <circle cx="52" cy="26" r="1.5" fill="rgba(244,234,200,0.35)" />
      {/* Cat silhouette — sitting on windowsill */}
      <rect x="20" y="90" width="80" height="12" rx="6" fill="rgba(244,234,200,0.12)" />
      {/* Cat body */}
      <ellipse cx="60" cy="86" rx="22" ry="16" fill="#1E3028" />
      {/* Cat head */}
      <circle cx="60" cy="68" r="17" fill="#1E3028" />
      {/* Cat ears */}
      <polygon points="48,58 43,44 54,56" fill="#1E3028" />
      <polygon points="72,58 77,44 66,56" fill="#1E3028" />
      {/* Ear inner */}
      <polygon points="49,56 45,47 53,55" fill="rgba(200,90,40,0.3)" />
      <polygon points="71,56 75,47 67,55" fill="rgba(200,90,40,0.3)" />
      {/* Eyes */}
      <ellipse cx="54" cy="66" rx="3.5" ry="4.5" fill="#D4A030" />
      <ellipse cx="66" cy="66" rx="3.5" ry="4.5" fill="#D4A030" />
      <ellipse cx="54" cy="66" rx="1.5" ry="4" fill="#1E3028" />
      <ellipse cx="66" cy="66" rx="1.5" ry="4" fill="#1E3028" />
      {/* Nose */}
      <path d="M57 72 Q60 74 63 72" stroke="rgba(244,234,200,0.4)" strokeWidth="1" fill="none" strokeLinecap="round" />
      <circle cx="60" cy="71" r="1.5" fill="rgba(200,90,40,0.5)" />
      {/* Tail curl */}
      <path d="M80 94 Q95 88 92 78 Q89 70 82 76" stroke="#1E3028" strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function FriendsWalking({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Ground */}
      <ellipse cx="80" cy="96" rx="70" ry="6" fill="rgba(244,234,200,0.08)" />
      {/* Character 1 — rust */}
      <circle cx="42" cy="24" r="17" fill="#C85A28" />
      {/* Eyes 1 */}
      <circle cx="37" cy="22" r="3.5" fill="white" />
      <circle cx="47" cy="22" r="3.5" fill="white" />
      <circle cx="38" cy="23" r="2" fill="#2C1C0C" />
      <circle cx="48" cy="23" r="2" fill="#2C1C0C" />
      <circle cx="38.6" cy="22.2" r="0.8" fill="white" />
      <circle cx="48.6" cy="22.2" r="0.8" fill="white" />
      {/* Body 1 */}
      <rect x="28" y="41" width="28" height="38" rx="14" fill="#C85A28" />
      {/* Legs 1 */}
      <rect x="30" y="70" width="10" height="22" rx="5" fill="#A84820" />
      <rect x="42" y="72" width="10" height="20" rx="5" fill="#A84820" />
      {/* Arm reaching */}
      <path d="M56 52 Q68 48 75 54" stroke="#C85A28" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Character 2 — green */}
      <circle cx="118" cy="24" r="17" fill="#3C5A44" />
      {/* Eyes 2 */}
      <circle cx="113" cy="22" r="3.5" fill="white" />
      <circle cx="123" cy="22" r="3.5" fill="white" />
      <circle cx="114" cy="23" r="2" fill="#2C1C0C" />
      <circle cx="124" cy="23" r="2" fill="#2C1C0C" />
      <circle cx="114.6" cy="22.2" r="0.8" fill="white" />
      <circle cx="124.6" cy="22.2" r="0.8" fill="white" />
      {/* Body 2 */}
      <rect x="104" y="41" width="28" height="38" rx="14" fill="#3C5A44" />
      {/* Legs 2 */}
      <rect x="106" y="70" width="10" height="20" rx="5" fill="#2E4535" />
      <rect x="118" y="72" width="10" height="22" rx="5" fill="#2E4535" />
      {/* Arm reaching back */}
      <path d="M104 52 Q92 48 85 54" stroke="#3C5A44" strokeWidth="7" strokeLinecap="round" fill="none" />
      {/* Joining hands in middle */}
      <circle cx="80" cy="54" r="7" fill="#D4A030" opacity="0.6" />
      {/* Stars above */}
      <path d="M80 4 l1.5 4.5 l4.5 1.5 l-4.5 1.5 l-1.5 4.5 l-1.5-4.5 l-4.5-1.5 l4.5-1.5 Z" fill="#D4A030" opacity="0.5" />
      <circle cx="20" cy="10" r="2" fill="#D4A030" opacity="0.3" />
      <circle cx="140" cy="10" r="2" fill="#D4A030" opacity="0.3" />
    </svg>
  );
}

export function OpenBook({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 130 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Shadow */}
      <ellipse cx="65" cy="96" rx="50" ry="5" fill="rgba(30,48,34,0.3)" />
      {/* Left page */}
      <path d="M65 12 Q42 8 12 18 L12 82 Q42 72 65 78 Z" fill="#F4EAC8" />
      {/* Right page */}
      <path d="M65 12 Q88 8 118 18 L118 82 Q88 72 65 78 Z" fill="#EDD8A8" />
      {/* Spine curve */}
      <path d="M65 12 Q63 45 65 78" stroke="#C85A28" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Left page lines */}
      <line x1="22" y1="30" x2="58" y2="27" stroke="rgba(42,28,12,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="38" x2="58" y2="35" stroke="rgba(42,28,12,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="46" x2="52" y2="43" stroke="rgba(42,28,12,0.2)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="54" x2="58" y2="51" stroke="rgba(42,28,12,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="62" x2="50" y2="59" stroke="rgba(42,28,12,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Right page lines */}
      <line x1="72" y1="27" x2="108" y2="30" stroke="rgba(42,28,12,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="35" x2="108" y2="38" stroke="rgba(42,28,12,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="43" x2="104" y2="46" stroke="rgba(42,28,12,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="51" x2="108" y2="54" stroke="rgba(42,28,12,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="72" y1="59" x2="102" y2="62" stroke="rgba(42,28,12,0.1)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Page curl top right */}
      <path d="M110 18 Q118 18 118 26" stroke="rgba(42,28,12,0.12)" strokeWidth="1" fill="none" />
      {/* Bookmark ribbon */}
      <path d="M95 8 L95 32 L100 26 L105 32 L105 8 Z" fill="#C85A28" opacity="0.7" />
      {/* Stars */}
      <circle cx="8" cy="14" r="2" fill="#D4A030" opacity="0.4" />
      <circle cx="122" cy="14" r="2" fill="#D4A030" opacity="0.4" />
    </svg>
  );
}

export function PrayingHands({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Left hand */}
      <path d="M50 80 Q28 72 22 50 Q18 36 26 28 Q30 24 36 30 L42 50 L50 80 Z" fill="#F4EAC8" />
      {/* Right hand */}
      <path d="M50 80 Q72 72 78 50 Q82 36 74 28 Q70 24 64 30 L58 50 L50 80 Z" fill="#EDD8A8" />
      {/* Fingers left */}
      <path d="M36 30 Q34 20 38 16 Q42 14 44 22 L42 50" stroke="#F4EAC8" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M40 28 Q38 16 43 12 Q48 10 49 20 L48 50" stroke="#F4EAC8" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {/* Fingers right */}
      <path d="M64 30 Q66 20 62 16 Q58 14 56 22 L58 50" stroke="#EDD8A8" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M60 28 Q62 16 57 12 Q52 10 51 20 L52 50" stroke="#EDD8A8" strokeWidth="5.5" strokeLinecap="round" fill="none" />
      {/* Center join */}
      <path d="M50 80 L50 48" stroke="#C85A28" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      {/* Stars above */}
      <path d="M50 6 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5-4 l-4-1.5 l4-1.5 Z" fill="#D4A030" opacity="0.7" />
      <circle cx="30" cy="10" r="2" fill="#D4A030" opacity="0.3" />
      <circle cx="70" cy="10" r="2" fill="#D4A030" opacity="0.3" />
    </svg>
  );
}

export function SparkleCluster({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Main star */}
      <path d="M40 6 l3 14 l14 3 l-14 3 l-3 14 l-3-14 l-14-3 l14-3 Z" fill="#D4A030" opacity="0.9" />
      {/* Small stars */}
      <path d="M14 14 l1.5 5 l5 1.5 l-5 1.5 l-1.5 5 l-1.5-5 l-5-1.5 l5-1.5 Z" fill="#D4A030" opacity="0.5" />
      <path d="M66 14 l1.5 5 l5 1.5 l-5 1.5 l-1.5 5 l-1.5-5 l-5-1.5 l5-1.5 Z" fill="#D4A030" opacity="0.5" />
      <path d="M14 66 l1.5 5 l5 1.5 l-5 1.5 l-1.5 5 l-1.5-5 l-5-1.5 l5-1.5 Z" fill="#D4A030" opacity="0.35" />
      <path d="M66 66 l1.5 5 l5 1.5 l-5 1.5 l-1.5 5 l-1.5-5 l-5-1.5 l5-1.5 Z" fill="#D4A030" opacity="0.35" />
      {/* Dots */}
      <circle cx="40" cy="68" r="3" fill="#D4A030" opacity="0.3" />
      <circle cx="8" cy="40" r="3" fill="#D4A030" opacity="0.3" />
      <circle cx="72" cy="40" r="3" fill="#D4A030" opacity="0.3" />
    </svg>
  );
}

export function CozyRoom({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Floor */}
      <rect x="0" y="90" width="160" height="30" rx="0" fill="rgba(42,28,12,0.15)" />
      {/* Wall corner */}
      <rect x="0" y="0" width="160" height="90" fill="rgba(30,48,34,0.3)" />
      {/* Window */}
      <rect x="20" y="12" width="55" height="50" rx="6" fill="#2E4535" />
      <line x1="47" y1="12" x2="47" y2="62" stroke="rgba(244,234,200,0.15)" strokeWidth="2" />
      <line x1="20" y1="37" x2="75" y2="37" stroke="rgba(244,234,200,0.15)" strokeWidth="2" />
      {/* Moon through window */}
      <circle cx="35" cy="25" r="10" fill="#D4A030" opacity="0.6" />
      <circle cx="39" cy="22" r="8" fill="#2E4535" />
      {/* Bookshelf */}
      <rect x="90" y="20" width="60" height="60" rx="4" fill="rgba(42,28,12,0.3)" />
      <line x1="90" y1="44" x2="150" y2="44" stroke="rgba(244,234,200,0.1)" strokeWidth="1.5" />
      <line x1="90" y1="64" x2="150" y2="64" stroke="rgba(244,234,200,0.1)" strokeWidth="1.5" />
      {/* Books */}
      <rect x="94" y="25" width="8" height="18" rx="2" fill="#C85A28" opacity="0.7" />
      <rect x="104" y="27" width="6" height="16" rx="2" fill="#D4A030" opacity="0.6" />
      <rect x="112" y="24" width="9" height="19" rx="2" fill="rgba(244,234,200,0.4)" />
      <rect x="123" y="26" width="7" height="17" rx="2" fill="#3C5A44" opacity="0.8" />
      <rect x="94" y="46" width="10" height="16" rx="2" fill="rgba(244,234,200,0.3)" />
      <rect x="106" y="48" width="8" height="14" rx="2" fill="#C85A28" opacity="0.5" />
      {/* Small plant */}
      <rect x="135" y="72" width="10" height="14" rx="3" fill="rgba(42,28,12,0.4)" />
      <circle cx="140" cy="66" r="10" fill="#3C5A44" opacity="0.8" />
      <circle cx="134" cy="70" r="7" fill="#4A6E54" opacity="0.7" />
      <circle cx="146" cy="70" r="7" fill="#4A6E54" opacity="0.7" />
      {/* Lamp */}
      <rect x="12" y="70" width="8" height="20" rx="2" fill="rgba(42,28,12,0.4)" />
      <path d="M4 70 L28 70 L22 52 L10 52 Z" fill="#D4A030" opacity="0.5" />
      {/* Lamp glow */}
      <ellipse cx="16" cy="62" rx="18" ry="14" fill="#D4A030" opacity="0.08" />
    </svg>
  );
}

export function VerseScroll({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      {/* Scroll top roll */}
      <ellipse cx="50" cy="14" rx="38" ry="10" fill="#EDD8A8" />
      <ellipse cx="50" cy="10" rx="38" ry="10" fill="#F4EAC8" />
      {/* Scroll body */}
      <rect x="12" y="10" width="76" height="88" fill="#F4EAC8" />
      {/* Scroll bottom roll */}
      <ellipse cx="50" cy="98" rx="38" ry="10" fill="#EDD8A8" />
      <ellipse cx="50" cy="102" rx="38" ry="10" fill="#F4EAC8" />
      {/* Text lines */}
      <line x1="24" y1="28" x2="76" y2="28" stroke="rgba(42,28,12,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="38" x2="76" y2="38" stroke="rgba(42,28,12,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="48" x2="70" y2="48" stroke="rgba(42,28,12,0.18)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="58" x2="76" y2="58" stroke="rgba(42,28,12,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="68" x2="68" y2="68" stroke="rgba(42,28,12,0.12)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="78" x2="76" y2="78" stroke="rgba(42,28,12,0.1)" strokeWidth="1.5" strokeLinecap="round" />
      {/* Star seal */}
      <circle cx="50" cy="55" r="14" fill="rgba(200,90,40,0.12)" />
      <path d="M50 44 l2 6.5 l6.5 2 l-6.5 2 l-2 6.5 l-2-6.5 l-6.5-2 l6.5-2 Z" fill="#C85A28" opacity="0.5" />
    </svg>
  );
}
