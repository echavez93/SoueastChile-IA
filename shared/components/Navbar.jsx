// Navbar — sticky transparent header
// Becomes solid dark when scrolled past hero
// Triggers full-screen menu overlay on click
const Navbar = ({ onOpenMenu, dark }) => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mantener transparente sobre el hero — solo se vuelve sólido tras scroll significativo
  const solid = scrolled || dark;

  return (
    <header
      className={"navbar" + (solid ? " nav-scrolled" : "")}
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: "var(--nav-h)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(20px, 4vw, 52px)",
        color: "#fff",
        transition: "background 320ms var(--ease-out), backdrop-filter 320ms",
        background: solid ? "rgba(0,0,0,0.85)" : "transparent",
        backdropFilter: solid ? "blur(12px)" : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
        <button
          aria-label="Abrir menú"
          onClick={onOpenMenu}
          className="nav-burger"
          style={{ color: "#fff", display: "inline-flex", padding: 8 }}
        >
          <Icon name="menu" size={32} color="#fff" />
        </button>
        <nav className="nav-links" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          <a href="modelo-s06.html" className="nav-link"><ModelName name="S06" color="#fff" /></a>
          <a href="modelo-s06-phev.html" className="nav-link"><ModelName name="S06 PHEV" color="#fff" /></a>
          <a href="modelo-s07.html" className="nav-link"><ModelName name="S07" color="#fff" /></a>
          <a href="modelo-s09.html" className="nav-link"><ModelName name="S09" color="#fff" /></a>
        </nav>
      </div>

      <a href="home.html" style={{ display: "inline-flex", alignItems: "center" }}>
        <Logo height={22} color="#fff" />
      </a>

      <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <a href={(window.cotizarRouter && window.cotizarRouter.getCurrentCotizarUrl()) || "modelo-s06.html#cotizar"} style={{ fontFamily: "Montserrat", fontWeight: 700, fontSize: 16, color: "#fff" }}>Cotizar</a>
        <span style={{ width: 1, height: 21, background: "#fff", display: "inline-block" }} />
        <a href="sucursales.html" style={{ fontFamily: "Montserrat", fontSize: 16, color: "#fff" }}>Sucursales</a>
      </div>

      <style>{`
        .nav-link {
          font-family: Montserrat, sans-serif;
          font-size: 16px;
          color: #fff;
          position: relative;
          padding: 4px 0;
        }
        .nav-link::after {
          content: ""; position: absolute; left: 0; bottom: 0;
          width: 0; height: 2px; background: var(--color-primary);
          transition: width 280ms var(--ease-out);
        }
        .nav-link:hover::after { width: 100%; }

        @media (max-width: 1023px) {
          .nav-links { display: none !important; }
          .nav-right a:nth-child(3), .nav-right span { display: none; }
        }
        @media (max-width: 767px) {
          .nav-right a { font-size: 13px; }
        }
      `}</style>
    </header>
  );
};
window.Navbar = Navbar;
