// MegaMenu — fullscreen overlay menu with two states:
//  state="initial"  — left dark column (S06 highlighted), right white column with single model card
//  state="lineup"   — left dark column with sub-items (SUV/Sedán/Pick Up/Híbrido), right white column with category list
//
// Datos: lee el lineup desde Strapi vía useStrapi. Si Strapi no está configurado
// o falla, usa MEGAMENU_FALLBACK (mismo shape derivado, idéntico al hardcoded original).

const MEGAMENU_FALLBACK = {
  modelos: [
    { id: 1, slug: 's06', nombre: 'S06', categoria: 'SUV', destacado: true, orden: 1 },
    { id: 2, slug: 's07', nombre: 'S07', categoria: 'SUV', destacado: true, orden: 2 },
    { id: 3, slug: 's09', nombre: 'S09', categoria: 'SUV', destacado: true, orden: 3 },
  ],
  destacados: [
    { id: 1, slug: 's06', nombre: 'S06', categoria: 'SUV', destacado: true, orden: 1 },
    { id: 2, slug: 's07', nombre: 'S07', categoria: 'SUV', destacado: true, orden: 2 },
    { id: 3, slug: 's09', nombre: 'S09', categoria: 'SUV', destacado: true, orden: 3 },
  ],
  byCategoria: {
    'SUV': [
      { id: 1, slug: 's06', nombre: 'S06', destacado: true },
      { id: 2, slug: 's07', nombre: 'S07', destacado: true },
      { id: 3, slug: 's09', nombre: 'S09', destacado: true },
    ],
    'Sedán': [],
    'Pick Up': [],
    'Híbrido': [],
  },
};

