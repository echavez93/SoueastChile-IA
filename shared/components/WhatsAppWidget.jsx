// WhatsApp floating widget — Andes Retail / adereso style
// Bubble bottom-right; click → expandable popup matching reference image.
const WhatsAppWidget = ({ phone = "56912345678" }) => {
  const [open, setOpen] = React.useState(false);
  const message = encodeURIComponent("Hola, quisiera más información sobre SOUEAST.");
  const waUrl = `https://wa.me/${phone}?text=${message}`;

  const Icon = ({ size = 32, color = "#fff" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} fill={color} aria-hidden="true">
      <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.33.244-.73.244-1.088 0-.058 0-.144-.03-.215-.1-.172-2.434-1.39-2.678-1.39zm-2.908 7.593c-1.747 0-3.48-.53-4.942-1.49L7.793 24.41l1.132-3.337a8.955 8.955 0 0 1-1.72-5.272c0-4.955 4.04-8.995 8.997-8.995S25.2 10.845 25.2 15.8c0 4.958-4.04 8.998-8.998 8.998zm0-19.798c-5.96 0-10.8 4.842-10.8 10.8 0 1.964.53 3.898 1.546 5.574L5 27.176l5.974-1.92a10.807 10.807 0 0 0 16.03-9.455c0-5.958-4.842-10.8-10.802-10.8z" fillRule="evenodd"/>
    </svg>
  );

  return (
    <div className="wa">
      {/* Popup card */}
      <div className={"wa__card" + (open ? " wa__card--open" : "")} role="dialog" aria-hidden={!open} aria-label="Chat con Andes Retail">
        <header className="wa__head">
          <div className="wa__avatar">
            <Icon size={36} color="#25D366" />
          </div>
          <div className="wa__headText">
            <p className="wa__title">Andes Retail</p>
            <p className="wa__subtitle">¡Encuentra el vehículo perfecto para lo que necesitas!</p>
          </div>
          <button className="wa__close" onClick={() => setOpen(false)} aria-label="Cerrar">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 5l10 10M15 5L5 15" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
          </button>
        </header>

        <div className="wa__body">
          <div className="wa__bubble">
            <p className="wa__bubbleName">Andes Retail</p>
            <p className="wa__bubbleText">¿Quieres cotizar, agendar o necesitas recomendaciones? Escríbeme.</p>
          </div>
        </div>

        <footer className="wa__foot">
          <a className="wa__btn" href={waUrl} target="_blank" rel="noopener noreferrer">
            <Icon size={22} color="#fff" />
            <span>¡Hablemos!</span>
          </a>
          <p className="wa__credit">
            <em>desarollado por</em>{" "}
            <span className="wa__brand">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="6" stroke="#1565F0" strokeWidth="1.6" fill="none"/>
                <path d="M9 9 L11.5 11.5" stroke="#1565F0" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              adereso
            </span>
          </p>
        </footer>
      </div>

      {/* Floating bubble */}
      <button
        id="wa-widget-send-button"
        className="wa__bubbleBtn"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Cerrar chat" : "Abrir chat de WhatsApp"}
        aria-expanded={open}
      >
        <Icon size={32} color="#fff" />
      </button>

      <style>{`
        .wa {
          position: fixed;
          right: 20px;
          bottom: 20px;
          z-index: 90;
          font-family: "Open Sans", "Montserrat", system-ui, sans-serif;
        }

        /* ── Floating bubble ── */
        .wa__bubbleBtn {
          width: 60px; height: 60px;
          border-radius: 50%;
          background: #25D366;
          box-shadow: 0 8px 20px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.12);
          display: inline-flex; align-items: center; justify-content: center;
          color: #fff;
          cursor: pointer;
          transition: transform 200ms var(--ease-out), box-shadow 200ms;
          margin-left: auto;
          display: flex;
        }
        .wa__bubbleBtn:hover { transform: scale(1.06); box-shadow: 0 12px 28px rgba(0,0,0,0.22); }
        .wa__bubbleBtn:active { transform: scale(0.96); }

        /* ── Popup card ── */
        .wa__card {
          position: absolute;
          right: 0;
          bottom: 76px;
          width: 360px;
          max-width: calc(100vw - 40px);
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 18px 40px rgba(0,0,0,0.22), 0 4px 10px rgba(0,0,0,0.08);
          overflow: hidden;
          opacity: 0;
          transform: translateY(12px) scale(0.96);
          transform-origin: bottom right;
          pointer-events: none;
          transition: opacity 220ms var(--ease-out), transform 240ms var(--ease-out);
        }
        .wa__card--open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        /* Header — dark teal */
        .wa__head {
          background: #075E54;
          color: #fff;
          padding: 18px 16px 18px 18px;
          display: grid;
          grid-template-columns: 56px 1fr 24px;
          gap: 14px;
          align-items: flex-start;
        }
        .wa__avatar {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.18);
        }
        .wa__headText { min-width: 0; padding-top: 2px; }
        .wa__title {
          margin: 0 0 4px;
          font-family: "Open Sans", sans-serif;
          font-weight: 700;
          font-size: 17px;
          line-height: 1.2;
          color: #fff;
        }
        .wa__subtitle {
          margin: 0;
          font-size: 14px;
          line-height: 1.35;
          color: rgba(255,255,255,0.95);
          font-weight: 400;
        }
        .wa__close {
          width: 24px; height: 24px;
          color: #fff;
          display: inline-flex; align-items: center; justify-content: center;
          opacity: 0.9;
          transition: opacity 160ms;
        }
        .wa__close:hover { opacity: 1; }

        /* Body — beige WhatsApp pattern */
        .wa__body {
          background: #ECE5DD;
          padding: 22px 18px;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(0,0,0,0.04) 0 2px, transparent 3px),
            radial-gradient(circle at 70% 60%, rgba(0,0,0,0.035) 0 2px, transparent 3px),
            radial-gradient(circle at 40% 80%, rgba(0,0,0,0.03) 0 2px, transparent 3px),
            radial-gradient(circle at 85% 20%, rgba(0,0,0,0.035) 0 2px, transparent 3px);
          background-size: 120px 120px;
        }
        .wa__bubble {
          background: #fff;
          border-radius: 10px;
          padding: 14px 16px;
          box-shadow: 0 1px 1px rgba(0,0,0,0.08);
          position: relative;
        }
        .wa__bubble::before {
          content: "";
          position: absolute;
          top: 0; left: -6px;
          width: 12px; height: 12px;
          background: #fff;
          clip-path: polygon(100% 0, 0 0, 100% 100%);
        }
        .wa__bubbleName {
          margin: 0 0 4px;
          font-weight: 700;
          font-size: 14px;
          color: #888;
        }
        .wa__bubbleText {
          margin: 0;
          font-size: 15px;
          line-height: 1.4;
          color: #303030;
        }

        /* Footer — CTA + credit */
        .wa__foot {
          background: #fff;
          padding: 18px 18px 14px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .wa__btn {
          width: 100%;
          height: 50px;
          border-radius: 100px;
          background: #4FCE5D;
          color: #fff;
          font-weight: 700;
          font-size: 17px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          box-shadow: 0 4px 12px rgba(79,206,93,0.35);
          transition: background 180ms, transform 120ms;
        }
        .wa__btn:hover { background: #43c051; }
        .wa__btn:active { transform: translateY(1px); }
        .wa__credit {
          margin: 0;
          font-size: 13px;
          color: #999;
        }
        .wa__credit em { font-style: italic; }
        .wa__brand {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #1565F0;
          font-weight: 700;
          font-style: normal;
        }

        @media (max-width: 767px) {
          .wa { right: 14px; bottom: 14px; }
          .wa__bubbleBtn { width: 54px; height: 54px; }
          .wa__card { width: 320px; bottom: 68px; }
        }
      `}</style>
    </div>
  );
};
window.WhatsAppWidget = WhatsAppWidget;
