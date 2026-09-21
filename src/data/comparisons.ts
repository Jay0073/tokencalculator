/**
 * Model comparison pages. One list, read by the /[comparison]/ route, the comparison
 * cards on the landing page, and the /compare/ hub, so they can never disagree.
 *
 * Rates are NOT stored here: each page reads live rates from the model catalogue by
 * leftId/rightId. Prose that quotes a rate must be re-checked after a catalogue sync.
 */
export type ComparisonGroup = 'frontier' | 'balanced' | 'budget' | 'challengers' | 'legacy';

/** Hub sections, in display order. */
export const COMPARISON_GROUPS: { id: ComparisonGroup; eyebrow: string; title: string; detail: string }[] = [
  { id: 'frontier', eyebrow: 'Frontier models', title: 'The most capable models', detail: 'Top-tier models, where output price and long-context tiers decide the bill.' },
  { id: 'balanced', eyebrow: 'Balanced tier', title: 'Everyday production models', detail: 'The models most teams run in production, priced between the frontier and the budget tier.' },
  { id: 'budget', eyebrow: 'High-volume tier', title: 'Cheap models for high volume', detail: 'Models priced for millions of requests, where the monthly total matters more than one call.' },
  { id: 'challengers', eyebrow: 'Challenger models', title: 'Challengers against the big labs', detail: 'DeepSeek, Qwen, Kimi, GLM and Meta models, priced against each other and against the closed frontier models they compete with.' },
  { id: 'legacy', eyebrow: 'Older model names', title: 'Looking for an older model?', detail: 'GPT-4o, GPT-4o mini, o1 and DeepSeek R1 are retired. These pages compare the models that replaced them.' },
];

/** Guides that compare approaches rather than two models. */
export const COST_GUIDES = [
  { href: '/prompt-caching-cost/', title: 'Prompt caching cost', detail: 'What a cached prefix saves on a 20-turn agent loop' },
  { href: '/long-context-vs-rag-cost/', title: 'Long context vs RAG cost', detail: 'Stuffing a 1M window against retrieval, priced per query' },
];

export interface ComparisonPage {
  /** Short title and one-line detail for cards on the landing page and the hub. */
  card: { title: string; detail: string };
  /** Section on the /compare/ hub. */
  group: ComparisonGroup;
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  crumb: string;
  heading: string;
  intro: string;
  legacyTerms: string;
  leftId: string;
  rightId: string;
  decision: string;
  /** Page-specific prose. This is what makes each page different from its siblings. */
  analysis: { heading: string; body: string[] }[];
  faq: { question: string; answer: string }[];
}

