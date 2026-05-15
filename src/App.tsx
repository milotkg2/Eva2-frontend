import { useEffect, useMemo, useState } from "react";
import ContextoEntregaPanel from "./components/ContextoEntregaPanel";
import IndicadoresTable from "./components/IndicadoresTable";
import type { Indicador } from "./types";
import { DEMO_INDICADORES } from "./types";
import { promedioAvance } from "./utils/indicadores";

const apiBase =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<Record<string, unknown> | null>(null);
  const [healthErr, setHealthErr] = useState<string | null>(null);
  const [rows, setRows] = useState<Indicador[]>([]);
  const [rowsErr, setRowsErr] = useState<string | null>(null);
  const [usandoDemo, setUsandoDemo] = useState(false);

  const modo = useMemo(() => (apiBase ? "api" : "demo"), []);

  const stats = useMemo(() => {
    const categorias = new Set(rows.map((r) => r.categoria)).size;
    return {
      total: rows.length,
      categorias,
      avanceProm: promedioAvance(rows),
    };
  }, [rows]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setHealthErr(null);
      setRowsErr(null);

      if (!apiBase) {
        if (!cancelled) {
          setHealth({
            status: "local",
            mensaje: "Sin VITE_API_BASE_URL en el build",
          });
          setRows(DEMO_INDICADORES);
          setUsandoDemo(true);
          setLoading(false);
        }
        return;
      }

      const base = apiBase;

      try {
        const hr = await fetch(`${base}/api/health`);
        if (!hr.ok) throw new Error(`health HTTP ${hr.status}`);
        const hj = (await hr.json()) as Record<string, unknown>;
        if (!cancelled) {
          setHealth(hj);
          setHealthErr(null);
        }
      } catch {
        if (!cancelled) {
          setHealth(null);
          setHealthErr("No se pudo leer /api/health");
        }
      }

      try {
        const ir = await fetch(`${base}/api/indicadores`);
        if (!ir.ok) throw new Error(`indicadores HTTP ${ir.status}`);
        const ij = (await ir.json()) as Indicador[];
        if (!cancelled) {
          setRows(ij);
          setUsandoDemo(false);
          setRowsErr(null);
        }
      } catch {
        if (!cancelled) {
          setRows(DEMO_INDICADORES);
          setUsandoDemo(true);
          setRowsErr("Mostrando datos demo: la API no respondió.");
        }
      }

      if (!cancelled) setLoading(false);
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const dbOk =
    health && typeof health.db === "string" && health.db === "up";

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>📊 Lumina Retail — monitoreo</h1>
        <p className="subtitle">
          <strong>Innovatech Chile</strong>, etapa 2: aplicación de marca
          desplegada sobre la infraestructura de la evaluación parcial 1, con
          API <strong>Spring Boot</strong> + <strong>MySQL</strong> y front{" "}
          <strong>React + Vite + Nginx</strong> (patrón del curso en{" "}
          <code>ejemplos y guias</code>).
        </p>
        <p className="meta-line">
          Marca de ejemplo: Lumina Retail · KPI operativos y de despliegue
        </p>
      </header>

      {healthErr && (
        <div className="alert alert-error">⚠️ {healthErr}</div>
      )}
      {modo === "demo" && (
        <div className="alert alert-warning">
          .Base de datos conectada <code>VITE_API_BASE_URL</code> .  <code>.</code> con <code>VITE_API_URL</code>).
        </div>
      )}
      {rowsErr && modo === "api" && (
        <div className="alert alert-warning">⚠️ {rowsErr}</div>
      )}
      {dbOk && modo === "api" && !usandoDemo && (
        <div className="alert alert-success">
          Base de datos conectada (health: <code>db: up</code>).
        </div>
      )}

      <div className="stats-bar">
        <div className="stat-card">
          <div className="stat-num">{loading ? "…" : stats.total}</div>
          <div className="stat-label">Indicadores</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{loading ? "…" : stats.categorias}</div>
          <div className="stat-label">Áreas / categorías</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">
            {loading ? "…" : `${stats.avanceProm}%`}
          </div>
          <div className="stat-label">Avance promedio</div>
        </div>
      </div>

      <ContextoEntregaPanel apiBase={apiBase} />

      <div className="card">
        <div className="card-title">
          📋 Tabla de indicadores
          {loading && (
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-muted)",
                marginLeft: "auto",
              }}
            >
              Cargando…
            </span>
          )}
        </div>

        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        ) : (
          <IndicadoresTable rows={rows} />
        )}
      </div>

      <footer className="app-footer">
        API indicadores:{" "}
        <code>
          {(apiBase || "http://localhost:8080") + "/api/indicadores"}
        </code>
        {" · "}
        Health:{" "}
        <code>
          {(apiBase || "http://localhost:8080") + "/api/health"}
        </code>
      </footer>
    </div>
  );
}