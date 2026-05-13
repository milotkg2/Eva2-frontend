import type { Indicador } from "../types";
import { fmtMeta, fmtValor, pctAvance } from "../utils/indicadores";

type Props = {
  rows: Indicador[];
};

export default function IndicadoresTable({ rows }: Props) {
  if (rows.length === 0) {
    return (
      <div className="empty-state">
        <div className="icon">📊</div>
        <p>No hay indicadores para mostrar.</p>
        <p style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
          Verifica la API o el archivo <code>.env</code> de build (
          <code>VITE_API_BASE_URL</code>).
        </p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Área</th>
            <th>Indicador</th>
            <th className="num">Valor</th>
            <th className="num">Meta</th>
            <th>Avance</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const p = pctAvance(row);
            return (
              <tr key={row.id}>
                <td>
                  <span className="badge">{row.id}</span>
                </td>
                <td>
                  <span className="badge badge-secondary">{row.categoria}</span>
                </td>
                <td>{row.nombre}</td>
                <td className="num">{fmtValor(row)}</td>
                <td className="num" style={{ color: "var(--text-muted)" }}>
                  {fmtMeta(row)}
                </td>
                <td>
                  <div className="progress-track" title={`${p}%`}>
                    <div
                      className="progress-fill"
                      style={{ width: `${p}%` }}
                    />
                  </div>
                  <div className="progress-label">{p}%</div>
                </td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                  {row.actualizado}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
