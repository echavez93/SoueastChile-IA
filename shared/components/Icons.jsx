// Icon set — Material-style line icons. Original drawings.
const Icon = ({ name, size = 24, color = "currentColor", style, ...rest }) => {
  const paths = {
    menu: <path d="M4 7h22M4 17h22" stroke={color} strokeWidth="2" strokeLinecap="round" />,
    close: <path d="M6 6l18 18M24 6L6 24" stroke={color} strokeWidth="2" strokeLinecap="round" />,
    arrowRight: <path d="M5 12h22M20 5l7 7-7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    arrowDown: <path d="M16 5v22M9 20l7 7 7-7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    arrowUp: <path d="M16 27V5M9 12l7-7 7 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    chevronDown: <path d="M8 12l4 4 4-4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    chevronUp: <path d="M8 14l4-4 4 4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    chevronLeft: <path d="M14 6l-6 6 6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    chevronRight: <path d="M10 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    car: <g stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 16l2-6c.5-1.4 1.6-2 3-2h10c1.4 0 2.5.6 3 2l2 6"/>
      <path d="M3 16h22v4H3z"/>
      <circle cx="8" cy="20" r="2" fill={color}/>
      <circle cx="20" cy="20" r="2" fill={color}/>
    </g>,
    pin: <g stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 26s8-7 8-13a8 8 0 10-16 0c0 6 8 13 8 13z"/>
      <circle cx="14" cy="13" r="3"/>
    </g>,
    wrench: <g stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 6a4 4 0 11-5 5L8 20l-2 2 2 2 2-2 9-9a4 4 0 015-5z"/>
    </g>,
    whatsapp: <g stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4a10 10 0 00-8.7 14.9L4 26l7.3-1.3A10 10 0 1014 4z"/>
      <path d="M10 11c0 4 3 7 7 7l1.5-1.5-2-1-1 .5c-1.5-.5-2.5-1.5-3-3l.5-1-1-2L10 11z"/>
    </g>,
    star: <path d="M12 2l3 7 7 .6-5.3 4.6 1.6 7L12 17l-6.3 4.2 1.6-7L2 9.6 9 9z" fill={color}/>,
    plus: <path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />,
    minus: <path d="M5 12h14" stroke={color} strokeWidth="2" strokeLinecap="round" />,
    check: <path d="M5 12l4 4 10-10" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    instagram: <g stroke={color} strokeWidth="1.6" fill="none">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17" cy="7" r="1" fill={color}/>
    </g>,
    facebook: <path d="M14 22v-8h3l.5-4H14V8c0-1 .5-2 2-2h2V2.5C17.5 2.3 16 2 14.5 2c-3 0-5 2-5 5v3H6v4h3.5v8H14z" fill={color}/>,
  };
  return (
    <svg width={size} height={size} viewBox={name === "facebook" || name === "instagram" || name === "whatsapp" || name === "star" || name === "plus" || name === "minus" || name === "check" || name === "chevronDown" || name === "chevronUp" || name === "chevronLeft" || name === "chevronRight" ? "0 0 24 24" : "0 0 32 32"} fill="none" style={style} {...rest}>
      {paths[name] || null}
    </svg>
  );
};
window.Icon = Icon;
