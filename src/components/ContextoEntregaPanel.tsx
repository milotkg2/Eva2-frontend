import { useState } from "react";

type Props = {
  apiBase: string;
};

/**
 * Mismo patrón que CsvPanel del curso: card + título + botón Mostrar/Ocultar.
 */
export default function ContextoEntregaPanel({ apiBase }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <div
        className="card-title"
        style={{ justifyContent: "space-between", marginBottom: open ? "0.75rem" : 0 }}
      >
        <span>📘 Contexto Innovatech — Etapa 2</span>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      {open && (
        <>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              marginBottom: "0.75rem",
              lineHeight: 1.5,
            }}
          >
            <strong>Innovatech Chile</strong> despliega la aplicación de la
            marca <strong>Lumina Retail</strong> sobre la infraestructura de
            la <strong>Evaluación Parcial N.º 1</strong> (VPC, subredes, EC2,
            security groups), siguiendo el flujo del material{" "}
            <code>ejemplos y guias</code>: contenedores, ECR, GitHub Actions y
            compose en EC2.
          </p>
          <ul
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              paddingLeft: "1.2rem",
              lineHeight: 1.55,
            }}
          >
            <li>
              Front (esta app): React + Vite, build estático servido por Nginx
              en Docker.
            </li>
            <li>Back: Spring Boot + MySQL (capa datos con volumen persistente).</li>
            <li>
              Endpoints usados: <code>/api/health</code>,{" "}
              <code>/api/indicadores</code>.
            </li>
          </ul>
          <div className="api-mini" style={{ marginTop: "0.85rem" }}>
            <strong>Base API configurada:</strong>{" "}
            {apiBase ? <code>{apiBase}</code> : <em>(ninguna — modo demo)</em>}
          </div>
        </>
      )}
    </div>
  );
}
