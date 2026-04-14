export const primerSections = [
  {
    id: "what-is-dcf",
    label: "01",
    kicker: "Big Idea",
    title: "Discounted Cash Flow",
    summary:
      "DCF starts with one simple question: if a business can produce cash in the future, what is that future cash worth to us today?",
    shortPoints: [
      "First we forecast the cash the business may generate.",
      "Then we adjust that cash for time and risk.",
      "Finally we compare that value with the stock price in the market.",
    ],
    detailTitle: "What DCF is really doing",
    detailBody: [
      "A helpful way to think about a company is this: it is an asset that can produce cash year after year. A DCF turns that idea into numbers. We estimate the company’s future operating cash flow, bring those future cash flows back into today’s money, and then ask what that means for shareholders on a per-share basis.",
      "That is why DCF is not mainly about accounting profit. It is about future cash generation, the time value of money, and how much of the business value actually belongs to equity holders after debt is considered.",
    ],
    detailBullets: [
      "Future cash matters more than past accounting history.",
      "Cash received later is worth less than cash received now.",
      "A DCF is powerful, but only if the assumptions are sensible.",
    ],
    visual: "hero",
  },
  {
    id: "what-we-need",
    label: "02",
    kicker: "Inputs",
    title: "What data do we need?",
    summary:
      "Before we value anything, we need a starting point from the real company: market data, financial statement data, and a few modeling assumptions.",
    shortPoints: [
      "Price and shares outstanding tell us what the market sees today.",
      "Revenue, cash, and debt give us the financial starting line.",
      "Forecast assumptions let us test what the business could look like next.",
    ],
    detailTitle: "The minimum data behind the model",
    detailBody: [
      "For a practical public-company DCF, the first layer is real company data: current price, diluted shares outstanding, TTM revenue, cash, and total debt. These numbers anchor the model in reality and help us move from enterprise value to equity value.",
      "After that, we choose the assumptions that drive the forecast: growth, margins, reinvestment, taxes, the discount rate, and terminal growth. Those are the inputs that shape the answer.",
    ],
    detailBullets: [
      "Market data: price, ticker, exchange, currency",
      "Capital structure: diluted shares, cash, total debt, net debt",
      "Operating base: TTM revenue and historical baseline ratios when available",
      "Forecast drivers: growth, margin, reinvestment, taxes, discount rate",
    ],
    visual: "inputs",
  },
  {
    id: "forecast-drivers",
    label: "03",
    kicker: "Assumptions",
    title: "What can we customize?",
    summary:
      "The model lets us change the assumptions that truly move value, either with one flat number or year by year.",
    shortPoints: [
      "Growth changes the size of the business.",
      "Margins and reinvestment change the cash the business keeps.",
      "WACC, debt, and shares change how that value is measured per share.",
    ],
    detailTitle: "How each user input enters the model",
    detailBody: [
      "Some assumptions affect the operating forecast directly. Revenue growth changes sales. EBITDA margin changes profitability. D&A, CapEx, and NWC percentages determine how much of those operating profits turn into actual free cash flow.",
      "Other assumptions affect valuation rather than operations. WACC changes how strongly we discount future cash flows. Terminal growth changes the continuing value at the end of the forecast period. Net debt and diluted shares change how enterprise value becomes equity value per share.",
    ],
    detailBullets: [
      "Flat mode applies one assumption to every forecast year.",
      "Year-by-year mode lets us specify a different value for each year.",
      "User inputs should override history. History should override fallback defaults.",
    ],
    visual: "drivers",
  },
  {
    id: "build-ufcf",
    label: "04",
    kicker: "Forecast Build",
    title: "From revenue to UFCF",
    summary:
      "We do not jump straight to valuation. We first build the business forecast line by line until we reach unlevered free cash flow.",
    shortPoints: [
      "Start with revenue.",
      "Turn revenue into operating profit.",
      "Subtract reinvestment to reach free cash flow.",
    ],
    detailTitle: "The operating forecast formulas",
    detailBody: [
      "These are the main formulas inside the operating forecast. They follow the same DCF logic we pulled from the PE material and then adapted into a cleaner public-company FCFF workflow.",
      "The sequence matters. Revenue comes first. Then profitability. Then taxes. Then reinvestment. Only after all of that do we arrive at UFCF.",
    ],
    formulas: [
      {
        title: "Revenue",
        latex: String.raw`Revenue_t = Revenue_{t-1}\,(1 + g_t)`,
        description: "This says next year’s revenue equals this year’s revenue multiplied by one plus the growth rate.",
      },
      {
        title: "EBITDA",
        latex: String.raw`EBITDA_t = Revenue_t \times m^{EBITDA}_t`,
        description: "EBITDA margin tells us how much operating profit is left before depreciation and amortization.",
      },
      {
        title: "D&A",
        latex: String.raw`D\&A_t = Revenue_t \times d_t`,
        description: "In this streamlined version, D&A is estimated as a percentage of revenue.",
      },
      {
        title: "EBIT and NOPAT",
        latex: String.raw`\begin{aligned} EBIT_t &= EBITDA_t - D\&A_t \\ NOPAT_t &= EBIT_t(1-\tau_t) \end{aligned}`,
        description: "EBIT is operating profit after D&A. NOPAT is the after-tax version of EBIT and is a key step toward free cash flow.",
      },
      {
        title: "Working Capital and CapEx",
        latex: String.raw`\begin{aligned} NWC_t &= Revenue_t \times n_t \\ \Delta NWC_t &= NWC_t - NWC_{t-1} \\ CapEx_t &= Revenue_t \times c_t \end{aligned}`,
        description: "Working capital and CapEx both represent cash that must be tied back into the business. Only the change in working capital reduces free cash flow.",
      },
      {
        title: "UFCF",
        latex: String.raw`UFCF_t = NOPAT_t + D\&A_t - CapEx_t - \Delta NWC_t`,
        description: "This is the cash flow available to all capital providers before debt payments are considered.",
      },
    ],
    glossary: [
      ["g_t", "Revenue growth rate in year t"],
      [String.raw`m^{EBITDA}_t`, "EBITDA margin in year t"],
      ["d_t", "D&A as a percent of revenue in year t"],
      [String.raw`\tau_t`, "Tax rate in year t"],
      ["n_t", "NWC as a percent of revenue in year t"],
      ["c_t", "CapEx as a percent of revenue in year t"],
    ],
    visual: "ufcf",
  },
  {
    id: "turn-cash-into-value",
    label: "05",
    kicker: "Valuation Build",
    title: "From UFCF to equity value",
    summary:
      "Once we have UFCF, we can finally turn the forecast into a valuation by discounting it and adding continuing value.",
    shortPoints: [
      "Bring future cash flows back to today.",
      "Estimate value after the explicit forecast period.",
      "Convert enterprise value into per-share equity value.",
    ],
    detailTitle: "The valuation formulas",
    detailBody: [
      "This is the step where the operating model becomes a valuation model. The key ideas are present value, continuing value, and the difference between enterprise value and equity value.",
      "In the current public-company version, the bridge uses net debt to move from enterprise value to equity value. A fuller institutional model can include extra adjustments, but this gives a clean first-principles framework.",
    ],
    formulas: [
      {
        title: "Present Value of UFCF",
        latex: String.raw`PV(UFCF_t) = \frac{UFCF_t}{(1+WACC)^t}`,
        description: "This is the time-value-of-money step. The farther away the cash flow is, the more heavily it is discounted.",
      },
      {
        title: "Terminal Value",
        latex: String.raw`TV_n = \frac{UFCF_n(1+g)}{WACC-g}`,
        description: "This estimates the value of the business beyond the forecast period, assuming it grows at a stable long-term rate.",
      },
      {
        title: "Enterprise Value",
        latex: String.raw`EV = \sum_{t=1}^{n} PV(UFCF_t) + PV(TV_n)`,
        description: "Enterprise value represents the value of the operating business before debt is subtracted.",
      },
      {
        title: "Equity Value",
        latex: String.raw`Equity\ Value = EV - Net\ Debt`,
        description: "After subtracting net debt, we are left with the value that belongs to shareholders.",
      },
      {
        title: "Implied Share Price",
        latex: String.raw`Implied\ Share\ Price = \frac{Equity\ Value}{Diluted\ Shares\ Outstanding}`,
        description: "This produces the per-share number that we compare with the market price to judge upside or downside.",
      },
    ],
    glossary: [
      ["WACC", "Weighted Average Cost of Capital"],
      ["g", "Terminal growth rate"],
      ["EV", "Enterprise value"],
      ["TV_n", "Terminal value at the end of year n"],
    ],
    visual: "valuation",
  },
  {
    id: "reading-the-model",
    label: "06",
    kicker: "Reading Output",
    title: "How do we read the analysis page?",
    summary:
      "The analysis page is where the model explains its answer. It shows the conclusion, the forecast behind it, and the source of the assumptions.",
    shortPoints: [
      "Summary cards tell you the headline answer.",
      "Tables and charts show why the answer looks that way.",
      "Audit data tells you where the inputs came from.",
    ],
    detailTitle: "What each area of the analysis page tells you",
    detailBody: [
      "Start with the summary cards. They answer the main question first: what value is the model suggesting, and how does that compare with the current market price? Then look at the forecast table to see the year-by-year business logic underneath.",
      "After that, use the EV bridge, diagnostics, and data-quality sections to understand how the result was built and whether any important assumptions came from user input, historical data, or fallback defaults.",
    ],
    detailBullets: [
      "Cards: current price, EV, equity value, implied share price, upside/downside",
      "Charts: trend of revenue, EBITDA, and UFCF",
      "Forecast table: the actual modeled numbers year by year",
      "Audit section: transparency about assumptions and missing data",
    ],
    visual: "analysis",
  },
];
