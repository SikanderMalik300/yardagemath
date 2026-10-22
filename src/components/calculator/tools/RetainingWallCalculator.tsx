"use client";

import { useMemo, useState } from "react";
import { computeRetainingWall, type RetainingInput } from "@/lib/formulas/retainingWall";
import { feetInchesToFeet, round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { RETAINING_BLOCKS, RETAINING_PAD_WIDTH_IN, RETAINING_PAD_DEPTH_IN, RETAINING_DRAIN_WIDTH_IN, PAVER_BASE_COMPACTION_PCT, RETAINING_MAX_HEIGHT_FT, DENSITY_TONS_PER_CUYD, PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, FeetInches, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "retaining-wall-calculator";

type BlockKey = keyof typeof RETAINING_BLOCKS | "custom";
interface Section { lenFt: string; lenIn: string; htFt: string; htIn: string; }
const newSection = (): Section => ({ lenFt: "20", lenIn: "0", htFt: "2", htIn: "0" });

const BLOCK_OPTS = [
  ...(Object.keys(RETAINING_BLOCKS) as (keyof typeof RETAINING_BLOCKS)[]).map((k) => ({ value: k, label: RETAINING_BLOCKS[k].label })),
  { value: "custom", label: "Custom size" },
];

export function RetainingWallCalculator() {
  const [sections, setSections] = useState<Section[]>([newSection()]);
  const [block, setBlock] = useState<BlockKey>("standard");
  const [customH, setCustomH] = useState("6");
  const [customL, setCustomL] = useState("16");
  const [buried, setBuried] = useState("1");
  const [waste, setWaste] = useState("5");
  const [caps, setCaps] = useState(true);
  const [capLen, setCapLen] = useState("16");
  const [pricePerBlock, setPricePerBlock] = useState(String(PRICES.retainingBlockEach));
  const [pricePerCap, setPricePerCap] = useState(String(PRICES.retainingCapEach));
  const [gravelPrice, setGravelPrice] = useState(String(PRICES.gravelPerTon));
  const [pipePrice, setPipePrice] = useState(String(PRICES.drainPipePerFt));
  const [installedPrice, setInstalledPrice] = useState(String(PRICES.retainingInstalledPerSqFt));

  const blockHeightIn = block === "custom" ? num(customH) : RETAINING_BLOCKS[block].heightIn;
  const blockLengthIn = block === "custom" ? num(customL) : RETAINING_BLOCKS[block].lengthIn;

  const changeBlock = (v: string) => {
    setBlock(v as BlockKey);
    if (v !== "custom") setCapLen(String(RETAINING_BLOCKS[v as keyof typeof RETAINING_BLOCKS].lengthIn));
    else setCapLen(customL);
  };

  const result = useMemo(() => {
    const input: RetainingInput = {
      sections: sections.map((s) => ({ lengthFt: feetInchesToFeet(num(s.lenFt), num(s.lenIn)), heightFt: feetInchesToFeet(num(s.htFt), num(s.htIn)) })),
      blockHeightIn, blockLengthIn, buriedCourses: num(buried), wastePct: num(waste),
      caps, capLengthIn: num(capLen),
      padWidthIn: RETAINING_PAD_WIDTH_IN, padDepthIn: RETAINING_PAD_DEPTH_IN, drainWidthIn: RETAINING_DRAIN_WIDTH_IN,
      compactionPct: PAVER_BASE_COMPACTION_PCT,
      padDensity: DENSITY_TONS_PER_CUYD.crusherRun, drainDensity: DENSITY_TONS_PER_CUYD.crushedStone,
      pricePerBlock: num(pricePerBlock), pricePerCap: num(pricePerCap), gravelPricePerTon: num(gravelPrice),
      pricePerPipeFt: num(pipePrice), installedPerSqFt: num(installedPrice),
    };
    return computeRetainingWall(input);
  }, [sections, blockHeightIn, blockLengthIn, buried, waste, caps, capLen, pricePerBlock, pricePerCap, gravelPrice, pipePrice, installedPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ sections, block, customH, customL, buried, waste, caps, capLen, pricePerBlock, pricePerCap, gravelPrice, pipePrice, installedPrice }));

  const update = (i: number, patch: Partial<Section>) => setSections(sections.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  const add = () => setSections([...sections, newSection()]);
  const remove = (i: number) => setSections(sections.length > 1 ? sections.filter((_, idx) => idx !== i) : sections);
  const reset = () => {
    setSections([newSection()]); setBlock("standard"); setCustomH("6"); setCustomL("16");
    setBuried("1"); setWaste("5"); setCaps(true); setCapLen("16");
    setPricePerBlock(String(PRICES.retainingBlockEach)); setPricePerCap(String(PRICES.retainingCapEach));
    setGravelPrice(String(PRICES.gravelPerTon)); setPipePrice(String(PRICES.drainPipePerFt)); setInstalledPrice(String(PRICES.retainingInstalledPerSqFt));
  };

  const overHeight = result.maxHeightFt > RETAINING_MAX_HEIGHT_FT;
  const summary = `Retaining wall: ${fmtInt(result.blocksWithWaste)} blocks with ${waste}% waste (${fmtInt(result.blocks)} before) over ${fmtInt(result.courses)} courses, ${fmtInt(result.caps)} caps. Base ${fmtNumber(round(result.padTons, 2))} t, drainage ${fmtNumber(round(result.drainTons, 2))} t, ${fmtInt(Math.ceil(result.pipeLinearFt))} ft pipe. Material ${fmtUSD(result.materialCost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Wall sections</GroupLabel>
            {sections.map((s, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>Section {i + 1}</span>
                  <button type="button" className="button-secondary" onClick={() => remove(i)} aria-label={`Remove section ${i + 1}`} style={{ minHeight: 40, padding: "0 0.625rem" }} disabled={sections.length === 1}>✕</button>
                </div>
                <FeetInches idBase={`len-${i}`} label="Wall length" feet={s.lenFt} inches={s.lenIn} onFeet={(v) => update(i, { lenFt: v })} onInches={(v) => update(i, { lenIn: v })} />
                <FeetInches idBase={`ht-${i}`} label="Height above ground" feet={s.htFt} inches={s.htIn} onFeet={(v) => update(i, { htFt: v })} onInches={(v) => update(i, { htIn: v })} />
              </div>
            ))}
            <button type="button" className="button-secondary" onClick={add}>+ Add a section</button>

            <FormGroupDivider />
            <GroupLabel>Block &amp; options</GroupLabel>
            <Field label="Block size (face H × L)" htmlFor="block" hint="Check the block's label for the face size.">
              <Select id="block" value={block} onChange={changeBlock} options={BLOCK_OPTS} />
            </Field>
            {block === "custom" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <Field label="Face height (in)" htmlFor="ch"><NumberInput id="ch" value={customH} onChange={setCustomH} suffix="in" /></Field>
                <Field label="Face length (in)" htmlFor="cl"><NumberInput id="cl" value={customL} onChange={(v) => { setCustomL(v); setCapLen(v); }} suffix="in" /></Field>
              </div>
            )}
            <Field label="Buried course" htmlFor="buried" hint="Most walls bury the first row below grade.">
              <Select id="buried" value={buried} onChange={setBuried} options={[{ value: "1", label: "Yes, bury 1 course" }, { value: "0", label: "No buried course" }]} />
            </Field>
            <Field label="Waste / extra (%)" htmlFor="waste">
              <NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" />
            </Field>
            <Field label="Caps" htmlFor="caps">
              <Select id="caps" value={caps ? "yes" : "no"} onChange={(v) => setCaps(v === "yes")} options={[{ value: "yes", label: "Add caps" }, { value: "no", label: "No caps" }]} />
            </Field>
            {caps && (
              <Field label="Cap length (in)" htmlFor="capLen"><NumberInput id="capLen" value={capLen} onChange={setCapLen} suffix="in" /></Field>
            )}

            <FormGroupDivider />
            <GroupLabel>Prices</GroupLabel>
            <Field label="Price per block" htmlFor="pb"><NumberInput id="pb" value={pricePerBlock} onChange={setPricePerBlock} suffix="$" /></Field>
            <Field label="Price per cap" htmlFor="pc"><NumberInput id="pc" value={pricePerCap} onChange={setPricePerCap} suffix="$" /></Field>
            <Field label="Gravel per ton" htmlFor="pg"><NumberInput id="pg" value={gravelPrice} onChange={setGravelPrice} suffix="$/ton" /></Field>
            <Field label="Drain pipe per ft" htmlFor="pp"><NumberInput id="pp" value={pipePrice} onChange={setPipePrice} suffix="$/ft" /></Field>
            <Field label="Installed price per sq ft (optional)" htmlFor="pi"><NumberInput id="pi" value={installedPrice} onChange={setInstalledPrice} suffix="$/sq ft" /></Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label="Blocks needed"
              value={fmtInt(result.blocksWithWaste)}
              unit="blocks"
              sub={`${fmtInt(result.blocks)} before ${waste}% waste · ${fmtInt(result.courses)} courses incl. buried`}
            />
            {overHeight && (
              <p className="notice notice-warning" style={{ marginTop: "0.75rem", maxWidth: "none" }}>
                Walls over about {RETAINING_MAX_HEIGHT_FT} feet usually need an engineered design and a permit. Check your local code.
              </p>
            )}
            <SecondaryResults>
              <SecondaryItem label="Caps" value={fmtInt(result.caps)} />
              <SecondaryItem label="Base pad gravel" value={`${fmtNumber(round(result.padTons, 2))} tons`} />
              <SecondaryItem label="Drainage stone (#57)" value={`${fmtNumber(round(result.drainTons, 2))} tons`} />
              <SecondaryItem label="Drain pipe" value={`${fmtInt(Math.ceil(result.pipeLinearFt))} ft`} />
              <SecondaryItem label="Material cost" value={fmtUSD(result.materialCost)} />
              <SecondaryItem label="Installed estimate" value={fmtUSD(result.installedCost)} />
            </SecondaryResults>

            <ShowMath>
              <MathLine>blocks per course = ceil(length ÷ {fmtNumber(round(blockLengthIn / 12, 2))}) · courses = ceil(height ÷ {fmtNumber(round(blockHeightIn / 12, 2))}) + {buried}</MathLine>
              <MathLine>blocks = {fmtInt(result.blocks)} → + {waste}% = {fmtInt(result.blocksWithWaste)}</MathLine>
              <MathLine>base pad = 24 in × 6 in × length × 1.2 = {fmtNumber(round(result.padCuYd, 2))} cu yd × 1.5 = {fmtNumber(round(result.padTons, 2))} tons</MathLine>
              <MathLine>drainage = 12 in × wall height × length = {fmtNumber(round(result.drainCuYd, 2))} cu yd × 1.4 = {fmtNumber(round(result.drainTons, 2))} tons</MathLine>
            </ShowMath>

            <ResultActions slug={SLUG} getSummary={() => summary} getShareParams={() => ({ block, buried, waste })} onReset={reset} />
          </div>
        }
      />
    </div>
  );
}
