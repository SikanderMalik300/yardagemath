"use client";

import { useMemo, useState } from "react";
import {
  computeFencePost,
  suggestedDepthIn,
  FENCE_POSTS,
  FENCE_BAG_TYPES,
  type FencePostKey,
  type FenceBagKey,
  type FencePostInput,
} from "@/lib/formulas/fencePost";
import { round } from "@/lib/formulas/units";
import { num } from "@/lib/analytics";
import { PRICES } from "@/lib/constants";
import { fmtInt, fmtUSD, fmtNumber } from "@/lib/format";
import { CalculatorShell } from "../CalculatorShell";
import { Field, NumberInput, Select, GroupLabel, FormGroupDivider } from "../Fields";
import { PrimaryResult, SecondaryResults, SecondaryItem } from "../Results";
import { ShowMath, MathLine } from "../ShowMath";
import { ResultActions } from "../ResultActions";
import { useFirstCalculate } from "../useCalcEvent";

const SLUG = "fence-post-concrete-calculator";

const POST_OPTS = (Object.keys(FENCE_POSTS) as FencePostKey[]).map((k) => ({ value: k, label: FENCE_POSTS[k].label }));
const BAG_OPTS = (Object.keys(FENCE_BAG_TYPES) as FenceBagKey[]).map((k) => ({ value: k, label: FENCE_BAG_TYPES[k].label }));

