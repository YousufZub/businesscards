'use client';

// ─── Scan Animation ───────────────────────────────────────────────────────────

function ScanAnimation() {
  return (
    <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[200px]" aria-hidden>
      <defs>
        {/* Scan laser gradient */}
        <linearGradient id="s-laser" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#818cf8" stopOpacity="0"/>
          <stop offset="30%"  stopColor="#818cf8" stopOpacity="0.9"/>
          <stop offset="70%"  stopColor="#a5b4fc" stopOpacity="0.9"/>
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0"/>
        </linearGradient>
        {/* Scan glow blur */}
        <filter id="s-glow" x="-20%" y="-100%" width="140%" height="400%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Card clip */}
        <clipPath id="s-screen">
          <rect x="52" y="24" width="96" height="172" rx="8"/>
        </clipPath>
      </defs>

      {/* ── Phone body ── */}
      <rect x="44" y="10" width="112" height="206" rx="16" fill="#0d1117" stroke="#1e293b" strokeWidth="1.5"/>
      {/* Screen */}
      <rect x="52" y="24" width="96" height="172" rx="8" fill="#030712"/>
      {/* Notch */}
      <rect x="80" y="15" width="40" height="6" rx="3" fill="#1e293b"/>
      {/* Home indicator */}
      <rect x="82" y="200" width="36" height="4" rx="2" fill="#1e293b"/>

      {/* ── Viewfinder UI inside screen ── */}
      <g clipPath="url(#s-screen)">
        {/* Dim background overlay */}
        <rect x="52" y="24" width="96" height="172" fill="#030712"/>
        {/* Spotlight over card area */}
        <rect x="60" y="72" width="80" height="62" rx="4" fill="#0a0a1f"/>

        {/* Business card */}
        <g filter="url(#s-glow)">
          <rect x="63" y="76" width="74" height="50" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="0.75">
            <animate attributeName="fill" values="#0f172a;#172554;#0f172a" dur="3s" repeatCount="indefinite" begin="1.8s"/>
          </rect>
          {/* Card company logo placeholder */}
          <rect x="108" y="80" width="22" height="22" rx="3" fill="#1d4ed8" opacity="0.5"/>
          <rect x="114" y="86" width="10" height="10" rx="2" fill="#3b82f6" opacity="0.7"/>
          {/* Card text lines */}
          <rect x="67" y="82" width="34" height="3" rx="1.5" fill="#93c5fd" opacity="0.9"/>
          <rect x="67" y="89" width="22" height="2.5" rx="1" fill="#475569"/>
          <rect x="67" y="95" width="38" height="2" rx="1" fill="#334155"/>
          <rect x="67" y="101" width="28" height="2" rx="1" fill="#334155"/>
          <rect x="67" y="107" width="32" height="2" rx="1" fill="#334155"/>
        </g>

        {/* Scan laser line — sweeps down the card */}
        <g>
          <rect x="60" y="76" width="80" height="6" fill="url(#s-laser)" opacity="0.35">
            <animateTransform attributeName="transform" type="translate" from="0,0" to="0,44" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1"/>
          </rect>
          <line x1="60" y1="79" x2="140" y2="79" stroke="url(#s-laser)" strokeWidth="1.5" filter="url(#s-glow)">
            <animateTransform attributeName="transform" type="translate" from="0,0" to="0,44" dur="2.8s" repeatCount="indefinite" calcMode="spline" keySplines="0.4 0 0.2 1"/>
          </line>
        </g>

        {/* Detected field dots — appear after scan */}
        {[82, 89, 95, 101].map((y, i) => (
          <circle key={y} cx="137" cy={y + 1} r="2.5" fill="#10b981" opacity="0">
            <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.65;0.9;1" dur="2.8s" repeatCount="indefinite" begin={`${i * 0.08}s`}/>
            <animate attributeName="r" values="0;0;3;2.5;2.5" keyTimes="0;0.5;0.6;0.65;1" dur="2.8s" repeatCount="indefinite" begin={`${i * 0.08}s`}/>
          </circle>
        ))}
      </g>

      {/* ── Corner brackets (viewfinder) ── */}
      {/* Top-left */}
      <path d="M60,95 L60,72 L83,72" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0.35;1;0.35" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="stroke" values="#6366f1;#a5b4fc;#6366f1" dur="2s" repeatCount="indefinite"/>
      </path>
      {/* Top-right */}
      <path d="M140,95 L140,72 L117,72" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0.35;1;0.35" dur="2s" repeatCount="indefinite" begin="0.5s"/>
        <animate attributeName="stroke" values="#6366f1;#a5b4fc;#6366f1" dur="2s" repeatCount="indefinite" begin="0.5s"/>
      </path>
      {/* Bottom-left */}
      <path d="M60,113 L60,134 L83,134" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0.35;1;0.35" dur="2s" repeatCount="indefinite" begin="0.25s"/>
      </path>
      {/* Bottom-right */}
      <path d="M140,113 L140,134 L117,134" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round">
        <animate attributeName="opacity" values="0.35;1;0.35" dur="2s" repeatCount="indefinite" begin="0.75s"/>
      </path>

      {/* Scanning status label */}
      <text x="100" y="158" textAnchor="middle" fill="#6366f1" fontSize="7.5" fontFamily="monospace" letterSpacing="2">
        AI SCANNING
        <animate attributeName="opacity" values="0.3;1;0.3" dur="1.4s" repeatCount="indefinite"/>
      </text>
    </svg>
  );
}

