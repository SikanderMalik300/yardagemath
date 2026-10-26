"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { computeSod, SOD_PIECES, pieceSqFtFromDims, type SodShape, type SodPieceKey, type SodInput } from "@/lib/formulas/sod";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { SOD_PALLET_SQFT, SOD_WASTE_PCT, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "sod-calculator";

type CutoutShape = "rectangle" | "circle" | "area";
interface Cutout { shape: CutoutShape; l: string; w: string; d: string; sqft: string; }
interface Area { shape: SodShape; l: string; w: string; d: string; b: string; h: string; sqft: string; cutouts: Cutout[]; }

const newCutout = (): Cutout => ({ shape: "rectangle", l: "10", w: "12", d: "6", sqft: "120" });
const newArea = (): Area => ({ shape: "rectangle", l: "50", w: "20", d: "20", b: "20", h: "15", sqft: "1000", cutouts: [] });

const SHAPE_OPTS = [
  { value: "rectangle", label: "Rectangle (L × W)" },
  { value: "circle", label: "Circle (diameter)" },
  { value: "triangle", label: "Triangle (base × height)" },
  { value: "area", label: "I know the square feet" },
];
const CUTOUT_SHAPE_OPTS = [
  { value: "rectangle", label: "Patio / rectangle (L × W)" },
  { value: "circle", label: "Bed / circle (diameter)" },
  { value: "area", label: "Square feet" },
];
const PIECE_OPTS = (Object.keys(SOD_PIECES) as SodPieceKey[]).map((k) => ({ value: k, label: SOD_PIECES[k].label }));

