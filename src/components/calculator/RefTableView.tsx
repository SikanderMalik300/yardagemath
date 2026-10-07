import type { RefTable } from "@/data/calculators";

/** Renders a reference table with scope headers and right-aligned numerics (design.md §11). */
export function RefTableView({ table }: { table: RefTable }) {
  return (
    <figure style={{ margin: "0 0 1.5rem" }}>
      <figcaption style={{ fontWeight: 600, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
        {table.title}
      </figcaption>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {table.columns.map((col, i) => (
                <th key={i} scope="col" className={col.num ? "num" : undefined}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => {
                  const col = table.columns[c];
                  if (c === 0) {
                    return (
                      <th key={c} scope="row" style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                        {cell}
                      </th>
                    );
                  }
                  return (
                    <td key={c} className={col?.num ? "num" : undefined}>
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.footnote && (
        <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", marginTop: "0.5rem" }}>
          {table.footnote}
        </p>
      )}
    </figure>
  );
}
