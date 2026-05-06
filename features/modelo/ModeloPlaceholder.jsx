// MODELO PLACEHOLDER — same structural skeleton as S06 page,
// but every image slot is replaced with the dummy placeholder so the
// real assets can be dropped in later.
//
// Sections preserved (same as Modelo.jsx for S06):
//   Hero · Descripción/Specs · Colores · Galería · Seguridad · Specs table · Cotización
//
// Usage: <ModeloPlaceholderPage modelo="S07" />

const DUMMY = "assets/modelo-dummy.svg";

// Resolver helper: si Strapi nos da un asset, úsalo; si no, dummy.
const resolveImg = (media) => {
  if (!media) return DUMMY;
  if (window.strapiService && window.strapiService.assetUrl) {
    const url = window.strapiService.assetUrl(media);
    return url || DUMMY;
  }
  return DUMMY;
};

// Imágenes locales por modelo (override del DUMMY cuando Strapi no entrega imagen).
const HERO_BY_MODEL = {
  "S07": "assets/s07-banner.webp",
};
const SIDE_BY_MODEL = {
  "S07": "assets/s07-descripcion.webp",
};
// Imagen principal de la sección "Colores" (vista exterior aérea) por modelo.
const MAIN_COLOR_BY_MODEL = {
  "S07": "assets/s07-color-oceanblue.webp",
};

const PHero = ({ modelo, data }) => {
  const handleCotizar = (e) => {
    e.preventDefault();
    window.location.href = `cotizador.html?modelo=${encodeURIComponent(modelo)}`;
  };

  return (
    <section className="mhero">
      <img className="mhero__bg" src={data?.imagen_principal ? resolveImg(data.imagen_principal) : (HERO_BY_MODEL[modelo] || DUMMY)} alt={`SOUEAST ${modelo}`} />
      <div className="mhero__overlay" />
      <div className="mhero__content">
        <h1 className="mhero__brand">SOUEAST <span>{modelo}</span></h1>
        <p className="mhero__tag">{data?.tagline || "Más estilo"}</p>
        <div className="mhero__ctas">
          <CTA variant="ghost" href="#galeria">Ver ficha</CTA>
          <CTA variant="ghost" href="#testdrive">Agenda tu Test Drive</CTA>
          <CTA variant="orange" href={`cotizador.html?modelo=${encodeURIComponent(modelo)}`} onClick={handleCotizar}>Cotizar</CTA>
        </div>
      </div>
    <style>{`
      .mhero { position: relative; height: 100vh; min-height: 560px; max-height: 980px; overflow: hidden; color: #fff; }
      .mhero__bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
      .mhero__overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6)); }
      .mhero__content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 0 20px; }
      .mhero__brand { font-family: Montserrat; font-weight: 700; font-size: 72px; margin: 0; letter-spacing: 0.02em; }
      .mhero__brand span { color: var(--color-primary); }
      .mhero__tag { font-family: Montserrat; font-weight: 700; font-size: var(--fs-hero); margin: 8px 0 40px; }
      .mhero__ctas { display: flex; gap: 16px; flex-wrap: wrap; justify-content: center; }
      @media (max-width: 767px) { .mhero__brand { font-size: 38px; } .mhero__ctas { flex-direction: column; width: 100%; max-width: 280px; } .mhero__ctas .cta { width: 100%; justify-content: center; } }
    `}</style>
  </section>
  );
};

// Formateo CLP simple — $12.345.678
const formatCLP = (n) => {
  if (n === null || n === undefined || n === 0) return "$15.000.000";
  return "$" + Number(n).toLocaleString("es-CL");
};

