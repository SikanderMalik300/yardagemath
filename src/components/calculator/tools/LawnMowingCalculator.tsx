"use client";

import { useMemo, useState } from "react";
import { computeHomeowner, computePro, type Frequency } from "@/lib/formulas/lawnMowing";
import { round, SQFT_PER_ACRE } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { LAWN_SEASON_WEEKS_DEFAULT } from "@/lib/constants";
import { fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "lawn-mowing-cost-calculator";
type Tab = "homeowner" | "pro";
type AreaUnit = "acres" | "sqft";

function toSqFt(area: string, unit: AreaUnit): number {
  return unit === "acres" ? num(area) * SQFT_PER_ACRE : num(area);
}

export function LawnMowingCalculator() {
  const [tab, setTab] = useState<Tab>("homeowner");

  // Homeowner
  const [hArea, setHArea] = useState("0.25");
  const [hUnit, setHUnit] = useState<AreaUnit>("acres");
  const [freq, setFreq] = useState<Frequency>("weekly");
  const [season, setSeason] = useState(String(LAWN_SEASON_WEEKS_DEFAULT));
  const [edging, setEdging] = useState(false);
  const [trimming, setTrimming] = useState(false);
  const [bagging, setBagging] = useState(false);

  // Pro
  const [pArea, setPArea] = useState("0.25");
  const [pUnit, setPUnit] = useState<AreaUnit>("acres");
  const [deck, setDeck] = useState("21");
  const [speed, setSpeed] = useState("3");
  const [eff, setEff] = useState("80");
  const [trimMin, setTrimMin] = useState("10");
  const [travelMin, setTravelMin] = useState("5");
  const [rate, setRate] = useState("60");
  const [overhead, setOverhead] = useState("0");

  const home = useMemo(
    () =>
      computeHomeowner({
        areaSqFt: toSqFt(hArea, hUnit),
        frequency: freq,
        seasonWeeks: num(season),
        edging,
        trimming,
        bagging,
      }),
    [hArea, hUnit, freq, season, edging, trimming, bagging]
  );

  const pro = useMemo(
    () =>
      computePro({
        areaSqFt: toSqFt(pArea, pUnit),
        deckWidthIn: num(deck),
        speedMph: num(speed),
        efficiencyPct: num(eff),
        trimMinutes: num(trimMin),
        travelMinutes: num(travelMin),
        hourlyRate: num(rate),
        overheadPct: num(overhead),
      }),
    [pArea, pUnit, deck, speed, eff, trimMin, travelMin, rate, overhead]
  );

  useFirstCalculate(
    SLUG,
    JSON.stringify({ tab, hArea, hUnit, freq, season, edging, trimming, bagging, pArea, pUnit, deck, speed, eff, trimMin, travelMin, rate, overhead })
  );

  const reset = () => {
    setTab("homeowner");
    setHArea("0.25"); setHUnit("acres"); setFreq("weekly"); setSeason(String(LAWN_SEASON_WEEKS_DEFAULT));
    setEdging(false); setTrimming(false); setBagging(false);
    setPArea("0.25"); setPUnit("acres"); setDeck("21"); setSpeed("3"); setEff("80");
    setTrimMin("10"); setTravelMin("5"); setRate("60"); setOverhead("0");
  };

  const checkbox = (label: string, checked: boolean, onChange: (v: boolean) => void) => (
    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", fontSize: "0.9375rem" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: 18, height: 18 }} />
      {label}
    </label>
  );

  const tabButton = (value: Tab, label: string) => {
    const active = tab === value;
    return (
      <button
        type="button"
        role="tab"
        aria-selected={active}
        id={`tab-${value}`}
        aria-controls={`panel-${value}`}
        onClick={() => setTab(value)}
        style={{
          flex: 1,
          minHeight: 44,
          padding: "0.5rem 0.75rem",
          border: "1px solid var(--border-strong)",
          borderBottom: active ? "2px solid var(--brand)" : "1px solid var(--border-strong)",
          background: active ? "var(--brand-soft)" : "var(--surface)",
          color: active ? "var(--brand)" : "var(--text-secondary)",
          fontWeight: 600,
          fontSize: "0.9375rem",
          cursor: "pointer",
          borderRadius: active ? "var(--radius-sm) var(--radius-sm) 0 0" : "var(--radius-sm)",
        }}
      >
        {label}
      </button>
    );
  };

  const homeSummary = `Mowing ${fmtUSD(home.perCut)} per cut, ${fmtUSD(home.perMonth)}/month, ${fmtUSD(home.perSeason)}/season. — YardageMath`;
  const proSummary = `Mowing job: ${fmtUSD(pro.price)} (${fmtNumber(round(pro.totalHours, 2))} h at ${fmtUSD(num(rate))}/h). — YardageMath`;

  return (
    <div>
      <div role="tablist" aria-label="Lawn mowing audience" style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
        {tabButton("homeowner", "Homeowner: what should I pay?")}
        {tabButton("pro", "Lawn care pro: what should I charge?")}
      </div>

      {tab === "homeowner" ? (
        <div role="tabpanel" id="panel-homeowner" aria-labelledby="tab-homeowner">
          <CalculatorShell
            left={
              <div>
                <GroupLabel>Your lawn</GroupLabel>
                <Field label="Lawn size" htmlFor="harea">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ flex: 2 }}>
                      <NumberInput id="harea" value={hArea} onChange={setHArea} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Select
                        id="hunit"
                        value={hUnit}
                        onChange={(v) => setHUnit(v as AreaUnit)}
                        options={[
                          { value: "acres", label: "acres" },
                          { value: "sqft", label: "sq ft" },
                        ]}
                      />
                    </div>
                  </div>
                </Field>
                <Field label="Frequency" htmlFor="freq">
                  <Select
                    id="freq"
                    value={freq}
                    onChange={(v) => setFreq(v as Frequency)}
                    options={[
                      { value: "weekly", label: "Weekly" },
                      { value: "biweekly", label: "Bi-weekly" },
                    ]}
                  />
                </Field>
                <Field label="Season length (weeks)" htmlFor="season">
                  <NumberInput id="season" value={season} onChange={setSeason} suffix="wk" />
                </Field>
                <GroupLabel>Extras</GroupLabel>
                {checkbox("Edging", edging, setEdging)}
                {checkbox("String trimming", trimming, setTrimming)}
                {checkbox("Bagging clippings", bagging, setBagging)}
              </div>
            }
            right={
              <div>
                <PrimaryResult label="Estimated price per cut" value={fmtUSD(home.perCut)} sub={`${fmtNumber(round(home.acres, 3))} acres`} />
                <SecondaryResults>
                  <SecondaryItem label="Per month" value={fmtUSD(home.perMonth)} />
                  <SecondaryItem label="Per season" value={fmtUSD(home.perSeason)} />
                </SecondaryResults>
                <ShowMath>
                  <MathLine>lawn = {fmtNumber(round(home.acres, 3))} acres</MathLine>
                  <MathLine>base rate from size tier + extras = {fmtUSD(home.perCut)} per cut</MathLine>
                  <MathLine>per season = per cut × cuts in {season} weeks = {fmtUSD(home.perSeason)}</MathLine>
                </ShowMath>
                <ResultActions slug={SLUG} getSummary={() => homeSummary} getShareParams={() => ({ tab: "homeowner", a: hArea, u: hUnit, f: freq })} onReset={reset} />
              </div>
            }
          />
        </div>
      ) : (
        <div role="tabpanel" id="panel-pro" aria-labelledby="tab-pro">
          <CalculatorShell
            left={
              <div>
                <GroupLabel>Job details</GroupLabel>
                <Field label="Lawn size" htmlFor="parea">
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <div style={{ flex: 2 }}>
                      <NumberInput id="parea" value={pArea} onChange={setPArea} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <Select id="punit" value={pUnit} onChange={(v) => setPUnit(v as AreaUnit)} options={[{ value: "acres", label: "acres" }, { value: "sqft", label: "sq ft" }]} />
                    </div>
                  </div>
                </Field>
                <Field label="Mower deck width (in)" htmlFor="deck">
                  <NumberInput id="deck" value={deck} onChange={setDeck} suffix="in" />
                </Field>
                <Field label="Mowing speed (mph)" htmlFor="speed">
                  <NumberInput id="speed" value={speed} onChange={setSpeed} suffix="mph" />
                </Field>
                <Field label="Field efficiency (%)" htmlFor="eff">
                  <NumberInput id="eff" value={eff} onChange={setEff} suffix="%" />
                </Field>
                <Field label="Trimming / edging (min)" htmlFor="trim">
                  <NumberInput id="trim" value={trimMin} onChange={setTrimMin} suffix="min" />
                </Field>
                <Field label="Travel time (min)" htmlFor="travel">
                  <NumberInput id="travel" value={travelMin} onChange={setTravelMin} suffix="min" />
                </Field>
                <Field label="Hourly rate ($)" htmlFor="rate">
                  <NumberInput id="rate" value={rate} onChange={setRate} suffix="$/h" />
                </Field>
                <Field label="Fuel / overhead (%)" htmlFor="oh">
                  <NumberInput id="oh" value={overhead} onChange={setOverhead} suffix="%" />
                </Field>
              </div>
            }
            right={
              <div>
                <PrimaryResult label="Price for this job" value={fmtUSD(pro.price)} sub={`${fmtNumber(round(pro.totalHours, 2))} hours total · ${fmtNumber(round(pro.acresPerHour, 2))} acres/hour`} />
                <SecondaryResults>
                  <SecondaryItem label="Acres per hour" value={fmtNumber(round(pro.acresPerHour, 2))} />
                  <SecondaryItem label="Mowing time" value={`${fmtNumber(round(pro.mowHours, 2))} h`} />
                  <SecondaryItem label="Total time" value={`${fmtNumber(round(pro.totalHours, 2))} h`} />
                  <SecondaryItem label="Per 1,000 sq ft" value={fmtUSD(pro.pricePer1000SqFt)} />
                </SecondaryResults>
                <ShowMath>
                  <MathLine>acres/hour = ({deck} × {speed} × {round(num(eff) / 100, 2)}) ÷ 99 = {fmtNumber(round(pro.acresPerHour, 2))}</MathLine>
                  <MathLine>mow hours = {fmtNumber(round(pro.acres, 3))} ÷ {fmtNumber(round(pro.acresPerHour, 2))} = {fmtNumber(round(pro.mowHours, 2))}</MathLine>
                  <MathLine>total hours = {fmtNumber(round(pro.mowHours, 2))} + ({trimMin} + {travelMin}) ÷ 60 = {fmtNumber(round(pro.totalHours, 2))}</MathLine>
                  <MathLine>price = {fmtNumber(round(pro.totalHours, 2))} × {fmtUSD(num(rate))} × (1 + {overhead}%) = {fmtUSD(pro.price)}</MathLine>
                </ShowMath>
                <ResultActions slug={SLUG} getSummary={() => proSummary} getShareParams={() => ({ tab: "pro", a: pArea, u: pUnit, deck, speed, eff, rate })} onReset={reset} />
              </div>
            }
          />
        </div>
      )}
    </div>
  );
}