// ─── Review Animation ─────────────────────────────────────────────────────────

function ReviewAnimation() {
  const fields = [
    { label: 'Name',    value: 'John Smith',         color: '#93c5fd', delay: '0.3s',  valuew: 62 },
    { label: 'Company', value: 'Acme Corp',           color: '#c4b5fd', delay: '1.1s',  valuew: 50 },
    { label: 'Email',   value: 'john@acme.com',       color: '#6ee7b7', delay: '1.9s',  valuew: 68 },
    { label: 'Phone',   value: '+1 555 012 3456',     color: '#fda4af', delay: '2.7s',  valuew: 56 },
  ];
  const CYCLE = '5s';

  return (
    <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[200px]" aria-hidden>
      <defs>
        <filter id="r-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <linearGradient id="r-card-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0d1117"/>
          <stop offset="100%" stopColor="#0f172a"/>
        </linearGradient>
      </defs>

      {/* ── Card panel ── */}
      <rect x="18" y="14" width="164" height="196" rx="14" fill="url(#r-card-bg)" stroke="#1e293b" strokeWidth="1.5"/>
      {/* Top accent bar */}
      <rect x="18" y="14" width="164" height="3" rx="1.5" fill="#6366f1" opacity="0.6"/>

      {/* ── Header ── */}
      <rect x="30" y="26" width="70" height="3" rx="1.5" fill="#e2e8f0" opacity="0.9"/>
      <rect x="30" y="34" width="44" height="2.5" rx="1" fill="#475569"/>

      {/* AI badge */}
      <g filter="url(#r-glow)">
        <rect x="142" y="22" width="32" height="18" rx="6" fill="#312e81" stroke="#6366f1" strokeWidth="0.75"/>
        <text x="158" y="34" textAnchor="middle" fill="#a5b4fc" fontSize="7.5" fontFamily="monospace" fontWeight="bold">AI</text>
        {/* Rotating sparkle dots around badge */}
        {[0, 90, 180, 270].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 158 + 14 * Math.cos(rad);
          const cy = 31  + 14 * Math.sin(rad);
          return (
            <circle key={deg} cx={cx} cy={cy} r="1.5" fill="#818cf8" opacity="0.7">
              <animateTransform attributeName="transform" type="rotate" from={`0 158 31`} to={`360 158 31`} dur="4s" repeatCount="indefinite" begin={`${i * 1}s`}/>
              <animate attributeName="opacity" values="0.2;0.9;0.2" dur="2s" repeatCount="indefinite" begin={`${i * 0.5}s`}/>
            </circle>
          );
        })}
      </g>

      {/* Divider */}
      <line x1="28" y1="50" x2="172" y2="50" stroke="#1e293b" strokeWidth="1"/>

      {/* ── Extracted fields ── */}
      {fields.map(({ label, color, delay, valuew }, i) => {
        const y = 62 + i * 36;
        return (
          <g key={label}>
            {/* Label */}
            <text x="30" y={y + 2} fill="#475569" fontSize="7.5" fontFamily="monospace" letterSpacing="0.5">
              {label.toUpperCase()}
            </text>

            {/* Value bar (animates width 0 → full) */}
            <rect x="30" y={y + 8} width="0" height="10" rx="2" fill={color} opacity="0.15">
              <animate attributeName="width" values={`0;0;${valuew};${valuew};0`}
                keyTimes="0;0.05;0.25;0.85;1"
                dur={CYCLE} repeatCount="indefinite" begin={delay}
                calcMode="spline" keySplines="0 0 0 0;0.4 0 0.2 1;0 0 0 0;0.4 0 0.2 1"/>
            </rect>
            {/* Value text line (color line, simulating text) */}
            <rect x="30" y={y + 12} width="0" height="2.5" rx="1" fill={color} opacity="0.85">
              <animate attributeName="width" values={`0;0;${valuew};${valuew};0`}
                keyTimes="0;0.05;0.25;0.85;1"
                dur={CYCLE} repeatCount="indefinite" begin={delay}
                calcMode="spline" keySplines="0 0 0 0;0.4 0 0.2 1;0 0 0 0;0.4 0 0.2 1"/>
            </rect>
            {/* Sub-line */}
            <rect x="30" y={y + 17} width="0" height="1.5" rx="0.75" fill={color} opacity="0.35">
              <animate attributeName="width" values={`0;0;${Math.round(valuew * 0.6)};${Math.round(valuew * 0.6)};0`}
                keyTimes="0;0.08;0.28;0.85;1"
                dur={CYCLE} repeatCount="indefinite" begin={delay}
                calcMode="spline" keySplines="0 0 0 0;0.4 0 0.2 1;0 0 0 0;0.4 0 0.2 1"/>
            </rect>

            {/* Checkmark (appears after field reveals) */}
            <g opacity="0">
              <circle cx="162" cy={y + 14} r="7" fill="#064e3b" stroke="#10b981" strokeWidth="1">
                <animate attributeName="opacity" values="0;0;1;1;0"
                  keyTimes="0;0.3;0.45;0.85;1"
                  dur={CYCLE} repeatCount="indefinite" begin={delay}/>
              </circle>
              <path d={`M158,${y + 14} L161,${y + 17} L166,${y + 11}`}
                fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray="12" strokeDashoffset="12">
                <animate attributeName="stroke-dashoffset" values="12;12;0;0;12"
                  keyTimes="0;0.3;0.48;0.85;1"
                  dur={CYCLE} repeatCount="indefinite" begin={delay}/>
                <animate attributeName="opacity" values="0;0;1;1;0"
                  keyTimes="0;0.3;0.45;0.85;1"
                  dur={CYCLE} repeatCount="indefinite" begin={delay}/>
              </path>
            </g>
          </g>
        );
      })}

      {/* Bottom pulse bar */}
      <rect x="30" y="210" width="0" height="2" rx="1" fill="#6366f1">
        <animate attributeName="width" values="0;140;0" dur="5s" repeatCount="indefinite"/>
      </rect>
    </svg>
  );
}

