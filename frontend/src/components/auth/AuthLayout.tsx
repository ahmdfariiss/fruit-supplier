'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AuthLayoutProps {
  children: React.ReactNode;
  activeTab?: 'login' | 'register';
}

export default function AuthLayout({ children, activeTab }: AuthLayoutProps) {
  const pathname = usePathname();
  const current =
    activeTab || (pathname?.includes('register') ? 'register' : 'login');

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* ══════════════════════════════════════════════════════════
          LEFT PANEL
      ══════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:flex flex-col justify-between p-11 min-h-screen relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #071204 0%, #0d1e07 45%, #0a1905 100%)' }}
      >
        {/* Grain overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='260'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='260' height='260' filter='url(%23n)' opacity='0.07'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat', mixBlendMode: 'overlay',
        }} />

        {/* Ambient glow bottom */}
        <div className="absolute pointer-events-none z-0" style={{
          bottom: '-120px', left: '50%', transform: 'translateX(-50%)',
          width: '480px', height: '480px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(50,130,8,0.16) 0%, rgba(18,72,0,0.07) 50%, transparent 70%)',
        }} />

        {/* Ambient glow top-right */}
        <div className="absolute pointer-events-none z-0" style={{
          top: '-60px', right: '-40px',
          width: '300px', height: '300px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(90,160,18,0.13) 0%, transparent 65%)',
        }} />

        {/* Subtle arc rings */}
        <svg className="absolute inset-0 pointer-events-none z-0" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="0" cy="100%" r="240" fill="none" stroke="rgba(90,170,20,0.05)" strokeWidth="1"/>
          <circle cx="0" cy="100%" r="370" fill="none" stroke="rgba(90,170,20,0.03)" strokeWidth="0.8"/>
          <circle cx="100%" cy="0" r="150" fill="none" stroke="rgba(70,140,10,0.04)" strokeWidth="1"/>
          <line x1="0" y1="38%" x2="100%" y2="38%" stroke="rgba(140,200,50,0.04)" strokeWidth="0.7"/>
        </svg>

        {/*
          ═══════════════════════════════════════════════════════
          LEAF CLUSTER — TOP RIGHT
          Each leaf = a proper OVAL-LANCEOLATE shape:
          symmetric ellipse tapered to a sharp tip at both ends,
          like daun mangga / daun jambu / daun rambutan.
          They FAN OUT from a shared stem node at the corner.
          Each leaf is drawn in its "natural upright" position
          (petiole at bottom-center, tip pointing up), then
          rotated into its final fan angle with CSS transform
          on individual <g> elements.
          ═══════════════════════════════════════════════════════
        */}
        <svg
          className="absolute pointer-events-none"
          style={{ top: 0, right: 0, overflow: 'visible', zIndex: 1 }}
          width="1" height="1"
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Each leaf has a gradient: bright top-half, darker base */}
            <linearGradient id="g_a" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#8ed436" stopOpacity="0.96"/>
              <stop offset="35%"  stopColor="#5aaa1a" stopOpacity="0.93"/>
              <stop offset="70%"  stopColor="#3d8010" stopOpacity="0.89"/>
              <stop offset="100%" stopColor="#224e06" stopOpacity="0.85"/>
            </linearGradient>
            <linearGradient id="g_b" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#7ece2c" stopOpacity="0.93"/>
              <stop offset="40%"  stopColor="#4e9c14" stopOpacity="0.89"/>
              <stop offset="100%" stopColor="#1e4608" stopOpacity="0.84"/>
            </linearGradient>
            <linearGradient id="g_c" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#6abe24" stopOpacity="0.91"/>
              <stop offset="45%"  stopColor="#448c10" stopOpacity="0.87"/>
              <stop offset="100%" stopColor="#1a3e06" stopOpacity="0.82"/>
            </linearGradient>
            <linearGradient id="g_d" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#98dc3c" stopOpacity="0.94"/>
              <stop offset="35%"  stopColor="#62b020" stopOpacity="0.90"/>
              <stop offset="100%" stopColor="#265408" stopOpacity="0.85"/>
            </linearGradient>
            <linearGradient id="g_e" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#5ab41c" stopOpacity="0.88"/>
              <stop offset="50%"  stopColor="#38780e" stopOpacity="0.84"/>
              <stop offset="100%" stopColor="#163204" stopOpacity="0.80"/>
            </linearGradient>
            <linearGradient id="g_f" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#4ea016" stopOpacity="0.86"/>
              <stop offset="50%"  stopColor="#2e6409" stopOpacity="0.82"/>
              <stop offset="100%" stopColor="#122804" stopOpacity="0.78"/>
            </linearGradient>
            <linearGradient id="g_g" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%"   stopColor="#88d030" stopOpacity="0.90"/>
              <stop offset="40%"  stopColor="#52981a" stopOpacity="0.86"/>
              <stop offset="100%" stopColor="#204808" stopOpacity="0.82"/>
            </linearGradient>
            {/* Shared highlight sheen — left of midrib */}
            <linearGradient id="sheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#c8f060" stopOpacity="0.18"/>
              <stop offset="60%"  stopColor="#c8f060" stopOpacity="0.06"/>
              <stop offset="100%" stopColor="#c8f060" stopOpacity="0"/>
            </linearGradient>
            <filter id="ls" x="-40%" y="-40%" width="200%" height="200%">
              <feDropShadow dx="2" dy="5" stdDeviation="9" floodColor="#030a02" floodOpacity="0.60"/>
            </filter>
          </defs>

          {/*
            LEAF TEMPLATE (in local coords, before rotation):
            - Tip at (0, -130): sharp apical tip
            - Widest at (±38, -50): broadest mid-section
            - Base / petiole attachment at (0, 0)
            Using cubic bezier to get natural lanceolate curve.
            The path draws: tip → right edge curve down → base → left edge curve up → tip
          */}

          {/*
            FAN ARRANGEMENT (all pivoting from approx top-right corner
            of the panel, which we call the "origin"):
            We position each leaf's petiole at the shared origin
            by translating to that origin, then rotating.

            Screen origin for the fan node ≈ top-right corner of panel.
            We use absolute px coords. Panel is ~680px wide, leaves
            hang DOWN and to the LEFT from the corner.

            Leaf angles (0° = pointing straight UP from node):
            A:  -20°  (nearly vertical, slight right lean)
            B:  -55°  (leaning left-up)
            C:  -90°  (horizontal left)
            D:  -130° (angling down-left)
            E:  -165° (nearly straight down, slight left)
            F:  +15°  (leaning right, partially off-screen)
            G:  -40°  (between A and B)

            We render using <g transform="translate(ox,oy) rotate(angle)">
            where ox,oy is the fan origin in the SVG's own coordinate space.
            The SVG is 1x1 with overflow:visible, positioned top:0 right:0
            so its (0,0) = top-right corner of the panel.
          */}

          {/* ── helper macro: one leaf shape reused via transform ──
              Since SVG doesn't have macros easily, we draw each leaf inline.
              Leaf shape template (petiole at origin, tip upward):
                M 0 0
                C  6 -10,  36 -30,  38 -55   ← right shoulder
                C  40 -80, 20 -115, 0 -130   ← right edge to tip
                C -20 -115,-40 -80, -38 -55  ← left edge from tip
                C -36 -30, -6 -10,  0  0     ← left shoulder to petiole

              Midrib: M 0 0 L 0 -130
              Lateral veins (right side, mirrored left):
                at y=-30: C 0,-30  20,-34  30,-36
                at y=-55: C 0,-55  22,-58  32,-60
                at y=-80: C 0,-80  18,-83  26,-85
                at y=-105:C 0,-105 12,-107 18,-108
          ──────────────────────────────────────────────────── */}

          {/* LEAF F — far right, partially clipped by corner */}
          <g transform="translate(0,0) rotate(15)" filter="url(#ls)">
            <path d="M 0 0 C 6 -10, 36 -30, 38 -55 C 40 -80, 20 -115, 0 -130 C -20 -115,-40 -80,-38 -55 C -36 -30,-6 -10, 0 0Z" fill="url(#g_f)"/>
            <path d="M 0 0 C 2 -10, 4 -60, 0 -130" stroke="rgba(5,18,2,0.45)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M 2 -30 C 8 -32, 22 -35, 30 -37"  stroke="rgba(5,18,2,0.22)" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
            <path d="M 2 -55 C 8 -57, 20 -60, 28 -62"  stroke="rgba(5,18,2,0.20)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
            <path d="M 1 -80 C 6 -82, 16 -84, 22 -86"  stroke="rgba(5,18,2,0.17)" strokeWidth="0.60" fill="none" strokeLinecap="round"/>
            <path d="M 0 -105 C 4 -107, 10 -108, 15 -109" stroke="rgba(5,18,2,0.14)" strokeWidth="0.55" fill="none" strokeLinecap="round"/>
            <path d="M -2 -30 C -8 -32,-22 -35,-30 -37"  stroke="rgba(5,18,2,0.18)" strokeWidth="0.7" fill="none" strokeLinecap="round"/>
            <path d="M -2 -55 C -8 -57,-20 -60,-28 -62"  stroke="rgba(5,18,2,0.16)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
            <path d="M -1 -80 C -6 -82,-16 -84,-22 -86"  stroke="rgba(5,18,2,0.14)" strokeWidth="0.60" fill="none" strokeLinecap="round"/>
          </g>

          {/* LEAF A — nearly vertical, slight rightward lean */}
          <g transform="translate(0,0) rotate(-22)" filter="url(#ls)">
            <path d="M 0 0 C 6 -10, 38 -32, 40 -60 C 42 -88, 22 -118, 0 -135 C -22 -118,-42 -88,-40 -60 C -38 -32,-6 -10, 0 0Z" fill="url(#g_a)"/>
            {/* Left sheen */}
            <path d="M 0 -135 C -10 -110,-30 -80,-38 -55 C -38 -55,-20 -84, 0 -135Z" fill="url(#sheen)"/>
            <path d="M 0 0 C 1 -12, 1 -65, 0 -135" stroke="rgba(4,16,1,0.50)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <path d="M 2 -35 C 10 -38, 26 -42, 36 -44"  stroke="rgba(4,16,1,0.26)" strokeWidth="0.80" fill="none" strokeLinecap="round"/>
            <path d="M 2 -62 C 9  -65, 24 -68, 34 -70"  stroke="rgba(4,16,1,0.23)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
            <path d="M 1 -88 C 7  -91, 19 -94, 26 -96"  stroke="rgba(4,16,1,0.20)" strokeWidth="0.70" fill="none" strokeLinecap="round"/>
            <path d="M 1 -112 C 5 -114, 13 -116, 18 -117" stroke="rgba(4,16,1,0.16)" strokeWidth="0.62" fill="none" strokeLinecap="round"/>
            <path d="M -2 -35 C -10 -38,-26 -42,-36 -44"  stroke="rgba(4,16,1,0.22)" strokeWidth="0.80" fill="none" strokeLinecap="round"/>
            <path d="M -2 -62 C -9  -65,-24 -68,-34 -70"  stroke="rgba(4,16,1,0.19)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
            <path d="M -1 -88 C -7  -91,-19 -94,-26 -96"  stroke="rgba(4,16,1,0.17)" strokeWidth="0.70" fill="none" strokeLinecap="round"/>
            <path d="M -1 -112 C -5 -114,-13 -116,-18 -117" stroke="rgba(4,16,1,0.14)" strokeWidth="0.62" fill="none" strokeLinecap="round"/>
            {/* Bright rim highlight */}
            <path d="M 0 0 C -4 -12,-36 -50,-40 -80 C -42 -100,-30 -120, 0 -135" stroke="rgba(170,255,70,0.12)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </g>

          {/* LEAF G — between A and B */}
          <g transform="translate(0,0) rotate(-42)" filter="url(#ls)">
            <path d="M 0 0 C 6 -10, 36 -30, 38 -55 C 40 -80, 20 -115, 0 -130 C -20 -115,-40 -80,-38 -55 C -36 -30,-6 -10, 0 0Z" fill="url(#g_g)"/>
            <path d="M 0 0 C 0 -12, 0 -60, 0 -130" stroke="rgba(4,16,1,0.46)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M 2 -30 C 9 -33, 24 -37, 33 -39"  stroke="rgba(4,16,1,0.24)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
            <path d="M 2 -55 C 8 -58, 21 -62, 29 -64"  stroke="rgba(4,16,1,0.21)" strokeWidth="0.70" fill="none" strokeLinecap="round"/>
            <path d="M 1 -80 C 6 -83, 17 -86, 23 -88"  stroke="rgba(4,16,1,0.18)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
            <path d="M 1 -105 C 4 -107, 11 -109, 15 -110" stroke="rgba(4,16,1,0.14)" strokeWidth="0.58" fill="none" strokeLinecap="round"/>
            <path d="M -2 -30 C -9 -33,-24 -37,-33 -39"  stroke="rgba(4,16,1,0.20)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
            <path d="M -2 -55 C -8 -58,-21 -62,-29 -64"  stroke="rgba(4,16,1,0.17)" strokeWidth="0.70" fill="none" strokeLinecap="round"/>
            <path d="M -1 -80 C -6 -83,-17 -86,-23 -88"  stroke="rgba(4,16,1,0.15)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
          </g>

          {/* LEAF B — angling up-left ~55° */}
          <g transform="translate(0,0) rotate(-58)" filter="url(#ls)">
            <path d="M 0 0 C 6 -10, 40 -34, 42 -62 C 44 -92, 24 -122, 0 -140 C -24 -122,-44 -92,-42 -62 C -40 -34,-6 -10, 0 0Z" fill="url(#g_b)"/>
            <path d="M 0 -140 C -12 -115,-34 -82,-42 -58 C -42 -58,-22 -88, 0 -140Z" fill="url(#sheen)"/>
            <path d="M 0 0 C 0 -14, 0 -70, 0 -140" stroke="rgba(4,16,1,0.50)" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
            <path d="M 2 -38 C 10 -42, 28 -47, 38 -49"   stroke="rgba(4,16,1,0.27)" strokeWidth="0.82" fill="none" strokeLinecap="round"/>
            <path d="M 2 -65 C 9  -68, 25 -72, 35 -74"   stroke="rgba(4,16,1,0.24)" strokeWidth="0.77" fill="none" strokeLinecap="round"/>
            <path d="M 1 -92 C 7  -95, 21 -98, 29 -100"  stroke="rgba(4,16,1,0.21)" strokeWidth="0.72" fill="none" strokeLinecap="round"/>
            <path d="M 1 -116 C 5 -118, 14 -120, 20 -121" stroke="rgba(4,16,1,0.17)" strokeWidth="0.64" fill="none" strokeLinecap="round"/>
            <path d="M -2 -38 C -10 -42,-28 -47,-38 -49"   stroke="rgba(4,16,1,0.23)" strokeWidth="0.82" fill="none" strokeLinecap="round"/>
            <path d="M -2 -65 C -9  -68,-25 -72,-35 -74"   stroke="rgba(4,16,1,0.20)" strokeWidth="0.77" fill="none" strokeLinecap="round"/>
            <path d="M -1 -92 C -7  -95,-21 -98,-29 -100"  stroke="rgba(4,16,1,0.18)" strokeWidth="0.72" fill="none" strokeLinecap="round"/>
            <path d="M -1 -116 C -5 -118,-14 -120,-20 -121" stroke="rgba(4,16,1,0.14)" strokeWidth="0.64" fill="none" strokeLinecap="round"/>
            <path d="M 0 0 C -4 -14,-38 -56,-42 -86 C -44 -108,-28 -128, 0 -140" stroke="rgba(170,255,70,0.11)" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </g>

          {/* LEAF C — near horizontal, pointing left ~90° */}
          <g transform="translate(0,0) rotate(-90)" filter="url(#ls)">
            <path d="M 0 0 C 6 -10, 38 -30, 40 -56 C 42 -84, 22 -116, 0 -132 C -22 -116,-42 -84,-40 -56 C -38 -30,-6 -10, 0 0Z" fill="url(#g_c)"/>
            <path d="M 0 0 C 0 -12, 0 -62, 0 -132" stroke="rgba(4,16,1,0.46)" strokeWidth="1.7" fill="none" strokeLinecap="round"/>
            <path d="M 2 -32 C 9 -35, 25 -39, 35 -41"   stroke="rgba(4,16,1,0.25)" strokeWidth="0.78" fill="none" strokeLinecap="round"/>
            <path d="M 2 -58 C 8 -61, 23 -65, 32 -67"   stroke="rgba(4,16,1,0.22)" strokeWidth="0.73" fill="none" strokeLinecap="round"/>
            <path d="M 1 -84 C 6 -87, 18 -90, 25 -92"   stroke="rgba(4,16,1,0.19)" strokeWidth="0.68" fill="none" strokeLinecap="round"/>
            <path d="M 1 -108 C 4 -110, 12 -112, 17 -113" stroke="rgba(4,16,1,0.15)" strokeWidth="0.60" fill="none" strokeLinecap="round"/>
            <path d="M -2 -32 C -9 -35,-25 -39,-35 -41"   stroke="rgba(4,16,1,0.21)" strokeWidth="0.78" fill="none" strokeLinecap="round"/>
            <path d="M -2 -58 C -8 -61,-23 -65,-32 -67"   stroke="rgba(4,16,1,0.18)" strokeWidth="0.73" fill="none" strokeLinecap="round"/>
            <path d="M -1 -84 C -6 -87,-18 -90,-25 -92"   stroke="rgba(4,16,1,0.16)" strokeWidth="0.68" fill="none" strokeLinecap="round"/>
          </g>

          {/* LEAF D — angling down-left ~130° */}
          <g transform="translate(0,0) rotate(-130)" filter="url(#ls)">
            <path d="M 0 0 C 6 -10, 36 -30, 38 -55 C 40 -80, 20 -115, 0 -130 C -20 -115,-40 -80,-38 -55 C -36 -30,-6 -10, 0 0Z" fill="url(#g_d)"/>
            <path d="M 0 0 C 0 -12, 0 -60, 0 -130" stroke="rgba(4,16,1,0.46)" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
            <path d="M 2 -30 C 9 -33, 24 -37, 33 -39"   stroke="rgba(4,16,1,0.25)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
            <path d="M 2 -55 C 8 -58, 21 -62, 29 -64"   stroke="rgba(4,16,1,0.22)" strokeWidth="0.70" fill="none" strokeLinecap="round"/>
            <path d="M 1 -80 C 6 -83, 17 -86, 23 -88"   stroke="rgba(4,16,1,0.19)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
            <path d="M 1 -105 C 4 -107, 11 -109, 15 -110" stroke="rgba(4,16,1,0.15)" strokeWidth="0.58" fill="none" strokeLinecap="round"/>
            <path d="M -2 -30 C -9 -33,-24 -37,-33 -39"   stroke="rgba(4,16,1,0.21)" strokeWidth="0.75" fill="none" strokeLinecap="round"/>
            <path d="M -2 -55 C -8 -58,-21 -62,-29 -64"   stroke="rgba(4,16,1,0.18)" strokeWidth="0.70" fill="none" strokeLinecap="round"/>
            <path d="M -1 -80 C -6 -83,-17 -86,-23 -88"   stroke="rgba(4,16,1,0.16)" strokeWidth="0.65" fill="none" strokeLinecap="round"/>
          </g>

          {/* LEAF E — nearly straight down ~165° */}
          <g transform="translate(0,0) rotate(-165)" filter="url(#ls)">
            <path d="M 0 0 C 6 -10, 34 -28, 36 -52 C 38 -76, 20 -110, 0 -126 C -20 -110,-38 -76,-36 -52 C -34 -28,-6 -10, 0 0Z" fill="url(#g_e)"/>
            <path d="M 0 0 C 0 -12, 0 -58, 0 -126" stroke="rgba(4,16,1,0.44)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            <path d="M 2 -28 C 8 -31, 22 -35, 30 -37"   stroke="rgba(4,16,1,0.22)" strokeWidth="0.72" fill="none" strokeLinecap="round"/>
            <path d="M 2 -52 C 7 -55, 20 -58, 27 -60"   stroke="rgba(4,16,1,0.19)" strokeWidth="0.67" fill="none" strokeLinecap="round"/>
            <path d="M 1 -76 C 5 -79, 15 -82, 21 -84"   stroke="rgba(4,16,1,0.16)" strokeWidth="0.62" fill="none" strokeLinecap="round"/>
            <path d="M 1 -100 C 4 -102, 10 -104, 14 -105" stroke="rgba(4,16,1,0.13)" strokeWidth="0.55" fill="none" strokeLinecap="round"/>
            <path d="M -2 -28 C -8 -31,-22 -35,-30 -37"   stroke="rgba(4,16,1,0.18)" strokeWidth="0.72" fill="none" strokeLinecap="round"/>
            <path d="M -2 -52 C -7 -55,-20 -58,-27 -60"   stroke="rgba(4,16,1,0.15)" strokeWidth="0.67" fill="none" strokeLinecap="round"/>
            <path d="M -1 -76 C -5 -79,-15 -82,-21 -84"   stroke="rgba(4,16,1,0.13)" strokeWidth="0.62" fill="none" strokeLinecap="round"/>
          </g>

          {/* ── STEM / BRANCH NODE at origin (0,0) = top-right corner ── */}
          {/* Small woody knot that all petioles emerge from */}
          <circle cx="0" cy="0" r="7" fill="#0e2804" opacity="0.80"/>
          <circle cx="0" cy="0" r="4" fill="#162e05" opacity="0.60"/>

          {/* Dew drops — positioned on the "screen" fan, scattered naturally */}
          {/* These stay in the SVG local space so they appear on leaf surfaces */}
          {/* We approximate by placing them at known leaf positions after transform */}
        </svg>

        {/* Dew drops as separate absolutely-positioned tiny SVG (world coords) */}
        <svg className="absolute pointer-events-none z-2" style={{ top: 0, right: 0, overflow: 'visible' }} width="1" height="1" viewBox="0 0 1 1">
          {/* Approximate world positions of dew on each leaf after rotation */}
          {/* Leaf A (rot -22): tip is ~up-right, vein ~(-22°), at ~120px from origin */}
          {[
            { x: -28,  y: -125 },  /* Leaf A tip area */
            { x: -55,  y: -80  },  /* Leaf A mid */
            { x: -100, y: -60  },  /* Leaf B mid */
            { x: -135, y: -30  },  /* Leaf B lower */
            { x: -130, y: 20   },  /* Leaf C (horizontal) */
            { x: -120, y: 55   },  /* Leaf D */
            { x: -75,  y: 90   },  /* Leaf D lower */
            { x: -30,  y: 110  },  /* Leaf E */
            { x: 30,   y: -110 },  /* Leaf F */
            { x: -80,  y: -95  },  /* Leaf B tip */
            { x: -62,  y: -112 },  /* Leaf G tip */
          ].map((d, i) => (
            <ellipse
              key={i}
              cx={d.x} cy={d.y}
              rx={i % 3 === 0 ? 3.5 : i % 3 === 1 ? 2.8 : 2.2}
              ry={i % 3 === 0 ? 2.6 : i % 3 === 1 ? 2.1 : 1.6}
              fill="rgba(215,255,150,0.28)"
              opacity="0.55"
            />
          ))}
        </svg>

        {/* ── BOTTOM LEFT small accent leaves ── */}
        <svg
          className="absolute pointer-events-none"
          style={{ bottom: 0, left: 0, overflow: 'visible', zIndex: 1 }}
          width="1" height="1"
          viewBox="0 0 1 1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bl_a" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%"   stopColor="#1e4806" stopOpacity="0.82"/>
              <stop offset="50%"  stopColor="#3a7e12" stopOpacity="0.78"/>
              <stop offset="100%" stopColor="#5aaa1c" stopOpacity="0.72"/>
            </linearGradient>
            <linearGradient id="bl_b" x1="50%" y1="100%" x2="50%" y2="0%">
              <stop offset="0%"   stopColor="#163604" stopOpacity="0.74"/>
              <stop offset="100%" stopColor="#4a9018" stopOpacity="0.66"/>
            </linearGradient>
            <filter id="bls" x="-40%" y="-40%" width="200%" height="200%">
              <feDropShadow dx="-1" dy="-3" stdDeviation="7" floodColor="#020802" floodOpacity="0.50"/>
            </filter>
          </defs>
          {/* Two small leaves from bottom-left corner, pointing up-right */}
          <g transform="translate(0,0) rotate(60)" filter="url(#bls)">
            <path d="M 0 0 C 5 -8, 28 -24, 30 -44 C 32 -64, 16 -90, 0 -102 C -16 -90,-32 -64,-30 -44 C -28 -24,-5 -8, 0 0Z" fill="url(#bl_a)"/>
            <path d="M 0 0 C 0 -10, 0 -50, 0 -102" stroke="rgba(4,14,1,0.40)" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            <path d="M 1 -24 C 6 -27, 16 -30, 22 -32" stroke="rgba(4,14,1,0.22)" strokeWidth="0.62" fill="none" strokeLinecap="round"/>
            <path d="M 1 -44 C 6 -47, 15 -50, 21 -52" stroke="rgba(4,14,1,0.19)" strokeWidth="0.58" fill="none" strokeLinecap="round"/>
            <path d="M 1 -65 C 5 -67, 12 -69, 17 -71" stroke="rgba(4,14,1,0.16)" strokeWidth="0.53" fill="none" strokeLinecap="round"/>
            <path d="M -1 -24 C -6 -27,-16 -30,-22 -32" stroke="rgba(4,14,1,0.18)" strokeWidth="0.62" fill="none" strokeLinecap="round"/>
            <path d="M -1 -44 C -6 -47,-15 -50,-21 -52" stroke="rgba(4,14,1,0.15)" strokeWidth="0.58" fill="none" strokeLinecap="round"/>
          </g>
          <g transform="translate(0,0) rotate(40)" filter="url(#bls)">
            <path d="M 0 0 C 4 -7, 24 -22, 26 -40 C 28 -58, 14 -82, 0 -93 C -14 -82,-28 -58,-26 -40 C -24 -22,-4 -7, 0 0Z" fill="url(#bl_b)"/>
            <path d="M 0 0 C 0 -9, 0 -46, 0 -93" stroke="rgba(4,14,1,0.36)" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            <path d="M 1 -22 C 5 -25, 14 -28, 20 -30" stroke="rgba(4,14,1,0.20)" strokeWidth="0.58" fill="none" strokeLinecap="round"/>
            <path d="M 1 -42 C 5 -44, 13 -47, 18 -49" stroke="rgba(4,14,1,0.17)" strokeWidth="0.53" fill="none" strokeLinecap="round"/>
            <path d="M 1 -62 C 4 -64, 10 -66, 14 -67" stroke="rgba(4,14,1,0.14)" strokeWidth="0.48" fill="none" strokeLinecap="round"/>
            <path d="M -1 -22 C -5 -25,-14 -28,-20 -30" stroke="rgba(4,14,1,0.16)" strokeWidth="0.58" fill="none" strokeLinecap="round"/>
            <path d="M -1 -42 C -5 -44,-13 -47,-18 -49" stroke="rgba(4,14,1,0.13)" strokeWidth="0.53" fill="none" strokeLinecap="round"/>
          </g>
          <circle cx="0" cy="0" r="5" fill="#0c2003" opacity="0.70"/>
        </svg>

        {/* ══ CONTENT ══ */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 font-lora text-[1.3rem] font-semibold text-white no-underline mb-14">
            <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-base"
              style={{ background: 'linear-gradient(135deg, #5ab020 0%, #2d7a00 100%)', boxShadow: '0 2px 14px rgba(80,180,20,0.4), inset 0 1px 0 rgba(255,255,255,0.18)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.5 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
              </svg>
            </div>
            BuahKita
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-8" style={{ background: 'linear-gradient(90deg, rgba(120,200,50,0.7), transparent)' }}/>
            <span className="text-[0.68rem] tracking-[0.18em] font-bold uppercase" style={{ color: 'rgba(138,216,55,0.7)' }}>
              Platform Buah Lokal Indonesia
            </span>
          </div>

          <h2 className="font-lora text-[clamp(1.9rem,2.9vw,3rem)] font-semibold text-white leading-[1.15] tracking-tight mb-5">
            Belanja Buah Segar,<br/>
            <em style={{ fontStyle: 'italic', backgroundImage: 'linear-gradient(135deg, #a8cf6f 0%, #5ab020 50%, #8ed44a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Langsung dari
            </em><br/>
            Petaninya
          </h2>

          <p className="text-[0.88rem] leading-[1.8] max-w-[360px] mb-9" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Bergabung dan nikmati kemudahan pesan, invoice otomatis, dan
            transparansi penuh rantai distribusi buah lokal Indonesia.
          </p>

          {/* Stats */}
          <div className="flex gap-4 mb-7">
            {[
              { num: '2.400+', label: 'Pelanggan Aktif' },
              { num: '120+',   label: 'Petani Mitra' },
              { num: '99%',    label: 'Kepuasan' },
            ].map((s) => (
              <div key={s.num} className="flex-1 rounded-2xl p-3 text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-[1.1rem] font-bold font-lora"
                  style={{ backgroundImage: 'linear-gradient(135deg, #a8cf6f 0%, #5ab020 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {s.num}
                </div>
                <div className="text-[0.65rem] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            {[
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, title: 'Invoice PDF Otomatis', desc: 'Setiap pesanan langsung punya invoice formal' },
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>, title: 'Upload Bukti Transfer', desc: 'Konfirmasi bayar tanpa kirim foto ke WA' },
              { icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Pantau Status Real-Time', desc: 'Lacak pesanan dari dibuat hingga selesai' },
            ].map((f) => (
              <div key={f.title} className="flex items-center gap-3 rounded-2xl py-3 px-4"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(4px)' }}>
                <div className="w-[32px] h-[32px] rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(90,170,25,0.22) 0%, rgba(50,110,8,0.14) 100%)', border: '1px solid rgba(110,190,40,0.2)', color: '#8ed44a' }}>
                  {f.icon}
                </div>
                <div>
                  <strong className="block text-[0.82rem] font-bold text-white mb-px">{f.title}</strong>
                  <span className="text-[0.72rem]" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.desc}</span>
                </div>
                <div className="ml-auto w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: 'rgba(110,190,40,0.5)' }}/>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 mt-6">
          <div className="mb-5 h-px w-full" style={{ background: 'linear-gradient(90deg, rgba(110,190,40,0.22), transparent 70%)' }}/>
          <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.032)', border: '1px solid rgba(255,255,255,0.075)', backdropFilter: 'blur(8px)' }}>
            <div className="font-lora text-4xl leading-none mb-2 select-none" style={{ color: 'rgba(110,190,40,0.28)', fontStyle: 'italic' }}>&ldquo;</div>
            <p className="font-lora italic text-[0.85rem] leading-[1.75] mb-3" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Dulu repot banget pesan lewat WA. Sekarang semua di website — invoice langsung ada, upload bukti TF langsung dikonfirmasi!
            </p>
            <div className="flex items-center gap-3">
              <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[0.8rem] font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #5ab020, #2d7a00)', color: 'rgba(255,255,255,0.9)', boxShadow: '0 0 0 2px rgba(90,176,32,0.3)' }}>
                RA
              </div>
              <div>
                <strong className="text-[0.78rem] text-white block">Rista Amelia</strong>
                <span className="text-[0.68rem]" style={{ color: 'rgba(255,255,255,0.45)' }}>Pelanggan sejak 2025, Semarang</span>
              </div>
              <div className="ml-auto flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#a8cf6f"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — unchanged */}
      <div className="flex flex-col items-center justify-center px-10 py-10 overflow-y-auto bg-cream">
        <div className="w-full max-w-[420px]">
          <div className="flex bg-white border-[1.5px] border-faint rounded-pill p-1 gap-1 mb-7">
            <Link href="/auth/login"
              className={`flex-1 py-2.5 rounded-pill text-[0.85rem] font-bold text-center no-underline transition-all duration-250 ${current === 'login' ? 'bg-g1 text-white shadow-[0_2px_12px_rgba(45,90,0,0.3)]' : 'text-muted bg-transparent'}`}>
              Masuk
            </Link>
            <Link href="/auth/register"
              className={`flex-1 py-2.5 rounded-pill text-[0.85rem] font-bold text-center no-underline transition-all duration-250 ${current === 'register' ? 'bg-g1 text-white shadow-[0_2px_12px_rgba(45,90,0,0.3)]' : 'text-muted bg-transparent'}`}>
              Daftar Akun
            </Link>
          </div>
          {children}
        </div>
      </div>

    </div>
  );
}