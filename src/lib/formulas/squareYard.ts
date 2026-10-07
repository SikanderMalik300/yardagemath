/** Square Yard Calculator formula (build-spec #6). sqYd = sqFt / 9 */
import { SQFT_PER_SQYD, sqFtToSqM } from "./units";

export interface AreaRow {
  /** Either dimensions (ft) or a direct sq ft value. */
  lengthFt: number;
  widthFt: number;
  directSqFt: number | null;
}

export interface SquareYardInput {
  areas: AreaRow[];
  wastePct: number;
  pricePerSqYd: number | null;
}

export interface SquareYardResult {
  totalSqFt: number;
  totalSqYd: number;
  totalSqYdWithWaste: number;
  totalSqM: number;
  cost: number | null;
}

function rowSqFt(row: AreaRow): number {
  return row.directSqFt !== null ? row.directSqFt : row.lengthFt * row.widthFt;
}

export function computeSquareYard(input: SquareYardInput): SquareYardResult {
  const totalSqFt = input.areas.reduce((sum, r) => sum + rowSqFt(r), 0);
  const totalSqYd = totalSqFt / SQFT_PER_SQYD;
  const totalSqYdWithWaste = totalSqYd * (1 + input.wastePct / 100);
  const cost = input.pricePerSqYd === null ? null : totalSqYdWithWaste * input.pricePerSqYd;

  return {
    totalSqFt,
    totalSqYd,
    totalSqYdWithWaste,
    totalSqM: sqFtToSqM(totalSqFt),
    cost,
  };
}
