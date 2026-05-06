// shared/components/useStrapi.jsx
// Hook React para consumir window.strapiService desde componentes.
//
// Resuelve los tres problemas que aparecen al hacer fetch directo dentro de un
// componente:
//   1. Estados loading / error / data sin re-implementarlos en cada página.
//   2. Cancelación al desmontar — evita el "Can't perform a state update on an
//      unmounted component" si el usuario navega antes de que la API responda.
//   3. Reejecución solo cuando cambian las deps (mismo contrato que useEffect).
//
// Uso típico:
//
//   const { data: sucursales, loading, error, refetch } =
//     useStrapi(() => window.strapiService.listSucursales({ region }), [region]);
//
//   if (loading) return <Skeleton />;
//   if (error)   return <ErrorState onRetry={refetch} />;
//   return sucursales.map(...);
//
// Para datos que podrían no existir todavía (Strapi aún sin desplegar) el hook
// también acepta un valor `fallback` que se usa mientras `data` sea null.
// Esto deja a las páginas funcionando con datos mock durante la transición.

const useStrapi = (fetcher, deps = [], options = {}) => {
  const { fallback = null, skip = false } = options;

  const [state, setState] = React.useState({
    data: fallback,
    loading: !skip,
    error: null,
  });

  // Guardamos el fetcher en un ref — así no necesitamos meterlo en deps
  // (el caller suele pasar una arrow function nueva en cada render, lo que
  // dispararía un loop si la incluyéramos).
  const fetcherRef = React.useRef(fetcher);
  fetcherRef.current = fetcher;

  // Tick para forzar refetch manual sin tocar las deps externas.
  const [tick, setTick] = React.useState(0);
  const refetch = React.useCallback(() => setTick((n) => n + 1), []);

  React.useEffect(() => {
    if (skip) {
      setState({ data: fallback, loading: false, error: null });
      return;
    }

    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    Promise.resolve()
      .then(() => fetcherRef.current())
      .then((data) => {
        if (!alive) return;
        setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!alive) return;
        console.warn("[useStrapi] fetch failed", err);
        // Si hay fallback, lo dejamos como data para que la UI no quede vacía.
        setState({ data: fallback, loading: false, error: err });
      });

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skip, tick, ...deps]);

  return { ...state, refetch };
};

window.useStrapi = useStrapi;
