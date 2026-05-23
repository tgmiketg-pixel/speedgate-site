/* SpeedGate — Conversion-focused redesign */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

/* ─── DESIGN TOKENS (editable via Tweaks) ─── */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#39FF14",
  "cta": "#FF5C1F",
  "showStickyCta": true,
  "spotsRemaining": 47,
  "spotsTotal": 100,
  "displayFont": "Big Shoulders Display"
}/*EDITMODE-END*/;

/* ════════════════════════════════════════════════
   NAV
════════════════════════════════════════════════ */
const Nav = ({ spots, total }) => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onS = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onS);
    return () => window.removeEventListener('scroll', onS);
  }, []);
  return (
    <nav className="nav" style={scrolled ? { borderBottomColor: 'var(--border-strong)' } : {}}>
      <div className="wrap nav-row">
        <a href="#" className="brand">
          <div className="brand-mark"><Logo size={28} /></div>
          <span className="brand-word">SPEEDGATE</span>
        </a>
        <ul className="nav-links">
          <li><a href="#demo">The System</a></li>
          <li><a href="#wedge">Why It Wins</a></li>
          <li><a href="#skills">Skills Mode</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#founder">Founder</a></li>
        </ul>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div className="nav-spots">
            <span className="dot"></span>
            <span><b>{spots}</b> / {total} FOUNDER SPOTS LEFT</span>
          </div>
          <a href="#pricing" className="btn btn-primary btn-sm">
            Reserve <span className="price-tag">$149</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

/* ════════════════════════════════════════════════
   HERO — animated capture panel on right
════════════════════════════════════════════════ */
const HeroCapture = () => {
  const [t, setT] = useState(0);              // 0..1 progress
  const [phase, setPhase] = useState('run');  // 'run' | 'done'
  const rafRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    const DUR = 4200;   // ms run cycle
    const HOLD = 1400;  // ms verified hold
    const total = DUR + HOLD;
    const tick = (now) => {
      if (!startRef.current) startRef.current = now;
      const e = (now - startRef.current) % total;
      if (e < DUR) {
        setT(e / DUR);
        setPhase('run');
      } else {
        setT(1);
        setPhase('done');
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // simulated time on the gate (10ms precision)
  const elapsed = phase === 'done' ? 4.687 : (t * 4.687);
  const seconds = Math.floor(elapsed);
  const hundredths = Math.floor((elapsed - seconds) * 100);
  const timerStr = `${String(seconds).padStart(2,'0')}.${String(hundredths).padStart(2,'0')}`;

  // runner left position 8% → 78%
  const runnerLeft = 8 + t * 70;

  // biomech dots — appear progressively as runner moves
  const biomechDots = [
    { t: 0.20, x: 16, y: 40 },
    { t: 0.35, x: 30, y: 38 },
    { t: 0.50, x: 44, y: 42 },
    { t: 0.65, x: 58, y: 38 },
    { t: 0.80, x: 72, y: 40 },
  ];

  return (
    <div className={"capture " + (phase === 'done' ? 'is-verified' : '')}>
      <div className="frame-corner tl"></div>
      <div className="frame-corner tr"></div>
      <div className="frame-corner bl"></div>
      <div className="frame-corner br"></div>

      <div className="hud-top">
        <span>SPEEDGATE / CH 01</span>
        <span className="rec">REC</span>
      </div>

      <div className="timer-label">CHRONOS · 40 YD</div>
      <div className="timer-big">
        {timerStr}<span className="ms">s</span>
      </div>

      <div className="hud-data">
        <div className="data-row"><span className="k">PEAK</span><span className="v">{phase === 'done' ? '21.4' : (t * 21.4).toFixed(1)} MPH</span></div>
        <div className="data-row"><span className="k">STRIDE</span><span className="v">{phase === 'done' ? 18 : Math.floor(t * 18)}</span></div>
        <div className="data-row"><span className="k">LEAN</span><span className="v">{phase === 'done' ? '42°' : Math.floor(t * 42) + '°'}</span></div>
      </div>

      {/* track perspective */}
      <div className="runner-zone">
        <div className="track-floor"></div>
        <div className="gate-l"></div>
        <div className="gate-r"></div>
        <div className="laser-line"></div>

        {/* biomechanics dots that appear as runner crosses */}
        {biomechDots.map((d, i) => (
          t > d.t && (
            <div
              key={i}
              className="biomech-dot"
              style={{
                left: d.x + '%',
                bottom: d.y + '%',
                opacity: Math.min(1, (t - d.t) * 5),
              }}
            />
          )
        ))}

        {/* running figure */}
        <div className="runner" style={{ left: runnerLeft + '%' }}>
          <SprintFigure size={80} blur={t > 0.05} />
        </div>
      </div>

      <div className="stamp">VERIFIED · 4.69s · 40YD</div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="hero" data-screen-label="01 Hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="hero-meta">
              <span className="live">LIVE CAPTURE</span>
              <span className="sep"></span>
              <span>v1.0 / FOUNDER SERIES</span>
              <span className="sep"></span>
              <span>PRE-ORDER</span>
            </div>

            <h1>
              <span className="line">VERIFIED</span>
              <span className="line line-2">SPEED<span className="punct">.</span></span>
            </h1>

            <p className="hero-sub">
              Laser-precision timing, synchronized video, and AI biomechanics —
              fused into one portable system. The proof <b>recruiters, scouts,
              and coaches</b> actually trust. Starting at $149.
            </p>

            <div className="hero-cta-row">
              <a href="#pricing" className="btn btn-primary btn-lg">
                Reserve Yours <span className="price-tag">$149</span> <span className="arr" />
              </a>
              <a href="#demo" className="btn btn-ghost btn-lg">
                Watch a Verified Sprint
              </a>
            </div>

            <div className="hero-strip">
              <div className="cell">
                <div className="v">&lt;10<span className="unit">ms</span></div>
                <div className="l">Timing Accuracy</div>
              </div>
              <div className="cell">
                <div className="v">100<span className="unit">+</span></div>
                <div className="l">Athletes / 20 min</div>
              </div>
              <div className="cell">
                <div className="v">40<span className="unit">hr</span></div>
                <div className="l">Battery Life</div>
              </div>
              <div className="cell">
                <div className="v">2<span className="unit">min</span></div>
                <div className="l">Setup, Any Field</div>
              </div>
            </div>
          </div>

          <div>
            <HeroCapture />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   DEMO — interactive scrubbable sprint
════════════════════════════════════════════════ */
const SCRUB_DUR = 4.69; // seconds simulated

const useScrub = () => {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    if (!playing) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = (now) => {
      if (!lastRef.current) lastRef.current = now;
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      setT(prev => {
        let n = prev + dt / (SCRUB_DUR + 0.6);
        if (n > 1) n = 0;
        return n;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  const setManual = (v) => {
    setPlaying(false);
    setT(Math.max(0, Math.min(1, v)));
    lastRef.current = null;
  };

  return { t, playing, setPlaying, setManual };
};

const DemoStage = ({ t, layers }) => {
  const seconds = Math.floor(t * SCRUB_DUR);
  const hundredths = Math.floor((t * SCRUB_DUR - seconds) * 100);
  const timerStr = `${String(seconds).padStart(2,'0')}.${String(hundredths).padStart(2,'0')}`;

  // runner runs from 12% → 86%
  const runnerX = 12 + t * 74;

  const biomechDots = [
    { t: 0.15, x: 18, y: 40, label: 'KNEE' },
    { t: 0.30, x: 32, y: 38, label: 'HIP' },
    { t: 0.45, x: 46, y: 42, label: 'KNEE' },
    { t: 0.60, x: 60, y: 38, label: 'HIP' },
    { t: 0.75, x: 74, y: 40, label: 'KNEE' },
  ];

  const zones = [
    { label: '0-10', t0: 0.0, t1: 0.30 },
    { label: '10-20', t0: 0.30, t1: 0.55 },
    { label: '20-30', t0: 0.55, t1: 0.78 },
    { label: '30-40', t0: 0.78, t1: 1.0 },
  ];

  return (
    <div className="demo-stage">
      <div className="stage-grid" />

      <div className="stage-hud-top">
        <span>SPEEDGATE / DEMO-01</span>
        <span>{(t * SCRUB_DUR).toFixed(2)} / {SCRUB_DUR.toFixed(2)}s</span>
      </div>

      <div className="stage-timer-label">CHRONOS · 40 YD · VERIFIED</div>
      <div className="stage-timer-pos">
        <div className="stage-timer">
          {timerStr}<span className="ms">s</span>
        </div>
      </div>

      <div className="stage-track"></div>

      <div className="stage-gates">
        <div className="stage-gate start"></div>
        <div className="stage-gate end"></div>
      </div>

      {/* zones */}
      {layers.zones && (
        <div className="stage-zones">
          {zones.map((z, i) => (
            <div key={i} className="stage-zone">
              <span className="zlabel">{z.label}YD</span>
            </div>
          ))}
        </div>
      )}

      {/* biomechanics dots */}
      {layers.bio && biomechDots.map((d, i) => (
        t > d.t && (
          <div
            key={i}
            className="stage-bio-dot"
            style={{
              left: d.x + '%',
              bottom: d.y + '%',
              opacity: Math.min(1, (t - d.t) * 4),
            }}
          />
        )
      ))}

      {/* ball-control trail (orange) */}
      {layers.ball && (
        <>
          <svg className="stage-ball-trail" style={{ left: 0, top: 0, width: '100%', height: '100%' }} viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path
              d={`M ${120 + t * 740} ${380 + Math.sin(t * 16) * 30} q -40 -40 -80 0 t -80 0 t -80 0 t -80 0`}
              stroke="#FF5C1F"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4 4"
              opacity="0.5"
            />
          </svg>
          <div
            className="stage-ball"
            style={{
              left: `calc(${runnerX}% - 28px)`,
              bottom: `calc(20% + ${Math.abs(Math.sin(t * 20)) * 30}px)`,
            }}
          />
        </>
      )}

      {/* runner figure */}
      <div className="stage-figure" style={{ left: runnerX + '%' }}>
        <SprintFigure size={90} blur={t > 0.05 && t < 0.98} />
      </div>
    </div>
  );
};

const Demo = () => {
  const { t, playing, setPlaying, setManual } = useScrub();
  const [layers, setLayers] = useState({
    timing: true,
    bio: true,
    zones: true,
    ball: false,
  });

  const toggle = (k) => setLayers(L => ({ ...L, [k]: !L[k] }));

  const handleScrub = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setManual((e.clientX - r.left) / r.width);
  };

  // live computed values for side card
  const splits = {
    '10yd': (1.42 + (1 - Math.min(1, t * 4)) * 0.05).toFixed(2),
    '20yd': t > 0.30 ? (2.41).toFixed(2) : '--',
    '30yd': t > 0.55 ? (3.40).toFixed(2) : '--',
    '40yd': t > 0.78 ? (4.69).toFixed(2) : '--',
  };

  return (
    <section className="demo" id="demo" data-screen-label="02 Demo">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>THE SYSTEM</div>
            <h2>
              Anatomy of a <br />
              <span className="alt">verified sprint</span>
            </h2>
          </div>
          <p className="lede">
            Every run is captured, timed to the millisecond, and tagged
            biomechanically — then bundled into a single shareable, tamper-proof
            video. <b>Toggle the layers</b> to see what coaches and recruiters
            see when they open it.
          </p>
        </div>

        <div className="demo-shell">
          <div style={{ position: 'relative' }}>
            <DemoStage t={t} layers={layers} />
            <button
              className="stage-scrub-play"
              onClick={() => setPlaying(p => !p)}
              aria-label={playing ? "Pause" : "Play"}
            >
              {playing ? (
                <svg viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
              ) : (
                <svg viewBox="0 0 24 24"><polygon points="6,4 20,12 6,20"/></svg>
              )}
            </button>
            <div className="stage-scrub">
              <div className="stage-scrub-bar" onMouseDown={(e) => { handleScrub(e); }} onClick={handleScrub}>
                <div className="fill" style={{ width: `${t * 100}%` }} />
                <div className="knob" style={{ left: `${t * 100}%` }} />
              </div>
              <div className="stage-scrub-times">
                <span>00.00</span>
                <span>0:01</span>
                <span>0:02</span>
                <span>0:03</span>
                <span>04.69</span>
              </div>
            </div>
          </div>

          <div className="demo-side">
            <div>
              <div className="demo-layers-title">DATA LAYERS</div>
              <button className={"layer-toggle " + (layers.timing ? 'on' : '')} onClick={() => toggle('timing')}>
                <div>
                  <div className="lt-name">Precision Timing</div>
                  <div className="lt-desc">Sub-10ms laser gate, always on</div>
                </div>
                <div className="lt-sw"></div>
              </button>
              <button className={"layer-toggle " + (layers.zones ? 'on' : '')} onClick={() => toggle('zones')}>
                <div>
                  <div className="lt-name">Split Zones</div>
                  <div className="lt-desc">10 / 20 / 30 / 40 yard acceleration</div>
                </div>
                <div className="lt-sw"></div>
              </button>
              <button className={"layer-toggle " + (layers.bio ? 'on' : '')} onClick={() => toggle('bio')}>
                <div>
                  <div className="lt-name">AI Biomechanics</div>
                  <div className="lt-desc">Hip + knee tracking per stride</div>
                </div>
                <div className="lt-sw"></div>
              </button>
              <button className={"layer-toggle " + (layers.ball ? 'on' : '')} onClick={() => toggle('ball')}>
                <div>
                  <div className="lt-name">Ball Control</div>
                  <div className="lt-desc">Skills Mode: dribble / touch tracking</div>
                </div>
                <div className="lt-sw"></div>
              </button>
            </div>

            <div className="demo-stat-card">
              <h4><span>VERIFIED RESULT</span><span className="verified">✓ LIVE</span></h4>
              <div className="big">
                {(t * SCRUB_DUR).toFixed(2)}<span className="alt">s</span>
              </div>
              <div className="row"><span className="k">10 yd split</span><span className="v">{splits['10yd']}s</span></div>
              <div className="row"><span className="k">20 yd split</span><span className="v">{splits['20yd']}s</span></div>
              <div className="row"><span className="k">30 yd split</span><span className="v">{splits['30yd']}s</span></div>
              <div className="row"><span className="k">40 yd final</span><span className="v">{splits['40yd']}s</span></div>
              <div className="row"><span className="k">Peak speed</span><span className="v">{(t * 21.4).toFixed(1)} mph</span></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   WEDGE — Stopwatch vs Phone vs SpeedGate
════════════════════════════════════════════════ */
const Wedge = () => (
  <section className="wedge" id="wedge" data-screen-label="03 Wedge">
    <div className="wrap">
      <div className="sec-head">
        <div>
          <div className="eyebrow" style={{ marginBottom: 16 }}>WHY IT WINS</div>
          <h2>The proof <br />problem<span className="o">.</span></h2>
        </div>
        <p className="lede">
          A handheld stopwatch lies by 0.3 seconds. A phone video has no time.
          Neither opens doors. <b>SpeedGate produces the only output that travels
          with you</b> — a verified video timing record recruiters and scouts
          can trust.
        </p>
      </div>

      <div className="wedge-row">
        <div className="wedge-cell">
          <div className="num">01 / STOPWATCH</div>
          <h3>Hand timing<br/>guesses<br/>your future</h3>
          <p>
            ±0.3s human reaction error. Self-reported with no proof.
            Recruiters discount it before they read it.
          </p>
          <div className="wedge-meta">
            <div className="mrow"><span className="k">Accuracy</span><span className="v bad">±0.30s</span></div>
            <div className="mrow"><span className="k">Verifiable</span><span className="v bad">No</span></div>
            <div className="mrow"><span className="k">Recruiting use</span><span className="v bad">Discounted</span></div>
          </div>
          <div className="verdict bad">✕ Not credible</div>
        </div>

        <div className="wedge-cell">
          <div className="num">02 / PHONE VIDEO</div>
          <h3>Footage<br/>without a<br/>finish line</h3>
          <p>
            You can see the run. You can't prove the time. Coaches see
            athleticism — but nothing to measure or compare against.
          </p>
          <div className="wedge-meta">
            <div className="mrow"><span className="k">Accuracy</span><span className="v warn">None</span></div>
            <div className="mrow"><span className="k">Verifiable</span><span className="v warn">Partial</span></div>
            <div className="mrow"><span className="k">Recruiting use</span><span className="v warn">Anecdotal</span></div>
          </div>
          <div className="verdict warn">◐ Not verifiable</div>
        </div>

        <div className="wedge-cell win">
          <div className="num">03 / SPEEDGATE</div>
          <h3>Laser time +<br/><span className="alt">verified</span><br/>video</h3>
          <p>
            Sub-10ms laser gate, fused with synchronized footage and AI
            biomechanics, signed and shareable. The only output that lands
            on a coach's desk and stays there.
          </p>
          <div className="wedge-meta">
            <div className="mrow"><span className="k">Accuracy</span><span className="v good">&lt;0.01s</span></div>
            <div className="mrow"><span className="k">Verifiable</span><span className="v good">Cryptographic</span></div>
            <div className="mrow"><span className="k">Recruiting use</span><span className="v good">Currency</span></div>
          </div>
          <div className="verdict good">✓ Recruitable</div>
        </div>
      </div>
    </div>
  </section>
);

/* ════════════════════════════════════════════════
   SKILLS MODE — sport switcher
════════════════════════════════════════════════ */
const SPORTS = {
  football: {
    name: 'FOOTBALL',
    headline: <>Combine numbers,<br/><span className="alt">verified.</span></>,
    body: 'Test 100+ athletes in 20 minutes. Every 40 is signed with synchronized video — the only times recruiters trust on tape.',
    bigV: '4.42s',
    bigL: 'Verified 40-yd',
    readouts: [
      { name: '10-yd split', sub: 'Acceleration', v: '1.42', unit: 's' },
      { name: '20-yd split', sub: 'Build', v: '2.41', unit: 's' },
      { name: 'Get-off / first step', sub: 'Explosiveness', v: '0.28', unit: 's' },
      { name: 'Top speed', sub: 'Peak velocity', v: '22.1', unit: 'mph' },
      { name: 'Sprint form score', sub: 'AI biomechanics', v: '91', unit: '/100' },
    ],
    chips: ['Combine prep', 'Pro day', 'Position-specific', 'Roster testing'],
  },
  basketball: {
    name: 'BASKETBALL',
    headline: <>Speed <span className="alt">with</span><br/>the ball.</>,
    body: 'Same gate, ball-tracking on. Measure dribble frequency, hand dominance, ball-height consistency — at top speed, not standing still.',
    bigV: '94',
    bigL: 'Control score / 100',
    readouts: [
      { name: 'Dribble frequency', sub: 'Touches/sec at speed', v: '3.4', unit: 'hz' },
      { name: 'Hand dominance', sub: 'L vs R ratio', v: '58 / 42', unit: '' },
      { name: 'Ball height var.', sub: 'Consistency', v: '±2.1', unit: 'in' },
      { name: 'Crossover speed', sub: 'Hand-to-hand', v: '0.18', unit: 's' },
      { name: 'Head-up score', sub: 'Vision while moving', v: '88', unit: '/100' },
    ],
    chips: ['Full court speed', 'Crossover drills', 'Defensive slides', 'AAU testing'],
  },
  soccer: {
    name: 'SOCCER',
    headline: <>Close control<br/>at <span className="alt">full pace.</span></>,
    body: 'How does an athlete\'s speed change with the ball at their feet? SpeedGate measures touch count, foot dominance, and first-touch quality at top speed.',
    bigV: '89',
    bigL: 'First-touch score',
    readouts: [
      { name: 'Touch frequency', sub: 'Touches per 10 yds', v: '4.2', unit: '' },
      { name: 'Foot dominance', sub: 'L vs R balance', v: '47 / 53', unit: '' },
      { name: 'Ball proximity', sub: 'Avg distance', v: '0.6', unit: 'm' },
      { name: 'Speed delta', sub: 'With vs without ball', v: '-8.4', unit: '%' },
      { name: 'First touch grade', sub: 'AI scored', v: '89', unit: '/100' },
    ],
    chips: ['Academy testing', 'Position-specific', 'Combine drills', 'Showcase'],
  },
  track: {
    name: 'TRACK',
    headline: <>Lab precision,<br/><span className="alt">on any track.</span></>,
    body: 'Hand-timed 100s and stopwatch hurdles are gone. Sub-10ms laser timing matches Brower and FinishLynx for a fraction of the price — and adds biomechanics for free.',
    bigV: '10.74s',
    bigL: 'Verified 100m',
    readouts: [
      { name: 'Reaction', sub: 'Block clearance', v: '0.142', unit: 's' },
      { name: 'Acceleration phase', sub: '0–30m', v: '3.81', unit: 's' },
      { name: 'Max velocity zone', sub: '40–70m', v: '11.4', unit: 'm/s' },
      { name: 'Stride frequency', sub: 'Peak', v: '4.7', unit: 'hz' },
      { name: 'Form decay', sub: 'Late-race score', v: '94', unit: '/100' },
    ],
    chips: ['100/200/400', 'Hurdles', 'Relays', 'Sprint mechanics'],
  },
  baseball: {
    name: 'BASEBALL',
    headline: <>Home-to-first,<br/><span className="alt">on the clock.</span></>,
    body: 'Stolen-base speed, home-to-first, and 60-yard times — every scout\'s checklist, signed and shareable from the field.',
    bigV: '6.42s',
    bigL: 'Verified 60-yd',
    readouts: [
      { name: 'Home to 1st', sub: 'Out of box', v: '4.18', unit: 's' },
      { name: 'First step', sub: 'Lead off', v: '0.31', unit: 's' },
      { name: 'Acceleration', sub: '0–30 ft', v: '2.04', unit: 's' },
      { name: 'Top speed', sub: 'Peak mph', v: '21.7', unit: 'mph' },
      { name: 'Stride form', sub: 'AI score', v: '88', unit: '/100' },
    ],
    chips: ['60-yd dash', 'Home-to-first', 'Showcase prep', 'Scouting'],
  },
};

const SkillsPanel = ({ active }) => {
  const s = SPORTS[active];
  return (
    <div className="sport-panel">
      <div>
        <h3 className="sport-headline">{s.headline}</h3>
        <p className="sport-body">{s.body}</p>
        <div className="sport-metric-row">
          <div className="sport-big-metric">
            <div className="v">{s.bigV}</div>
            <div className="l">{s.bigL}</div>
          </div>
        </div>
        <div className="sport-more">
          {s.chips.map((c, i) => <div key={i} className={"chip" + (i === 0 ? ' on' : '')}>{c}</div>)}
        </div>
      </div>
      <div>
        <div className="sport-readouts">
          <h4><span>LIVE READOUT — SPEEDGATE APP</span><span className="badge">VERIFIED</span></h4>
          {s.readouts.map((r, i) => (
            <div key={i} className="readout-row">
              <div className="readout-name">
                {r.name}
                <small>{r.sub}</small>
              </div>
              <div className="readout-value">
                {r.v}<span className="sub">{r.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Skills = () => {
  const [active, setActive] = useState('football');
  return (
    <section className="skills" id="skills" data-screen-label="04 Skills">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>SKILLS MODE</div>
            <h2>Same hardware. <br /><span className="alt">Every sport.</span></h2>
          </div>
          <p className="lede">
            One gate. One camera. A software-enabled platform that scales from
            sprint biomechanics to ball control across <b>every sport that
            matters</b>. Tap a sport.
          </p>
        </div>

        <div className="sport-tabs">
          {Object.entries(SPORTS).map(([k, v]) => (
            <button
              key={k}
              className={"sport-tab " + (active === k ? 'on' : '')}
              onClick={() => setActive(k)}
            >
              {v.name}
            </button>
          ))}
        </div>

        <SkillsPanel active={active} />
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   PRICING
════════════════════════════════════════════════ */
const Pricing = ({ spots, total }) => {
  const pct = ((total - spots) / total) * 100;
  return (
    <section className="pricing" id="pricing" data-screen-label="05 Pricing">
      <div className="wrap-tight">
        <div className="sec-head" style={{ textAlign: 'center', gridTemplateColumns: '1fr', justifyItems: 'center' }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16, justifyContent: 'center', display: 'inline-flex' }}>FOUNDER PRICING — ENDS SHIPMENT 01</div>
            <h2 style={{ textAlign: 'center' }}>Get yours <br /><span className="alt">before they're gone.</span></h2>
            <p className="lede" style={{ textAlign: 'center', margin: '0 auto', maxWidth: 540 }}>
              Founder pricing is locked in for the first <b>{total} kits only</b>.
              After that, retail. Every kit ships with the SpeedGate app, free US
              shipping, and a 2-year warranty.
            </p>
          </div>
        </div>

        <div className="spots-banner">
          <span className="lbl">Founder Spots</span>
          <span className="v">{total - spots} / {total} CLAIMED</span>
          <div className="bar"><div className="bar-fill" style={{ width: pct + '%' }} /></div>
          <span className="v" style={{ color: 'var(--cta)' }}>{spots} LEFT</span>
        </div>

        <div className="price-row">
          <div className="price">
            <div className="price-tier">BASE KIT</div>
            <div className="price-name">SOLO</div>
            <div className="price-sub">For the athlete training alone.</div>
            <div className="price-amount">
              <span className="amt">$149</span>
              <span className="strike">$249</span>
            </div>
            <div className="price-save">Save 40% off retail</div>
            <ul className="price-list">
              <li className="bold">1× SpeedGate Timing Gate</li>
              <li>1× Remote Start Controller</li>
              <li>SpeedGate Mobile App (iOS / Android)</li>
              <li>1 month Athlete Pro subscription</li>
              <li>Free US shipping · 2-year warranty</li>
            </ul>
            <a href="mailto:myspeedgate@gmail.com?subject=Reserve%20SpeedGate%20Solo" className="btn btn-ghost">Reserve Solo <span className="arr" /></a>
          </div>

          <div className="price featured">
            <div className="price-tier">PRO KIT</div>
            <div className="price-name">PRO</div>
            <div className="price-sub">For combine prep + position drills.</div>
            <div className="price-amount">
              <span className="amt">$249</span>
              <span className="strike">$449</span>
            </div>
            <div className="price-save">Save 45% off retail</div>
            <ul className="price-list">
              <li className="bold">2× SpeedGate Gates (start + finish)</li>
              <li className="bold">Split timing across 4 zones</li>
              <li>1× Remote Start Controller</li>
              <li>Enhanced two-gate verification</li>
              <li>6 months Athlete Pro subscription</li>
              <li>Free US shipping · 2-year warranty</li>
            </ul>
            <a href="mailto:myspeedgate@gmail.com?subject=Reserve%20SpeedGate%20Pro" className="btn btn-primary">Reserve Pro <span className="arr" /></a>
          </div>

          <div className="price">
            <div className="price-tier">COACH BUNDLE</div>
            <div className="price-name">TEAM</div>
            <div className="price-sub">For programs and coaches.</div>
            <div className="price-amount">
              <span className="amt">$449</span>
              <span className="strike">$899</span>
            </div>
            <div className="price-save">Save 50% off retail</div>
            <ul className="price-list">
              <li className="bold">2× Pro Kits (4 gates total)</li>
              <li className="bold">Coach Dashboard + team mgmt</li>
              <li>2× Remote Controllers</li>
              <li>Priority support + onboarding</li>
              <li>1 year Team Pro subscription</li>
              <li>Free US shipping · 3-year warranty</li>
            </ul>
            <a href="mailto:myspeedgate@gmail.com?subject=Reserve%20SpeedGate%20Team" className="btn btn-ghost">Reserve Team <span className="arr" /></a>
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 32, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--muted)', textTransform: 'uppercase' }}>
          Refundable deposit · Ships Q3 2026 · No charge until shipment
        </p>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   FOUNDER
════════════════════════════════════════════════ */
const Founder = () => (
  <section className="founder" id="founder" data-screen-label="06 Founder">
    <div className="wrap">
      <div className="founder-grid">
        <div style={{ position: 'relative' }}>
          <div className="founder-img">
            <img src="founder.jpeg" alt="Michael Montoya — Founder of SpeedGate" />
            <div className="founder-tag">
              <div className="badge">MICHAEL MONTOYA</div>
              <div className="badge">FOUNDER / INVENTOR</div>
            </div>
            <div className="founder-img-meta">
              <div className="fim-row">
                <span className="fim-k">CFL</span>
                <span className="fim-sep"></span>
                <span className="fim-k">9.69 RAS</span>
                <span className="fim-sep"></span>
                <span className="fim-k">PATENT HOLDER</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 20 }}>THE FOUNDER</div>
          <h3 className="founder-quote">
            "I had coaches who timed my runs.<br/>
            <span className="alt">Most athletes don't.</span><br/>
            SpeedGate is my attempt to fix that."
          </h3>
          <div className="founder-byline">
            <b>MICHAEL MONTOYA</b>
            <span style={{ width: 16, height: 1, background: 'var(--dim)' }} />
            <span>CFL · Inventor · 9.69 RAS</span>
          </div>
          <p className="founder-credit">
            Former professional athlete (Canadian Football League) with a
            9.69 Relative Athletic Score. Creator of the NeuroReformer
            neuromuscular training system. Patent holder across hardware
            architecture, timing synchronization, and AI workflows.
          </p>
          <div className="founder-creds">
            <div className="founder-cred">
              <div className="k">ELITE ATHLETE</div>
              <div className="v">9.69 RAS — pro-grade speed &amp; explosion</div>
            </div>
            <div className="founder-cred">
              <div className="k">HARDWARE INVENTOR</div>
              <div className="v">NeuroReformer — concept to deployed product</div>
            </div>
            <div className="founder-cred">
              <div className="k">IP PROTECTED</div>
              <div className="v">Patents on architecture, timing &amp; AI</div>
            </div>
            <div className="founder-cred">
              <div className="k">PLATFORM VISION</div>
              <div className="v">Verified athletic data for NIL &amp; recruiting</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/* ════════════════════════════════════════════════
   FAQ
════════════════════════════════════════════════ */
const FAQS = [
  {
    q: "How accurate is the timing — really?",
    a: "Sub-10 millisecond laser gate, comparable to Brower Timing and FinishLynx systems used at the NFL Combine and Olympic trials. Every result is signed and tamper-proof — a verified output that recruiters and scouts can trust without seeing the run in person."
  },
  {
    q: "When does it ship?",
    a: "Founder series ships Q3 2026. Your reservation is a refundable deposit — you're not charged until your kit ships. Founder pricing is locked in even if retail goes up."
  },
  {
    q: "Does it work on any field?",
    a: "Yes. Set up in under two minutes on any surface — grass, turf, track, gym floor, driveway. Weather-resistant for outdoor use. 40-hour battery on a single charge."
  },
  {
    q: "What's 'Skills Mode'?",
    a: "Same hardware, software-enabled multi-sport expansion. Activates ball tracking for basketball and soccer; sprint biomechanics for every land sport. No new hardware required — Skills Mode is included on Pro and Team subscriptions."
  },
  {
    q: "Can I share results with college coaches?",
    a: "Every result generates a signed video file with embedded timing data. Share via the app to recruiting platforms, NIL agents, college coaches — anyone can verify the time was real, taken on a SpeedGate, and unedited."
  },
];

const FAQ = () => {
  const [open, setOpen] = useState(0);
  return (
    <section className="faq" data-screen-label="07 FAQ">
      <div className="wrap-tight">
        <div className="sec-head" style={{ marginBottom: 40 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}>FAQ</div>
            <h2>Questions, <br /><span className="alt">answered.</span></h2>
          </div>
          <p className="lede">
            Everything we get asked, in one place. Still curious? Email{' '}
            <a href="mailto:myspeedgate@gmail.com" style={{ color: 'var(--accent)', textDecoration: 'none' }}>myspeedgate@gmail.com</a>.
          </p>
        </div>
        <div className="faq-list">
          {FAQS.map((f, i) => (
            <div key={i} className={"faq-item" + (open === i ? ' open' : '')} onClick={() => setOpen(open === i ? -1 : i)}>
              <div className="faq-q">
                <span>{f.q}</span>
                <span className="plus">+</span>
              </div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ════════════════════════════════════════════════
   FINAL CTA
════════════════════════════════════════════════ */
const FinalCTA = () => (
  <section className="final-cta" id="cta" data-screen-label="08 Final CTA">
    <div className="wrap">
      <h2>
        KNOW YOUR<br/>
        <span className="alt">TRUE SPEED.</span>
      </h2>
      <p>
        Every athlete deserves the proof. Every coach deserves the tool.
        Founder pricing closes when the first 100 ship.
      </p>
      <div className="cta-row">
        <a href="#pricing" className="btn btn-primary btn-lg">
          Reserve Yours <span className="price-tag">$149</span> <span className="arr" />
        </a>
        <a href="mailto:myspeedgate@gmail.com" className="btn btn-ghost btn-lg">
          Talk to the founder
        </a>
      </div>
    </div>
  </section>
);

/* ════════════════════════════════════════════════
   FOOTER
════════════════════════════════════════════════ */
const Footer = () => (
  <footer className="footer">
    <div className="wrap">
      <div className="footer-row">
        <div className="footer-col">
          <a href="#" className="brand" style={{ marginBottom: 14 }}>
            <Logo size={26} />
            <span className="brand-word">SPEEDGATE</span>
          </a>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 320, marginTop: 8 }}>
            Verified speed, biomechanics, and skill measurement — for every
            athlete, every sport, every field.
          </p>
        </div>
        <div className="footer-col">
          <h5>PRODUCT</h5>
          <ul>
            <li><a href="#demo">The System</a></li>
            <li><a href="#skills">Skills Mode</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="#cta">Reserve</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>COMPANY</h5>
          <ul>
            <li><a href="#founder">Founder</a></li>
            <li><a href="#wedge">Why It Wins</a></li>
            <li><a href="mailto:myspeedgate@gmail.com">Contact</a></li>
            <li><a href="mailto:myspeedgate@gmail.com?subject=Press">Press</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h5>SUPPORT</h5>
          <ul>
            <li><a href="mailto:myspeedgate@gmail.com">Help</a></li>
            <li><a href="mailto:myspeedgate@gmail.com">Warranty</a></li>
            <li><a href="mailto:myspeedgate@gmail.com">Shipping</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-meta">
        <span>© 2026 SPEEDGATE · CONFIDENTIAL</span>
        <span>VERIFIED SPEED · FOR EVERY ATHLETE</span>
      </div>
    </div>
  </footer>
);

/* ════════════════════════════════════════════════
   STICKY BOTTOM CTA
════════════════════════════════════════════════ */
const StickyCTA = ({ spots }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onS = () => setShow(window.scrollY > 800 && window.scrollY < (document.body.scrollHeight - window.innerHeight - 600));
    window.addEventListener('scroll', onS);
    onS();
    return () => window.removeEventListener('scroll', onS);
  }, []);
  return (
    <div className={"sticky-cta" + (show ? ' show' : '')}>
      <div className="live">Only <b>{spots}</b> founder spots left</div>
      <a href="#pricing" className="btn btn-primary btn-sm">
        Reserve <span className="price-tag">$149</span> <span className="arr" />
      </a>
    </div>
  );
};

/* ════════════════════════════════════════════════
   TWEAKS
════════════════════════════════════════════════ */
const TweaksUI = ({ tweaks, setTweak }) => {
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    document.documentElement.style.setProperty('--cta', tweaks.cta);
    document.documentElement.style.setProperty('--accent-glow', tweaks.accent + '38');
    document.documentElement.style.setProperty('--accent-soft', tweaks.accent + '14');
    document.documentElement.style.setProperty('--cta-soft', tweaks.cta + '1a');
    document.documentElement.style.setProperty('--font-display', `'${tweaks.displayFont}', Impact, sans-serif`);
  }, [tweaks]);

  return (
    <TweaksPanel>
      <TweakSection label="Brand colors">
        <TweakColor
          label="Precision accent"
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
          options={['#39FF14', '#00E5FF', '#F4FF42', '#FF3366']}
        />
        <TweakColor
          label="CTA color"
          value={tweaks.cta}
          onChange={(v) => setTweak('cta', v)}
          options={['#FF5C1F', '#39FF14', '#FFFFFF', '#3D7BFF']}
        />
      </TweakSection>
      <TweakSection label="Typography">
        <TweakRadio
          label="Display"
          value={tweaks.displayFont}
          onChange={(v) => setTweak('displayFont', v)}
          options={[
            { value: 'Big Shoulders Display', label: 'Shoulders' },
            { value: 'Space Grotesk', label: 'Grotesk' },
          ]}
        />
      </TweakSection>
      <TweakSection label="Scarcity">
        <TweakSlider
          label="Spots left"
          value={tweaks.spotsRemaining}
          onChange={(v) => setTweak('spotsRemaining', v)}
          min={1} max={100} step={1}
        />
        <TweakToggle
          label="Sticky CTA"
          value={tweaks.showStickyCta}
          onChange={(v) => setTweak('showStickyCta', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
};

/* ════════════════════════════════════════════════
   APP
════════════════════════════════════════════════ */
const App = () => {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  return (
    <>
      <Nav spots={tweaks.spotsRemaining} total={tweaks.spotsTotal} />
      <main>
        <Hero />
        <Demo />
        <Wedge />
        <Skills />
        <Pricing spots={tweaks.spotsRemaining} total={tweaks.spotsTotal} />
        <Founder />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      {tweaks.showStickyCta && <StickyCTA spots={tweaks.spotsRemaining} />}
      <TweaksUI tweaks={tweaks} setTweak={setTweak} />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