export function SodCalculator() {
  const [areas, setAreas] = useState<Area[]>([newArea()]);
  const [waste, setWaste] = useState(String(SOD_WASTE_PCT));
  const [pallet, setPallet] = useState(String(SOD_PALLET_SQFT));
  const [customPallet, setCustomPallet] = useState("450");
  const [piece, setPiece] = useState<SodPieceKey>("slab");
  const [customL, setCustomL] = useState("24");
  const [customW, setCustomW] = useState("16");
  const [price, setPrice] = useState(String(PRICES.sodPerSqFt));
  const [pricePallet, setPricePallet] = useState("");
  const [delivery, setDelivery] = useState("0");
  const [installed, setInstalled] = useState(String(PRICES.sodInstalledPerSqFt));

  const palletSqFt = pallet === "custom" ? num(customPallet) : num(pallet);
  const pieceSqFt = piece === "custom" ? pieceSqFtFromDims(num(customL), num(customW)) : SOD_PIECES[piece].sqFt;
  const pieceWord = piece === "roll" ? "Rolls" : piece === "custom" ? "Pieces" : "Slabs";

  const result = useMemo(() => {
    const input: SodInput = {
      areas: areas.map((a) => ({
        shape: a.shape,
        lengthFt: num(a.l), widthFt: num(a.w), diameterFt: num(a.d), baseFt: num(a.b), heightFt: num(a.h), directSqFt: num(a.sqft),
        cutouts: a.cutouts.map((c) => ({ shape: c.shape, lengthFt: num(c.l), widthFt: num(c.w), diameterFt: num(c.d), directSqFt: num(c.sqft) })),
      })),
      wastePct: num(waste),
      palletSqFt,
      pieceSqFt,
      pricePerSqFt: num(price),
      pricePerPallet: num(pricePallet),
      deliveryFee: num(delivery),
      installedPerSqFt: num(installed),
    };
    return computeSod(input);
  }, [areas, waste, palletSqFt, pieceSqFt, price, pricePallet, delivery, installed]);

  useFirstCalculate(SLUG, JSON.stringify({ areas, waste, pallet, piece, price, pricePallet }));

  const update = (i: number, patch: Partial<Area>) => setAreas(areas.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const add = () => setAreas([...areas, newArea()]);
  const remove = (i: number) => setAreas(areas.length > 1 ? areas.filter((_, idx) => idx !== i) : areas);
  const addCutout = (i: number) => update(i, { cutouts: areas[i].cutouts.length < 3 ? [...areas[i].cutouts, newCutout()] : areas[i].cutouts });
  const updateCutout = (i: number, j: number, patch: Partial<Cutout>) => update(i, { cutouts: areas[i].cutouts.map((c, idx) => (idx === j ? { ...c, ...patch } : c)) });
  const removeCutout = (i: number, j: number) => update(i, { cutouts: areas[i].cutouts.filter((_, idx) => idx !== j) });

  const reset = () => {
    setAreas([newArea()]); setWaste(String(SOD_WASTE_PCT)); setPallet(String(SOD_PALLET_SQFT)); setCustomPallet("450");
    setPiece("slab"); setCustomL("24"); setCustomW("16"); setPrice(String(PRICES.sodPerSqFt)); setPricePallet(""); setDelivery("0"); setInstalled(String(PRICES.sodInstalledPerSqFt));
  };

  const summary = `Sod: order ${fmtInt(result.orderSqFt)} sq ft (${fmtInt(result.netSqFt)} net + ${waste}%), ${fmtInt(result.pallets)} pallets or ${fmtInt(result.pieces)} ${pieceWord.toLowerCase()}. Material ${fmtUSD(result.materialCost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Lawn areas</GroupLabel>
            {areas.map((a, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Area {i + 1}</span>
                  <button type="button" className="button-secondary" onClick={() => remove(i)} aria-label={`Remove area ${i + 1}`} style={{ minHeight: 40, padding: "0 0.625rem" }} disabled={areas.length === 1}>✕</button>
                </div>
                <Field label="Shape" htmlFor={`shape-${i}`}>
                  <Select id={`shape-${i}`} value={a.shape} onChange={(v) => update(i, { shape: v as SodShape })} options={SHAPE_OPTS} />
                </Field>
                {a.shape === "rectangle" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Length (ft)" htmlFor={`l-${i}`}><NumberInput id={`l-${i}`} value={a.l} onChange={(v) => update(i, { l: v })} suffix="ft" /></Field>
                    <Field label="Width (ft)" htmlFor={`w-${i}`}><NumberInput id={`w-${i}`} value={a.w} onChange={(v) => update(i, { w: v })} suffix="ft" /></Field>
                  </div>
                )}
                {a.shape === "circle" && (
                  <Field label="Diameter (ft)" htmlFor={`d-${i}`}><NumberInput id={`d-${i}`} value={a.d} onChange={(v) => update(i, { d: v })} suffix="ft" /></Field>
                )}
                {a.shape === "triangle" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Base (ft)" htmlFor={`b-${i}`}><NumberInput id={`b-${i}`} value={a.b} onChange={(v) => update(i, { b: v })} suffix="ft" /></Field>
                    <Field label="Height (ft)" htmlFor={`h-${i}`}><NumberInput id={`h-${i}`} value={a.h} onChange={(v) => update(i, { h: v })} suffix="ft" /></Field>
                  </div>
                )}
                {a.shape === "area" && (
                  <Field label="Area (sq ft)" htmlFor={`a-${i}`}><NumberInput id={`a-${i}`} value={a.sqft} onChange={(v) => update(i, { sqft: v })} suffix="sq ft" /></Field>
                )}
                <div style={{ marginTop: "0.5rem" }}>
                  {a.cutouts.map((c, j) => (
                    <div key={j} style={{ borderLeft: "3px solid var(--border)", paddingLeft: "0.625rem", marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Cut-out {j + 1} (subtracted)</span>
                        <button type="button" className="button-secondary" onClick={() => removeCutout(i, j)} aria-label={`Remove cut-out ${j + 1} from area ${i + 1}`} style={{ minHeight: 36, padding: "0 0.5rem" }}>✕</button>
                      </div>
                      <Field label="Cut-out shape" htmlFor={`cs-${i}-${j}`}>
                        <Select id={`cs-${i}-${j}`} value={c.shape} onChange={(v) => updateCutout(i, j, { shape: v as CutoutShape })} options={CUTOUT_SHAPE_OPTS} />
                      </Field>
                      {c.shape === "rectangle" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                          <Field label="Length (ft)" htmlFor={`cl-${i}-${j}`}><NumberInput id={`cl-${i}-${j}`} value={c.l} onChange={(v) => updateCutout(i, j, { l: v })} suffix="ft" /></Field>
                          <Field label="Width (ft)" htmlFor={`cw-${i}-${j}`}><NumberInput id={`cw-${i}-${j}`} value={c.w} onChange={(v) => updateCutout(i, j, { w: v })} suffix="ft" /></Field>
                        </div>
                      )}
                      {c.shape === "circle" && (
                        <Field label="Diameter (ft)" htmlFor={`cd-${i}-${j}`}><NumberInput id={`cd-${i}-${j}`} value={c.d} onChange={(v) => updateCutout(i, j, { d: v })} suffix="ft" /></Field>
                      )}
                      {c.shape === "area" && (
                        <Field label="Area (sq ft)" htmlFor={`ca-${i}-${j}`}><NumberInput id={`ca-${i}-${j}`} value={c.sqft} onChange={(v) => updateCutout(i, j, { sqft: v })} suffix="sq ft" /></Field>
                      )}
                    </div>
                  ))}
                  {a.cutouts.length < 3 && (
                    <button type="button" className="button-secondary" onClick={() => addCutout(i)} style={{ minHeight: 40 }}>+ Subtract a patio, bed or the house</button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add another area</button>

            <FormGroupDivider />
            <GroupLabel>Waste, pallet &amp; piece</GroupLabel>
            <Field label="Waste / extra (%)" htmlFor="waste" hint="5% for simple shapes, up to 10% for lots of curves.">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Pallet coverage" htmlFor="pallet" hint="Pallet size varies by farm. Ask your supplier.">
              <Select id="pallet" value={pallet} onChange={setPallet} options={[
                { value: "400", label: "400 sq ft" },
                { value: "450", label: "450 sq ft" },
                { value: "500", label: "500 sq ft" },
                { value: "custom", label: "Custom" },
              ]} />
            </Field>
            {pallet === "custom" && (
              <Field label="Custom pallet (sq ft)" htmlFor="cpal"><NumberInput id="cpal" value={customPallet} onChange={setCustomPallet} suffix="sq ft" /></Field>
            )}
            <Field label="Piece type" htmlFor="piece">
              <Select id="piece" value={piece} onChange={(v) => setPiece(v as SodPieceKey)} options={PIECE_OPTS} />
            </Field>
            {piece === "custom" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <Field label="Piece length (in)" htmlFor="pl"><NumberInput id="pl" value={customL} onChange={setCustomL} suffix="in" /></Field>
                <Field label="Piece width (in)" htmlFor="pw"><NumberInput id="pw" value={customW} onChange={setCustomW} suffix="in" /></Field>
              </div>
            )}

            <FormGroupDivider />
            <GroupLabel>Price</GroupLabel>
            <Field label="Price per sq ft" htmlFor="price"><NumberInput id="price" value={price} onChange={setPrice} suffix="$/sq ft" /></Field>
            <Field label="Price per pallet (optional)" htmlFor="ppal" hint="If set, this overrides the per-sq-ft price.">
              <NumberInput id="ppal" value={pricePallet} onChange={setPricePallet} suffix="$/pallet" placeholder="e.g. 300" />
            </Field>
            <Field label="Delivery fee (optional)" htmlFor="del"><NumberInput id="del" value={delivery} onChange={setDelivery} suffix="$" /></Field>
            <Field label="Installed price per sq ft (optional)" htmlFor="inst" hint="For an installed estimate. Pro installation runs about $1 to $2 per sq ft.">
              <NumberInput id="inst" value={installed} onChange={setInstalled} suffix="$/sq ft" />
            </Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Sod to order"
              value={fmtNumber(round(result.orderSqFt, 0))}
              unit="sq ft"
              sub={`${fmtNumber(round(result.netSqFt, 0))} sq ft net + ${waste}% waste · ${fmtInt(result.pallets)} pallet${result.pallets === 1 ? "" : "s"}.`}
            />
            <SecondaryResults>
              <SecondaryItem label="Net area" value={`${fmtNumber(round(result.netSqFt, 0))} sq ft`} />
              <SecondaryItem label="Pallets" value={fmtInt(result.pallets)} />
              <SecondaryItem label={pieceWord} value={fmtInt(result.pieces)} />
            </SecondaryResults>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Sod material</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>{fmtUSD(result.materialCost)}</div>
              </div>
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: "var(--surface)" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Installed estimate</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>{fmtUSD(result.installedCost)}</div>
              </div>
            </div>

            {result.deliveryFee > 0 && (
              <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", background: "var(--surface)", marginTop: "0.75rem" }}>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Total material + delivery</div>
                <div style={{ fontSize: "1.125rem", fontWeight: 600 }}>{fmtUSD(result.totalCost)}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.125rem" }}>{fmtUSD(result.materialCost)} material + {fmtUSD(result.deliveryFee)} delivery</div>
              </div>
            )}

            <p style={{ fontSize: "0.875rem", marginTop: "0.75rem" }}>
              Seeding instead?{" "}
              <Link href="/grass-seed-calculator/" prefetch={false}>Use the Grass Seed Calculator</Link>{" "}
              for pounds and bags by grass type.
            </p>

            <ShowMath>
              <MathLine>net = {fmtNumber(round(result.netSqFt, 2))} sq ft (areas minus cut-outs)</MathLine>
              <MathLine>order = {fmtNumber(round(result.netSqFt, 2))} × (1 + {waste}%) = {fmtNumber(round(result.orderSqFt, 2))} sq ft</MathLine>
              <MathLine>pallets = ceil({fmtNumber(round(result.orderSqFt, 2))} ÷ {fmtNumber(palletSqFt, 0)}) = {fmtInt(result.pallets)}</MathLine>
              <MathLine>{pieceWord.toLowerCase()} = ceil({fmtNumber(round(result.orderSqFt, 2))} ÷ {fmtNumber(round(pieceSqFt, 2))}) = {fmtInt(result.pieces)}</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ waste, pallet, piece })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
