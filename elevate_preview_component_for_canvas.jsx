// Pure React preview (no external deps). Enhanced UX: sticky progress navbar, 3D‑tilt cards, magnetic CTA, reveal on scroll, hover glows.
import React, { useEffect, useRef } from "react";

export default function PreviewElevate() {
  // === Scroll progress for navbar ===
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const sc = document.documentElement.scrollTop || document.body.scrollTop;
      const h = (document.documentElement.scrollHeight - document.documentElement.clientHeight) || 1;
      const pct = Math.min(1, sc / h);
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${pct})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // === Reveal on scroll ===
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target as HTMLElement;
          el.style.opacity = "1";
          el.style.transform = "translateY(0px)";
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // === Mouse-follow glow & 3D tilt on cards ===
  const onCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.currentTarget;
    const r = t.getBoundingClientRect();
    const x = e.clientX - r.left; const y = e.clientY - r.top;
    t.style.setProperty("--mx", x + "px");
    t.style.setProperty("--my", y + "px");
    // 3D tilt
    const rx = ((y / r.height) - 0.5) * -10; // tilt up/down
    const ry = ((x / r.width) - 0.5) * 10;   // tilt left/right
    t.style.transform = `translateY(-4px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const onCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const t = e.currentTarget as HTMLDivElement;
    t.style.transform = "translateY(0) rotateX(0deg) rotateY(0deg)";
  };

  // === Magnetic CTA (button gently follows cursor) ===
  const magRef = useRef<HTMLAnchorElement>(null);
  const onMagMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const t = magRef.current; if (!t) return;
    const r = t.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width/2);
    const my = e.clientY - (r.top + r.height/2);
    const strength = 0.25; // how strong the magnet is
    t.style.transform = `translate(${mx*strength}px, ${my*strength}px)`;
  };
  const onMagLeave = () => { const t = magRef.current; if (t) t.style.transform = "translate(0,0)"; };

  return (
    <div style={styles.page}>
      <style>{css}</style>

      {/* Sticky navbar + progress bar */}
      <header style={styles.header}>
        <div style={styles.progressWrap}><div ref={progressRef} style={styles.progressBar} /></div>
        <div style={styles.container}>
          <strong style={{ fontSize: 18 }}>Elevate</strong>
          <nav style={styles.nav}>
            {['Leistungen', 'Team', 'Impressum', 'Datenschutz'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} style={styles.link}>{item}</a>
            ))}
          </nav>
          <div style={{ display:'flex', gap:8 }}>
            <a
              ref={magRef}
              onMouseMove={onMagMove}
              onMouseLeave={onMagLeave}
              href="#cta"
              style={{ ...styles.btn, ...styles.btnPrimary }}
            >Per WhatsApp anfragen</a>
            <a href="#cta" style={{ ...styles.btn, ...styles.btnGhost }}>E-Mail senden</a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section style={styles.section}>
          <div style={{ ...styles.container, textAlign: "center", maxWidth: 820, position:'relative' }}>
            <div aria-hidden style={styles.heroBlob} />
            <h1 style={styles.h1} data-reveal>Kleine Agenturen sind die Zukunft.</h1>
            <p style={{ ...styles.lead }} data-reveal>
              Elevate bringt Marken in der DACH-Region heute dorthin, wo andere erst morgen sind – Social & KI am Puls der Zeit, aus Wien.
            </p>
            <div style={{ marginTop: 24 }} data-reveal>
              <a
                ref={magRef}
                onMouseMove={onMagMove}
                onMouseLeave={onMagLeave}
                href="#cta"
                style={{ ...styles.btn, ...styles.btnPrimary, marginRight: 8 }}
              >Per WhatsApp anfragen</a>
              <a href="#cta" style={{ ...styles.btn, ...styles.btnGhost }}>E-Mail senden</a>
            </div>
            <div style={styles.scrollHint}>Scroll</div>
          </div>
        </section>

        {/* WHY SMALL */}
        <section style={{ ...styles.section, background: "#f6f6f7" }}>
          <div style={styles.container}>
            <h2 style={styles.h2} data-reveal>Warum klein &gt; groß</h2>
            <div style={styles.grid3}>
              {[
                { t: 'Geschwindigkeit', p: 'Entscheidungen in Tagen, nicht in Quartalen.' },
                { t: 'Nähe', p: 'Direkter Zugang zu den Machern statt Account-Schichten.' },
                { t: 'Experimentier-Stärke', p: 'Tests & Iteration statt PowerPoint-Theorie.' },
                { t: 'KI-Adaption', p: 'Neue Tools produktiv nutzen, sobald sie erscheinen.' },
              ].map((x) => (
                <div key={x.t} style={styles.card} onMouseMove={onCardMouseMove} onMouseLeave={onCardLeave} data-reveal>
                  <div style={styles.cardBody}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{x.t}</div>
                    <div style={styles.p}>{x.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="leistungen" style={styles.section}>
          <div style={styles.container}>
            <h2 style={styles.h2} data-reveal>Leistungen</h2>
            <div style={styles.grid3}>
              {[
                ['Konzeptplanung', 'Klarer Fahrplan von Ziel bis KPI.'],
                ['Contentplanung', 'Redaktionspläne, die verkaufen statt füllen.'],
                ['Contenterstellung', 'Schlanke Produktion für Social-Tempo.'],
                ['Community-Management', 'Antworten, die Beziehungen bauen.'],
                ['Paid Social', 'Medienbudget effizienter in Wirkung verwandeln.'],
                ['Monitoring', 'Kennzahlen, Learnings, nächste beste Aktion.'],
              ].map(([t, p]) => (
                <div key={t} style={styles.card} onMouseMove={onCardMouseMove} onMouseLeave={onCardLeave} data-reveal>
                  <div style={styles.cardBody}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{t}</div>
                    <div style={styles.p}>{p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section id="team" style={{ ...styles.section, background: "#f6f6f7" }}>
          <div style={styles.container}>
            <h2 style={styles.h2} data-reveal>Team</h2>
            <div style={styles.grid2}>
              {[
                { n: 'Chris', p: 'Master in Innovationsmanagement & Produktmarketing. Mehrjährige Erfahrung in unterschiedlichen Unternehmen; Fokus auf Strategie & Performance.' },
                { n: 'Merve', p: 'Master in Innovationsmanagement & Produktmarketing. Mehrjährige Erfahrung in unterschiedlichen Unternehmen; Fokus auf Content & Community.' },
              ].map((m) => (
                <div key={m.n} style={styles.card} onMouseMove={onCardMouseMove} onMouseLeave={onCardLeave} data-reveal>
                  <div style={styles.cardBody}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{m.n}</div>
                    <div style={styles.p}>{m.p}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section id="cta" style={styles.section}>
          <div style={{ ...styles.container, textAlign: "center" }}>
            <h2 style={styles.h2} data-reveal>Bereit für den nächsten Schritt?</h2>
            <p style={styles.lead} data-reveal>Wien-basiert. DACH-fokussiert. Social-Growth ohne Ballast.</p>
            <div style={{ marginTop: 24 }} data-reveal>
              <a
                ref={magRef}
                onMouseMove={onMagMove}
                onMouseLeave={onMagLeave}
                href="#"
                style={{ ...styles.btn, ...styles.btnPrimary, marginRight: 8 }}
              >Per WhatsApp anfragen</a>
              <a href="#" style={{ ...styles.btn, ...styles.btnGhost }}>E-Mail senden</a>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb' }}>
        <div style={{ ...styles.container, padding: '24px 16px', color: '#666', fontSize: 14, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ color: '#111', fontWeight: 600 }}>Elevate</div>
            <div>Wien-basiert · Arbeiten für die DACH-Region</div>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#impressum" style={styles.link}>Impressum</a>
            <a href="#datenschutz" style={styles.link}>Datenschutz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles: { [k: string]: React.CSSProperties } = {
  page: { fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif', color: '#0a0a0a', background: '#fff' },
  header: { position: 'sticky', top: 0, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.85)', borderBottom: '1px solid #e5e7eb', zIndex: 20 },
  progressWrap: { position:'relative', height:3, background:'transparent' },
  progressBar: { position:'absolute', left:0, top:0, height:'3px', width:'100%', background:'#0EA5E9', transform:'scaleX(0)', transformOrigin:'0 50%', transition:'transform .15s linear' },
  container: { maxWidth: 1120, margin: '0 auto', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  nav: { display: 'flex', gap: 16, fontSize: 14 },
  link: { color: '#0a0a0a', textDecoration: 'none', transition: 'color .2s', cursor: 'pointer' },
  section: { padding: '86px 0' },
  h1: { fontSize: 48, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.02em', opacity: 0, transform: 'translateY(12px)', transition: 'all .35s ease-out' },
  h2: { fontSize: 30, lineHeight: 1.2, fontWeight: 600, letterSpacing: '-0.01em', opacity: 0, transform: 'translateY(12px)', transition: 'all .35s ease-out' },
  lead: { marginTop: 8, fontSize: 20, color: '#525252', opacity: 0, transform: 'translateY(12px)', transition: 'all .35s ease-out .05s' },
  p: { color: '#4b5563', lineHeight: 1.6 },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginTop: 8, perspective:'1000px' },
  grid2: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, perspective:'1000px' },
  card: { border: '1px solid #e5e7eb', borderRadius: 16, background: '#fff', padding: 0, overflow: 'hidden', transition: 'transform .15s ease, box-shadow .2s',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)', position: 'relative', opacity: 0, transform: 'translateY(12px)' },
  cardBody: { padding: 24 },
  btn: { display: 'inline-flex', alignItems: 'center', gap: 8, borderRadius: 16, padding: '10px 18px', fontSize: 15, textDecoration: 'none', transition: 'background .3s, transform .2s' },
  btnPrimary: { background: '#0EA5E9', color: '#fff' },
  btnGhost: { background: 'transparent', color: '#0a0a0a', border: '1px solid #e5e7eb' },
  heroBlob: { position:'absolute', inset:'-60px -120px auto -120px', height:300, borderRadius:300, background:'linear-gradient(90deg,#0EA5E9,#60A5FA)', filter:'blur(48px)', opacity:.35, transform:'translateY(-30px)', pointerEvents:'none' },
  scrollHint: { position:'absolute', bottom:-24, left:'50%', transform:'translateX(-50%)', fontSize:12, letterSpacing:'.2em', textTransform:'uppercase', color:'#888' },
};

const css = `
/* Reveal base state */
[data-reveal] { opacity: 0; transform: translateY(12px); }

/* Card glow */
.card::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: 0; transition: opacity .2s ease;
  background: radial-gradient(500px 200px at var(--mx,50%) var(--my,0%), rgba(14,165,233,.10), transparent 60%);
}
.card:hover::after { opacity: 1; }
`;
