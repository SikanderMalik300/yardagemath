# YardageMath: Next 5 Pages (spec for the coding agent)

Prepared 9 Oct 2026 · Owner: Sikander Mushtaq · Hub: all 5 go under **/concrete/** (Concrete & Block)

> Agent rules (same as the first 12 pages):
> - Reuse the existing calculator page template, components, schema (WebApplication, BreadcrumbList, FAQPage), OG image generator, Sources block, author box and "Show the math".
> - Formulas go in `lib/formulas/` with unit tests. Every worked example below must be a passing test.
> - Constants marked **VERIFY**: open a real manufacturer, NCMA, ICC/IRC or supplier source and confirm before publishing. Put the link in `sources.ts` and on /how-we-calculate/. If the source disagrees, use the source's number and update the examples and tests to match.
> - Use the page text below **word for word**. It's already written in the site's plain style: no em dashes, no filler, answer first. Visible FAQ text must equal the JSON-LD.
> - Titles ≤ 60 characters (no brand suffix on calculator pages), descriptions ≤ 155, one H1, self-canonical, `.png` OG image.
> - Add each page to: the sitemap (lastmod = push date), the /concrete/ hub (card + "Which calculator do I need?" row), llms.txt, the HTML sitemap, and the Related calculators of the pages listed under "Link from".
> - One commit per page. Run `npm test` + `next build` before each push.
> - Publish order: 1 → 5. It's fine to ship 1–2 pages a day; slower and reviewed beats all at once.

Keyword data: Semrush US, Oct 2026.

---

## Page 13: Yards of Concrete Calculator

- **URL:** `/yards-of-concrete-calculator/`
- **Main keyword:** how many yards of concrete do i need (1,300/mo, KD 27)
- **Supporting:** yard of concrete (1,000, KD 25), how much is a yard of concrete (8,100, KD 21), concrete yardage, concrete calculator yards, how to calculate yards of concrete
- **Title:** `Yards of Concrete Calculator – How Many Yards Do I Need?` (56)
- **Meta:** `Find how many cubic yards of concrete you need for a slab, footing or round column. Includes waste, 80-lb bag count and cost at your price per yard.` (148)
- **H1:** Yards of Concrete Calculator
- **Not the same as the slab cost page:** that page is about the cost of a slab. This one answers "how many yards" for any pour shape: slab, wall/footing strip or round column.

**Calculator**

- Shape tabs: Slab / patio (L × W × thickness), Wall or footing strip (L × W × D), Round column / tube (diameter × height, quantity).
- Inputs: ft + in, thickness in inches, quantity (columns), waste % (default 10), price per cubic yard (default $160, same cited 2026 source as the slab page), bag size (80 / 60 lb).
- Outputs: cubic yards (main), with waste, cubic feet, bags, estimated cost.
- Formulas: slab `cu ft = L × W × (T/12)`; strip `cu ft = L × W × D` (all in ft); column `cu ft = π × (d/2)² × h × qty`; `cu yd = cu ft ÷ 27`; bags `= ceil(cu ft × (1+waste) ÷ yield)`, yield 80 lb = 0.60, 60 lb = 0.45 cu ft.

**Worked examples (make these tests)**

1. 12 × 12 ft patio at 4 in: 144 × 0.333 = 48 cu ft → **1.78 cu yd**, 1.96 with 10% waste.
2. Four 12-inch round column forms, 4 ft tall: π × 0.5² × 4 × 4 = 12.57 cu ft → **0.47 cu yd**, 0.51 with 10% waste.

**Page text (use as written)**

Quick answer: One cubic yard of concrete is 27 cubic feet. That fills a 10 × 10 ft slab about 3¼ inches thick, or about 81 sq ft at 4 inches. Pick your shape below, enter the size, and you'll get the cubic yards, the bag count and the cost.

How to use:
1. Pick the shape: slab, wall or footing strip, or round column.
2. Enter the size in feet and inches. Thickness is in inches.
3. Leave waste at 10% unless you have a reason to change it.
4. Add your local price per yard if you have a quote.
5. Read the cubic yards. Round up when you order.

Tips & buying advice:
- Always round your order up. Running out of concrete halfway through a pour leaves a cold joint, and that's a weak spot.
- Ready-mix plants usually sell in quarter- or half-yard steps, so round up to the next step.
- Small orders often carry a short-load fee. If you need under about 1 cubic yard, bags can make more sense.
- Measure thickness in a few spots. If your base dips an inch, a big slab can eat a lot more concrete than you planned.

Reference table: cubic yards for common slabs at 4" and 6" (10×10, 12×12, 16×16, 20×20, 24×24, 30×30), plus the 80-lb bag count for each.

FAQ:

**How many yards of concrete do I need for a 10x10 slab?**
About 1.23 cubic yards at 4 inches thick, or 1.36 with 10% extra. At 6 inches thick it's about 1.85 cubic yards.

**How much is a yard of concrete?**
In 2026 a cubic yard of ready-mix usually costs around $140–$190 delivered, depending on your area and the mix strength. Small loads cost more per yard because of short-load fees, so get a local quote. _(VERIFY range with the same 2026 cost source used on the slab page.)_

**How many square feet does a yard of concrete cover?**
It depends on thickness. One yard covers about 81 sq ft at 4 inches, 65 sq ft at 5 inches and 54 sq ft at 6 inches. Divide 324 by the thickness in inches.

**How do I calculate yards of concrete?**
Multiply length × width × thickness, all in feet, to get cubic feet. Then divide by 27. A 12 × 12 slab at 4 inches is 12 × 12 × 0.333 = 48 cubic feet, which is 1.78 yards.

**How many 80-lb bags make a yard of concrete?**
About 45. Each 80-lb bag makes about 0.60 cubic feet, and a yard is 27 cubic feet.

**Should I order extra concrete?**
Yes, about 10%. Uneven ground, form bulges and spills all use more than the math says. Being short is a much bigger problem than having a little left over.

**What is the minimum amount of concrete I can order?**
Many plants deliver as little as 1 cubic yard, but loads under about 3–4 yards often carry a short-load fee. Ask about it when you call.

- **Sources (VERIFY):** Quikrete 80-lb yield (already in sources.ts); the 2026 cost guide already used on the slab page.
- **Link from:** concrete-slab-cost, cubic-yard, concrete-block, /concrete/ hub.

---

## Page 14: Concrete Block Weight (chart + calculator)

- **URL:** `/concrete-block-weight/`
- **Main keyword:** how much does a concrete block weigh (8,100 combined; "how much does concrete block weight" 6,600–8,100, KD 7–18)
- **Supporting:** cement block weight (1,300), how much does a cmu block weigh (880), how much does cinder block weigh (720), how heavy is a concrete block (390), 8x8x16 concrete block weight (390), cmu weight (260), cinder block weight
- **Title:** `Concrete Block Weight Chart – CMU & Cinder Block Weights` (56)
- **Meta:** `How much does a concrete block weigh? Weights for 4, 6, 8, 10 and 12 inch CMU, normal and lightweight, plus a calculator for total load and pallet weight.` (155)
- **H1:** Concrete Block Weight Chart & Calculator
- **SERP note:** this keyword shows an AI Overview. The chart plus the load calculator is what earns the click.

**Weight chart (VERIFY every value with 2+ manufacturer spec sheets, e.g. Oldcastle/Echelon, Basalite, County Materials; show ranges if sources differ)**

| Block (nominal) | Normal weight | Lightweight |
|---|---|---|
| 4 × 8 × 16 | about 26 lb | about 19 lb |
| 6 × 8 × 16 | about 32 lb | about 24 lb |
| 8 × 8 × 16 | about 38 lb | about 28 lb |
| 10 × 8 × 16 | about 45 lb | about 33 lb |
| 12 × 8 × 16 | about 52 lb | about 38 lb |
| 8 × 8 × 8 half block | about 19 lb | about 14 lb |
| 8 × 8 × 16 solid | about 60–70 lb | n/a |

**Calculator:** number of blocks × block type (from the chart) → total lb and tons; optional "pallet" mode (blocks per pallet, default 90) → pallet weight; truck check (payload input, default 1,500 lb for a half-ton pickup) → "about N blocks per trip".

**Worked examples (tests)**

1. 142 blocks × 38 lb = 5,396 lb = **2.70 tons** (the default wall from the concrete block calculator).
2. One pallet of 90 × 38 lb = 3,420 lb; with a 1,500-lb payload → **39 blocks per trip** (floor(1,500 ÷ 38)).

**Page text (use as written; update the numbers if VERIFY changes them)**

Quick answer: A standard 8×8×16 concrete block weighs about 38 lb in normal-weight concrete and about 28 lb as a lightweight block. A pallet of 90 standard blocks is around 3,400 lb. Use the chart for other sizes, or the calculator to get the total weight of your order.

Tips & buying advice:
- Ask your yard whether their blocks are normal-weight or lightweight. The difference is about 10 lb a block, and on a big wall that adds up to tons.
- A half-ton pickup can usually carry only about 35–40 standard blocks. Check your payload sticker before loading a pallet's worth.
- Wet blocks weigh more. Blocks left in the rain soak up water, so weigh-limited trips get shorter.
- Lift with your legs, and get help for 12-inch and solid blocks. They're heavier than they look.

FAQ:

**How much does an 8x8x16 concrete block weigh?**
About 38 lb for a normal-weight block and about 28 lb for a lightweight one. Exact weight varies by manufacturer and mix, so check the spec sheet if it matters.

**How much does a cinder block weigh?**
Most blocks sold as "cinder blocks" today are regular concrete blocks, so a standard 8×8×16 weighs about 28–38 lb. True old-style cinder blocks were lighter, closer to the lightweight numbers.

**How much does a pallet of concrete blocks weigh?**
A pallet of 90 standard 8-inch blocks weighs roughly 3,400 lb, plus about 40–50 lb for the pallet itself. Pallets with more or bigger blocks can top 4,000 lb.

**How many concrete blocks can a pickup truck carry?**
A half-ton pickup with about 1,500 lb of payload can carry roughly 39 standard 38-lb blocks. A three-quarter-ton truck can carry more. Always go by your truck's payload rating, not by how much fits in the bed.

**What is the difference between normal-weight and lightweight block?**
Lightweight blocks use lighter aggregate like expanded shale or slag, so they're about 25–30% lighter and easier to lay. Normal-weight blocks are denser and a little stronger. For most garden and yard walls, either works.

**How much does a 12-inch concrete block weigh?**
About 52 lb for a normal-weight 12×8×16 block and about 38 lb for a lightweight one.

**How much does a solid concrete block weigh?**
A solid 8×8×16 block weighs roughly 60–70 lb, nearly twice a hollow one. Solid blocks are used for caps, footings and places that need extra strength.

- **Sources (VERIFY):** 2 manufacturer weight spec sheets + NCMA TEK on unit weights.
- **Link from:** concrete-block, block-wall, CMU sizes (page 15), /concrete/ hub.

---

## Page 15: CMU Block Sizes & Dimensions (guide + course converter)

- **URL:** `/cmu-block-sizes/`
- **Main keyword:** cmu block dimensions (6,600–8,100, KD 22–23)
- **Supporting:** standard cmu sizes (1,300), concrete masonry block dimensions (1,300), cmu concrete block sizes (1,300), concrete masonry unit dimensions (720), concrete block height (590), 8 cmu block dimensions (480), cinder block size, what is the size of a cinder block (880)
- **Title:** `CMU Block Sizes & Dimensions – Nominal vs Actual Chart` (54)
- **Meta:** `Standard CMU block sizes with nominal and actual dimensions, half blocks and half-high units, plus a course converter for wall height and length.` (144)
- **H1:** CMU Block Sizes and Dimensions
- **SERP note:** competitive (no weak sites in the top 10) and has an AI Overview. Treat it as a strong support page that links into the calculators. The small converter tool is our edge.

**Size chart (VERIFY with NCMA TEK 14-2 or a manufacturer catalog)**

| Nominal (W × H × L) | Actual (W × H × L) | Common use |
|---|---|---|
| 4 × 8 × 16 | 3⅝ × 7⅝ × 15⅝ | veneers, partitions |
| 6 × 8 × 16 | 5⅝ × 7⅝ × 15⅝ | interior walls |
| 8 × 8 × 16 | 7⅝ × 7⅝ × 15⅝ | standard walls, foundations |
| 10 × 8 × 16 | 9⅝ × 7⅝ × 15⅝ | taller or loaded walls |
| 12 × 8 × 16 | 11⅝ × 7⅝ × 15⅝ | retaining, heavy loads |
| 8 × 8 × 8 (half) | 7⅝ × 7⅝ × 7⅝ | wall ends, openings |
| 8 × 4 × 16 (half-high) | 7⅝ × 3⅝ × 15⅝ | adjusting course height |

**Converter tool:** wall height (ft + in) → courses (`ceil(H_in / 8)`) and actual built height (`courses × 8"`); wall length → blocks per course (`ceil(L_in / 16)`). Link to the concrete block calculator for full counts.

**Worked examples (tests)**

1. 6 ft wall: 72 ÷ 8 = **9 courses**, built height exactly 6 ft.
2. 52 in wall: 52 ÷ 8 = 6.5 → **7 courses** (56 in), or 6 courses plus one half-high row (52 in).

**Page text (use as written)**

Quick answer: A standard CMU is 8 × 8 × 16 inches nominal, but the block itself measures 7⅝ × 7⅝ × 15⅝ inches. The missing ⅜ inch is the mortar joint, so every laid block takes up exactly 8 × 16 inches of wall. The chart below covers 4, 6, 8, 10 and 12-inch blocks, half blocks and half-high units.

Tips:
- Plan walls in 8-inch steps of height and 16-inch steps of length. You'll cut far fewer blocks.
- "8-inch block" means the wall thickness, not the height. Every standard size is 8 inches tall.
- Use half blocks at wall ends and openings to keep the running bond pattern without cutting.
- If your height doesn't land on an 8-inch step, a row of half-high blocks gets you there.

FAQ:

**What are the standard CMU block sizes?**
The common sizes are 4, 6, 8, 10 and 12 inches wide, all 8 inches tall and 16 inches long (nominal). The 8 × 8 × 16 is by far the most used.

**What are the actual dimensions of an 8x8x16 block?**
7⅝ × 7⅝ × 15⅝ inches. The ⅜-inch difference is left for the mortar joint.

**Why are CMU blocks smaller than their nominal size?**
So the math works once they're laid. A 7⅝-inch block plus a ⅜-inch mortar joint equals 8 inches, which makes walls easy to plan in clean 8-inch and 16-inch units.

**How tall is a concrete block course?**
8 inches, including the mortar joint. That gives you 1.5 courses per foot, so a 4-foot wall has 6 courses.

**What size is a cinder block?**
Same as a concrete block. A standard "cinder block" is 8 × 8 × 16 nominal, or 7⅝ × 7⅝ × 15⅝ actual.

**What is a half block?**
A block that's 8 inches long instead of 16 (nominal 8 × 8 × 8). It's used at wall ends, corners and openings so you don't have to cut full blocks.

**How many blocks are in one course?**
Divide the wall length in inches by 16 and round up. A 20-foot wall is 240 inches, so it takes 15 blocks per course.

- **Sources (VERIFY):** NCMA TEK 14-2 (or the current NCMA sizes reference) + one manufacturer catalog.
- **Link from:** concrete-block, block-wall, concrete block weight (page 14), /concrete/ hub.

---

## Page 16: Concrete Footing Calculator

- **URL:** `/concrete-footing-calculator/`
- **Main keyword:** concrete footing calculator (1,900, KD 29)
- **Supporting:** footing calculator concrete (880, KD 26), concrete foundation calculator (880, KD 25), footing concrete calculator, how much concrete for footings
- **Title:** `Concrete Footing Calculator – Yards & Bags for Footings` (55)
- **Meta:** `Work out concrete for continuous wall footings, square pad footings and round pier footings. Get cubic yards, 80-lb bags and cost, with waste included.` (152)
- **H1:** Concrete Footing Calculator

**Calculator**

- Tabs: Continuous (strip) footing (length × width × depth), Pad footings (W × L × D × quantity), Round pier footings (diameter × depth × quantity).
- Inputs in ft + in; waste % (default 10); price per yard (default $160); bag size.
- Outputs: cubic yards, with waste, cubic feet, bags, cost.
- Same formulas as page 13 (strip and column), plus pads `W × L × D × qty`.
- Show a short "typical footing size" note (VERIFY with IRC Table R403.1 and local code): footings are commonly about twice the wall width, at least 12 in wide and 6 in thick for light structures, and below the frost line. **Always defer to local code.**

**Worked examples (tests)**

1. 40 ft strip footing, 16 in wide × 8 in deep: 40 × 1.333 × 0.667 = 35.56 cu ft → **1.32 cu yd**, 1.45 with 10% waste.
2. Six 24 × 24 in pad footings, 12 in deep: 2 × 2 × 1 × 6 = 24 cu ft → **0.89 cu yd**, 0.98 with waste.

**Page text (use as written)**

Quick answer: A 40-foot strip footing that's 16 inches wide and 8 inches deep takes about 1.32 cubic yards of concrete, or about 1.45 with 10% extra. Pick strip, pad or round pier footings below and enter your sizes to get yards, bags and cost.

How to use:
1. Pick the footing type: continuous strip, square pads or round piers.
2. Enter the size in feet and inches, and the number of footings.
3. Keep 10% waste. Trenches are never perfectly square.
4. Read the cubic yards and round up when you order.

Tips & buying advice:
- Dig footings to undisturbed soil and below your local frost line. Your building department can tell you the depth.
- Trenches are rarely cut clean. Measure the real width and depth in a few places before you order.
- For a small shed or deck, bags may be enough. Past about 1 cubic yard, ready-mix is usually easier and cheaper.
- Most footings need rebar. Ask your inspector what size and how many runs your project needs.

FAQ:

**How big should a concrete footing be?**
A common rule is twice the width of the wall, so an 8-inch block wall gets a 16-inch footing. Many codes call for at least 12 inches wide and 6 inches thick for light structures. Your local building code sets the actual size.

**How deep should footings be?**
Below the frost line, which ranges from a few inches in the south to 4 feet or more up north. Footings also need to sit on undisturbed or compacted soil. Check your local code for the exact depth.

**How much concrete do I need for a footing?**
Multiply length × width × depth in feet, then divide by 27 for cubic yards. A 40-foot footing, 16 inches wide and 8 inches deep, is about 1.32 yards before waste.

**How many bags of concrete for a footing?**
Divide the footing's cubic feet by 0.6 for 80-lb bags. A footing with 24 cubic feet of concrete needs about 40 bags, or 44 with 10% extra.

**Do footings need rebar?**
Most do. Two runs of #4 rebar is common for residential strip footings, but requirements vary. Follow your plans or ask your local inspector.

**How much concrete for a deck footing?**
A 12-inch round pier footing 3 feet deep takes about 2.4 cubic feet of concrete, which is 4 bags of 80-lb mix. Multiply by the number of piers.

**Can I pour a footing and wall at the same time?**
Sometimes, with a monolithic pour, but most block walls go on a footing that's poured and cured first. Your plans and local code decide which method you use.

- Example check for the deck FAQ: π × 0.5² × 3 = 2.36 cu ft → 2.36 ÷ 0.6 = 3.9 → 4 bags (make it a test).
- **Sources (VERIFY):** IRC 2021 R403.1 (or the current edition) footing size table; Quikrete yield; frost depth reference (e.g. NOAA/IRC frost map).
- **Link from:** yards of concrete (page 13), block-wall, concrete-slab-cost, /concrete/ hub.

---

## Page 17: Cinder Block Fill Calculator

- **URL:** `/cinder-block-fill-calculator/`
- **Main keyword:** cinder block fill calculator (320, KD 5)
- **Supporting:** cinder block concrete fill calculator (260, KD 0), how much concrete to fill cinder blocks, block fill calculator, grout fill calculator, core fill concrete
- **Title:** `Cinder Block Fill Calculator – Concrete to Fill Block Cores` (59)
- **Meta:** `How much concrete or grout to fill cinder block cores. Enter blocks or wall size, pick full or partial fill, and get cubic feet, yards and 80-lb bags.` (148)
- **H1:** Cinder Block Fill Calculator

**Calculator**

- Inputs: either the number of blocks **or** the wall length × height; block width (6 / 8 / 12 in); fill pattern (all cores / every other core / only rebar cores, with spacing); waste % (default 10); bag size.
- Uses the **same constants as the block wall page** (VERIFY, NCMA): grout per sq ft of fully grouted wall: 6" = 0.17, 8" = 0.26, 12" = 0.42 cu ft. Per block = per sq ft ÷ 1.125.
- Every other core = 50%. Rebar cores only = (cores filled ÷ total cores), using 2 cores per block.
- Outputs: cubic feet, cubic yards, 80-lb bags, blocks per bag.

**Worked examples (tests)**

1. 100 standard 8-inch blocks, all cores: 100 × (0.26 ÷ 1.125) = 23.1 cu ft → **0.86 cu yd**, about 39 bags of 80-lb (23.1 ÷ 0.6 = 38.5 → 39), before waste.
2. 20 × 4 ft wall of 8-inch block, every other core: 80 sq ft × 0.26 × 0.5 = 10.4 cu ft → **0.39 cu yd**, about 18 bags (17.3 → 18).

**Page text (use as written)**

Quick answer: Filling every core of an 8-inch concrete block wall takes about 0.26 cubic feet of concrete per square foot of wall. That's roughly 0.23 cubic feet per block, so one 80-lb bag fills about 2½ blocks. Enter your blocks or wall size below to get cubic feet, yards and bags.

How to use:
1. Enter the number of blocks, or the wall length and height.
2. Pick the block width: 6, 8 or 12 inches.
3. Choose all cores, every other core, or only the rebar cores.
4. Keep about 10% extra and read the bags or yards.

Tips & buying advice:
- Use a pourable mix. Regular concrete with big stones can bridge in narrow cores and leave empty pockets. Ask your supplier for core-fill grout or a pea-gravel mix.
- Fill in lifts of about 4 feet or less and rod each lift so the concrete settles all the way down.
- For more than about half a yard, a small ready-mix load or a grout pump saves a lot of bag mixing.
- Only fill the cores your plans call for. Filling every core uses twice the concrete of every other core.

FAQ:

**How much concrete does it take to fill a cinder block?**
About 0.23 cubic feet for a standard 8-inch block, based on 0.26 cubic feet per square foot of wall. One 80-lb bag fills about 2½ blocks.

**How many bags of concrete to fill 100 cinder blocks?**
About 39 bags of 80-lb mix for 100 standard 8-inch blocks with every core filled, before waste. Filling every other core takes about half that.

**Can I use regular concrete to fill block cores?**
You can, but a mix with small aggregate pours better. Big stones can jam in the cores and leave voids. Core-fill grout or a pea-gravel mix is made for this job.

**Do I need to fill every core?**
No. Many walls only need cores filled where there's vertical rebar, often every 16 to 48 inches. Fill every core only if your plans or engineer call for a fully grouted wall.

**How much grout per square foot of block wall?**
About 0.17 cubic feet for 6-inch block, 0.26 for 8-inch and 0.42 for 12-inch when every core is filled.

**How many cinder blocks does a yard of concrete fill?**
About 115 standard 8-inch blocks with every core filled, since a yard is 27 cubic feet and each block takes about 0.23 cubic feet.

**Should I fill cinder blocks with concrete or gravel?**
Use concrete or grout where the wall carries load or has rebar. Gravel adds weight but no strength, so it's only used in some landscape and garden walls where the plans allow it.

- Check: 27 ÷ 0.231 = 116.9; say "about 115" (rounded down after waste). Make a test for 0.231 per block.
- **Sources (VERIFY):** NCMA TEK on grout quantities (already in sources.ts for the block wall page).
- **Link from:** block-wall, concrete-block, CMU sizes (page 15), /concrete/ hub.

---

## After each page goes live (Claude)

1. Live check: title, description, H1, canonical, OG image, FAQs matching JSON-LD, worked-example numbers on the page.
2. Request indexing in Search Console.
3. Add it to the next weekly Search Console review.

## Owner (optional but valuable)

For any of these 5, add one real sentence for the "From Sikander" block, e.g. something you noticed buying or carrying blocks, digging a footing, or filling cores.
