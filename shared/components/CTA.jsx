// CTA — primary pill button (dark, white border, orange arrow)
// Variants: 'ghost' (translucent dark), 'solid' (full dark), 'orange' (filled brand)
const CTA = ({ children = "EXPLORE", variant = "solid", href = "#", onClick, style, ...rest }) => {
  const cls = "cta" + (variant === "ghost" ? " cta--ghost" : variant === "orange" ? " cta--orange" : " cta--solid-dark");
  return (
    <a className={cls} href={href} onClick={onClick} style={style} {...rest}>
      <span>{children}</span>
      <span className="cta__arrow" aria-hidden="true">
        <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
          <path d="M0 4h20m0 0L17 1m3 3L17 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </span>
    </a>
  );
};

// CTA news/inline link with underline arrow
const CTALink = ({ children = "EXPLORE", href = "#", onClick }) => (
  <a className="cta-link" href={href} onClick={onClick}>
    <span>{children}</span>
    <span className="cta-link__arrow" aria-hidden="true">
      <svg width="18" height="6" viewBox="0 0 18 6" fill="none">
        <path d="M0 3h16m0 0L13 0.5M16 3l-3 2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    </span>
  </a>
);

window.CTA = CTA;
window.CTALink = CTALink;
