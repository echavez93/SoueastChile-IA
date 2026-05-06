// Footer — minimal black, mirrors original SOUEAST Chile layout.
//   row 1: logo + tagline EASE YOUR LIFE / VOLVER ARRIBA ↑
//   row 2: model links | divider | social column
//   row 3: secondary links
const Footer = () => {
  const top = (e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const models = [
    { label: "S06", href: "modelo-s06.html" },
    { label: "S06 PHEV", href: "modelo-s06-phev.html" },
    { label: "S07", href: "modelo-s07.html" },
    { label: "S09", href: "modelo-s09.html" },
  ];

  const secondary = [
    { label: "Noticias", href: "#noticias" },
    { label: "Legales", href: "#legales" },
    { label: "Políticas de privacidad", href: "#privacidad" },
    { label: "Contáctanos", href: "#contacto" },
  ];

  return (
    <footer className="ft">
      {/* Row 1 — brand + back to top */}
      <div className="ft__row1">
        <div className="ft__brand">
          <Logo height={24} color="#fff" />
          <span className="ft__sep">|</span>
          <span className="ft__tagline">
            <span className="ft__tag-ease">EASE</span> YOUR <span className="ft__tag-life">LIFE</span>
          </span>
        </div>
        <a href="#" onClick={top} className="ft__back">
          <span>VOLVER ARRIBA</span>
          <Icon name="arrowUp" size={20} color="#ED7138" />
        </a>
      </div>

      {/* Row 2 — model links + social */}
      <div className="ft__row2">
        <ul className="ft__models">
          {models.map((m, i) => (
            <li key={i}><a href={m.href}><ModelName name={m.label} color="#fff" /></a></li>
          ))}
        </ul>
        <div className="ft__social">
          <a href="#" aria-label="Instagram"><Icon name="instagram" size={20} color="#fff" /></a>
          <a href="#" aria-label="Facebook"><Icon name="facebook" size={20} color="#fff" /></a>
          <a href="#" aria-label="TikTok">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M19 8.5a6.4 6.4 0 01-3.7-1.2v7.4a5.3 5.3 0 11-5.3-5.3v2.7a2.6 2.6 0 102.6 2.6V2h2.7a4 4 0 003.7 4z"/>
            </svg>
          </a>
          <a href="#" aria-label="YouTube">
            <svg width="22" height="20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M23 7.5c-.2-1.4-.9-2.4-2.3-2.6C18.5 4.5 12 4.5 12 4.5s-6.5 0-8.7.4C1.9 5.1 1.2 6.1 1 7.5.6 9.7.6 12 .6 12s0 2.3.4 4.5c.2 1.4.9 2.4 2.3 2.6 2.2.4 8.7.4 8.7.4s6.5 0 8.7-.4c1.4-.2 2.1-1.2 2.3-2.6.4-2.2.4-4.5.4-4.5s0-2.3-.4-4.5zM10 16V8l5 4-5 4z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Row 3 — secondary links */}
      <ul className="ft__secondary">
        {secondary.map((l, i) => (
          <li key={i}><a href={l.href}>{l.label}</a></li>
        ))}
      </ul>

      <div className="ft__bottom">
        <span>© {new Date().getFullYear()} SOUEAST Chile · Andes Motor</span>
      </div>

      <style>{`
        .ft { background: #000; color: #fff; padding: 64px var(--container-pad) 32px; }
        .ft__row1 {
          display: flex; justify-content: space-between; align-items: center;
          padding-bottom: 32px;
        }
        .ft__brand { display: inline-flex; align-items: center; gap: 16px; flex-wrap: wrap; }
        .ft__sep { color: #555; font-weight: 300; font-size: 18px; }
        .ft__tagline {
          font-family: Montserrat; font-size: 13px; letter-spacing: 0.18em;
          color: rgba(255,255,255,0.7);
        }
        .ft__tag-ease { color: #E8833A; font-weight: 800; }
        .ft__tag-life { color: #fff; font-weight: 800; }
        .ft__back {
          display: inline-flex; align-items: center; gap: 12px;
          color: #fff; font-family: Montserrat; font-weight: 600; font-size: 13px;
          letter-spacing: 0.12em;
          transition: opacity 200ms;
        }
        .ft__back:hover { opacity: 0.7; }

        .ft__row2 {
          display: flex; justify-content: space-between; align-items: center;
          padding: 24px 0;
          border-top: 1px solid #2a2a2a;
          border-bottom: 1px solid #2a2a2a;
        }
        .ft__models {
          list-style: none; padding: 0; margin: 0;
          display: flex; gap: 36px; align-items: center;
        }
        .ft__models a {
          font-family: Montserrat; font-size: 18px;
          color: #fff; transition: opacity 180ms;
        }
        .ft__models a:hover { opacity: 0.65; }
        .ft__social { display: flex; gap: 18px; }
        .ft__social a {
          width: 36px; height: 36px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          transition: background 180ms;
        }
        .ft__social a:hover { background: rgba(255,255,255,0.1); }

        .ft__secondary {
          list-style: none; padding: 24px 0 0; margin: 0;
          display: flex; gap: 32px; flex-wrap: wrap;
        }
        .ft__secondary a {
          font-family: Montserrat; font-size: 13px;
          color: #b0b0b0; transition: color 180ms;
          letter-spacing: 0.04em;
        }
        .ft__secondary a:hover { color: #ED7138; }

        .ft__bottom {
          color: #666; font-size: 12px; padding-top: 16px;
          letter-spacing: 0.04em;
        }

        @media (max-width: 767px) {
          .ft { padding: 48px var(--container-pad) 24px; }
          .ft__row1 { flex-direction: column; align-items: flex-start; gap: 16px; }
          .ft__row2 { flex-direction: column; align-items: flex-start; gap: 20px; }
          .ft__models { flex-wrap: wrap; gap: 20px; }
          .ft__secondary { flex-direction: column; gap: 12px; }
        }
      `}</style>
    </footer>
  );
};
window.Footer = Footer;