const MegaMenu = ({ open, onClose, initialState = "initial" }) => {
  const [state, setState] = React.useState(initialState);
  const [activeCat, setActiveCat] = React.useState("SUV");

  // Cargar lineup desde Strapi (cacheado globalmente entre páginas).
  // Si el hook aún no se cargó (orden de scripts), devolvemos shape completo
  // para no romper a futuros consumidores del retorno.
  const strapiConfigured = !!(window.ENV && window.ENV.STRAPI_URL);
  const useStrapiSafe = window.useStrapi || (() => ({ data: MEGAMENU_FALLBACK, loading: false, error: null, refetch: () => {} }));
  const { data: lineup } = useStrapiSafe(
    () => window.strapiService && window.strapiService.getLineup ? window.strapiService.getLineup() : Promise.resolve(MEGAMENU_FALLBACK),
    [],
    { fallback: MEGAMENU_FALLBACK, skip: !strapiConfigured }
  );
  const safeLineup = lineup || MEGAMENU_FALLBACK;

  React.useEffect(() => { if (open) setState(initialState); }, [open, initialState]);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, onClose]);

  // Modelos destacados → items izquierdos del estado "initial"
  const destacados = safeLineup.destacados || [];
  // Primer destacado se marca como primary (recibe el color naranja)
  const leftItemsInitial = [
    ...destacados.map((m, i) => ({
      label: i === 0 ? `SOUEAST ${m.nombre}` : m.nombre,
      primary: i === 0,
      href: `modelo-${m.slug}.html`,
    })),
    { label: "Agendar", href: "https://andesmotor.in-touch.cl/agenda/jetour/", external: true },
  ];

  // Categorías visibles → solo las que tienen al menos 1 modelo, más las del fallback
  const allCategories = ["SUV", "Sedán", "Pick Up", "Híbrido"];
  const leftItemsLineup = allCategories.map((c) => ({ label: c, section: true }));

  const rightItems = [
    { label: "Cotizar", href: (window.cotizarRouter && window.cotizarRouter.getCurrentCotizarUrl()) || "modelo-s06.html#cotizar" },
    { label: "Sucursales", href: "sucursales.html" },
    { label: "Agenda tu servicio", href: "#servicio" },
    { label: "Contáctanos", href: "#contacto" },
    { label: "Legales", href: "#legales" },
  ];

  // byCategoria viene de Strapi → array de modelos. Render usa nombre completo.
  const lineupModelsBySection = {};
  for (const cat of allCategories) {
    const arr = safeLineup.byCategoria?.[cat] || [];
    lineupModelsBySection[cat] = arr.map((m) => ({ nombre: `SOUEAST ${m.nombre}`, slug: m.slug }));
  }

  return (
    <div className={"mm" + (open ? " mm--open" : "")} role="dialog" aria-hidden={!open} aria-label="Menú principal">
      <button className="mm__close" onClick={onClose} aria-label="Cerrar menú">
        <Icon name="close" size={28} color="#fff" />
      </button>

      <div className="mm__shell">
        {/* LEFT — dark panel */}
        <aside className="mm__left">
          <div className="mm__brand">
            <Logo height={18} color="#fff" />
          </div>
          {state === "initial" ? (
            <ul className="mm__list">
              {leftItemsInitial.map((it, i) => (
                <li key={i} className={"mm__item" + (it.primary ? " mm__item--primary" : "")}>
                  <a
                    href={it.href}
                    onClick={it.external ? undefined : onClose}
                    target={it.external ? "_blank" : undefined}
                    rel={it.external ? "noopener noreferrer" : undefined}
                  >
                    <span>{it.label}</span>
                    <Icon name="chevronRight" size={20} color="#fff" />
                  </a>
                </li>
              ))}
              <li className="mm__divider" />
              <li className="mm__item">
                <button onClick={() => setState("lineup")}>
                  <span>Línea completa</span>
                  <Icon name="arrowRight" size={20} color="#ED7138" />
                </button>
              </li>
            </ul>
          ) : (
            <ul className="mm__list">
              {leftItemsLineup.map((it, i) => (
                <li
                  key={i}
                  className={"mm__item mm__item--cat" + (activeCat === it.label ? " is-active" : "")}
                  onMouseEnter={() => setActiveCat(it.label)}
                >
                  <button onClick={() => setActiveCat(it.label)}>
                    <span>{it.label}</span>
                    {activeCat === it.label && <Icon name="arrowRight" size={20} color="#ED7138" />}
                  </button>
                </li>
              ))}
              <li className="mm__divider" />
              <li className="mm__item">
                <button onClick={() => setState("initial")}>
                  <Icon name="chevronLeft" size={20} color="#fff" />
                  <span style={{ marginLeft: 8 }}>Volver</span>
                </button>
              </li>
            </ul>
          )}
        </aside>

        {/* RIGHT — white panel */}
        <section className="mm__right">
          {state === "initial" ? (
            <>
              <div className="mm__hero" style={{ backgroundImage: "url(" + window.__resources.s06RenderImg + ")" }} role="img" aria-label={destacados[0] ? `SOUEAST ${destacados[0].nombre}` : "SOUEAST"} />
              <div className="mm__heroFooter">
                <CTA variant="solid" href={destacados[0] ? `modelo-${destacados[0].slug}.html` : "#"}>EXPLORE</CTA>
              </div>
              <ul className="mm__rightList">
                {rightItems.map((it, i) => (
                  <li key={i}>
                    <a href={it.href} onClick={onClose}>
                      {it.label}
                      <Icon name="chevronRight" size={18} color="#444" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <h3 className="mm__catTitle">{activeCat}</h3>
              <span className="tick" style={{ marginBottom: 24 }} />
              <ul className="mm__modelGrid">
                {(lineupModelsBySection[activeCat] || []).length === 0 && (
                  <li className="mm__empty">Próximamente.</li>
                )}
                {(lineupModelsBySection[activeCat] || []).map((m, i) => {
                  const modelHref = `modelo-${m.slug}.html`;
                  return (
                  <li key={i}>
                    <a href={modelHref} onClick={onClose}>
                      <div style={{ aspectRatio: "16/9", backgroundImage: "url(" + window.__resources.s06RenderImg + ")", backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundColor: "#f3f3f1" }} role="img" aria-label={m.nombre} />
                      <div className="mm__modelLabel">{m.nombre}</div>
                    </a>
                  </li>
                  );
                })}
              </ul>
              <ul className="mm__rightList mm__rightList--compact">
                {rightItems.map((it, i) => (
                  <li key={i}>
                    <a href={it.href} onClick={onClose}>
                      {it.label}
                      <Icon name="chevronRight" size={18} color="#444" />
                    </a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
      </div>

      <style>{`
        .mm {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(20,20,20,0.5);
          backdrop-filter: blur(20px);
          opacity: 0; pointer-events: none;
          transition: opacity 320ms var(--ease-out);
        }
        .mm--open { opacity: 1; pointer-events: auto; }
        .mm__close {
          position: absolute; top: 24px; left: 48px;
          width: 48px; height: 48px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          color: #fff;
          transition: background 200ms;
        }
        .mm__close:hover { background: rgba(255,255,255,0.12); }
        .mm__shell {
          position: absolute; top: 100px; left: 50px; right: 50px; bottom: 50px;
          display: grid; grid-template-columns: 453px 1fr; gap: 0;
          max-width: 1300px;
          margin: 0 auto;
          transform: translateY(20px);
          transition: transform 360ms var(--ease-out);
        }
        .mm--open .mm__shell { transform: translateY(0); }
        .mm__left {
          background: #000; color: #fff;
          border-radius: 20px 0 0 20px;
          padding: 48px 36px;
          display: flex; flex-direction: column; gap: 24px;
        }
        .mm__brand { padding-bottom: 16px; border-bottom: 1px solid rgba(255,255,255,0.15); }
        .mm__list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px; }
        .mm__item a, .mm__item button {
          display: flex; align-items: center; justify-content: space-between;
          width: 100%; padding: 14px 12px;
          color: #fff; font-family: Montserrat; font-size: 18px; font-weight: 400;
          border-radius: 8px;
          transition: background 180ms, color 180ms, padding-left 180ms;
        }
        .mm__item:hover a, .mm__item:hover button { background: rgba(255,255,255,0.06); padding-left: 18px; }
        .mm__item--primary a, .mm__item--cat.is-active button { color: #ED7138; font-weight: 700; }
        .mm__divider { height: 1px; background: rgba(255,255,255,0.18); margin: 12px 0; }

        .mm__right {
          background: #fff;
          border-radius: 0 20px 20px 0;
          padding: 48px 56px;
          color: #444;
          display: flex; flex-direction: column;
          overflow-y: auto;
        }
        .mm__hero {
          aspect-ratio: 715/344; width: 100%;
          margin-bottom: 28px;
          border-radius: 4px;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
          background-color: #f3f3f1;
        }
        .mm__heroFooter { display: flex; justify-content: center; padding-bottom: 32px; border-bottom: 1px solid #ddd; margin-bottom: 24px; }
        .mm__rightList { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
        .mm__rightList li a {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 4px; font-size: 18px; color: #444;
          border-bottom: 1px solid #eee;
          transition: color 180ms, padding-left 180ms;
        }
        .mm__rightList li a:hover { color: #ED7138; padding-left: 8px; }
        .mm__rightList--compact li a { padding: 12px 4px; font-size: 16px; }

        .mm__catTitle { font-size: 32px; font-weight: 700; color: #444; margin: 0 0 12px; }
        .mm__modelGrid {
          list-style: none; padding: 0; margin: 0 0 32px;
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
        }
        .mm__modelGrid a { display: block; }
        .mm__modelLabel { padding: 12px 0; font-size: 16px; color: #444; font-weight: 500; }
        .mm__empty { color: #999; padding: 32px 0; }

        @media (max-width: 1023px) {
          .mm__shell { grid-template-columns: 1fr; top: 80px; left: 20px; right: 20px; bottom: 20px; }
          .mm__left { border-radius: 16px 16px 0 0; padding: 32px 24px; }
          .mm__right { border-radius: 0 0 16px 16px; padding: 32px 24px; }
          .mm__hero { aspect-ratio: 16/9; margin-bottom: 20px; }
          .mm__close { left: 16px; top: 14px; }
        }
        @media (max-width: 767px) {
          .mm__shell { top: 64px; left: 0; right: 0; bottom: 0; }
          .mm__left, .mm__right { border-radius: 0; }
          .mm__close { color: #fff; }
        }
      `}</style>
    </div>
  );
};
window.MegaMenu = MegaMenu;
