// HOME — Hero + Modelos + Noticias + Acciones (mirroring SOUEAST Chile original)

const HomeHero = () =>
<section className="hero" id="home">
    <img className="hero__bg" src="assets/home-hero.png" alt="" />
    <div className="hero__overlay" />
    <div className="hero__content">
      <p className="hero__eyebrow">
        <span className="hero__eyebrow--ease">EASE</span>
        <span className="hero__eyebrow--your"> YOUR </span>
        <span className="hero__eyebrow--life">LIFE</span>
      </p>
      <h1 className="hero__title">Bienvenidos a SOUEAST Chile</h1>
      <a className="hero__cta" href="modelo-s06.html">
        <span>CONOCE MÁS</span>
        <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
          <path d="M0 4h20m0 0L17 1m3 3L17 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </a>
    </div>
    <button className="hero__scroll" onClick={() => document.getElementById("modelos").scrollIntoView({ behavior: "smooth", block: "start" })} aria-label="Scroll">
      <Icon name="chevronDown" size={32} color="#fff" />
    </button>

    <style>{`
      .hero { position: relative; height: 100vh; min-height: 560px; max-height: 980px; overflow: hidden; color: #fff; }
      .hero__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .hero__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.20) 0%, rgba(0,0,0,0.55) 80%); }
      .hero__content {
        position: relative; z-index: 2; height: 100%;
        display: flex; flex-direction: column; align-items: center; justify-content: center;
        text-align: center; padding: 0 20px;
        gap: 16px;
      }
      .hero__eyebrow {
        font-family: Montserrat; font-size: var(--fs-eyebrow);
        margin: 0;
        letter-spacing: 0.18em;
        opacity: 0; animation: heroIn 700ms 100ms var(--ease-out) both;
      }
      .hero__eyebrow--ease { color: #E8833A; font-weight: 800; }
      .hero__eyebrow--your { color: rgba(255,255,255,0.6); font-weight: 400; }
      .hero__eyebrow--life { color: #fff; font-weight: 800; }
      .hero__title {
        font-family: Montserrat; font-weight: 700; font-size: var(--fs-hero);
        margin: 0 0 24px; line-height: 1.05;
        max-width: 18ch;
        opacity: 0; animation: heroIn 700ms 240ms var(--ease-out) both;
      }
      .hero__cta {
        display: inline-flex; align-items: center; gap: 16px;
        background: rgba(20,20,20,0.55);
        color: #fff;
        padding: 14px 28px;
        border-radius: 100px;
        font-family: Montserrat; font-weight: 600; font-size: 13px;
        letter-spacing: 0.12em;
        backdrop-filter: blur(6px);
        transition: background 200ms var(--ease-out), transform 200ms;
        opacity: 0; animation: heroIn 700ms 380ms var(--ease-out) both;
      }
      .hero__cta:hover { background: var(--color-primary); transform: translateY(-1px); }
      .hero__cta svg path { stroke: #E8833A; }
      .hero__cta:hover svg path { stroke: #fff; }
      .hero__scroll {
        position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%);
        z-index: 3; color: #fff; padding: 8px;
        animation: bob 1.6s ease-in-out infinite;
      }
      @keyframes heroIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes bob { 0%,100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 8px); } }

      @media (max-width: 767px) {
        .hero { min-height: 520px; }
        .hero__title { padding: 0 24px; }
      }
    `}</style>
  </section>;