const PDescripcion = ({ modelo, data }) => {
  // versiones puede venir como array de strings (fallback) o como array de
  // componentes Strapi {nombre}. Normalizamos a array de strings.
  const rawVersiones = (data?.versiones && data.versiones.length)
    ? data.versiones
    : ["1.5T-6DCT", "1.5T-6DCT Lite", "1.6TD-7DCT Pro Max"];
  const versiones = rawVersiones.map(v => typeof v === "string" ? v : (v && v.nombre) || "").filter(Boolean);
  const [version, setVersion] = React.useState(versiones[0]);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => { setVersion(versiones[0]); }, [data?.slug]);
  return (
    <section className="desc">
      <img className="desc__img" src={(data?.imagen_lateral || data?.imagen_principal) ? resolveImg(data.imagen_lateral || data.imagen_principal) : (SIDE_BY_MODEL[modelo] || DUMMY)} alt={`SOUEAST ${modelo} vista lateral`} />
      <div className="desc__body">
        <div className="desc__select" onClick={() => setOpen(!open)}>
          <span>Versión {version}</span>
          <Icon name={open ? "chevronUp" : "chevronDown"} size={20} color="#B7B7B7" />
          {open && (
            <ul className="desc__opts">
              {versiones.map(v => (
                <li key={v} onClick={(e) => { e.stopPropagation(); setVersion(v); setOpen(false); }}>{v}</li>
              ))}
            </ul>
          )}
        </div>
        <p className="desc__lead">{data?.descripcion || `Descripción del modelo SOUEAST ${modelo}. Reemplazar este texto con el copy definitivo del modelo.`}</p>
        <div className="desc__price">
          <span className="desc__priceLabel">Precio desde</span>
          <span className="desc__priceVal">{formatCLP(data?.precio_desde)}<sup>*</sup></span>
        </div>
        <p className="desc__fine">{data?.precio_legal || "*Texto legal del precio. Reemplazar con el contenido definitivo."}</p>
      </div>
      <style>{`
        .desc { display: grid; grid-template-columns: 800px 1fr; gap: 64px; padding: 80px var(--container-pad); align-items: center; }
        .desc__img { aspect-ratio: 800/574; width: 100%; object-fit: cover; }
        .desc__body { display: flex; flex-direction: column; gap: 24px; }
        .desc__select { position: relative; display: flex; align-items: center; justify-content: space-between; padding: 8px 14px; border: 1px solid var(--color-line); color: var(--color-line); cursor: pointer; user-select: none; min-width: 329px; max-width: 329px; }
        .desc__opts { position: absolute; top: 100%; left: -1px; right: -1px; background: #fff; border: 1px solid var(--color-line); list-style: none; padding: 0; margin: 0; z-index: 5; }
        .desc__opts li { padding: 10px 14px; cursor: pointer; color: var(--color-text); }
        .desc__opts li:hover { background: var(--color-surface); color: var(--color-primary); }
        .desc__lead { font-family: Montserrat; font-size: 16px; color: var(--color-text); line-height: 1.6; max-width: 56ch; }
        .desc__price { padding: 16px 0; border-top: 2px solid var(--color-primary); border-bottom: 2px solid var(--color-primary); display: flex; flex-direction: column; gap: 8px; }
        .desc__priceLabel { font-size: 16px; color: var(--color-muted); }
        .desc__priceVal { font-family: Montserrat; font-weight: 700; font-size: 36px; color: var(--color-text); }
        .desc__fine { font-size: 12px; color: var(--color-muted); line-height: 1.5; max-width: 56ch; }
        @media (max-width: 1023px) { .desc { grid-template-columns: 1fr; gap: 32px; padding: 48px var(--container-pad); } .desc__select { max-width: 100%; } }
      `}</style>
    </section>
  );
};

