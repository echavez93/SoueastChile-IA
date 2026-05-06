// Soueast wordmark — stylized "SOUEAST" with bold geometric look,
// con "S" más prominente. Versión SVG original (no recreación de marca).
const Logo = ({ height = 22, color = "#fff" }) => (
  <svg
    aria-label="SOUEAST"
    height={height}
    viewBox="0 0 200 28"
    fill="none"
    style={{ display: "inline-block" }}
  >
    <text
      x="0" y="22"
      fontFamily="Montserrat, sans-serif"
      fontWeight="800"
      fontSize="24"
      letterSpacing="3.6"
      fill={color}
    >
      SOUEAST
    </text>
  </svg>
);

// Stylized model name — "S" big, números más pequeños y con peso menor.
// Para los items del navbar (S06, S06 PHEV, S07, S09).
const ModelName = ({ name, color = "#fff" }) => {
  // Splits letters from digits and PHEV badge
  const m = name.match(/^(S)(\d+)(\s?PHEV)?$/i);
  if (!m) return <span style={{ color }}>{name}</span>;
  const [, s, num, phev] = m;
  return (
    <span style={{ display: "inline-flex", alignItems: "baseline", color, fontFamily: "Montserrat, sans-serif" }}>
      <span style={{ fontSize: "1.05em", fontWeight: 800, letterSpacing: 0 }}>{s}</span>
      <span style={{ fontSize: "0.78em", fontWeight: 500, marginLeft: 1, letterSpacing: "0.02em" }}>{num}</span>
      {phev && (
        <span style={{
          fontSize: "0.55em", fontWeight: 700, marginLeft: 4, padding: "1px 5px",
          border: "1px solid currentColor", borderRadius: 3, letterSpacing: "0.06em",
          alignSelf: "center", lineHeight: 1.2,
        }}>PHEV</span>
      )}
    </span>
  );
};

window.Logo = Logo;
window.ModelName = ModelName;