// ─── Cloud Save Animation ─────────────────────────────────────────────────────

function CloudSaveAnimation() {
  return (
    <svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[200px]" aria-hidden>
      <defs>
        <filter id="c-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="c-glow-sm" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        {/* Data stream path */}
        <path id="c-stream-path" d="M100,178 C100,155 80,140 80,118 C80,95 100,88 100,68"/>
        {/* Gradient for stream line */}
        <linearGradient id="c-stream-grad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%"   stopColor="#6366f1" stopOpacity="0.1"/>
          <stop offset="50%"  stopColor="#6366f1" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9"/>
        </linearGradient>
      </defs>

      {/* ── Stream line (dashed, animated dash-offset) ── */}
      <use href="#c-stream-path" fill="none" stroke="url(#c-stream-grad)" strokeWidth="1.5"
        strokeDasharray="4 6">
        <animate attributeName="stroke-dashoffset" from="100" to="0" dur="2s" repeatCount="indefinite"/>
      </use>

      {/* ── Travelling data dots ── */}
      {[0, 0.7, 1.4].map((begin, i) => (
        <g key={i}>
          <circle r="4.5" fill="#6366f1" filter="url(#c-glow-sm)">
            <animateMotion dur="2.1s" repeatCount="indefinite" begin={`${begin}s`} calcMode="spline" keySplines="0.4 0 0.6 1">
              <mpath href="#c-stream-path"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.85;1" dur="2.1s" repeatCount="indefinite" begin={`${begin}s`}/>
            <animate attributeName="r" values="3;5;4;3" dur="2.1s" repeatCount="indefinite" begin={`${begin}s`}/>
          </circle>
          {/* Dot glow trail */}
          <circle r="8" fill="#6366f1" opacity="0">
            <animateMotion dur="2.1s" repeatCount="indefinite" begin={`${begin}s`} calcMode="spline" keySplines="0.4 0 0.6 1">
              <mpath href="#c-stream-path"/>
            </animateMotion>
            <animate attributeName="opacity" values="0;0.15;0.1;0" keyTimes="0;0.1;0.85;1" dur="2.1s" repeatCount="indefinite" begin={`${begin}s`}/>
          </circle>
        </g>
      ))}

      {/* ── Cloud icon ── */}
      <g filter="url(#c-glow)">
        {/* Cloud fill — pulses on data arrival */}
        <path d="M70,88 C70,74 80,64 95,64 C98,55 106,50 116,50 C130,50 140,60 140,72 C146,72 152,78 152,85 C152,92 146,98 140,98 L78,98 C73,98 70,93 70,88 Z"
          fill="#0d1117">
          <animate attributeName="fill" values="#0d1117;#0d1117;#1e1b4b;#312e81;#1e1b4b;#0d1117"
            keyTimes="0;0.5;0.65;0.75;0.88;1"
            dur="6.3s" repeatCount="indefinite"/>
        </path>
        <path d="M70,88 C70,74 80,64 95,64 C98,55 106,50 116,50 C130,50 140,60 140,72 C146,72 152,78 152,85 C152,92 146,98 140,98 L78,98 C73,98 70,93 70,88 Z"
          fill="none" stroke="#6366f1" strokeWidth="1.5">
          <animate attributeName="stroke" values="#1e293b;#1e293b;#6366f1;#818cf8;#6366f1;#1e293b"
            keyTimes="0;0.5;0.65;0.75;0.88;1"
            dur="6.3s" repeatCount="indefinite"/>
        </path>

        {/* Checkmark inside cloud */}
        <path d="M91,77 L100,86 L118,66"
          fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
          strokeDasharray="35" strokeDashoffset="35">
          <animate attributeName="stroke-dashoffset" values="35;35;0;0;35"
            keyTimes="0;0.68;0.82;0.9;1"
            dur="6.3s" repeatCount="indefinite"
            calcMode="spline" keySplines="0 0 0 0;0.4 0 0.2 1;0 0 0 0;0 0 0 0"/>
          <animate attributeName="opacity" values="0;0;1;1;0"
            keyTimes="0;0.68;0.75;0.9;0.95"
            dur="6.3s" repeatCount="indefinite"/>
        </path>

        {/* Cloud glow ring — appears on save */}
        <ellipse cx="111" cy="74" rx="46" ry="26" fill="none" stroke="#6366f1" strokeWidth="1" opacity="0">
          <animate attributeName="opacity" values="0;0;0.5;0;0" keyTimes="0;0.72;0.78;0.88;1" dur="6.3s" repeatCount="indefinite"/>
          <animate attributeName="rx" values="42;42;52;60;60" keyTimes="0;0.72;0.78;0.88;1" dur="6.3s" repeatCount="indefinite"/>
          <animate attributeName="ry" values="24;24;30;36;36" keyTimes="0;0.72;0.78;0.88;1" dur="6.3s" repeatCount="indefinite"/>
        </ellipse>
      </g>

      {/* ── Phone/device at bottom ── */}
      <g>
        {/* Phone body */}
        <rect x="72" y="170" width="56" height="48" rx="8" fill="#0d1117" stroke="#1e293b" strokeWidth="1.5"/>
        {/* Screen */}
        <rect x="78" y="175" width="44" height="36" rx="5" fill="#030712"/>
        {/* Home bar */}
        <rect x="90" y="214" width="20" height="2.5" rx="1.25" fill="#1e293b"/>
        {/* Screen content — mini card */}
        <rect x="82" y="179" width="36" height="24" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.5"/>
        <rect x="85" y="184" width="20" height="2" rx="1" fill="#475569"/>
        <rect x="85" y="189" width="14" height="1.5" rx="0.75" fill="#334155"/>
        <rect x="85" y="193" width="22" height="1.5" rx="0.75" fill="#334155"/>
        {/* Upload indicator */}
        <text x="100" y="208" textAnchor="middle" fill="#6366f1" fontSize="6.5" fontFamily="monospace" letterSpacing="1.5" opacity="0.7">
          UPLOAD
          <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.1s" repeatCount="indefinite"/>
        </text>
      </g>

      {/* Saved label below cloud */}
      <text x="100" y="114" textAnchor="middle" fill="#10b981" fontSize="7.5" fontFamily="monospace" letterSpacing="1.5" opacity="0">
        SAVED
        <animate attributeName="opacity" values="0;0;0;1;1;0" keyTimes="0;0.6;0.75;0.82;0.92;1" dur="6.3s" repeatCount="indefinite"/>
      </text>
    </svg>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

const STEPS = [
  {
    num:       '01',
    Animation: ScanAnimation,
    title:     'Scan',
    desc:      'Point your camera at any business card. Our AI scanning engine locks on, extracts every field, and processes it in under a second.',
  },
  {
    num:       '02',
    Animation: ReviewAnimation,
    title:     'Review',
    desc:      'AI-extracted fields appear instantly — name, company, email, phone, LinkedIn. Edit anything, add tags, and link to a calendar event.',
  },
  {
    num:       '03',
    Animation: CloudSaveAnimation,
    title:     'Save',
    desc:      'One tap syncs the contact to your secure Convex vault. Available instantly across all your devices, in real time.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-5 sm:px-8 bg-[#0d1117]/60 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            From card to contact in 3 seconds
          </h2>
          <p className="text-gray-400 text-lg">No typing. No losing cards. Just scan and go.</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-start">
          {STEPS.map(({ num, Animation, title, desc }, i) => (
            <div key={num} className="flex flex-col items-center text-center group">
              {/* SVG animation card */}
              <div className="relative w-full flex justify-center mb-8">
                {/* Glow behind animation */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-32 h-32 bg-brand-600/10 rounded-full blur-2xl" />
                </div>
                <div className="relative z-10 w-44 h-48 flex items-center justify-center">
                  <Animation />
                </div>
              </div>

              {/* Step number + connector */}
              <div className="flex items-center gap-4 mb-4 w-full justify-center">
                <div className="w-10 h-10 rounded-xl bg-brand-600/15 border border-brand-600/30 flex items-center justify-center text-brand-400 text-sm font-black shrink-0">
                  {num}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-brand-600/30 to-transparent" />
                )}
              </div>

              <h3 className="text-white font-bold text-xl mb-2 group-hover:text-brand-300 transition-colors">
                {title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