export function FencePostCalculator() {
  const [postKey, setPostKey] = useState<FencePostKey>("wood4x4");
  const [customRound, setCustomRound] = useState(false);
  const [customW, setCustomW] = useState("3.5");
  const [customL, setCustomL] = useState("3.5");
  const [customD, setCustomD] = useState("4");
  const [holeDiameter, setHoleDiameter] = useState(String(FENCE_POSTS.wood4x4.holeIn));
  const [holeDepth, setHoleDepth] = useState("30");
  const [gravel, setGravel] = useState("6");
  const [posts, setPosts] = useState("1");
  const [bagKey, setBagKey] = useState<FenceBagKey>("fastSet50");
  const [waste, setWaste] = useState("10");
  const [price, setPrice] = useState(String(FENCE_BAG_TYPES.fastSet50.price));
  const [gravelPrice, setGravelPrice] = useState(String(PRICES.paverBasePerBag));
  const [helperHeight, setHelperHeight] = useState("72");

  const post = FENCE_POSTS[postKey];
  const round_ = postKey === "custom" ? customRound : post.round;
  const postW = postKey === "custom" ? num(customW) : post.widthIn;
  const postL = postKey === "custom" ? num(customL) : post.lengthIn;
  const postD = postKey === "custom" ? num(customD) : post.diameterIn;
  const postWidthForHelper = round_ ? postD : postW;

  const changePost = (v: string) => {
    const k = v as FencePostKey;
    setPostKey(k);
    if (k !== "custom") setHoleDiameter(String(FENCE_POSTS[k].holeIn));
  };
  const changeBag = (v: string) => {
    const k = v as FenceBagKey;
    setBagKey(k);
    setPrice(String(FENCE_BAG_TYPES[k].price));
  };

  const result = useMemo(() => {
    const input: FencePostInput = {
      round: round_,
      postWidthIn: postW,
      postLengthIn: postL,
      postDiameterIn: postD,
      holeDiameterIn: num(holeDiameter),
      holeDepthIn: num(holeDepth),
      gravelIn: num(gravel),
      posts: num(posts),
      wastePct: num(waste),
      bagYieldCuFt: FENCE_BAG_TYPES[bagKey].yieldCuFt,
      pricePerBag: num(price),
      gravelPricePerBag: num(gravelPrice),
    };
    return computeFencePost(input);
  }, [round_, postW, postL, postD, holeDiameter, holeDepth, gravel, posts, waste, bagKey, price, gravelPrice]);

  useFirstCalculate(SLUG, JSON.stringify({ postKey, holeDiameter, holeDepth, gravel, posts, bagKey, waste }));

  // Hole helper (suggestion only).
  const suggDepth = Math.round(suggestedDepthIn(num(helperHeight), num(gravel)));
  const suggLow = 2 * Math.floor(1.5 * Math.max(0, postWidthForHelper));
  const suggHigh = suggLow + 2;
  const useSuggestions = () => {
    setHoleDepth(String(suggDepth));
    setHoleDiameter(String(suggLow));
  };

  const reset = () => {
    setPostKey("wood4x4");
    setCustomRound(false); setCustomW("3.5"); setCustomL("3.5"); setCustomD("4");
    setHoleDiameter(String(FENCE_POSTS.wood4x4.holeIn));
    setHoleDepth("30"); setGravel("6"); setPosts("1");
    setBagKey("fastSet50"); setWaste("10");
    setPrice(String(FENCE_BAG_TYPES.fastSet50.price));
    setGravelPrice(String(PRICES.paverBasePerBag));
    setHelperHeight("72");
  };

  const bagLabel = FENCE_BAG_TYPES[bagKey].label;
  const summary = `${bagLabel}: ${fmtInt(result.totalBags)} bags for ${posts} post${num(posts) === 1 ? "" : "s"} (${fmtNumber(round(result.bagsPerPost, 2))} per post, ${fmtNumber(round(result.totalCuFt, 2))} cu ft total), plus ${fmtInt(result.gravelBags)} gravel bags. Cost ${fmtUSD(result.cost)}., yardagemath.com/${SLUG}/`;

  return (
    <div>
      <CalculatorShell
        left={
          <div>
            <GroupLabel>Post &amp; hole</GroupLabel>
            <Field label="Post size" htmlFor="post" hint="Wood posts are smaller than their name: a 4 by 4 is 3.5 in square.">
              <Select id="post" value={postKey} onChange={changePost} options={POST_OPTS} />
            </Field>
            {postKey === "custom" && (
              <>
                <Field label="Post shape" htmlFor="cshape">
                  <Select id="cshape" value={customRound ? "round" : "square"} onChange={(v) => setCustomRound(v === "round")} options={[{ value: "square", label: "Square / rectangle" }, { value: "round", label: "Round" }]} />
                </Field>
                {customRound ? (
                  <Field label="Post diameter (in)" htmlFor="cd"><NumberInput id="cd" value={customD} onChange={setCustomD} suffix="in" /></Field>
                ) : (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    <Field label="Post width (in)" htmlFor="cw"><NumberInput id="cw" value={customW} onChange={setCustomW} suffix="in" /></Field>
                    <Field label="Post length (in)" htmlFor="cl"><NumberInput id="cl" value={customL} onChange={setCustomL} suffix="in" /></Field>
                  </div>
                )}
              </>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <Field label="Hole diameter (in)" htmlFor="hd"><NumberInput id="hd" value={holeDiameter} onChange={setHoleDiameter} suffix="in" /></Field>
              <Field label="Hole depth (in)" htmlFor="hdep"><NumberInput id="hdep" value={holeDepth} onChange={setHoleDepth} suffix="in" /></Field>
            </div>
            <Field label="Gravel at the bottom (in)" htmlFor="grav" hint="About 6 inches for drainage. Set to 0 for none.">
              <NumberInput id="grav" value={gravel} onChange={setGravel} suffix="in" />
            </Field>
            <Field label="Number of posts" htmlFor="posts"><NumberInput id="posts" value={posts} onChange={setPosts} suffix="posts" /></Field>

            <details style={{ marginBottom: "0.875rem", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "0.5rem 0.75rem" }}>
              <summary style={{ cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "var(--text-secondary)" }}>Hole helper</summary>
              <Field label="Post height above ground (in)" htmlFor="hh" hint="A 6 ft fence post stands about 72 in above ground.">
                <NumberInput id="hh" value={helperHeight} onChange={setHelperHeight} suffix="in" />
              </Field>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", margin: "0.25rem 0" }}>
                Suggested depth: <strong>{suggDepth} in</strong> (one third of the height above ground, plus gravel).
                Suggested diameter: <strong>{suggLow} to {suggHigh} in</strong> (about 3 times the post width).
              </p>
              <button type="button" className="button-secondary" onClick={useSuggestions} style={{ minHeight: 40 }}>Use these</button>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.5rem", marginBottom: 0 }}>
                Go below your local frost line where codes require it.
              </p>
            </details>

            <FormGroupDivider />
            <GroupLabel>Bag type, waste &amp; price</GroupLabel>
            <Field label="Bag type" htmlFor="bag" hint="Fast-setting mix is poured dry and watered; it sets in 20 to 40 minutes.">
              <Select id="bag" value={bagKey} onChange={changeBag} options={BAG_OPTS} />
            </Field>
            <Field label="Waste / extra (%)" htmlFor="waste"><NumberInput id="waste" value={waste} onChange={setWaste} suffix="%" /></Field>
            <Field label="Price per bag" htmlFor="price"><NumberInput id="price" value={price} onChange={setPrice} suffix="$/bag" /></Field>
            <Field label="Gravel price per 0.5 cu ft bag" htmlFor="gprice"><NumberInput id="gprice" value={gravelPrice} onChange={setGravelPrice} suffix="$/bag" /></Field>
          </div>
        }
        right={
          <div>
            <PrimaryResult
              label={`${bagLabel} bags needed`}
              value={fmtInt(result.totalBags)}
              unit="bags"
              sub={`About ${fmtNumber(round(result.bagsPerPost, 2))} bags per post before waste. ${fmtNumber(round(result.totalCuFt, 2))} cu ft total (${fmtNumber(round(result.totalCuYd, 2))} cu yd).`}
            />
            <SecondaryResults>
              <SecondaryItem label="Bags per post (before waste)" value={fmtNumber(round(result.bagsPerPost, 2))} />
              <SecondaryItem label="Concrete per post" value={`${fmtNumber(round(result.perPostCuFt, 2))} cu ft`} />
              <SecondaryItem label="Total concrete" value={`${fmtNumber(round(result.totalCuFt, 2))} cu ft`} />
              <SecondaryItem label="Gravel" value={`${fmtNumber(round(result.gravelCuFt, 2))} cu ft`} />
              <SecondaryItem label="Gravel bags (0.5 cu ft)" value={fmtInt(result.gravelBags)} />
              <SecondaryItem label="Estimated cost" value={fmtUSD(result.cost)} />
            </SecondaryResults>

            <ShowMath>
              <MathLine>concrete depth = {holeDepth} - {gravel} = {fmtNumber(round(result.concreteDepthIn, 1))} in</MathLine>
              <MathLine>hole = 3.1416 × ({holeDiameter} ÷ 2)² × {fmtNumber(round(result.concreteDepthIn, 1))} cu in</MathLine>
              <MathLine>per post = (hole - post) ÷ 1,728 = {fmtNumber(round(result.perPostCuFt, 2))} cu ft</MathLine>
              <MathLine>total = {fmtNumber(round(result.perPostCuFt, 2))} × {posts} = {fmtNumber(round(result.totalCuFt, 2))} cu ft</MathLine>
              <MathLine>bags = ceil({fmtNumber(round(result.totalCuFtWithWaste, 2))} ÷ {fmtNumber(FENCE_BAG_TYPES[bagKey].yieldCuFt, 3)}) = {fmtInt(result.totalBags)}</MathLine>
              <MathLine>gravel = 3.1416 × ({holeDiameter} ÷ 2)² × {gravel} ÷ 1,728 × {posts} = {fmtNumber(round(result.gravelCuFt, 2))} cu ft</MathLine>
            </ShowMath>

            <ResultActions
              slug={SLUG}
              getSummary={() => summary}
              getShareParams={() => ({ post: postKey, d: holeDiameter, depth: holeDepth, gravel, posts, bag: bagKey })}
              onReset={reset}
            />
          </div>
        }
      />
    </div>
  );
}