export const COMPARISONS: ComparisonPage[] = [
  {
    slug: 'gpt-6-astra-vs-claude-fable-5-1-cost',
    card: { title: 'GPT-6 Astra vs Claude Fable 5.1', detail: 'Same headline price, four-fold cached-input gap' },
    group: 'frontier',
    title: 'GPT-6 Astra vs Claude Fable 5.1 Cost Calculator',
    description: 'GPT-6 Astra and Claude Fable 5.1 both list $10 per million input tokens and $50 output. Compare the cached-input gap, long-context tier and real workload cost.',
    eyebrow: 'Frontier model comparison', crumb: 'GPT-6 Astra vs Claude Fable 5.1',
    heading: 'GPT-6 Astra vs Claude Fable 5.1 cost.',
    intro: 'Two frontier models shipped days apart in September 2026 with the same headline price. The bill they produce is not the same.',
    legacyTerms: 'Both models are current. Rates below come from the maintained catalogue and carry the date they were verified.',
    leftId: 'gpt-6-astra', rightId: 'claude-fable-5-1',
    decision: 'The headline rates are identical, so the decision turns on cached input, long-context behaviour, and how many output tokens each model spends to finish the same task.',
    analysis: [
      {
        heading: 'Identical sticker price, different cached rate',
        body: [
          'Both models list $10 per million input tokens and $50 per million output tokens. On a one-off call there is nothing to choose between them on price.',
          'The difference is the cached-input rate. GPT-6 Astra reads cached tokens at $1 per million; Claude Fable 5.1 reads them at $0.25 per million. That is a four-fold gap on exactly the tokens that repeat most: the system prompt, the tool definitions, and the retrieved context an agent resends on every turn.',
          'For a single question this is irrelevant. For a twenty-turn agent loop carrying a 100,000-token prefix, the cached portion dominates the bill and the four-fold gap becomes the whole decision.',
        ],
      },
      {
        heading: 'The 272,000-token cliff',
        body: [
          'GPT-6 Astra and the GPT-5.6 family apply a long-context tier once a request crosses 272,000 input tokens. Above that line OpenAI documents roughly double the input rate and 1.5 times the output rate, and it applies to the whole request, not just the tokens above the threshold.',
          'Anthropic documents its one-million-token window at the standard per-token rate throughout. A 900,000-token request bills at the same rate per token as a 9,000-token one.',
          'This is why the "Whole-document analysis" and "Full-context load" rows in the table below can reverse the ranking that the "Short chat turn" row suggests. If your workload regularly crosses 272,000 tokens, the tier is a larger effect than the headline price.',
        ],
      },
      {
        heading: 'Benchmarks disagree, and token spend is why',
        body: [
          'Published comparisons do not agree on which model is stronger. OpenAI\'s own table puts GPT-6 Astra ahead on nearly every row. The independent evaluator Artificial Analysis first placed Astra well behind Claude Fable 5.1, then revised its index on 5 September after criticism that the test underrated Astra. After the revision Fable 5.1 still leads and Astra is second.',
          'The more useful figure for a budget is cost per completed task, because a model that reasons in fewer tokens is cheaper even at the same rate. Artificial Analysis reports that Astra uses fewer tokens per task than any other frontier model, so at identical rates it tends to finish the same task for less.',
          'Neither number tells you what your workload costs. Output length is the variable that decides it, and it is the one you can measure directly by pasting a real prompt into the calculator on this page.',
        ],
      },
    ],
    faq: [
      { question: 'Are GPT-6 Astra and Claude Fable 5.1 the same price?', answer: 'The headline rates are identical at $10 per million input tokens and $50 per million output tokens. They differ on cached input, where GPT-6 Astra charges $1 per million and Claude Fable 5.1 charges $0.25 per million, and on long-context billing, where GPT-6 Astra applies a higher tier above 272,000 input tokens.' },
      { question: 'Which is cheaper for an agent that reuses a long system prompt?', answer: 'Claude Fable 5.1, in most cases. Repeated prefix tokens bill at the cached rate, and its cached rate is four times lower. The advantage grows with the number of turns and the size of the reused prefix.' },
      { question: 'What happens above 272,000 input tokens on GPT-6 Astra?', answer: 'OpenAI applies a long-context tier that raises the rate for the entire request, not only the tokens above the threshold. Anthropic bills its full one-million-token window at the standard rate, so the two diverge sharply on very large single calls.' },
      { question: 'Does this calculator send my prompt to either provider?', answer: 'No. Text, document contents, and image pixels are processed in your browser. Only public model metadata may be refreshed from a pricing catalogue.' },
    ],
  },
  {
    slug: 'muse-spark-1-3-vs-claude-opus-5-cost',
    card: { title: 'Muse Spark 1.3 vs Claude Opus 5', detail: 'Three index points behind, at a quarter of the cost per task' },
    group: 'frontier',
    title: 'Muse Spark 1.3 vs Claude Opus 5 Cost Calculator',
    description: 'Muse Spark 1.3 lists $1.25 and $4.25 per million tokens against $5 and $25 for Claude Opus 5. Compare real workload cost, the Contributor tier, and benchmarks.',
    eyebrow: 'Frontier challenger comparison', crumb: 'Muse Spark 1.3 vs Claude Opus 5',
    heading: 'Muse Spark 1.3 vs Claude Opus 5 cost.',
    intro: 'Meta\'s newest model sits a few points behind Claude Opus 5 on the main independent index, for a fraction of the price. The question is whether those points matter for your task.',
    legacyTerms: 'Both models are current. Muse Spark 1.3 was released on 2 September 2026. Rates are Meta\'s standard tier and Anthropic\'s standard API price, from the maintained catalogue.',
    leftId: 'muse-spark-1.3', rightId: 'claude-opus-5',
    decision: 'Muse Spark 1.3 is four times cheaper on input and about six times cheaper on output. Run your hardest real tasks on both before switching, because the remaining quality gap is small on average but not evenly spread.',
    analysis: [
      {
        heading: 'Four times cheaper on input, six times on output',
        body: [
          'Muse Spark 1.3 lists $1.25 per million input tokens, $0.15 cached and $4.25 output. Claude Opus 5 lists $5, $0.50 and $25. That is a four-fold gap on input and close to a six-fold gap on output.',
          'Output is where the difference compounds. An agent that writes long answers or code on every turn spends most of its budget on output tokens, so the six-fold gap, not the four-fold one, is the number to plan with.',
          'Both accept roughly one million tokens of context, so neither forces a retrieval design on long documents.',
        ],
      },
      {
        heading: 'Three points behind, at a quarter of the cost per task',
        body: [
          'On version 4.3.2 of the Artificial Analysis Intelligence Index, Claude Opus 5 at maximum effort scores 51 and Muse Spark 1.3 at maximum effort scores 48. That places Opus 5 seventh and Muse Spark 1.3 thirteenth of the 200 models in the comparison.',
          'The cost of reaching those scores is far apart. Artificial Analysis puts Muse Spark 1.3 at $1.60 per index task and Claude Opus 5 at $5.86. Both are verbose: Opus 5 used 140 million output tokens to run the index and Muse Spark 1.3 used 170 million, against a median of 92 million.',
          'Muse Spark 1.3 also answers faster once it starts, at about 240 output tokens per second against about 61 for Opus 5. Neither is quick to start: time to first token was about 22 seconds for Muse Spark 1.3 and about 54 seconds for Opus 5 at maximum effort.',
        ],
      },
      {
        heading: 'The Contributor tier changes the price, and the terms',
        body: [
          'Meta also sells Muse Spark 1.3 on a Contributor tier at $0.10 per million input tokens, $0.002 cached and $0.20 output, roughly a twentieth of the standard price. The condition is that Meta may use your prompts and completions to train future Meta models.',
          'That rules it out for confidential data, customer content, and anything covered by a data-processing agreement. It is also capped at 100 requests per minute, against 3,000 on the standard tier. For public or synthetic data it is an unusually cheap option.',
          'The calculator on this page uses the standard tier, because that is the tier most production workloads can accept.',
        ],
      },
    ],
    faq: [
      { question: 'How much cheaper is Muse Spark 1.3 than Claude Opus 5?', answer: 'At standard rates Muse Spark 1.3 is four times cheaper on input ($1.25 against $5 per million tokens) and about six times cheaper on output ($4.25 against $25). Artificial Analysis measured $1.60 per index task for Muse Spark 1.3 against $5.86 for Claude Opus 5.' },
      { question: 'Is Muse Spark 1.3 as capable as Claude Opus 5?', answer: 'Close, but not equal. On version 4.3.2 of the Artificial Analysis Intelligence Index, Claude Opus 5 at maximum effort scores 51 and Muse Spark 1.3 at maximum effort scores 48. Test both on your own hardest tasks before deciding.' },
      { question: 'What is the Muse Spark Contributor tier?', answer: 'A discounted tier at $0.10 per million input tokens and $0.20 output. In exchange, Meta may use your prompts and completions to train future Meta models, and the limit is 100 requests per minute. Do not use it for confidential or customer data.' },
      { question: 'Is Muse Spark open-weight?', answer: 'Not yet. Meta has said a Muse Spark open-weights release is on its roadmap, but Muse Spark 1.3 is available only as a hosted API.' },
    ],
  },
  {
    slug: 'deepseek-v4-1-flash-vs-deepseek-v4-pro-cost',
    card: { title: 'DeepSeek V4.1 Flash vs V4 Pro', detail: 'The cheaper model now leads on coding benchmarks' },
    group: 'challengers',
    title: 'DeepSeek V4.1 Flash vs V4 Pro Cost Calculator',
    description: 'DeepSeek V4.1 Flash beats V4 Pro on coding benchmarks at about a quarter of the input price. Compare real cost, peak-hour pricing, and where V4 Pro still leads.',
    eyebrow: 'Same lab, new generation', crumb: 'DeepSeek V4.1 Flash vs V4 Pro',
    heading: 'DeepSeek V4.1 Flash vs V4 Pro cost.',
    intro: 'DeepSeek\'s new Flash model is cheaper than its Pro model and beats it on most coding benchmarks. It does not beat it everywhere.',
    legacyTerms: 'Both models are current. DeepSeek kept V4 Pro on its API after 14 September 2026 in response to user demand. Rates shown are off-peak, from DeepSeek\'s official pricing page.',
    leftId: 'deepseek-flash', rightId: 'deepseek-v4-pro',
    decision: 'For coding and agent work, start with V4.1 Flash: it is cheaper and scores higher on DeepSeek\'s own coding benchmarks. Keep V4 Pro for knowledge-heavy questions, where it still scores higher, and measure output length, because V4.1 Flash tends to write more.',
    analysis: [
      {
        heading: 'Flash is now both the cheaper model and the stronger coder',
        body: [
          'At off-peak rates DeepSeek V4.1 Flash lists $0.15 per million input tokens, $0.003 cached and $0.60 output. DeepSeek V4 Pro lists $0.66, $0.022 and $1.98. Flash is about four times cheaper on input, three times cheaper on output, and seven times cheaper on cached input.',
          'DeepSeek\'s model card, run at maximum reasoning effort, puts V4.1 Flash ahead of V4 Pro on DeepSWE (74.2 against 62.7), Terminal-Bench 2.1 (90.6 against 87.9) and Codeforces (3471 against 3348). On DeepSWE it is level with Claude Opus 5, which scored 74.0 in the same table.',
        ],
      },
      {
        heading: 'Where V4 Pro still leads',
        body: [
          'The same table shows V4 Pro ahead on knowledge-heavy tests: Humanity\'s Last Exam (42.7 against 36.8) and GPQA Diamond (92.4 against 90.9). If your workload is expert question answering rather than code, the older and more expensive model can still be the better choice.',
          'DeepSeek first planned to route every V4 Pro request to V4.1 Flash from 14 September. It then decided to keep serving V4 Pro in response to user demand. DeepSeek has said a V4.1 Pro is coming, without giving a date.',
        ],
      },
      {
        heading: 'Peak hours and verbosity change the real bill',
        body: [
          'DeepSeek bills double from 01:00 to 04:00 and from 06:00 to 10:00 UTC, Monday to Friday. The rates in the table are the off-peak ones. A workload that runs during Chinese business hours pays twice the figure shown, so schedule batch jobs outside those windows where you can.',
          'V4.1 Flash is also verbose. Artificial Analysis recorded 250 million output tokens for it to run its Intelligence Index, against a median of 140 million for comparable models. A cheaper rate multiplied by more tokens is still cheaper here, but by less than the headline ratio suggests. Set a realistic output length in the calculator before comparing.',
        ],
      },
    ],
    faq: [
      { question: 'Is DeepSeek V4.1 Flash better than V4 Pro?', answer: 'On coding and agent benchmarks, yes: DeepSeek\'s own table puts V4.1 Flash ahead on DeepSWE, Terminal-Bench 2.1 and Codeforces. V4 Pro still scores higher on Humanity\'s Last Exam and GPQA Diamond, which test expert knowledge.' },
      { question: 'How much cheaper is DeepSeek V4.1 Flash than V4 Pro?', answer: 'At off-peak rates, about four times cheaper on input ($0.15 against $0.66 per million tokens), three times cheaper on output ($0.60 against $1.98), and seven times cheaper on cached input.' },
      { question: 'Is DeepSeek V4 Pro being retired?', answer: 'No. DeepSeek first planned to route V4 Pro requests to V4.1 Flash from 14 September 2026, then decided to keep serving V4 Pro in response to user demand. The old name deepseek-v4-flash, by contrast, is retired and now routes to V4.1 Flash.' },
      { question: 'Why is the real cost higher than the table at some times of day?', answer: 'DeepSeek charges double during peak hours: 01:00 to 04:00 and 06:00 to 10:00 UTC, Monday to Friday, except Chinese public holidays. This page shows off-peak rates.' },
    ],
  },
  {
    slug: 'muse-spark-1-3-vs-deepseek-v4-1-flash-cost',
    card: { title: 'Muse Spark 1.3 vs DeepSeek V4.1 Flash', detail: 'Closed mid-price model against a cheap open one' },
    group: 'challengers',
    title: 'Muse Spark 1.3 vs DeepSeek V4.1 Flash Cost Calculator',
    description: 'Muse Spark 1.3 costs about eight times more per input token than DeepSeek V4.1 Flash. Compare real workload cost, peak pricing, and independent scores.',
    eyebrow: 'Challenger comparison', crumb: 'Muse Spark 1.3 vs DeepSeek V4.1 Flash',
    heading: 'Muse Spark 1.3 vs DeepSeek V4.1 Flash cost.',
    intro: 'Two September 2026 releases that sit well below frontier prices, with different trade-offs: one closed and higher on independent scores, one open-weight and much cheaper.',
    legacyTerms: 'Both models are current. Muse Spark rates are Meta\'s standard tier. DeepSeek rates shown are off-peak, from DeepSeek\'s official pricing page.',
    leftId: 'muse-spark-1.3', rightId: 'deepseek-flash',
    decision: 'If the cheaper model passes your evaluation, DeepSeek V4.1 Flash wins on cost at any hour. If it does not, Muse Spark 1.3 is the step up that still costs a fraction of frontier pricing.',
    analysis: [
      {
        heading: 'An eight-fold gap off-peak, four-fold at peak',
        body: [
          'Muse Spark 1.3 lists $1.25 per million input tokens and $4.25 output. DeepSeek V4.1 Flash lists $0.15 and $0.60 off-peak. That is about eight times on input and seven times on output.',
          'During DeepSeek\'s peak hours the Flash rates double to $0.30 and $1.20, and the gap narrows to about four times on input and three and a half times on output. Muse Spark has no time-of-day pricing, so its cost is the same at any hour.',
        ],
      },
      {
        heading: 'Independent scores favour Muse Spark, cost per task favours DeepSeek',
        body: [
          'On version 4.3 of the Artificial Analysis Intelligence Index, Muse Spark 1.3 at maximum effort scores 48 and DeepSeek V4.1 Flash scores 39. That is a real gap, not a rounding difference.',
          'The cost of a task tells the other half of the story. Artificial Analysis puts Muse Spark 1.3 at $1.60 per index task and DeepSeek V4.1 Flash at $0.27, even though it priced DeepSeek at peak rates. Both models are verbose, so measure the output your prompts really produce before trusting a per-token comparison.',
        ],
      },
      {
        heading: 'Open weights and data terms',
        body: [
          'DeepSeek publishes V4.1 Flash weights under the MIT licence, so it can be self-hosted or served by other providers. Muse Spark 1.3 is available only as a hosted API. Meta has said an open-weights release of Muse Spark is on its roadmap, without a date.',
          'Meta\'s Contributor tier cuts Muse Spark to $0.10 input and $0.20 output, below DeepSeek\'s off-peak rates, in exchange for letting Meta train on your prompts and completions. That is a data decision before it is a price decision.',
        ],
      },
    ],
    faq: [
      { question: 'Which is cheaper, Muse Spark 1.3 or DeepSeek V4.1 Flash?', answer: 'DeepSeek V4.1 Flash, at any hour. Off-peak it is about eight times cheaper on input and seven times cheaper on output. During peak hours DeepSeek doubles its rates, and the gap narrows to about four times on input.' },
      { question: 'Which scores higher on independent tests?', answer: 'Muse Spark 1.3. On version 4.3 of the Artificial Analysis Intelligence Index it scores 48 at maximum effort, against 39 for DeepSeek V4.1 Flash. Per task, DeepSeek was still far cheaper: $0.27 against $1.60.' },
      { question: 'Can Muse Spark ever be cheaper than DeepSeek V4.1 Flash?', answer: 'Only on Meta\'s Contributor tier, at $0.10 input and $0.20 output, where Meta may use your data to train future models. At standard rates DeepSeek V4.1 Flash is cheaper.' },
      { question: 'Which one can I self-host?', answer: 'DeepSeek V4.1 Flash. Its weights are published under the MIT licence. Muse Spark 1.3 is available only as a hosted API for now.' },
    ],
  },
  {
    slug: 'deepseek-v4-1-flash-vs-qwen3-8-flash-pricing',
    card: { title: 'DeepSeek V4.1 Flash vs Qwen3.8 Flash', detail: 'The budget price war, with peak-hour maths' },
    group: 'budget',
    title: 'DeepSeek V4.1 Flash vs Qwen3.8 Flash Pricing Calculator',
    description: 'DeepSeek V4.1 Flash and Qwen3.8 Flash both list about $0.15 per million input tokens. Compare output, cached input and peak-hour cost on your real workload.',
    eyebrow: 'Budget model pricing', crumb: 'DeepSeek V4.1 Flash vs Qwen3.8 Flash',
    heading: 'DeepSeek V4.1 Flash vs Qwen3.8 Flash pricing.',
    intro: 'Two of the cheapest capable models on the market list the same input price. The bill still differs, and the time of day decides by how much.',
    legacyTerms: 'Both models are current. DeepSeek rates shown are off-peak, from DeepSeek\'s official pricing page. Qwen3.8 Flash is served by Alibaba Cloud.',
    leftId: 'deepseek-flash', rightId: 'qwen3.8-flash',
    decision: 'Off-peak and with a large reused prompt, DeepSeek V4.1 Flash is usually cheaper. During DeepSeek\'s peak hours, or for output-heavy work, Qwen3.8 Flash usually is. Price your real traffic pattern, not the headline rate.',
    analysis: [
      {
        heading: 'Same input price, different everything else',
        body: [
          'Off-peak, DeepSeek V4.1 Flash lists $0.15 per million input tokens, $0.003 cached and $0.60 output. Qwen3.8 Flash lists about $0.15 input, $0.016 cached and $0.47 output.',
          'So Qwen3.8 Flash is about 20 percent cheaper on output, and DeepSeek V4.1 Flash is about five times cheaper on cached input. Which difference matters depends on the shape of your requests.',
        ],
      },
      {
        heading: 'Peak hours double one side of the comparison',
        body: [
          'DeepSeek charges double from 01:00 to 04:00 and from 06:00 to 10:00 UTC on weekdays: $0.30 input and $1.20 output. At those hours Qwen3.8 Flash costs half as much on input and less than half on output.',
          'A pipeline that runs around the clock pays a blend. About 35 of the week\'s 168 hours are peak, so a steady workload pays roughly 20 percent more than DeepSeek\'s off-peak rate. A workload concentrated in Asian business hours pays close to double.',
        ],
      },
      {
        heading: 'Cached prefixes favour DeepSeek',
        body: [
          'Agent loops and retrieval pipelines resend the same prefix many times. DeepSeek bills cached input at $0.003 per million off-peak, about a fifth of Qwen\'s $0.016. On a workload dominated by a long cached prefix, that gap outweighs the output difference.',
          'Both models have open weights. DeepSeek publishes V4.1 Flash under the MIT licence, and Alibaba published the model behind Qwen3.8 Flash as Qwen3.8-Flash-Next, with 6 billion active parameters. Either can be self-hosted if per-token pricing stops making sense at your volume.',
        ],
      },
    ],
    faq: [
      { question: 'Which is cheaper, DeepSeek V4.1 Flash or Qwen3.8 Flash?', answer: 'It depends on timing and request shape. Input prices match off-peak. Qwen3.8 Flash is about 20 percent cheaper on output; DeepSeek V4.1 Flash is about five times cheaper on cached input. During DeepSeek\'s peak hours, Qwen3.8 Flash is cheaper on input and output.' },
      { question: 'When are DeepSeek peak hours?', answer: '01:00 to 04:00 and 06:00 to 10:00 UTC, Monday to Friday, except Chinese public holidays. DeepSeek charges double in those windows. The rates on this page are off-peak.' },
      { question: 'Are both models open-weight?', answer: 'Yes. DeepSeek publishes V4.1 Flash under the MIT licence, and Alibaba published the weights behind Qwen3.8 Flash as Qwen3.8-Flash-Next. The hosted API prices on this page do not apply if you self-host.' },
    ],
  },
  {
    slug: 'gpt-5-6-terra-vs-claude-sonnet-5-pricing',
    card: { title: 'GPT-5.6 Terra vs Claude Sonnet 5', detail: 'Balanced production-model pricing' },
    group: 'balanced',
    title: 'GPT-5.6 Terra vs Claude Sonnet 5 Pricing Calculator',
    description: 'GPT-5.6 Terra and Claude Sonnet 5 both list $2 per million input tokens. Compare output rates, cached input, and real per-request cost for production workloads.',
    eyebrow: 'Balanced model comparison', crumb: 'GPT-5.6 Terra vs Claude Sonnet 5',
    heading: 'GPT-5.6 Terra vs Claude Sonnet 5 pricing.',
    intro: 'The two default choices for production work. They match exactly on input price and diverge on everything else.',
    legacyTerms: 'Both models are current. The calculator separates exact local OpenAI counts from calibrated Claude estimates.',
    leftId: 'gpt-5.6-terra', rightId: 'claude-sonnet-5',
    decision: 'Input price is identical, so compare output rate, cached-input rate, and long-context behaviour. At production volume these compound into a much larger difference than the sticker price suggests.',
    analysis: [
      {
        heading: 'Same input price, different output price',
        body: [
          'Both list $2 per million input tokens. Claude Sonnet 5 lists $10 per million output; GPT-5.6 Terra lists $12. On an output-heavy workload that 20 percent gap is the entire decision, and it is invisible if you compare input prices alone.',
          'Reverse the shape and the answer reverses. A classification or extraction job that reads a lot and writes a little sees almost no difference between them.',
        ],
      },
      {
        heading: 'These are the models most workloads should start on',
        body: [
          'Both sit in the balanced tier: roughly a fifth of frontier price, with a one-million-token context window. For most production tasks that is the right starting point, and moving up to a frontier model should follow a measured quality failure rather than a hunch.',
          'The cheaper high-volume tier is a further order of magnitude down. GPT-5.6 Luna lists $0.20 input and $1.20 output, which is a tenth of Terra on input. If your task is routing, tagging, or summarising short text, test the cheap tier before assuming you need this one.',
        ],
      },
      {
        heading: 'Long-context tier applies to one side only',
        body: [
          'GPT-5.6 Terra applies a long-context tier above 272,000 input tokens, doubling the input rate for the whole request. Claude Sonnet 5 bills its full window flat.',
          'For a codebase-wide analysis or a long document, that single rule can matter more than the output-rate difference. The last two rows of the computed table show the effect directly.',
        ],
      },
    ],
    faq: [
      { question: 'Is GPT-5.6 Terra or Claude Sonnet 5 cheaper?', answer: 'They are identical on input at $2 per million. Claude Sonnet 5 is cheaper on output at $10 per million against $12. For requests above 272,000 input tokens GPT-5.6 Terra applies a long-context tier, which widens the gap further.' },
      { question: 'Which should I use for a production agent?', answer: 'Test both on your real prompt. Claude Sonnet 5 has the lower output rate and the lower cached-input rate, which suits agent loops that resend a long prefix. GPT-5.6 Terra gives exact local token counts, which makes cost forecasting easier to verify.' },
      { question: 'Do I need a frontier model instead?', answer: 'Usually not at first. The balanced tier costs about a fifth of frontier pricing. Move up only after a measured quality failure on your own task, and compare the cheap tier first if your task is short-form.' },
    ],
  },
  {
    slug: 'deepseek-v4-1-flash-vs-gpt-5-6-luna-pricing',
    card: { title: 'DeepSeek V4.1 Flash vs GPT-5.6 Luna', detail: 'High-volume pricing, off-peak and peak' },
    group: 'budget',
    title: 'DeepSeek V4.1 Flash vs GPT-5.6 Luna Pricing Calculator',
    description: 'DeepSeek V4.1 Flash lists half the output price of GPT-5.6 Luna off-peak, and the same price at peak hours. Compare high-volume cost with your own requests.',
    eyebrow: 'High-volume model pricing', crumb: 'DeepSeek V4.1 Flash vs GPT-5.6 Luna',
    heading: 'DeepSeek V4.1 Flash vs GPT-5.6 Luna pricing.',
    intro: 'At the cheap end of the market, small rate differences decide budgets because the request count is enormous. DeepSeek adds a second variable: the time of day.',
    legacyTerms: 'Both are current high-volume models. DeepSeek V4.1 Flash replaced V4 Flash on 10 September 2026, and this page replaces the V4 Flash comparison. DeepSeek rates shown are off-peak.',
    leftId: 'deepseek-flash', rightId: 'gpt-5.6-luna',
    decision: 'At this tier the per-request cost is trivial and the monthly total is not. Compare using your real requests per day and the hours they run, not the per-call price.',
    analysis: [
      {
        heading: 'Half the output price off-peak, the same at peak',
        body: [
          'Off-peak, DeepSeek V4.1 Flash lists $0.15 per million input tokens and $0.60 output. GPT-5.6 Luna lists $0.20 and $1.20. Flash is 25 percent cheaper on input and half the price on output.',
          'During DeepSeek\'s peak hours, 01:00 to 04:00 and 06:00 to 10:00 UTC on weekdays, Flash doubles to $0.30 and $1.20. Output then costs the same on both, and Luna becomes the cheaper model on input.',
          'One request costs a fraction of a cent either way. Ten million requests a month does not, and that is where these differences become the whole line item.',
        ],
      },
      {
        heading: 'What this tier is actually for',
        body: [
          'High-volume models are not small frontier models. They suit classification, routing, tagging, extraction from known formats, short summaries, and the first pass of a two-stage pipeline where a stronger model handles only the hard cases.',
          'V4.1 Flash is stronger than that role usually needs: DeepSeek reports it ahead of its own V4 Pro on coding benchmarks. That makes it tempting to use for everything, but it writes long answers. Artificial Analysis recorded it among the more verbose models it tests, and output is the expensive side of the bill.',
        ],
      },
      {
        heading: 'Cached input and long context',
        body: [
          'DeepSeek bills cached input at $0.003 per million off-peak, against $0.02 for GPT-5.6 Luna. A pipeline that resends a long system prompt on every call gains the most from that gap.',
          'GPT-5.6 Luna applies a long-context rate above 272,000 input tokens: $0.40 input and $1.80 output for the whole request. DeepSeek bills its one-million-token window at one rate. For very large single requests, that rule matters more than the base price.',
        ],
      },
    ],
    faq: [
      { question: 'Which is cheaper for high-volume work?', answer: 'Off-peak, DeepSeek V4.1 Flash is cheaper on input, output and cached input. During DeepSeek\'s peak hours its rates double, output costs the same as GPT-5.6 Luna, and Luna is cheaper on input.' },
      { question: 'What happened to DeepSeek V4 Flash?', answer: 'DeepSeek retired it on 10 September 2026 and now routes the old model name to V4.1 Flash, billed at V4.1 Flash rates. This page replaces the earlier V4 Flash comparison.' },
      { question: 'When should I use a high-volume model instead of a balanced one?', answer: 'For classification, routing, tagging, extraction from known formats, and short summaries. A common pattern is a two-stage pipeline where the cheap model handles everything and only low-confidence cases escalate to a stronger model.' },
    ],
  },
  {
    slug: 'gemini-3-5-flash-lite-vs-gpt-5-6-luna-cost',
    card: { title: 'Gemini 3.5 Flash-Lite vs GPT-5.6 Luna', detail: 'Multimodal image and document cost' },
    group: 'budget',
    title: 'Gemini 3.5 Flash-Lite vs GPT-5.6 Luna Cost Calculator',
    description: 'Compare Gemini 3.5 Flash-Lite and GPT-5.6 Luna for high-volume multimodal work, including the image token rules that text-only price tables leave out.',
    eyebrow: 'High-volume multimodal', crumb: 'Gemini 3.5 Flash-Lite vs GPT-5.6 Luna',
    heading: 'Gemini 3.5 Flash-Lite vs GPT-5.6 Luna cost.',
    intro: 'Two cheap models that both accept images, where a text-only price comparison will mislead you.',
    legacyTerms: 'Both models are current. Google names Gemini 3.5 Flash-Lite as the replacement for Gemini 3.1 Flash-Lite, which shuts down on 7 May 2027. This page replaces the earlier 3.1 comparison.',
    leftId: 'gemini-3.5-flash-lite', rightId: 'gpt-5.6-luna',
    decision: 'For multimodal pipelines, include representative image sizes as well as text. Vision-token rules differ enough between providers that text-only tables hide the real request cost.',
    analysis: [
      {
        heading: 'Images are priced as tokens, and the formulas differ',
        body: [
          'Neither provider bills images by the file. Both convert dimensions into a token count and charge the normal input rate on it, but they use different rules to do so.',
          'OpenAI splits a resized image into tiles and charges a base allowance plus a per-tile cost, with a fixed low-detail option that ignores size entirely. Google allocates tokens by media size against its own published guidance. The same photograph therefore produces different token counts on the two models.',
          'This is why a text-only price comparison is unreliable for a vision pipeline. Upload a representative image in the calculator below and compare the totals rather than the rates.',
        ],
      },
      {
        heading: 'The low-detail option is the biggest lever on OpenAI',
        body: [
          'OpenAI\'s low-detail mode charges a flat allowance regardless of image dimensions. For thumbnails, screenshots where only layout matters, or a first-pass filter, it can cut image cost dramatically.',
          'It is a quality trade, not a free saving: fine text and small features stop being legible to the model. Test it on your actual images before adopting it across a pipeline.',
        ],
      },
      {
        heading: 'Text rates favour Luna; image volume decides',
        body: [
          'On text, GPT-5.6 Luna is the cheaper model. Gemini 3.5 Flash-Lite lists $0.30 per million input and $2.50 output; GPT-5.6 Luna lists $0.20 and $1.20, less than half on output.',
          'Gemini 3.5 Flash-Lite also costs more than the 3.1 model it replaces, which listed $0.25 and $1.50. If you are migrating a Gemini pipeline, re-run the numbers rather than assuming the new generation is cheaper.',
          'Once images enter the mix, the token counts diverge much more than the rates do. For an image-heavy workload, measure token counts on real files first and treat the published rates as a secondary factor.',
        ],
      },
    ],
    faq: [
      { question: 'How are image tokens calculated?', answer: 'Both providers convert image dimensions into a token count and bill it at the normal input rate, using different published formulas. OpenAI uses a tile-based method with a fixed low-detail option; Google allocates tokens by media size. The same image produces different counts on each.' },
      { question: 'Which is cheaper for a vision pipeline?', answer: 'It depends on image sizes as well as rates. On text, GPT-5.6 Luna is cheaper: $0.20 against $0.30 per million input, and $1.20 against $2.50 output. A given image produces different token counts on each, so upload a representative image to compare real totals.' },
      { question: 'Why not compare Gemini 3.1 Flash-Lite?', answer: 'Google has named Gemini 3.5 Flash-Lite as its replacement and will shut 3.1 Flash-Lite down on 7 May 2027. New projects should price the model they will still be able to use.' },
      { question: 'Does the calculator upload my images?', answer: 'No. Only the width and height are read locally in your browser and passed through each provider\'s published formula. The pixels never leave your device.' },
    ],
  },
  {
    slug: 'deepseek-v4-pro-vs-gpt-5-6-sol-cost',
    card: { title: 'DeepSeek V4 Pro vs GPT-5.6 Sol', detail: 'Reasoning workload comparison' },
    group: 'challengers',
    title: 'DeepSeek V4 Pro vs GPT-5.6 Sol Cost Calculator',
    description: 'DeepSeek V4 Pro undercuts GPT-5.6 Sol by about six times on input and ten times on output at off-peak rates. Compare real workload cost and context limits.',
    eyebrow: 'Open-weight vs proprietary', crumb: 'DeepSeek V4 Pro vs GPT-5.6 Sol',
    heading: 'DeepSeek V4 Pro vs GPT-5.6 Sol cost.',
    intro: 'One of the widest price gaps between two models that people genuinely evaluate against each other.',
    legacyTerms: 'Both models are current. DeepSeek rates shown are off-peak, from DeepSeek\'s official pricing page; DeepSeek charges double during peak hours.',
    leftId: 'deepseek-v4-pro', rightId: 'gpt-5.6-sol',
    decision: 'The price gap is large enough that the question is not cost but whether quality holds on your task. Measure output quality first, then use the calculator to size the saving.',
    analysis: [
      {
        heading: 'The gap is about six times on input and ten on output',
        body: [
          'Off-peak, DeepSeek V4 Pro lists $0.66 per million input tokens and $1.98 output. GPT-5.6 Sol lists $4 and $20. That is about six times on input and ten times on output. During DeepSeek\'s peak hours V4 Pro doubles to $1.32 and $3.96, and the gap narrows to about three and five times.',
          'A gap that size changes what is worth building. Workloads that are uneconomic at frontier prices, such as re-processing an entire archive or running an evaluation over thousands of documents, become routine.',
          'It also changes the risk calculus in the other direction: a ten-fold saving on a task the model gets wrong is not a saving.',
        ],
      },
      {
        heading: 'Open-weight models have closed much of the quality gap',
        body: [
          'The open-weight tier is no longer only a budget option. Published comparisons in 2026 put Kimi K3, Qwen3.8-Max and GLM-5.2 above 91 percent on GPQA Diamond, a graduate-level science reasoning benchmark that closed frontier models led not long ago.',
          'Independent summaries put open models at 80 to 95 percent cheaper on output than frontier proprietary models. That combination, near-parity on some reasoning benchmarks with an order-of-magnitude price gap, is why the comparison is now worth running rather than assuming.',
          'Benchmarks still do not settle your task. They narrow the shortlist; a held-out evaluation on your own data decides it.',
        ],
      },
      {
        heading: 'Counting confidence differs',
        body: [
          'GPT-5.6 Sol is tokenized exactly in your browser. DeepSeek V4 Pro is measured with a deterministic byte-length projection and labelled as an estimate.',
          'When the price gap is ten-fold, projection error is not what decides the comparison. But if you are reconciling an invoice rather than planning a budget, use the provider\'s own usage figures.',
        ],
      },
    ],
    faq: [
      { question: 'How much cheaper is DeepSeek V4 Pro than GPT-5.6 Sol?', answer: 'About six times cheaper on input and ten times cheaper on output at off-peak rates. During DeepSeek\'s peak hours the gap narrows to about three and five times. The computed table on this page converts that into cost for five concrete workload shapes.' },
      { question: 'Is an open-weight model good enough to replace a frontier model?', answer: 'It depends entirely on the task. Published 2026 comparisons put several open-weight models above 91 percent on GPQA Diamond, close to frontier performance on reasoning benchmarks. Run a held-out evaluation on your own data before switching, because benchmark parity does not guarantee task parity.' },
      { question: 'Does DeepSeek pricing change by time of day?', answer: 'Yes. DeepSeek charges double from 01:00 to 04:00 and 06:00 to 10:00 UTC, Monday to Friday, except Chinese public holidays. This page shows the off-peak rate.' },
    ],
  },
  {
    slug: 'kimi-k3-vs-claude-fable-5-1-cost',
    card: { title: 'Kimi K3 vs Claude Fable 5.1', detail: 'Open-weight challenger against the frontier' },
    group: 'challengers',
    title: 'Kimi K3 vs Claude Fable 5.1 Cost Calculator',
    description: 'Kimi K3 undercuts Claude Fable 5.1 by more than three times on both input and output. Compare real workload cost, context windows, and where the saving holds.',
    eyebrow: 'Open-weight challenger', crumb: 'Kimi K3 vs Claude Fable 5.1',
    heading: 'Kimi K3 vs Claude Fable 5.1 cost.',
    intro: 'An open-weight model priced against a frontier proprietary one, on a task class where both are credible.',
    legacyTerms: 'Both models are current. Kimi K3 is served under the Kimi K3 licence; rates carry their verification date.',
    leftId: 'kimi-k3', rightId: 'claude-fable-5-1',
    decision: 'The saving is large and consistent. The question is whether Kimi K3 holds quality on your task, and whether serving and support terms suit you.',
    analysis: [
      {
        heading: 'A frontier-class comparison at a third of the price',
        body: [
          'Kimi K3 launched at $3 per million input tokens and $15 per million output, against $10 and $50 for Claude Fable 5.1. That is a consistent three-fold-plus gap on both sides of the bill, which is unusual: most cheaper models save on input and give some of it back on output.',
          'Both carry very large context windows, so neither forces you into retrieval for a long document. The computed table below shows what that costs in practice at each request size.',
        ],
      },
      {
        heading: 'Where an open-weight model changes the architecture',
        body: [
          'A three-fold price gap does not usually change how a system is built. What changes it is the option to self-host. An open-weight licence means you can run the model on your own hardware, which moves cost from per-token to per-hour and removes the per-request network boundary entirely.',
          'That trade only pays above a utilisation threshold. Below it, a hosted API is cheaper and far less work. The cost lab on this site models the self-hosting crossover if you want to size it.',
          'For confidential prompts the calculation is different again: self-hosting removes the question of what leaves your network, which for some workloads outweighs the token price entirely.',
        ],
      },
      {
        heading: 'Counting is estimated on both sides here',
        body: [
          'Neither model ships a browser-runnable tokenizer, so both counts on this page are deterministic byte-length projections rather than exact counts. The comparison between them remains fair, because the same method is applied to both.',
          'Use the provider\'s reported usage to reconcile an invoice. Use this page to choose between them.',
        ],
      },
    ],
    faq: [
      { question: 'How much cheaper is Kimi K3 than Claude Fable 5.1?', answer: 'Kimi K3 launched at $3 per million input and $15 per million output, against $10 and $50 for Claude Fable 5.1. That is more than three times cheaper on both input and output, which is unusual for a cheaper model.' },
      { question: 'Is Kimi K3 open source?', answer: 'It is open-weight, served under the Kimi K3 licence rather than a standard open-source licence. The practical benefit is that self-hosting is possible, which changes cost from per-token to per-hour and removes the network boundary for confidential inputs.' },
      { question: 'Are the token counts on this page exact?', answer: 'No. Neither model publishes a tokenizer that runs in a browser, so both are measured with the same deterministic byte-length projection and labelled as estimates. The comparison between them is fair because the method is identical on both sides.' },
    ],
  },
  {
    slug: 'qwen3-8-max-vs-gpt-5-6-sol-cost',
    card: { title: 'Qwen3.8 Max vs GPT-5.6 Sol', detail: 'Multilingual tokenizer and price gap' },
    group: 'challengers',
    title: 'Qwen3.8 Max vs GPT-5.6 Sol Cost Calculator',
    description: 'Qwen3.8 Max lists $2 per million input tokens against $4 for GPT-5.6 Sol, with a larger gap on output. Compare real workload cost and multilingual token behaviour.',
    eyebrow: 'Open-weight vs proprietary', crumb: 'Qwen3.8 Max vs GPT-5.6 Sol',
    heading: 'Qwen3.8 Max vs GPT-5.6 Sol cost.',
    intro: 'Alibaba\'s flagship against OpenAI\'s reasoning tier, with a tokenizer difference that matters if your text is not English.',
    legacyTerms: 'Both models are current. Qwen counts use a deterministic byte-length projection; OpenAI counts for raw text are exact.',
    leftId: 'qwen3.8-max', rightId: 'gpt-5.6-sol',
    decision: 'Qwen3.8 Max is cheaper on both sides. If your content is substantially non-English, compare token counts on real text rather than trusting a ratio measured on English.',
    analysis: [
      {
        heading: 'Half the input price, a third of the output price',
        body: [
          'Qwen3.8 Max lists $2 per million input tokens and $6 per million output. GPT-5.6 Sol lists $4 and $20. The gap is two-fold on input and more than three-fold on output.',
          'Qwen3.8 Max also carries a one-million-token context window billed at a flat rate, while GPT-5.6 Sol applies a long-context tier above 272,000 input tokens. On large single requests the effective gap is wider than the headline rates suggest.',
        ],
      },
      {
        heading: 'Tokenizer vocabulary changes the count, not just the rate',
        body: [
          'Qwen\'s vocabulary is trained for Chinese and English together. English prose therefore packs a slightly different number of UTF-8 bytes per token than it does on an OpenAI encoding, and Chinese text differs much more.',
          'The consequence is practical: a cost ratio you measured on English documents will not transfer to a Chinese corpus. If your workload is multilingual, run representative text through the calculator for each language rather than applying one multiplier.',
          'This site measures Qwen with a deterministic byte-length projection calibrated for its family. It is labelled as an estimate for exactly this reason.',
        ],
      },
      {
        heading: 'Benchmarks have narrowed; task evaluation has not',
        body: [
          'Published 2026 comparisons place Qwen3.8-Max among the open-weight models scoring above 91 percent on GPQA Diamond, alongside Kimi K3 and GLM-5.2. On several reasoning benchmarks the gap to frontier proprietary models is now small.',
          'That is a reason to run the comparison, not a reason to skip it. Benchmark parity and task parity are different things, and the only evidence that settles your case is a held-out evaluation on your own data.',
        ],
      },
    ],
    faq: [
      { question: 'Is Qwen3.8 Max cheaper than GPT-5.6 Sol?', answer: 'Yes, at current published rates. Qwen3.8 Max lists $2 per million input and $6 output, against $4 and $20 for GPT-5.6 Sol. The effective gap widens on requests above 272,000 tokens, where GPT-5.6 Sol applies a long-context tier and Qwen3.8 Max does not.' },
      { question: 'Do Qwen token counts differ from OpenAI counts for the same text?', answer: 'Yes. Qwen\'s vocabulary is trained for Chinese and English together, so the bytes-per-token ratio differs from an OpenAI encoding, and the difference is much larger on Chinese text than on English. Measure each language separately.' },
      { question: 'How accurate are the Qwen counts here?', answer: 'They are deterministic byte-length projections, labelled as estimates. OpenAI counts for raw text are exact because its tokenizer runs locally in the browser. Use provider-reported usage to reconcile an invoice.' },
    ],
  },
  {
    slug: 'glm-5-3-vs-deepseek-v4-pro-pricing',
    card: { title: 'GLM-5.3 vs DeepSeek V4 Pro', detail: 'Low-cost open-weight comparison' },
    group: 'challengers',
    title: 'GLM-5.3 vs DeepSeek V4 Pro Pricing Calculator',
    description: 'Two low-cost open-weight models compared on real workload cost, context window, and where each one is the cheaper choice.',
    eyebrow: 'Open-weight comparison', crumb: 'GLM-5.3 vs DeepSeek V4 Pro',
    heading: 'GLM-5.3 vs DeepSeek V4 Pro pricing.',
    intro: 'Both sit far below frontier pricing. The gap between them is still large enough to matter at volume.',
    legacyTerms: 'Both models are current open-weight releases. DeepSeek rates shown are off-peak, from DeepSeek\'s official pricing page; DeepSeek charges double during peak hours.',
    leftId: 'glm-5.3', rightId: 'deepseek-v4-pro',
    decision: 'Both are cheap enough that quality on your task decides. Use the computed table to size the difference, then evaluate both on held-out data.',
    analysis: [
      {
        heading: 'Cheap, but not equally cheap',
        body: [
          'It is easy to treat every open-weight model as interchangeable on price. They are not. Published 2026 comparisons put the spread between the cheapest and most expensive of Kimi K3, Qwen3.8-Max and GLM-5.2 at over $10 per million output tokens, which is more than the entire output price of several models in this class.',
          'Off-peak, DeepSeek V4 Pro lists $0.66 per million input tokens and $1.98 output, about half of GLM-5.3\'s $1.40 and $4.40. During DeepSeek\'s peak hours V4 Pro doubles to $1.32 and $3.96, and the two cost almost the same. At a few thousand requests a month that is noise; at a few million, the hour you run in is a budget line.',
        ],
      },
      {
        heading: 'Both are strong on code, which is where they are usually deployed',
        body: [
          'This class of model is most often adopted for code assistance, where output volume is high and the task is well specified. Several 2026 comparisons rank GLM, DeepSeek V4 and Qwen closely on coding evaluations.',
          'Code workloads are unusually sensitive to output rate, because a model that writes a whole file emits far more tokens than one answering a question. Set the output slider to a realistic file length rather than a chat-sized answer.',
        ],
      },
      {
        heading: 'Both are measured by projection here',
        body: [
          'Neither publishes a browser-runnable tokenizer, so both counts on this page use the same deterministic byte-length method and are labelled as estimates.',
          'Because the same method applies to both, the ratio between them is more reliable than either absolute number. Use it to choose; use provider usage reports to reconcile.',
        ],
      },
    ],
    faq: [
      { question: 'Which is cheaper, GLM-5.3 or DeepSeek V4 Pro?', answer: 'Off-peak, DeepSeek V4 Pro is about half the price of GLM-5.3 on both input and output. During DeepSeek\'s peak hours its rates double and the two cost almost the same. The computed table on this page uses the off-peak rate.' },
      { question: 'Are open-weight models all similarly priced?', answer: 'No. Published 2026 comparisons put the spread between the cheapest and most expensive well-known open-weight models at over $10 per million output tokens. Treating the category as uniformly cheap is a common budgeting mistake.' },
      { question: 'Are these models good for coding?', answer: 'This class is most commonly deployed for code assistance and several 2026 comparisons rank them closely on coding evaluations. Code workloads are output-heavy, so set a realistic output length before comparing monthly cost.' },
    ],
  },
  {
    slug: 'claude-vs-gpt4o-token-cost',
    card: { title: 'Claude vs GPT token cost', detail: 'What replaced GPT-4o in the balanced tier' },
    group: 'legacy',
    title: 'Claude vs GPT Token Cost Calculator',
    description: 'GPT-4o has been superseded. Compare the models that replaced it, Claude Sonnet 5 and GPT-5.6 Terra, on real token cost for chat, RAG, and long-document workloads.',
    eyebrow: 'Balanced model comparison', crumb: 'Claude vs GPT token cost',
    heading: 'Claude vs GPT token cost.',
    intro: 'GPT-4o is retired from current pricing. This page compares the models that took its place in the balanced tier.',
    legacyTerms: 'GPT-4o is a legacy search term and no longer appears in current pricing. The live pair below is Claude Sonnet 5 and GPT-5.6 Terra, the current balanced-tier models.',
    leftId: 'claude-sonnet-5', rightId: 'gpt-5.6-terra',
    decision: 'Compare input and output rates together. An output-heavy agent can reverse a decision that looks obvious when judged on prompt cost alone.',
    analysis: [
      {
        heading: 'What replaced GPT-4o',
        body: [
          'GPT-4o occupied the balanced tier: capable enough for most production work, priced well below the frontier. That slot is now held by GPT-5.6 Terra on the OpenAI side and Claude Sonnet 5 on the Anthropic side.',
          'If you are costing a migration from GPT-4o, compare against these rather than against a frontier model. Moving straight to the frontier tier is the most common way a migration budget is overestimated.',
        ],
      },
      {
        heading: 'The rates that decide it',
        body: [
          'Both list $2 per million input tokens. Claude Sonnet 5 lists $10 per million output against $12 for GPT-5.6 Terra.',
          'Because input price is identical, the entire comparison rests on output volume and on cached input. A workload that writes little will see almost no difference; an agent that writes long answers on every turn will.',
        ],
      },
      {
        heading: 'Why old cost ratios do not transfer',
        body: [
          'Token counts are tokenizer-specific. A cost ratio you measured between GPT-4o and a Claude model in an earlier generation does not carry forward, because both the rates and the tokenizers changed.',
          'Re-measure with your current prompt. The calculator below counts OpenAI text exactly in your browser and projects Claude counts deterministically, and labels which is which.',
        ],
      },
    ],
    faq: [
      { question: 'Is GPT-4o still available?', answer: 'GPT-4o no longer appears in current published pricing. Its role in the balanced tier is now filled by GPT-5.6 Terra. If you are costing a migration, compare against the balanced tier rather than a frontier model.' },
      { question: 'Which is cheaper, Claude or GPT, in the balanced tier?', answer: 'Input price is identical at $2 per million. Claude Sonnet 5 is cheaper on output at $10 per million against $12 for GPT-5.6 Terra, so output-heavy workloads favour Claude.' },
      { question: 'Can I reuse a cost ratio I measured last year?', answer: 'No. Both the published rates and the tokenizers have changed, so an old ratio will mislead you. Re-measure with your current prompt.' },
    ],
  },
  {
    slug: 'deepseek-r1-vs-openai-o1-cost-calculator',
    card: { title: 'DeepSeek vs OpenAI reasoning cost', detail: 'Successors to R1 and o1, priced on output' },
    group: 'legacy',
    title: 'DeepSeek vs OpenAI Reasoning Model Cost Calculator',
    description: 'DeepSeek R1 and OpenAI o1 have been superseded. Compare their current successors, DeepSeek V4.1 Flash and GPT-6 Astra, on real reasoning workload cost.',
    eyebrow: 'Reasoning model comparison', crumb: 'DeepSeek vs OpenAI reasoning cost',
    heading: 'DeepSeek vs OpenAI reasoning model cost.',
    intro: 'R1 and o1 are retired names. This page compares the reasoning models that replaced them, where output volume dominates the bill.',
    legacyTerms: 'DeepSeek R1 and OpenAI o1 are legacy search terms. The current pair is DeepSeek V4.1 Flash, DeepSeek\'s newest reasoning model, and GPT-6 Astra, OpenAI\'s flagship. DeepSeek rates shown are off-peak.',
    leftId: 'deepseek-flash', rightId: 'gpt-6-astra',
    decision: 'Reasoning workloads are output-heavy by construction. Set a realistic output-token budget before comparing daily or monthly spend, because output is where the difference lands.',
    analysis: [
      {
        heading: 'Reasoning models bill differently from chat models',
        body: [
          'A reasoning model spends tokens thinking before it answers. Those tokens are billed as output, and output costs several times what input costs on every model in this comparison.',
          'This inverts the usual budgeting instinct. For a chat assistant, prompt size drives the bill. For a reasoning model, the length of the reasoning does, and it varies with problem difficulty in a way that a fixed estimate will not capture.',
          'Budget with a distribution, not an average. A task whose hard cases reason ten times longer than its easy ones will overrun a budget built on the mean.',
        ],
      },
      {
        heading: 'The widest gap in this market',
        body: [
          'Off-peak, DeepSeek V4.1 Flash lists $0.15 per million input tokens and $0.60 output. GPT-6 Astra lists $10 and $50. That is about 67 times on input and 83 times on output. Even at DeepSeek\'s peak rates the gap is more than 40 times on output.',
          'A gap that wide changes the question. It is no longer which model is cheaper, but whether the cheaper one is good enough, and on which tasks. DeepSeek\'s own table puts V4.1 Flash level with Claude Opus 5 on the DeepSWE coding benchmark, while independent indexes still place GPT-6 Astra near the top overall and V4.1 Flash well below it.',
        ],
      },
      {
        heading: 'What the old names meant',
        body: [
          'DeepSeek R1 and OpenAI o1 were the first widely used reasoning models, and they established the pattern of billing visible thinking as output tokens. Both have been superseded, and neither appears in current published pricing.',
          'Cost ratios from that generation do not transfer. Rates fell substantially and the models reason differently, so the token counts changed as well as the prices.',
        ],
      },
    ],
    faq: [
      { question: 'Are DeepSeek R1 and OpenAI o1 still available?', answer: 'Neither appears in current published pricing. The closest current models are DeepSeek V4.1 Flash and GPT-6 Astra, which is the pair priced on this page.' },
      { question: 'Why do reasoning models cost more than expected?', answer: 'They emit reasoning tokens before answering, and those bill as output, which costs several times more than input. Reasoning length also varies with problem difficulty, so a budget built on an average output length will overrun on hard cases.' },
      { question: 'How wide is the price gap?', answer: 'Off-peak, DeepSeek V4.1 Flash is about 83 times cheaper than GPT-6 Astra on output, the side that dominates reasoning workloads. DeepSeek doubles its rates during peak hours, which still leaves a gap of more than 40 times.' },
    ],
  },
  {
    slug: 'gemini-flash-vs-gpt-4o-mini-pricing',
    card: { title: 'Gemini Flash vs GPT mini', detail: 'The cheap tier after GPT-4o mini' },
    group: 'legacy',
    title: 'Gemini Flash vs GPT Mini Pricing Calculator',
    description: 'GPT-4o mini has been superseded. Compare today\'s Gemini Flash and GPT mini-tier models, Gemini 3.8 Flash and GPT-5.6 Luna, on real monthly cost.',
    eyebrow: 'High-volume model pricing', crumb: 'Gemini Flash vs GPT Mini',
    heading: 'Gemini Flash vs GPT mini pricing.',
    intro: 'GPT-4o mini is retired. This page compares today\'s Gemini Flash with the OpenAI model that took over the cheap tier.',
    legacyTerms: 'GPT-4o mini is a legacy search term and no longer appears in current pricing. The live pair is Gemini 3.8 Flash, Google\'s current Flash model, and GPT-5.6 Luna, OpenAI\'s high-volume model.',
    leftId: 'gemini-3.8-flash', rightId: 'gpt-5.6-luna',
    decision: 'Gemini Flash is no longer priced as a budget model. Compare it with GPT-5.6 Luna at your real request volume, and use Google\'s 2027 price if the workload will still run next year.',
    analysis: [
      {
        heading: 'The cheap tier got much cheaper',
        body: [
          'GPT-4o mini set the expectation for what a cheap model costs. The current tier is well below it: GPT-5.6 Luna lists $0.20 per million input and $1.20 output, following an OpenAI price reduction in mid-2026.',
          'If your cost model still assumes GPT-4o mini rates, it is overstating the bill. Re-run it before deciding you cannot afford a workload.',
        ],
      },
      {
        heading: 'Gemini Flash is no longer the cheap option',
        body: [
          'Gemini 3.8 Flash lists $0.75 per million input tokens and $3.75 output, almost four times GPT-5.6 Luna on input and about three times on output. Google now sells Flash as a capable mid-tier model; its low-cost line is Flash-Lite.',
          'Google has also announced that Gemini 3.8 Flash rises to $1.50 input and $7.50 output on 1 January 2027. A budget built on today\'s rate will be half the real cost from January. For a workload that will still run next year, use the 2027 rate.',
        ],
      },
      {
        heading: 'Per-call price is the wrong unit here',
        body: [
          'At these rates a single request costs a fraction of a cent, which makes per-call comparison useless. The meaningful figure is monthly total at your real request volume.',
          'The two variables that actually move it are output length and any prefix you resend on every call. A pipeline that quietly attaches a large system prompt to millions of requests will spend more on the prefix than on the work.',
        ],
      },
    ],
    faq: [
      { question: 'Is GPT-4o mini still available?', answer: 'It no longer appears in current published pricing. The high-volume slot is now held by GPT-5.6 Luna at $0.20 per million input and $1.20 output, which is below the rate GPT-4o mini set.' },
      { question: 'Which is cheaper for high-volume work?', answer: 'GPT-5.6 Luna, at current published rates: $0.20 per million input and $1.20 output, against $0.75 and $3.75 for Gemini 3.8 Flash. The gap widens on 1 January 2027, when Gemini 3.8 Flash rises to $1.50 and $7.50.' },
      { question: 'Is Gemini 3.8 Flash getting more expensive?', answer: 'Yes. Google\'s pricing page lists $0.75 input and $3.75 output through 31 December 2026, and $1.50 input and $7.50 output from 1 January 2027.' },
      { question: 'How should I compare cheap models?', answer: 'By monthly total at your real request volume, not per-call price. Output length and any prefix resent on every call are the two variables that move the number most.' },
    ],
  },
];