const PColores = ({ modelo, data }) => {
  const [tab, setTab] = React.useState("Exterior");
  const colors = (data?.colores && data.colores.length) ? data.colores : [
    { name: "Color 1", hex: "#92B1B9" },
    { name: "Color 2", hex: "#1E1E1E" },
    { name: "Color 3", hex: "#F3F3F1" },
    { name: "Color 4", hex: "#D9845B" },
    { name: "Color 5", hex: "#3A6F8F" },
  ];
  const [picked, setPicked] = React.useState(0);
  React.useEffect(() => { setPicked(0); }, [data?.slug]);

  // Filtrar swatches por tab. Si el dataset no distingue tipo, mostramos todos.
  const tipoOf = (c) => c?.tipo || "Exterior";
  const hayTipos = colors.some(c => c?.tipo);
  const visibleColors = hayTipos ? colors.filter(c => tipoOf(c) === tab) : colors;
  const pickedColor = visibleColors[picked] || visibleColors[0] || colors[0];

  // Resolver imagenes desde Strapi (componente color → imagen_aerea/imagen_lateral).
  // Si vienen pobladas, las usamos en el background. Si no, dejamos que el CSS
  // hardcodeado del HTML por modelo (data-modelo + nth-child) tome el control.
  const aereaUrl = pickedColor?.imagen_aerea ? resolveImg(pickedColor.imagen_aerea) : null;
  const lateralUrl = pickedColor?.imagen_lateral ? resolveImg(pickedColor.imagen_lateral) : null;
  const mainStyle = aereaUrl ? { backgroundImage: `url('${aereaUrl}')` } : { backgroundImage: `url('${MAIN_COLOR_BY_MODEL[modelo] || DUMMY}')` };
  const sideStyle = lateralUrl ? { backgroundImage: `url('${lateralUrl}')` } : { backgroundImage: `url('${DUMMY}')` };

  React.useEffect(() => { setPicked(0); }, [tab]);

  return (
    <section className="col" id="colores">
      <div className="col__head">
        <span className="section-eyebrow"><span className="bar" /> Personaliza</span>
        <h2 className="col__title">Colores</h2>
        <div className="col__tabs">
          {["Exterior", "Interior"].map(t => (
            <button key={t} className={"col__tab" + (tab === t ? " is-active" : "")} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="col__grid">
        <div className="col__main" style={mainStyle} role="img" aria-label="exterior" />
        <div className="col__side" style={sideStyle} role="img" aria-label="interior" />
      </div>
      <div className="col__swatchRow">
        <span className="tick" style={{ marginRight: 16 }} />
        <p className="col__swatchName">{pickedColor?.name || ""}</p>
        <div className="col__swatches">
          {visibleColors.map((c, i) => (
            <button key={c.name + i} onClick={() => setPicked(i)} className={"col__swatch" + (picked === i ? " is-active" : "")} style={{ background: c.hex }} aria-label={c.name} />
          ))}
        </div>
      </div>
      <style>{`
        .col { padding: 80px var(--container-pad); }
        .col__head { display: flex; align-items: baseline; gap: 32px; margin-bottom: 40px; flex-wrap: wrap; }
        .col__title { font-family: Montserrat; font-size: var(--fs-h3); color: var(--color-text); margin: 0; }
        .col__tabs { display: flex; gap: 24px; margin-left: auto; }
        .col__tab { font-family: Montserrat; font-size: 16px; color: var(--color-muted); padding: 6px 0; border-bottom: 2px solid transparent; transition: color 180ms, border-color 180ms; }
        .col__tab.is-active, .col__tab:hover { color: var(--color-primary); border-color: var(--color-primary); }
        .col__grid { display: grid; grid-template-columns: 820px 1fr; gap: 32px; margin-bottom: 32px; }
        .col__main { aspect-ratio: 820/500; background-size: cover; background-position: center; }
        .col__side { aspect-ratio: 820/600; background-size: cover; background-position: center; }
        .col__swatchRow { display: flex; align-items: center; padding-top: 24px; border-top: 1px solid var(--color-primary); flex-wrap: wrap; gap: 16px; }
        .col__swatchName { font-family: Montserrat; font-size: 18px; color: var(--color-text); margin: 0; min-width: 200px; }
        .col__swatches { display: flex; gap: 12px; margin-left: auto; }
        .col__swatch { width: 32px; height: 32px; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 0 0 1px #ccc; transition: transform 200ms, box-shadow 200ms; cursor: pointer; }
        .col__swatch:hover { transform: scale(1.1); }
        .col__swatch.is-active { box-shadow: 0 0 0 2px var(--color-primary); transform: scale(1.1); }
        @media (max-width: 1023px) { .col__grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
};

const PGaleria = ({ data }) => {
  const slides = (data?.galeria && data.galeria.length) ? data.galeria : [
    { feat: "Característica 1", desc: "Descripción de la característica destacada." },
    { feat: "Característica 2", desc: "Descripción de la característica destacada." },
    { feat: "Característica 3", desc: "Descripción de la característica destacada." },
    { feat: "Característica 4", desc: "Descripción de la característica destacada." },
  ];
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => { setIdx(0); }, [data?.slug]);
  const next = () => setIdx((idx + 1) % slides.length);
  const prev = () => setIdx((idx - 1 + slides.length) % slides.length);
  // Si el slide actual trae imagen desde Strapi, la usamos. Si no, el CSS
  // hardcodeado del HTML por modelo (data-s09-slide / data-s06phev-slide) toma el control.
  const slideImg = slides[idx]?.imagen ? resolveImg(slides[idx].imagen) : null;
  const stageStyle = slideImg ? { backgroundImage: `url('${slideImg}')` } : undefined;
  return (
    <section className="gal" id="galeria">
      <div className="gal__head">
        <span className="section-eyebrow"><span className="bar" /> Diseño</span>
      </div>
      <div className="gal__stage">
        <button className="gal__nav gal__nav--l" onClick={prev} aria-label="Anterior"><Icon name="chevronLeft" size={28} color="#fff" /></button>
        <div className="gal__img" style={stageStyle} role="img" aria-label={`galería — ${slides[idx].feat}`} />
        <button className="gal__nav gal__nav--r" onClick={next} aria-label="Siguiente"><Icon name="chevronRight" size={28} color="#fff" /></button>
      </div>
      <div className="gal__chips">
        {slides.map((s, i) => (
          <button key={i} className={"gal__chip" + (idx === i ? " is-active" : "")} onClick={() => setIdx(i)}>{s.feat}</button>
        ))}
      </div>
      <p className="gal__desc">{slides[idx].desc}</p>
      <style>{`
        .gal { padding: 80px var(--container-pad); background: var(--color-surface-3); }
        .gal__head { margin-bottom: 24px; }
        .gal__stage { position: relative; }
        .gal__img { aspect-ratio: 1682/575; background-size: cover; background-position: center; }
        .gal__nav { position: absolute; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; background: rgba(68,68,68,0.75); display: inline-flex; align-items: center; justify-content: center; transition: background 180ms; }
        .gal__nav:hover { background: var(--color-primary); }
        .gal__nav--l { left: 0; } .gal__nav--r { right: 0; }
        .gal__chips { display: flex; gap: 24px; padding: 24px 0; border-bottom: 1px solid var(--color-line); margin-top: 16px; flex-wrap: wrap; }
        .gal__chip { font-family: Montserrat; font-size: 14px; color: var(--color-text); padding: 6px 4px; border-bottom: 2px solid transparent; }
        .gal__chip.is-active { color: var(--color-primary); border-color: var(--color-primary); font-weight: 700; }
        .gal__desc { font-family: Montserrat; font-size: 18px; color: var(--color-text); text-align: center; margin: 24px 0 0; max-width: 80ch; margin-inline: auto; }
      `}</style>
    </section>
  );
};

const PSeguridad = ({ data }) => {
  // Acepta ambos shapes: {feat, desc} (componente Strapi unificado) y
  // {title, desc} (legacy del fallback estático). Se prioriza `feat`.
  const items = (data?.seguridad && data.seguridad.length) ? data.seguridad : [
    { feat: "Sistema de seguridad 1", desc: "Descripción del sistema de seguridad." },
    { feat: "Sistema de seguridad 2", desc: "Descripción del sistema de seguridad." },
    { feat: "Sistema de seguridad 3", desc: "Descripción del sistema de seguridad." },
  ];
  return (
    <section className="seg" id="seguridad">
      <div className="seg__head">
        <span className="section-eyebrow"><span className="bar" /> Seguridad</span>
        <h2 className="section-title" style={{ fontSize: "var(--fs-h3)" }}>SEGURIDAD</h2>
      </div>
      <div className="seg__grid">
        {items.map((it, i) => {
          const titulo = it.feat || it.title || "";
          const segImg = it.imagen ? resolveImg(it.imagen) : null;
          const segStyle = segImg ? { backgroundImage: `url('${segImg}')` } : undefined;
          return (
            <article key={i} className="seg__card">
              <div className="seg__img" style={segStyle} role="img" aria-label={titulo} />
              <h3 className="seg__title">{titulo}</h3>
              <p className="seg__desc">{it.desc}</p>
            </article>
          );
        })}
      </div>
      <style>{`
        .seg { padding: 80px var(--container-pad); background: #fff; }
        .seg__head { margin-bottom: 40px; }
        .seg__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
        .seg__img { aspect-ratio: 16/10; margin-bottom: 16px; background-size: cover; background-position: center; }
        .seg__title { font-family: Montserrat; font-weight: 700; font-size: 18px; color: var(--color-text); margin: 0 0 12px; }
        .seg__desc { font-family: Montserrat; font-size: 14px; color: var(--color-text); line-height: 1.6; margin: 0; }
        @media (max-width: 1023px) { .seg__grid { grid-template-columns: 1fr; } }
      `}</style>
    </section>
  );
};

const PSpecs = ({ modelo }) => {
  const [tab, setTab] = React.useState("PARÁMETROS");
  const [versions, setVersions] = React.useState({ "Lite": true, "Pro": true, "Pro Max": false });
  const cols = [
    { v: "1.5T-6DCT Lite", on: versions.Lite },
    { v: "1.5T-6DCT Pro", on: versions.Pro },
    { v: "1.6TD-7DCT Pro Max", on: versions["Pro Max"] },
  ].filter(c => c.on);
  const rows = [
    ["Largo x Ancho x Alto (mm)", "—", "—", "—"],
    ["Distancia entre ejes", "—", "—", "—"],
    ["Altura mínima al suelo (mm)", "—", "—", "—"],
    ["Peso en vacío (kg)", "—", "—", "—"],
    ["Cilindrada (ml)", "—", "—", "—"],
    ["Potencia neta máxima (kW) @ rpm", "—", "—", "—"],
    ["Torque máximo (Nm) @ rpm", "—", "—", "—"],
    ["Neumáticos", "—", "—", "—"],
  ];
  const cats = ["PARÁMETROS", "SEGURIDAD", "DISEÑO INTERIOR", "PRECIOS", "CABINA INTELIGENTE"];
  return (
    <section className="spec" id="specs">
      <div className="spec__head">
        <span className="section-eyebrow"><span className="bar" /> Especificaciones</span>
        <div className="spec__model">
          <span>{modelo}</span>
          <Icon name="chevronDown" size={18} color="#ED7138" />
        </div>
      </div>
      <div className="spec__check">
        <p className="spec__checkLabel">Comparar versiones:</p>
        {Object.keys(versions).map(k => (
          <label key={k} className="spec__chk">
            <input type="checkbox" checked={versions[k]} onChange={() => setVersions({ ...versions, [k]: !versions[k] })} />
            <span className="spec__chkBox">{versions[k] && <Icon name="check" size={14} color="#fff" />}</span>
            <span>{k === "Pro" ? "1.5T-6DCT Pro" : k === "Lite" ? "1.5T-6DCT Lite" : "1.6TD-7DCT Pro Max"}</span>
          </label>
        ))}
      </div>
      <div className="spec__bar">
        {cats.map(c => (
          <button key={c} className={"spec__cat" + (tab === c ? " is-active" : "")} onClick={() => setTab(c)}>
            <span>{c}</span>
            <Icon name={tab === c ? "minus" : "plus"} size={16} color="#fff" />
          </button>
        ))}
      </div>
      <div className="spec__table">
        <div className="spec__tHead">
          <div>Versiones</div>
          {cols.map(c => <div key={c.v}>{c.v}</div>)}
        </div>
        {rows.map((r, i) => (
          <div key={i} className="spec__tRow">
            <div className="spec__tLabel">{r[0]}</div>
            {versions.Lite && <div>{r[1]}</div>}
            {versions.Pro && <div>{r[2]}</div>}
            {versions["Pro Max"] && <div>{r[3]}</div>}
          </div>
        ))}
      </div>
      <p className="spec__note">Nota: La configuración de esta versión es general y está sujeta a ajustes según las normativas y requisitos locales. Para obtener información específica, consulte la región correspondiente.</p>
      <style>{`
        .spec { padding: 80px var(--container-pad); background: #fff; }
        .spec__head { display: flex; align-items: center; gap: 32px; margin-bottom: 24px; flex-wrap: wrap; }
        .spec__model { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border: 1px solid var(--color-primary); color: var(--color-primary); font-family: Montserrat; font-size: 18px; margin-left: auto; min-width: 160px; justify-content: space-between; }
        .spec__check { display: flex; align-items: center; gap: 24px; padding-bottom: 16px; flex-wrap: wrap; }
        .spec__checkLabel { font-size: 14px; color: var(--color-muted); margin: 0; }
        .spec__chk { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-family: Montserrat; font-size: 14px; color: var(--color-text); user-select: none; }
        .spec__chk input { display: none; }
        .spec__chkBox { width: 18px; height: 18px; border: 1px solid var(--color-line); display: inline-flex; align-items: center; justify-content: center; transition: all 180ms; }
        .spec__chk input:checked + .spec__chkBox { background: var(--color-primary); border-color: var(--color-primary); }
        .spec__bar { display: grid; grid-template-columns: repeat(5, 1fr); margin-bottom: 0; }
        .spec__cat { background: var(--color-surface-2); color: var(--color-text); padding: 16px 20px; border-right: 1px solid #ddd; display: flex; align-items: center; justify-content: space-between; gap: 8px; font-family: Montserrat; font-weight: 600; font-size: 13px; letter-spacing: 0.04em; transition: background 180ms; }
        .spec__cat.is-active { background: rgb(66,60,60); color: #fff; }
        .spec__cat:hover:not(.is-active) { background: #ddd; }
        .spec__cat svg path { stroke: currentColor !important; }
        .spec__cat.is-active svg path { stroke: #fff !important; }
        .spec__cat:not(.is-active) svg path { stroke: var(--color-text) !important; }
        .spec__table { background: var(--color-surface-2); padding: 24px; }
        .spec__tHead, .spec__tRow { display: grid; grid-template-columns: 2fr repeat(${cols.length}, 1fr); padding: 14px 8px; border-bottom: 1px solid #ddd; align-items: center; }
        .spec__tHead { font-weight: 700; color: var(--color-text); font-size: 14px; border-bottom: 2px solid var(--color-primary); }
        .spec__tRow { font-size: 14px; color: var(--color-text); }
        .spec__tLabel { color: var(--color-muted); }
        .spec__note { font-size: 12px; color: var(--color-muted); margin-top: 16px; line-height: 1.6; }
        @media (max-width: 1023px) { .spec__bar { grid-template-columns: 1fr 1fr; } .spec__tHead, .spec__tRow { grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px; } .spec__tHead > div:nth-child(n+3), .spec__tRow > div:nth-child(n+3) { display: none; } }
      `}</style>
    </section>
  );
};

const PCotizar = ({ modelo }) => {
  const formId = `cotizador_${modelo.toLowerCase()}`;
  const modeloFull = `SOUEAST ${modelo}`;
  const [form, setForm] = React.useState({ nombre: "", email: "", telefono: "", region: "", comuna: "", version: "1.5T-6DCT Pro", terms: false });
  const [errors, setErrors] = React.useState({});
  const [sent, setSent] = React.useState(false);

  const regiones = Object.keys(window.REGIONES_COMUNAS || {});
  const comunas = form.region ? (window.REGIONES_COMUNAS[form.region] || []) : [];
  const [submitting, setSubmitting] = React.useState(false);
  const [apiError, setApiError] = React.useState(null);

  // Cleanup del timeout del banner "sent" — evita setState en unmount.
  const sentTimeoutRef = React.useRef(null);
  React.useEffect(() => () => {
    if (sentTimeoutRef.current) clearTimeout(sentTimeoutRef.current);
  }, []);

  React.useEffect(() => {
    if (window.bloomreachService) {
      window.bloomreachService.trackEvent("form_view", { form: formId });
    }
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nombre.trim()) e.nombre = "Ingresa tu nombre";
    if (!form.email.trim()) e.email = "Ingresa tu email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Email no válido";
    if (!form.telefono.trim()) e.telefono = "Ingresa tu teléfono";
    else if (!/^\+?\d[\d\s\-]{6,}$/.test(form.telefono)) e.telefono = "Teléfono no válido";
    if (!form.region) e.region = "Selecciona una región";
    if (!form.terms) e.terms = "Debes aceptar los términos";
    return e;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    setApiError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (window.bloomreachService) {
      window.bloomreachService.trackEvent("form_submit", {
        form: formId, modelo: modeloFull, version: form.version, region: form.region,
      });
    }

    setSubmitting(true);
    try {
      const result = await window.cotizadorService.enviarCotizacion(form, { modelo: modeloFull });
      if (result.ok) {
        setSent(true);
        if (sentTimeoutRef.current) clearTimeout(sentTimeoutRef.current);
        sentTimeoutRef.current = setTimeout(() => setSent(false), 5000);
        if (window.bloomreachService) {
          window.bloomreachService.identifyCustomer(form.email, {
            email: form.email,
            first_name: form.nombre.split(/\s+/)[0] || "",
            last_name: form.nombre.split(/\s+/).slice(1).join(" "),
            phone: form.telefono,
            region: form.region,
          });
          window.bloomreachService.trackEvent("lead_sent", {
            form: formId, modelo: modeloFull, version: form.version, region: form.region, comuna: form.comuna,
          });
        }
        setForm({ nombre: "", email: "", telefono: "", region: "", comuna: "", version: "1.5T-6DCT Pro", terms: false });
      } else {
        setApiError("No pudimos enviar tu cotización. Intenta nuevamente.");
        if (window.bloomreachService) {
          window.bloomreachService.trackEvent("lead_error", { form: formId, status: result.status, reason: "http_error" });
        }
      }
    } catch (err) {
      console.error("[PCotizar] submit error", err);
      setApiError("Ocurrió un error de conexión. Intenta nuevamente.");
      if (window.bloomreachService) {
        window.bloomreachService.trackEvent("lead_error", { form: formId, reason: "network_error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (id, val) => {
    setForm(prev => {
      const next = { ...prev, [id]: val };
      if (id === 'region') next.comuna = "";
      return next;
    });
  };

  const renderField = (id, label, opts = {}) => {
    const { type = "text", options, disabled } = opts;
    const err = errors[id];
    return (
      <div className={"fld" + (err ? " fld--err" : "")}>
        <label htmlFor={id}>{label}</label>
        {options ? (
          <select id={id} value={form[id]} onChange={e => setField(id, e.target.value)} disabled={disabled}>
            <option value="">Selecciona…</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <input id={id} type={type} value={form[id]} onChange={e => setField(id, e.target.value)} />
        )}
        {err && <span className="fld__err">{err}</span>}
      </div>
    );
  };

  return (
    <section className="cot" id="cotizar">
      <div className="cot__inner">
        <div className="cot__intro">
          <span className="section-eyebrow" style={{ color: "#fff" }}><span className="bar" /> Solicita</span>
          <h2 className="cot__title">Cotiza tu {modeloFull}</h2>
          <p className="cot__lead">Te contactaremos en menos de 24 horas con una propuesta personalizada y la sucursal más cercana.</p>
        </div>

        {sent && (
          <div className="cot__ok"><Icon name="check" size={20} color="#fff" /> ¡Solicitud enviada! Te contactaremos pronto.</div>
        )}
        {apiError && !sent && (
          <div className="cot__err">{apiError}</div>
        )}

        <form className="cot__form" onSubmit={submit} noValidate>
          {renderField("nombre", "Nombre completo")}
          {renderField("email", "Email", { type: "email" })}
          {renderField("telefono", "Teléfono", { type: "tel" })}
          {renderField("version", "Versión", { options: ["1.5T-6DCT Lite", "1.5T-6DCT Pro", "1.6TD-7DCT Pro Max"] })}
          {renderField("region", "Región", { options: regiones })}
          {renderField("comuna", "Comuna", { options: comunas, disabled: !form.region })}

          <label className="cot__terms">
            <input type="checkbox" checked={form.terms} onChange={e => setForm({ ...form, terms: e.target.checked })} />
            <span className="cot__termsBox">{form.terms && <Icon name="check" size={14} color="#fff" />}</span>
            <span>Acepto los <a href="#">términos y políticas de privacidad</a> de SOUEAST.</span>
          </label>
          {errors.terms && <span className="fld__err" style={{ gridColumn: "1/-1" }}>{errors.terms}</span>}

          <div className="cot__actions">
            <button type="submit" className="cta cta--orange" style={{ minWidth: 220, opacity: submitting ? 0.7 : 1, pointerEvents: submitting ? "none" : "auto" }} disabled={submitting}>
              <span>{submitting ? "ENVIANDO…" : "SOLICITAR COTIZACIÓN"}</span>
              <span className="cta__arrow">
                <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
                  <path d="M0 4h20m0 0L17 1m3 3L17 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </span>
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .cot { padding: 100px var(--container-pad); background: #161616; color: #fff; }
        .cot__inner { max-width: 880px; margin: 0 auto; }
        .cot__intro { text-align: left; margin-bottom: 40px; }
        .cot__title { font-family: Montserrat; font-weight: 700; font-size: var(--fs-h2); margin: 8px 0 12px; }
        .cot__lead { color: #b7b7b7; font-size: 16px; max-width: 56ch; }
        .cot__ok { display: inline-flex; align-items: center; gap: 12px; background: var(--color-primary); padding: 14px 20px; border-radius: 4px; margin-bottom: 24px; font-weight: 600; }
        .cot__err { display: inline-block; background: rgba(226,55,55,0.15); border: 1px solid #e25; color: #ffb1b1; padding: 12px 18px; border-radius: 4px; margin-bottom: 24px; font-size: 14px; }
        .cot__form { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .fld { display: flex; flex-direction: column; gap: 6px; }
        .fld label { font-size: 13px; color: #b7b7b7; }
        .fld input, .fld select { background: transparent; border: 0; border-bottom: 1px solid #444; padding: 10px 0; color: #fff; font-size: 16px; transition: border-color 180ms; }
        .fld select:disabled { opacity: 0.4; cursor: not-allowed; }
        .fld select option { color: #161616; }
        .fld input:focus, .fld select:focus { outline: none; border-color: var(--color-primary); }
        .fld--err input, .fld--err select { border-color: #e25; }
        .fld__err { font-size: 12px; color: #e87a7a; margin-top: 2px; }
        .cot__terms { grid-column: 1 / -1; display: inline-flex; align-items: flex-start; gap: 12px; cursor: pointer; font-size: 14px; color: #ddd; }
        .cot__terms input { display: none; }
        .cot__termsBox { width: 18px; height: 18px; border: 1px solid #888; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; transition: all 180ms; }
        .cot__terms input:checked + .cot__termsBox { background: var(--color-primary); border-color: var(--color-primary); }
        .cot__terms a { color: var(--color-primary); }
        .cot__actions { grid-column: 1 / -1; display: flex; justify-content: flex-end; margin-top: 16px; }
        .cot__actions .cta { border-radius: 100px; padding: 14px 24px; height: auto; }
        @media (max-width: 767px) { .cot__form { grid-template-columns: 1fr; } .cot__actions { justify-content: stretch; } .cot__actions .cta { width: 100%; justify-content: center; } }
      `}</style>
    </section>
  );
};

// Hook único: lee el modelo desde Strapi (si está configurado) o desde el
// fallback local. La UI consume el shape unificado vía props.
const useModeloData = (modelo) => {
  const slug = (modelo || "").toLowerCase();
  const fallback = (window.MODELO_FALLBACKS && window.MODELO_FALLBACKS[slug]) || null;
  const strapiConfigured = !!(window.ENV && window.ENV.STRAPI_URL);

  const useStrapiHook = window.useStrapi || (() => ({ data: fallback, loading: false, error: null, refetch: () => {} }));
  const { data, loading, error, refetch } = useStrapiHook(
    () => (window.strapiService && window.strapiService.getModelo)
      ? window.strapiService.getModelo(slug)
      : Promise.resolve(fallback),
    [slug],
    { fallback, skip: !strapiConfigured || !slug }
  );
  return { data: data || fallback, loading, error, refetch };
};

const ModeloPlaceholderPage = ({ modelo }) => {
  const { data, loading, error } = useModeloData(modelo);

  // Bloomreach: track view del modelo cuando llega la data
  React.useEffect(() => {
    if (data && window.bloomreachService) {
      window.bloomreachService.trackEvent("modelo_view", {
        modelo: data.nombre || modelo,
        slug: data.slug || (modelo || "").toLowerCase(),
        precio_desde: data.precio_desde || null,
      });
    }
  }, [data?.slug]);

  return (
    <>
      {error && (window.ENV && window.ENV.STRAPI_URL) && (
        <div style={{ padding: "12px 24px", background: "#FFF5F2", color: "#8a3a1a", fontSize: 13, borderBottom: "1px solid #F4D5CC", textAlign: "center" }}>
          No se pudo cargar el contenido del CMS. Mostrando datos locales.
        </div>
      )}
      <PHero modelo={modelo} data={data} />
      <PDescripcion modelo={modelo} data={data} />
      <PColores modelo={modelo} data={data} />
      <PGaleria data={data} />
      <PSeguridad data={data} />
      <PSpecs modelo={modelo} />
      <PCotizar modelo={modelo} />
    </>
  );
};
window.ModeloPlaceholderPage = ModeloPlaceholderPage;
// cache-bust 1777575722973