const ModelosSection = () => {
  const modelos = [
    { name: "S06",      tag: "Lanzamiento",        img: "assets/s06-lateral.webp",      href: "modelo-s06.html" },
    { name: "S06 PHEV", tag: "Híbrido enchufable", img: "assets/s06-phev-lateral.webp", href: "modelo-s06-phev.html" },
    { name: "S07",      tag: "Lanzamiento",        img: "assets/s07-lateral.webp",      href: "modelo-s07.html" },
    { name: "S09",      tag: "Próximamente",       img: "assets/s09-lateral.webp",      href: "modelo-s09.html" },
  ];
  const [idx, setIdx] = React.useState(0);
  const current = modelos[idx];

  // Hover sobre el stage → autoplay activo. Mouse out → detenido.
  // Mantiene el mismo state (`hovering`) y un único setInterval/clearInterval.
  const [hovering, setHovering] = React.useState(false);
  React.useEffect(() => {
    if (!hovering) return;
    const t = setInterval(() => setIdx(i => (i + 1) % modelos.length), 1800);
    return () => clearInterval(t);
  }, [hovering, modelos.length]);

  return (
    <section className="modelos" id="modelos">
      <div className="modelos__topbar">
        <h2 className="section-title">Modelos</h2>
        <div className="modelos__decor">
          <span className="modelos__bigname">{current.name.replace(" PHEV", "")}</span>
          <span className="modelos__tag">{current.tag.toUpperCase()}</span>
        </div>
      </div>

      <div
        className="modelos__stage"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <button
          className="modelos__nav modelos__nav--l"
          aria-label="Anterior"
          onClick={() => setIdx((idx - 1 + modelos.length) % modelos.length)}
        >
          <Icon name="chevronLeft" size={28} color="#444" />
        </button>
        <div className="modelos__slides">
          {modelos.map((m, i) => (
            <img
              key={m.name}
              className={"modelos__hero" + (i === idx ? " is-active" : "")}
              src={m.img}
              alt={`SOUEAST ${m.name}`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>
        <button
          className="modelos__nav modelos__nav--r"
          aria-label="Siguiente"
          onClick={() => setIdx((idx + 1) % modelos.length)}
        >
          <Icon name="chevronRight" size={28} color="#444" />
        </button>
      </div>

      <div className="modelos__foot">
        <h3 className="modelos__name">SOUEAST {current.name}</h3>
        <CTA variant="solid" href={current.href}>EXPLORE</CTA>
        <div className="modelos__dots">
          {modelos.map((_, i) => (
            <button
              key={i}
              className={"dot" + (i === idx ? " is-active" : "")}
              aria-label={`Ir al modelo ${i + 1}`}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </div>

      <style>{`
        .modelos { position: relative; padding: 100px var(--container-pad); background: #fff; overflow: hidden; }
        .modelos__topbar {
          display: flex; justify-content: space-between; align-items: flex-start; gap: 40px;
          margin-bottom: 24px;
        }
        .modelos__decor { display: flex; flex-direction: column; align-items: flex-end; line-height: 0.85; }
        .modelos__bigname {
          font-family: Montserrat; font-weight: 800; font-size: clamp(64px, 9vw, 120px);
          color: #E0E0E0; letter-spacing: -0.02em;
        }
        .modelos__tag {
          font-family: Montserrat; font-weight: 700; font-size: 18px;
          color: var(--color-primary); margin-top: 8px;
          text-transform: uppercase; letter-spacing: 0.08em;
          transition: opacity 280ms;
        }
        .modelos__stage { position: relative; max-width: 1243px; margin: 40px auto; }
        .modelos__slides { position: relative; aspect-ratio: 1243/500; width: 100%; }
        .modelos__hero { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; opacity: 0; transition: opacity 500ms var(--ease-out); pointer-events: none; }
        .modelos__hero.is-active { opacity: 1; pointer-events: auto; }
        .modelos__nav {
          position: absolute; top: 50%; transform: translateY(-50%);
          width: 48px; height: 48px; border-radius: 50%;
          background: rgba(255,255,255,0.9); display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transition: background 180ms, transform 180ms;
          z-index: 3;
        }
        .modelos__nav:hover { background: var(--color-primary); transform: translateY(-50%) scale(1.05); }
        .modelos__nav:hover svg path { stroke: #fff !important; }
        .modelos__nav--l { left: -8px; }
        .modelos__nav--r { right: -8px; }
        .modelos__foot { display: flex; flex-direction: column; align-items: center; gap: 24px; padding-top: 16px; }
        .modelos__name { font-family: Montserrat; font-weight: 500; font-size: var(--fs-h2); color: var(--color-text); margin: 0; transition: opacity 280ms; }
        .modelos__dots { display: flex; gap: 8px; margin-top: 8px; }
        .dot { width: 60px; height: 2px; background: #d9d9d9; border-radius: 2px; transition: background 200ms; cursor: pointer; }
        .dot.is-active { background: var(--color-primary); }
        .dot:hover:not(.is-active) { background: #b0b0b0; }

        @media (max-width: 767px) {
          .modelos { padding: 56px var(--container-pad); }
          .modelos__topbar { flex-direction: column; gap: 8px; }
          .modelos__decor { align-items: flex-start; }
          .modelos__bigname { font-size: 56px; }
          .modelos__stage { margin: 24px 0; }
          .modelos__nav { width: 36px; height: 36px; }
          .modelos__nav--l { left: 0; }
          .modelos__nav--r { right: 0; }
          .dot { width: 32px; }
        }
      `}</style>
    </section>
  );
};


const NewsCard = ({ date, title, label, img, href }) =>
<a className="news" href={href || "#"}>
    <div className="news__img" style={{ backgroundImage: `url(${img})` }} role="img" aria-label={label} />
    <div className="news__body">
      <p className="news__date">{date}</p>
      <h5 className="news__title">{title}</h5>
      <span className="news__more">
        LEER MÁS
        <svg width="18" height="6" viewBox="0 0 18 6" fill="none">
          <path d="M0 3h16m0 0L13 0.5M16 3l-3 2.5" stroke="#ED7138" strokeWidth="1" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  </a>;


const NoticiasSection = () => {
  const items = [
    { date: "5 ENERO, 2026", title: "Soueast avanza a paso agigantado: Inauguró showroom exclusivo en Movicenter", label: "noticia 01", img: "assets/news-1.jpg", href: "#noticia-1" },
    { date: "20 DICIEMBRE, 2025", title: "Soueast: la nueva marca oriental que irrumpe en el mercado automotriz chileno", label: "noticia 02", img: "assets/news-2.jpg", href: "#noticia-2" },
  ];

  return (
    <section className="noticias" id="noticias">
      <h2 className="section-title noticias__title">Noticias</h2>
      <div className="noticias__grid">
        {items.map((it, i) => <NewsCard key={i} {...it} />)}
      </div>
      <style>{`
        .noticias { padding: 80px var(--container-pad); background: #fff; }
        .noticias__title { margin-bottom: 40px; }
        .noticias__grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
        .news { display: block; }
        .news__img { aspect-ratio: 16/9; background-size: cover; background-position: center; background-color: #ddd; margin-bottom: 20px; }
        .news__date { font-family: Montserrat; font-size: 12px; color: rgba(68,68,68,0.5); margin: 0 0 8px; letter-spacing: 0.08em; font-weight: 600; text-transform: uppercase; }
        .news__title { font-family: Montserrat; font-weight: 500; font-size: 20px; color: var(--color-text); margin: 0 0 16px; line-height: 1.35; text-wrap: pretty; }
        .news__more {
          display: inline-flex; align-items: center; gap: 12px;
          font-family: Montserrat; font-size: 12px; font-weight: 600;
          color: var(--color-text); letter-spacing: 0.08em;
          transition: gap 180ms var(--ease-out);
        }
        .news:hover .news__more { gap: 18px; }
        @media (max-width: 767px) {
          .noticias { padding: 48px var(--container-pad); }
          .noticias__grid { grid-template-columns: 1fr; gap: 32px; }
        }
      `}</style>
    </section>
  );
};


// Acciones — 3 ítems con divisores naranjas, sin título de sección.
const QueHacerSection = () => {
  const items = [
    { label: "Elige tu SOUEAST", icon: "se", primary: true,  href: "#modelos" },
    { label: "Encuentra tu Sucursal", icon: "pin", href: "sucursales.html" },
    { label: "Cotiza tu SOUEAST", icon: "doc", href: "modelo-s06.html#cotizar" },
  ];

  return (
    <section className="qh" id="que-hacer">
      <div className="qh__row">
        {items.map((it, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="qh__divider" aria-hidden="true" />}
            <a href={it.href} className={"qh__item" + (it.primary ? " qh__item--primary" : "")}>
              <span className="qh__icon">
                {it.icon === "se" && (
                  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
                    <rect x="6" y="12" width="32" height="4" fill={it.primary ? "#ED7138" : "#444"} />
                    <rect x="6" y="22" width="32" height="4" fill={it.primary ? "#ED7138" : "#444"} />
                    <rect x="6" y="32" width="20" height="4" fill={it.primary ? "#ED7138" : "#444"} />
                  </svg>
                )}
                {it.icon === "pin" && <Icon name="pin" size={44} color="#444" />}
                {it.icon === "doc" && (
                  <svg width="44" height="44" viewBox="0 0 32 32" fill="none" stroke="#444" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M9 4h11l5 5v19H9z" />
                    <path d="M20 4v5h5" />
                    <path d="M14 20c0-1 1-2 3-2s3 1 3 2-1 2-3 2-3 1-3 2 1 2 3 2 3-1 3-2" />
                    <path d="M17 16v12" />
                  </svg>
                )}
              </span>
              <span className="qh__label">{it.label}</span>
              {it.primary && <span className="qh__underline" />}
            </a>
          </React.Fragment>
        ))}
      </div>

      <style>{`
        .qh { padding: 80px var(--container-pad); background: #fff; }
        .qh__row {
          display: flex; align-items: center; justify-content: center;
          gap: 0;
          max-width: 1200px; margin: 0 auto;
        }
        .qh__divider {
          flex: 0 1 80px; height: 1px; background: var(--color-primary);
          align-self: center;
        }
        .qh__item {
          flex: 1 1 0;
          display: flex; flex-direction: column; align-items: center; text-align: center;
          gap: 16px; padding: 32px 16px;
          color: var(--color-text);
          transition: transform 200ms;
          position: relative;
        }
        .qh__item:hover { transform: translateY(-2px); }
        .qh__icon { width: 56px; height: 56px; display: inline-flex; align-items: center; justify-content: center; }
        .qh__label { font-family: Montserrat; font-weight: 500; font-size: 18px; }
        .qh__item--primary .qh__label { color: var(--color-primary); font-weight: 700; }
        .qh__underline { width: 60%; height: 2px; background: var(--color-primary); margin-top: 4px; }

        @media (max-width: 767px) {
          .qh { padding: 48px var(--container-pad); }
          .qh__row { flex-direction: column; gap: 0; }
          .qh__divider { width: 60%; flex: 0 0 auto; }
          .qh__item { flex-direction: column; padding: 24px 16px; }
        }
      `}</style>
    </section>
  );
};


const HomePage = () =>
<>
    <HomeHero />
    <ModelosSection />
    <NoticiasSection />
    <QueHacerSection />
  </>;

window.HomePage = HomePage;
