// lib/stocksData.js
// Universal asset list — stocks, ETFs, futures, bonds, mutual funds, commodities
// across US, UK, Germany, HK, India, France, Japan, Australia, Singapore.
//
// Exchange codes used throughout the app:
//   us → NYSE/NASDAQ  uk → LSE  de → XETRA  hk → HKEX
//   in → NSE India    fr → Euronext Paris  jp → TSE Japan
//   au → ASX Australia  sg → SGX Singapore
//
// Yahoo Finance symbol formats:
//   in  → {TICKER}.NS   (e.g. RELIANCE.NS)
//   fr  → {TICKER}.PA   (e.g. MC.PA)
//   jp  → {TICKER}.T    (e.g. 7203.T)
//   au  → {TICKER}.AX   (e.g. BHP.AX)
//   sg  → {TICKER}.SI   (e.g. D05.SI)
//   uk  → {TICKER}.L    de → {TICKER}.DE  hk → {TICKER}.HK
//
// Finnhub symbol formats:
//   in  → NSE:{TICKER}  fr → EURONEXT:{TICKER}
//   jp  → TSE:{TICKER}  au → ASX:{TICKER}  sg → SGX:{TICKER}

export const STOCKS = [

  // ─────────────────────────────────────────────────────────────────────────
  // 🇬🇧  UK — London Stock Exchange
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"HSBA",  name:"HSBC Holdings",              country:"UK", exchange:"uk", sector:"Financials",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"BP",    name:"BP",                          country:"UK", exchange:"uk", sector:"Energy",            marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"BARC",  name:"Barclays",                    country:"UK", exchange:"uk", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"GSK",   name:"GSK",                         country:"UK", exchange:"uk", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"AZN",   name:"AstraZeneca",                 country:"UK", exchange:"uk", sector:"Healthcare",        marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"VOD",   name:"Vodafone",                    country:"UK", exchange:"uk", sector:"Communication",     marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"SHEL",  name:"Shell",                       country:"UK", exchange:"uk", sector:"Energy",            marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"LLOY",  name:"Lloyds Banking Group",        country:"UK", exchange:"uk", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"RIO",   name:"Rio Tinto",                   country:"UK", exchange:"uk", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"ULVR",  name:"Unilever",                    country:"UK", exchange:"uk", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"REL",   name:"RELX",                        country:"UK", exchange:"uk", sector:"Technology",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"DGE",   name:"Diageo",                      country:"UK", exchange:"uk", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"BT.A",  name:"BT Group",                    country:"UK", exchange:"uk", sector:"Communication",     marketCap:"mid",   avgVol:"high",   type:"stock" },
  { ticker:"NG.",   name:"National Grid",               country:"UK", exchange:"uk", sector:"Utilities",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"SSE",   name:"SSE",                         country:"UK", exchange:"uk", sector:"Utilities",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"IAG",   name:"IAG (British Airways)",       country:"UK", exchange:"uk", sector:"Industrials",       marketCap:"mid",   avgVol:"high",   type:"stock" },
  { ticker:"EZJ",   name:"EasyJet",                     country:"UK", exchange:"uk", sector:"Industrials",       marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"STAN",  name:"Standard Chartered",          country:"UK", exchange:"uk", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"PRU",   name:"Prudential",                  country:"UK", exchange:"uk", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"LGEN",  name:"Legal & General",             country:"UK", exchange:"uk", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"ABF",   name:"Associated British Foods",    country:"UK", exchange:"uk", sector:"Consumer Staples",  marketCap:"mid",   avgVol:"low",    type:"stock" },
  { ticker:"EXPN",  name:"Experian",                    country:"UK", exchange:"uk", sector:"Technology",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"RKT",   name:"Reckitt Benckiser",           country:"UK", exchange:"uk", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"III",   name:"3i Group",                    country:"UK", exchange:"uk", sector:"Financials",        marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"BATS",  name:"British American Tobacco",    country:"UK", exchange:"uk", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"IMB",   name:"Imperial Brands",             country:"UK", exchange:"uk", sector:"Consumer Staples",  marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"WPP",   name:"WPP",                         country:"UK", exchange:"uk", sector:"Communication",     marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"MNDI",  name:"Mondi",                       country:"UK", exchange:"uk", sector:"Materials",         marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"HLMA",  name:"Halma",                       country:"UK", exchange:"uk", sector:"Industrials",       marketCap:"mid",   avgVol:"low",    type:"stock" },
  { ticker:"NXT",   name:"Next",                        country:"UK", exchange:"uk", sector:"Consumer Cyclical", marketCap:"mid",   avgVol:"medium", type:"stock" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇩🇪  Germany — XETRA / Frankfurt
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"SAP",   name:"SAP",                         country:"DE", exchange:"de", sector:"Technology",        marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"SIE",   name:"Siemens",                     country:"DE", exchange:"de", sector:"Industrials",       marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"ALV",   name:"Allianz",                     country:"DE", exchange:"de", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"BMW",   name:"BMW",                         country:"DE", exchange:"de", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"BAS",   name:"BASF",                        country:"DE", exchange:"de", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"DBK",   name:"Deutsche Bank",               country:"DE", exchange:"de", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"VOW3",  name:"Volkswagen",                  country:"DE", exchange:"de", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"MBG",   name:"Mercedes-Benz",               country:"DE", exchange:"de", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"DTE",   name:"Deutsche Telekom",            country:"DE", exchange:"de", sector:"Communication",     marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"MUV2",  name:"Munich Re",                   country:"DE", exchange:"de", sector:"Financials",        marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"ADS",   name:"Adidas",                      country:"DE", exchange:"de", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"HEN3",  name:"Henkel",                      country:"DE", exchange:"de", sector:"Consumer Staples",  marketCap:"mid",   avgVol:"low",    type:"stock" },
  { ticker:"BAYN",  name:"Bayer",                       country:"DE", exchange:"de", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"FRE",   name:"Fresenius",                   country:"DE", exchange:"de", sector:"Healthcare",        marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"CON",   name:"Continental",                 country:"DE", exchange:"de", sector:"Consumer Cyclical", marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"ZAL",   name:"Zalando",                     country:"DE", exchange:"de", sector:"Consumer Cyclical", marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"RWE",   name:"RWE",                         country:"DE", exchange:"de", sector:"Utilities",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"EOAN",  name:"E.ON",                        country:"DE", exchange:"de", sector:"Utilities",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"AIR",   name:"Airbus",                      country:"DE", exchange:"de", sector:"Industrials",       marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"DHL",   name:"DHL Group",                   country:"DE", exchange:"de", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"IFX",   name:"Infineon Technologies",       country:"DE", exchange:"de", sector:"Technology",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"SHL",   name:"Siemens Healthineers",        country:"DE", exchange:"de", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"SY1",   name:"Symrise",                     country:"DE", exchange:"de", sector:"Materials",         marketCap:"mid",   avgVol:"low",    type:"stock" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇫🇷  France — Euronext Paris
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"MC",    name:"LVMH",                        country:"FR", exchange:"fr", sector:"Consumer Cyclical", marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"TTE",   name:"TotalEnergies",               country:"FR", exchange:"fr", sector:"Energy",            marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"SAN",   name:"Sanofi",                      country:"FR", exchange:"fr", sector:"Healthcare",        marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"BNP",   name:"BNP Paribas",                 country:"FR", exchange:"fr", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"OR",    name:"L'Oréal",                     country:"FR", exchange:"fr", sector:"Consumer Staples",  marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"CS",    name:"AXA",                         country:"FR", exchange:"fr", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"SU",    name:"Schneider Electric",          country:"FR", exchange:"fr", sector:"Industrials",       marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"DG",    name:"Vinci",                       country:"FR", exchange:"fr", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"BN",    name:"Danone",                      country:"FR", exchange:"fr", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"RMS",   name:"Hermès International",        country:"FR", exchange:"fr", sector:"Consumer Cyclical", marketCap:"mega",  avgVol:"low",    type:"stock" },
  { ticker:"ML",    name:"Michelin",                    country:"FR", exchange:"fr", sector:"Consumer Cyclical", marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"RI",    name:"Pernod Ricard",               country:"FR", exchange:"fr", sector:"Consumer Staples",  marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"PUB",   name:"Publicis Groupe",             country:"FR", exchange:"fr", sector:"Communication",     marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"RNO",   name:"Renault",                     country:"FR", exchange:"fr", sector:"Consumer Cyclical", marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"GLE",   name:"Société Générale",            country:"FR", exchange:"fr", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"CAP",   name:"Capgemini",                   country:"FR", exchange:"fr", sector:"Technology",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"AIR",   name:"Air Liquide",                 country:"FR", exchange:"fr", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"KER",   name:"Kering",                      country:"FR", exchange:"fr", sector:"Consumer Cyclical", marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"EL",    name:"EssilorLuxottica",            country:"FR", exchange:"fr", sector:"Healthcare",        marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"STM",   name:"STMicroelectronics",          country:"FR", exchange:"fr", sector:"Technology",        marketCap:"large", avgVol:"medium", type:"stock" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇭🇰  Hong Kong — HKEX
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"9988",  name:"Alibaba Group",               country:"HK", exchange:"hk", sector:"Consumer Cyclical", marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"0700",  name:"Tencent Holdings",            country:"HK", exchange:"hk", sector:"Communication",     marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"9618",  name:"JD.com",                      country:"HK", exchange:"hk", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"2318",  name:"Ping An Insurance",           country:"HK", exchange:"hk", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"1299",  name:"AIA Group",                   country:"HK", exchange:"hk", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"0005",  name:"HSBC Holdings HK",            country:"HK", exchange:"hk", sector:"Financials",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"1810",  name:"Xiaomi Corporation",          country:"HK", exchange:"hk", sector:"Technology",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"3690",  name:"Meituan",                     country:"HK", exchange:"hk", sector:"Consumer Cyclical", marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"9999",  name:"NetEase",                     country:"HK", exchange:"hk", sector:"Communication",     marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"0941",  name:"China Mobile",                country:"HK", exchange:"hk", sector:"Communication",     marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"1177",  name:"Sino Biopharmaceutical",      country:"HK", exchange:"hk", sector:"Healthcare",        marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"2382",  name:"Sunny Optical Technology",    country:"HK", exchange:"hk", sector:"Technology",        marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"0388",  name:"HKEX (Hong Kong Exchanges)",  country:"HK", exchange:"hk", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"1398",  name:"ICBC (Industrial & Commercial Bank)",country:"HK",exchange:"hk",sector:"Financials",  marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"3988",  name:"Bank of China",               country:"HK", exchange:"hk", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"0016",  name:"Sun Hung Kai Properties",     country:"HK", exchange:"hk", sector:"Real Estate",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"0001",  name:"CK Hutchison Holdings",       country:"HK", exchange:"hk", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"0011",  name:"Hang Seng Bank",              country:"HK", exchange:"hk", sector:"Financials",        marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"2269",  name:"WuXi Biologics",              country:"HK", exchange:"hk", sector:"Healthcare",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"6098",  name:"Country Garden Services",     country:"HK", exchange:"hk", sector:"Real Estate",       marketCap:"mid",   avgVol:"medium", type:"stock" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇮🇳  India — NSE (National Stock Exchange)
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"RELIANCE",    name:"Reliance Industries",         country:"IN", exchange:"in", sector:"Energy",            marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"TCS",         name:"Tata Consultancy Services",   country:"IN", exchange:"in", sector:"Technology",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"HDFCBANK",    name:"HDFC Bank",                   country:"IN", exchange:"in", sector:"Financials",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"INFY",        name:"Infosys",                     country:"IN", exchange:"in", sector:"Technology",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"ICICIBANK",   name:"ICICI Bank",                  country:"IN", exchange:"in", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"KOTAKBANK",   name:"Kotak Mahindra Bank",         country:"IN", exchange:"in", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"LT",          name:"Larsen & Toubro",             country:"IN", exchange:"in", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"WIPRO",       name:"Wipro",                       country:"IN", exchange:"in", sector:"Technology",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"ONGC",        name:"ONGC (Oil & Natural Gas)",    country:"IN", exchange:"in", sector:"Energy",            marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"SBIN",        name:"State Bank of India",         country:"IN", exchange:"in", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"ITC",         name:"ITC Limited",                 country:"IN", exchange:"in", sector:"Consumer Staples",  marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"MARUTI",      name:"Maruti Suzuki India",         country:"IN", exchange:"in", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"BAJFINANCE",  name:"Bajaj Finance",               country:"IN", exchange:"in", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"BAJAJFINSV",  name:"Bajaj Finserv",               country:"IN", exchange:"in", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"TITAN",       name:"Titan Company",               country:"IN", exchange:"in", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"SUNPHARMA",   name:"Sun Pharmaceutical",          country:"IN", exchange:"in", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"HINDUNILVR",  name:"Hindustan Unilever",          country:"IN", exchange:"in", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"ASIANPAINT",  name:"Asian Paints",                country:"IN", exchange:"in", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"TECHM",       name:"Tech Mahindra",               country:"IN", exchange:"in", sector:"Technology",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"HCLTECH",     name:"HCL Technologies",            country:"IN", exchange:"in", sector:"Technology",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"ULTRACEMCO",  name:"UltraTech Cement",            country:"IN", exchange:"in", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"NESTLEIND",   name:"Nestlé India",                country:"IN", exchange:"in", sector:"Consumer Staples",  marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"ADANIENT",    name:"Adani Enterprises",           country:"IN", exchange:"in", sector:"Industrials",       marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"ADANIPORTS",  name:"Adani Ports & SEZ",           country:"IN", exchange:"in", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"POWERGRID",   name:"Power Grid Corporation",      country:"IN", exchange:"in", sector:"Utilities",         marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"NTPC",        name:"NTPC Limited",                country:"IN", exchange:"in", sector:"Utilities",         marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"AXISBANK",    name:"Axis Bank",                   country:"IN", exchange:"in", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"DRREDDY",     name:"Dr. Reddy's Laboratories",    country:"IN", exchange:"in", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"CIPLA",       name:"Cipla",                       country:"IN", exchange:"in", sector:"Healthcare",        marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"TATAMOTORS",  name:"Tata Motors",                 country:"IN", exchange:"in", sector:"Consumer Cyclical", marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"TATASTEEL",   name:"Tata Steel",                  country:"IN", exchange:"in", sector:"Materials",         marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"JSWSTEEL",    name:"JSW Steel",                   country:"IN", exchange:"in", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"HINDALCO",    name:"Hindalco Industries",         country:"IN", exchange:"in", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"COALINDIA",   name:"Coal India",                  country:"IN", exchange:"in", sector:"Energy",            marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"HEROMOTOCO",  name:"Hero MotoCorp",               country:"IN", exchange:"in", sector:"Consumer Cyclical", marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"DIVISLAB",    name:"Divi's Laboratories",         country:"IN", exchange:"in", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"GRASIM",      name:"Grasim Industries",           country:"IN", exchange:"in", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"INDUSINDBK",  name:"IndusInd Bank",               country:"IN", exchange:"in", sector:"Financials",        marketCap:"mid",   avgVol:"high",   type:"stock" },
  { ticker:"EICHERMOT",   name:"Eicher Motors (Royal Enfield)",country:"IN",exchange:"in",sector:"Consumer Cyclical",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"APOLLOHOSP",  name:"Apollo Hospitals",            country:"IN", exchange:"in", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },

  // India ETFs & Index Funds
  { ticker:"NIFTYBEES",   name:"Nippon India Nifty 50 BeES",  country:"IN", exchange:"in", sector:"ETF",               marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"JUNIORBEES",  name:"Nippon India Junior BeES",    country:"IN", exchange:"in", sector:"ETF",               marketCap:"mid",   avgVol:"medium", type:"etf" },
  { ticker:"BANKBEES",    name:"Nippon India Bank BeES",      country:"IN", exchange:"in", sector:"ETF",               marketCap:"mid",   avgVol:"medium", type:"etf" },
  { ticker:"GOLDBEES",    name:"Nippon India Gold BeES",      country:"IN", exchange:"in", sector:"ETF",               marketCap:"mid",   avgVol:"high",   type:"etf" },

  // India Mutual Fund Categories (via mfapi.in — schemeCode in ticker field)
  { ticker:"119551", name:"HDFC Top 100 Fund - Direct Growth",        country:"IN", exchange:"in", sector:"Mutual Fund", marketCap:null, avgVol:null, type:"mutualfund" },
  { ticker:"120503", name:"Axis Bluechip Fund - Direct Growth",       country:"IN", exchange:"in", sector:"Mutual Fund", marketCap:null, avgVol:null, type:"mutualfund" },
  { ticker:"120465", name:"Mirae Asset Large Cap Fund - Direct",      country:"IN", exchange:"in", sector:"Mutual Fund", marketCap:null, avgVol:null, type:"mutualfund" },
  { ticker:"122639", name:"SBI Bluechip Fund - Direct Growth",        country:"IN", exchange:"in", sector:"Mutual Fund", marketCap:null, avgVol:null, type:"mutualfund" },
  { ticker:"100033", name:"HDFC Mid-Cap Opportunities - Direct",      country:"IN", exchange:"in", sector:"Mutual Fund", marketCap:null, avgVol:null, type:"mutualfund" },
  { ticker:"120828", name:"Parag Parikh Flexi Cap Fund - Direct",     country:"IN", exchange:"in", sector:"Mutual Fund", marketCap:null, avgVol:null, type:"mutualfund" },
  { ticker:"120716", name:"Canara Robeco Equity Hybrid - Direct",     country:"IN", exchange:"in", sector:"Mutual Fund", marketCap:null, avgVol:null, type:"mutualfund" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇯🇵  Japan — Tokyo Stock Exchange
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"7203",  name:"Toyota Motor Corporation",    country:"JP", exchange:"jp", sector:"Consumer Cyclical", marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"6758",  name:"Sony Group Corporation",      country:"JP", exchange:"jp", sector:"Technology",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"9984",  name:"SoftBank Group",              country:"JP", exchange:"jp", sector:"Technology",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"6861",  name:"Keyence Corporation",         country:"JP", exchange:"jp", sector:"Technology",        marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"9983",  name:"Fast Retailing (Uniqlo)",     country:"JP", exchange:"jp", sector:"Consumer Cyclical", marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"8306",  name:"Mitsubishi UFJ Financial",    country:"JP", exchange:"jp", sector:"Financials",        marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"7267",  name:"Honda Motor Company",         country:"JP", exchange:"jp", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"7974",  name:"Nintendo",                    country:"JP", exchange:"jp", sector:"Communication",     marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"6098",  name:"Recruit Holdings",            country:"JP", exchange:"jp", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"4063",  name:"Shin-Etsu Chemical",          country:"JP", exchange:"jp", sector:"Materials",         marketCap:"large", avgVol:"low",    type:"stock" },
  { ticker:"9432",  name:"NTT (Nippon Telegraph)",      country:"JP", exchange:"jp", sector:"Communication",     marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"8035",  name:"Tokyo Electron",              country:"JP", exchange:"jp", sector:"Technology",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"6501",  name:"Hitachi",                     country:"JP", exchange:"jp", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"4502",  name:"Takeda Pharmaceutical",       country:"JP", exchange:"jp", sector:"Healthcare",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"6902",  name:"Denso Corporation",           country:"JP", exchange:"jp", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇦🇺  Australia — ASX
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"BHP",   name:"BHP Group",                   country:"AU", exchange:"au", sector:"Materials",         marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"CBA",   name:"Commonwealth Bank of Australia",country:"AU",exchange:"au",sector:"Financials",       marketCap:"mega",  avgVol:"high",   type:"stock" },
  { ticker:"CSL",   name:"CSL Limited",                 country:"AU", exchange:"au", sector:"Healthcare",        marketCap:"mega",  avgVol:"medium", type:"stock" },
  { ticker:"ANZ",   name:"ANZ Banking Group",           country:"AU", exchange:"au", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"WBC",   name:"Westpac Banking",             country:"AU", exchange:"au", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"NAB",   name:"National Australia Bank",     country:"AU", exchange:"au", sector:"Financials",        marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"MQG",   name:"Macquarie Group",             country:"AU", exchange:"au", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"WES",   name:"Wesfarmers",                  country:"AU", exchange:"au", sector:"Consumer Cyclical", marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"RIO",   name:"Rio Tinto ASX",               country:"AU", exchange:"au", sector:"Materials",         marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"FMG",   name:"Fortescue",                   country:"AU", exchange:"au", sector:"Materials",         marketCap:"large", avgVol:"high",   type:"stock" },
  { ticker:"WOW",   name:"Woolworths Group",            country:"AU", exchange:"au", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"TLS",   name:"Telstra Group",               country:"AU", exchange:"au", sector:"Communication",     marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"GMG",   name:"Goodman Group",               country:"AU", exchange:"au", sector:"Real Estate",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"COL",   name:"Coles Group",                 country:"AU", exchange:"au", sector:"Consumer Staples",  marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"REA",   name:"REA Group",                   country:"AU", exchange:"au", sector:"Technology",        marketCap:"large", avgVol:"medium", type:"stock" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇸🇬  Singapore — SGX
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"D05",   name:"DBS Group Holdings",          country:"SG", exchange:"sg", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"O39",   name:"OCBC Bank",                   country:"SG", exchange:"sg", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"U11",   name:"United Overseas Bank (UOB)",  country:"SG", exchange:"sg", sector:"Financials",        marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"Z74",   name:"Singapore Telecommunications (SingTel)",country:"SG",exchange:"sg",sector:"Communication",marketCap:"large",avgVol:"medium",type:"stock" },
  { ticker:"C09",   name:"City Developments",           country:"SG", exchange:"sg", sector:"Real Estate",       marketCap:"mid",   avgVol:"low",    type:"stock" },
  { ticker:"G13",   name:"Genting Singapore",           country:"SG", exchange:"sg", sector:"Consumer Cyclical", marketCap:"mid",   avgVol:"medium", type:"stock" },
  { ticker:"C6L",   name:"Singapore Airlines",          country:"SG", exchange:"sg", sector:"Industrials",       marketCap:"large", avgVol:"medium", type:"stock" },
  { ticker:"BN4",   name:"Keppel Corporation",          country:"SG", exchange:"sg", sector:"Industrials",       marketCap:"mid",   avgVol:"medium", type:"stock" },

  // ─────────────────────────────────────────────────────────────────────────
  // 🇺🇸  US — ETFs (all exchanges, always shown)
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"SPY",   name:"SPDR S&P 500 ETF Trust",              country:"US", exchange:"us", sector:"ETF", marketCap:"mega",  avgVol:"high",   type:"etf" },
  { ticker:"QQQ",   name:"Invesco QQQ Trust (NASDAQ-100)",       country:"US", exchange:"us", sector:"ETF", marketCap:"mega",  avgVol:"high",   type:"etf" },
  { ticker:"IWM",   name:"iShares Russell 2000 ETF",             country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"VOO",   name:"Vanguard S&P 500 ETF",                 country:"US", exchange:"us", sector:"ETF", marketCap:"mega",  avgVol:"high",   type:"etf" },
  { ticker:"VTI",   name:"Vanguard Total Stock Market ETF",      country:"US", exchange:"us", sector:"ETF", marketCap:"mega",  avgVol:"high",   type:"etf" },
  { ticker:"GLD",   name:"SPDR Gold Shares ETF",                 country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"SLV",   name:"iShares Silver Trust ETF",             country:"US", exchange:"us", sector:"ETF", marketCap:"mid",   avgVol:"high",   type:"etf" },
  { ticker:"TLT",   name:"iShares 20+ Year Treasury Bond ETF",   country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"IEF",   name:"iShares 7-10 Year Treasury Bond ETF",  country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"medium", type:"etf" },
  { ticker:"AGG",   name:"iShares Core US Aggregate Bond ETF",   country:"US", exchange:"us", sector:"ETF", marketCap:"mega",  avgVol:"high",   type:"etf" },
  { ticker:"BND",   name:"Vanguard Total Bond Market ETF",       country:"US", exchange:"us", sector:"ETF", marketCap:"mega",  avgVol:"medium", type:"etf" },
  { ticker:"HYG",   name:"iShares iBoxx High Yield Corp Bond",   country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"LQD",   name:"iShares iBoxx Investment Grade Bond",  country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"medium", type:"etf" },
  { ticker:"XLF",   name:"Financial Select Sector SPDR ETF",     country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"XLE",   name:"Energy Select Sector SPDR ETF",        country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"XLK",   name:"Technology Select Sector SPDR ETF",    country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"XLV",   name:"Health Care Select Sector SPDR ETF",   country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"XLI",   name:"Industrial Select Sector SPDR ETF",    country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"medium", type:"etf" },
  { ticker:"XLP",   name:"Consumer Staples Select Sector SPDR",  country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"medium", type:"etf" },
  { ticker:"VNQ",   name:"Vanguard Real Estate ETF",             country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"IEFA",  name:"iShares Core MSCI EAFE ETF",           country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"medium", type:"etf" },
  { ticker:"EEM",   name:"iShares MSCI Emerging Markets ETF",    country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"high",   type:"etf" },
  { ticker:"ARKK",  name:"ARK Innovation ETF",                   country:"US", exchange:"us", sector:"ETF", marketCap:"mid",   avgVol:"high",   type:"etf" },
  { ticker:"ARKQ",  name:"ARK Autonomous Technology & Robotics", country:"US", exchange:"us", sector:"ETF", marketCap:"small", avgVol:"medium", type:"etf" },
  { ticker:"VEA",   name:"Vanguard FTSE Developed Markets ETF",  country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"medium", type:"etf" },
  { ticker:"VWO",   name:"Vanguard FTSE Emerging Markets ETF",   country:"US", exchange:"us", sector:"ETF", marketCap:"large", avgVol:"medium", type:"etf" },
  { ticker:"USO",   name:"United States Oil Fund ETF",           country:"US", exchange:"us", sector:"ETF", marketCap:"mid",   avgVol:"high",   type:"etf" },

  // ─────────────────────────────────────────────────────────────────────────
  // 📈  Futures & Commodities (Stooq continuous contracts)
  // ─────────────────────────────────────────────────────────────────────────
  { ticker:"ES.F",  name:"S&P 500 Futures (E-mini)",          country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"high",   type:"future" },
  { ticker:"NQ.F",  name:"NASDAQ-100 Futures (E-mini)",       country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"high",   type:"future" },
  { ticker:"YM.F",  name:"Dow Jones Futures (E-mini)",        country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"RTY.F", name:"Russell 2000 Futures",              country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"CL.F",  name:"Crude Oil WTI Futures",             country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"high",   type:"future" },
  { ticker:"BZ.F",  name:"Brent Crude Oil Futures",           country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"high",   type:"future" },
  { ticker:"GC.F",  name:"Gold Futures",                      country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"high",   type:"future" },
  { ticker:"SI.F",  name:"Silver Futures",                    country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"HG.F",  name:"Copper Futures",                    country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"NG.F",  name:"Natural Gas Futures",               country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"ZW.F",  name:"Wheat Futures",                     country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"ZC.F",  name:"Corn Futures",                      country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"ZS.F",  name:"Soybean Futures",                   country:"US", exchange:"us", sector:"Commodity",  marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"ZB.F",  name:"US 30-Year Treasury Bond Futures",  country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"ZN.F",  name:"US 10-Year Treasury Note Futures",  country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"6E.F",  name:"EUR/USD Futures",                   country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"6J.F",  name:"JPY/USD Futures",                   country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"medium", type:"future" },
  { ticker:"6B.F",  name:"GBP/USD Futures",                   country:"US", exchange:"us", sector:"Futures",    marketCap:null, avgVol:"medium", type:"future" },
];

// ── Exchange suffix maps ───────────────────────────────────────────────────
export const FMP_EXCHANGE_SUFFIX = {
  uk: ".L", de: ".DE", hk: ".HK",
};

export const YAHOO_EXCHANGE_SUFFIX = {
  uk: ".L", de: ".DE", hk: ".HK",
  in: ".NS", fr: ".PA", jp: ".T", au: ".AX", sg: ".SI",
};

export const FINNHUB_EXCHANGE_PREFIX = {
  in: "NSE:", fr: "EURONEXT:", jp: "TSE:",
  au: "ASX:", sg: "SGX:", hk: "HKEX:", uk: "LSE:", de: "XETRA:",
};

export const STOOQ_EXCHANGE_SUFFIX = {
  uk: ".uk", de: ".de", hk: ".hk", us: ".us",
};

// ── Exchange display labels ────────────────────────────────────────────────
export const EXCHANGE_DISPLAY = {
  us: "NYSE/NASDAQ", uk: "LSE", de: "XETRA", hk: "HKEX",
  in: "NSE India",   fr: "Euronext",   jp: "TSE Japan",
  au: "ASX",         sg: "SGX",
};

// ── ALIASES — natural language → ticker ───────────────────────────────────
export const ALIASES = {
  // US Big Tech
  "apple":"AAPL","iphone":"AAPL","ipad":"AAPL","mac":"AAPL","macbook":"AAPL","airpods":"AAPL","siri":"AAPL",
  "microsoft":"MSFT","windows":"MSFT","xbox":"MSFT","azure":"MSFT","linkedin":"MSFT","office":"MSFT","teams":"MSFT","bing":"MSFT",
  "nvidia":"NVDA","geforce":"NVDA","cuda":"NVDA","jensen huang":"NVDA",
  "google":"GOOGL","alphabet":"GOOGL","youtube":"GOOGL","android":"GOOGL","gmail":"GOOGL","chrome":"GOOGL","waymo":"GOOGL","deepmind":"GOOGL","gemini":"GOOGL",
  "amazon":"AMZN","aws":"AMZN","prime":"AMZN","whole foods":"AMZN","alexa":"AMZN",
  "meta":"META","facebook":"META","instagram":"META","whatsapp":"META","threads":"META","oculus":"META","reels":"META",
  "tesla":"TSLA","elon musk":"TSLA","model 3":"TSLA","model y":"TSLA","cybertruck":"TSLA",
  "netflix":"NFLX",
  "disney":"DIS","marvel":"DIS","star wars":"DIS","pixar":"DIS","hulu":"DIS","espn":"DIS","disney+":"DIS",
  // US Finance
  "jpmorgan":"JPM","jp morgan":"JPM","chase":"JPM",
  "visa":"V","mastercard":"MA",
  "goldman":"GS","goldman sachs":"GS",
  "bank of america":"BAC","bofa":"BAC",
  "morgan stanley":"MS",
  "wells fargo":"WFC",
  "blackrock":"BLK",
  "berkshire":"BRK.B","buffett":"BRK.B","warren buffett":"BRK.B",
  // US Healthcare
  "eli lilly":"LLY","lilly":"LLY","ozempic":"LLY","mounjaro":"LLY",
  "johnson":"JNJ","j&j":"JNJ","johnson and johnson":"JNJ",
  "unitedhealth":"UNH","united health":"UNH",
  "abbvie":"ABBV","humira":"ABBV",
  "merck":"MRK","moderna":"MRNA","pfizer":"PFE","biontech":"BNTX",
  // US Energy
  "exxon":"XOM","exxonmobil":"XOM","exxon mobil":"XOM",
  "chevron":"CVX",
  // US Consumer
  "procter":"PG","p&g":"PG","procter and gamble":"PG",
  "cocacola":"KO","coca cola":"KO","coke":"KO",
  "pepsi":"PEP","pepsico":"PEP",
  "walmart":"WMT","costco":"COST",
  "home depot":"HD","mcdonalds":"MCD","mcdonald":"MCD",
  "starbucks":"SBUX","nike":"NKE",
  // US Chips
  "amd":"AMD","advanced micro":"AMD",
  "intel":"INTC","qualcomm":"QCOM",
  "adobe":"ADBE","photoshop":"ADBE",
  "salesforce":"CRM","oracle":"ORCL","ibm":"IBM",
  "broadcom":"AVGO","tsmc":"TSM",
  // UK
  "hsbc":"HSBA","hongkong shanghai":"HSBA",
  "bp":"BP","british petroleum":"BP",
  "barclays":"BARC","gsk":"GSK","glaxosmithkline":"GSK","glaxo":"GSK",
  "astrazeneca":"AZN","astra zeneca":"AZN",
  "vodafone":"VOD","shell":"SHEL","royal dutch shell":"SHEL",
  "lloyds":"LLOY","lloyds bank":"LLOY","rio tinto":"RIO",
  "unilever":"ULVR","dove":"ULVR","relx":"REL","diageo":"DGE",
  "guinness":"DGE","johnnie walker":"DGE","bt group":"BT.A",
  "national grid":"NG.","sse":"SSE","iag":"IAG","british airways":"IAG",
  "easyjet":"EZJ","standard chartered":"STAN","stanchart":"STAN",
  "reckitt":"RKT","durex":"RKT","dettol":"RKT",
  "british american tobacco":"BATS","bat":"BATS",
  "arm holdings":"ARM","arm chip":"ARM",
  // Germany
  "sap":"SAP","siemens":"SIE","allianz":"ALV","bmw":"BMW",
  "basf":"BAS","deutsche bank":"DBK","volkswagen":"VOW3","vw":"VOW3",
  "mercedes":"MBG","mercedes-benz":"MBG","daimler":"MBG",
  "deutsche telekom":"DTE","t-mobile":"DTE","telekom":"DTE",
  "munich re":"MUV2","adidas":"ADS","bayer":"BAYN","henkel":"HEN3",
  "fresenius":"FRE","continental":"CON","zalando":"ZAL",
  "rwe":"RWE","eon":"EOAN","e.on":"EOAN",
  "airbus":"AIR","dhl":"DHL","infineon":"IFX",
  // France
  "lvmh":"MC","louis vuitton":"MC","dior":"MC","moet":"MC","hennessy":"MC",
  "total":"TTE","totalenergies":"TTE",
  "sanofi":"SAN","loreal":"OR","l'oreal":"OR","lancome":"OR",
  "axa":"CS","bnp":"BNP","bnp paribas":"BNP",
  "schneider":"SU","vinci":"DG","danone":"BN",
  "hermes":"RMS","michelin":"ML","pernod":"RI","pernod ricard":"RI",
  "renault":"RNO","societe generale":"GLE","capgemini":"CAP",
  "air liquide":"AIR","kering":"KER","gucci":"KER","ysl":"KER",
  "essilor":"EL","luxottica":"EL","rayban":"EL",
  // Hong Kong / China
  "alibaba":"9988","taobao":"9988","tmall":"9988","alipay":"9988","ant group":"9988",
  "tencent":"0700","wechat":"0700","weixin":"0700","qq":"0700",
  "jd":"9618","jd.com":"9618","jingdong":"9618",
  "ping an":"2318","aia":"1299",
  "xiaomi":"1810","mi":"1810","redmi":"1810",
  "meituan":"3690","netease":"9999","china mobile":"0941",
  "icbc":"1398","industrial and commercial bank":"1398",
  "bank of china":"3988","ck hutchison":"0001","hutchison":"0001",
  "hang seng bank":"0011",
  // India
  "reliance":"RELIANCE","mukesh ambani":"RELIANCE","jio":"RELIANCE",
  "tcs":"TCS","tata consultancy":"TCS","tata consultancy services":"TCS",
  "hdfc bank":"HDFCBANK","hdfc":"HDFCBANK",
  "infosys":"INFY","narayana murthy":"INFY",
  "icici":"ICICIBANK","icici bank":"ICICIBANK",
  "kotak":"KOTAKBANK","kotak bank":"KOTAKBANK","kotak mahindra":"KOTAKBANK",
  "larsen":"LT","l&t":"LT","larsen toubro":"LT",
  "wipro":"WIPRO","ongc":"ONGC","sbi":"SBIN","state bank":"SBIN",
  "itc":"ITC","maruti":"MARUTI","suzuki india":"MARUTI",
  "bajaj finance":"BAJFINANCE","bajaj":"BAJAJFINSV","bajaj finserv":"BAJAJFINSV",
  "titan":"TITAN","tanishq":"TITAN",
  "sun pharma":"SUNPHARMA","sunpharma":"SUNPHARMA","sun pharmaceutical":"SUNPHARMA",
  "hindustan unilever":"HINDUNILVR","hul":"HINDUNILVR",
  "asian paints":"ASIANPAINT",
  "tech mahindra":"TECHM","hcl":"HCLTECH","hcl tech":"HCLTECH","hcl technologies":"HCLTECH",
  "ultratech":"ULTRACEMCO","ultratech cement":"ULTRACEMCO",
  "nestle india":"NESTLEIND","maggi":"NESTLEIND","kitkat india":"NESTLEIND",
  "adani":"ADANIENT","adani enterprises":"ADANIENT","gautam adani":"ADANIENT",
  "adani ports":"ADANIPORTS",
  "power grid":"POWERGRID","ntpc":"NTPC","axis bank":"AXISBANK",
  "dr reddy":"DRREDDY","dr reddys":"DRREDDY","cipla":"CIPLA",
  "tata motors":"TATAMOTORS","tata":"TATAMOTORS","jaguar":"TATAMOTORS","land rover":"TATAMOTORS",
  "tata steel":"TATASTEEL","jsw steel":"JSWSTEEL","jsw":"JSWSTEEL",
  "hindalco":"HINDALCO","coal india":"COALINDIA",
  "hero motocorp":"HEROMOTOCO","hero honda":"HEROMOTOCO",
  "divis lab":"DIVISLAB","divi's":"DIVISLAB",
  "eicher":"EICHERMOT","royal enfield":"EICHERMOT",
  "apollo hospitals":"APOLLOHOSP","apollo":"APOLLOHOSP",
  // Japan
  "toyota":"7203","honda":"7267","sony":"6758","softbank":"9984",
  "nintendo":"7974","keyence":"6861","uniqlo":"9983","fast retailing":"9983",
  "mitsubishi ufj":"8306","mufg":"8306","ntt":"9432","hitachi":"6501",
  "takeda":"4502","denso":"6902","tokyo electron":"8035",
  // Australia
  "bhp":"BHP","bhp billiton":"BHP",
  "commonwealth bank":"CBA","commbank":"CBA",
  "csl":"CSL","anz":"ANZ","westpac":"WBC","nab":"NAB",
  "macquarie":"MQG","wesfarmers":"WES","bunnings":"WES",
  "fortescue":"FMG","woolworths":"WOW","telstra":"TLS",
  // Singapore
  "dbs":"D05","dbs bank":"D05","ocbc":"O39","uob":"U11",
  "singtel":"Z74","singapore airlines":"C6L","sia":"C6L",
  "keppel":"BN4","genting singapore":"G13",
  // ETFs
  "spy":"SPY","s&p etf":"SPY","s&p 500 etf":"SPY",
  "qqq":"QQQ","nasdaq etf":"QQQ","nasdaq 100 etf":"QQQ",
  "iwm":"IWM","russell etf":"IWM","small cap etf":"IWM",
  "voo":"VOO","vanguard s&p":"VOO","vti":"VTI","vanguard total":"VTI",
  "gld":"GLD","gold etf":"GLD","tlt":"TLT","bond etf":"TLT",
  "arkk":"ARKK","ark":"ARKK","ark innovation":"ARKK","cathie wood":"ARKK",
  "agg":"AGG","aggregate bond":"AGG","bnd":"BND","hyg":"HYG","high yield":"HYG",
  "eem":"EEM","emerging markets etf":"EEM","iefa":"IEFA","developed markets etf":"IEFA",
  // Futures & Commodities
  "s&p futures":"ES.F","sp futures":"ES.F","es futures":"ES.F",
  "nasdaq futures":"NQ.F","nq futures":"NQ.F",
  "dow futures":"YM.F","ym futures":"YM.F",
  "crude oil":"CL.F","oil futures":"CL.F","wti":"CL.F","wti crude":"CL.F",
  "brent":"BZ.F","brent crude":"BZ.F","brent oil":"BZ.F",
  "gold futures":"GC.F","gc futures":"GC.F",
  "silver futures":"SI.F","copper futures":"HG.F","copper":"HG.F",
  "natural gas":"NG.F","natgas":"NG.F","natural gas futures":"NG.F",
  "wheat":"ZW.F","wheat futures":"ZW.F",
  "corn":"ZC.F","corn futures":"ZC.F","soybean":"ZS.F","soy":"ZS.F",
  "treasury futures":"ZB.F","bond futures":"ZB.F","10 year":"ZN.F",
  "eur usd":"6E.F","euro futures":"6E.F",
  // Mutual Funds
  "hdfc top 100":"119551","hdfc large cap":"119551",
  "axis bluechip":"120503","axis large cap":"120503",
  "mirae large cap":"120465","mirae asset":"120465",
  "sbi bluechip":"122639","sbi large cap":"122639",
  "hdfc mid cap":"100033","parag parikh":"120828","ppfas":"120828",
};

export const TICKER_DISPLAY_NAME = {
  // US
  "AAPL":"Apple","MSFT":"Microsoft","NVDA":"NVIDIA","GOOGL":"Alphabet (Google)",
  "AMZN":"Amazon","META":"Meta","TSLA":"Tesla","NFLX":"Netflix","DIS":"Disney",
  "JPM":"JPMorgan","V":"Visa","MA":"Mastercard","GS":"Goldman Sachs","BAC":"Bank of America",
  "XOM":"ExxonMobil","CVX":"Chevron","LLY":"Eli Lilly","JNJ":"Johnson & Johnson",
  "UNH":"UnitedHealth","ABBV":"AbbVie","MRK":"Merck","PG":"Procter & Gamble",
  "KO":"Coca-Cola","PEP":"PepsiCo","WMT":"Walmart","COST":"Costco","HD":"Home Depot",
  "MCD":"McDonald's","AMD":"AMD","INTC":"Intel","QCOM":"Qualcomm","ADBE":"Adobe",
  "CRM":"Salesforce","ORCL":"Oracle","IBM":"IBM","AVGO":"Broadcom","TSM":"TSMC",
  // UK
  "HSBA":"HSBC","BP":"BP","BARC":"Barclays","GSK":"GSK","AZN":"AstraZeneca",
  "VOD":"Vodafone","SHEL":"Shell","LLOY":"Lloyds","RIO":"Rio Tinto (London)",
  "ULVR":"Unilever","REL":"RELX","DGE":"Diageo","BT.A":"BT Group",
  "NG.":"National Grid","SSE":"SSE","IAG":"IAG","EZJ":"easyJet",
  "STAN":"Standard Chartered","BATS":"British American Tobacco",
  // Germany
  "SAP":"SAP","SIE":"Siemens","ALV":"Allianz","BMW":"BMW","BAS":"BASF",
  "DBK":"Deutsche Bank","VOW3":"Volkswagen","MBG":"Mercedes-Benz",
  "DTE":"Deutsche Telekom","MUV2":"Munich Re","ADS":"Adidas","BAYN":"Bayer",
  "AIR":"Airbus (XETRA)","IFX":"Infineon",
  // France
  "MC":"LVMH","TTE":"TotalEnergies","SAN":"Sanofi","BNP":"BNP Paribas",
  "OR":"L'Oréal","CS":"AXA","SU":"Schneider Electric","DG":"Vinci",
  "BN":"Danone","RMS":"Hermès","ML":"Michelin","RI":"Pernod Ricard",
  "RNO":"Renault","GLE":"Société Générale","CAP":"Capgemini","KER":"Kering",
  // HK
  "9988":"Alibaba","0700":"Tencent","9618":"JD.com","2318":"Ping An",
  "1299":"AIA","1810":"Xiaomi","3690":"Meituan","9999":"NetEase",
  "0941":"China Mobile","1398":"ICBC","3988":"Bank of China",
  "0001":"CK Hutchison","0011":"Hang Seng Bank",
  // India
  "RELIANCE":"Reliance Industries","TCS":"TCS","HDFCBANK":"HDFC Bank",
  "INFY":"Infosys","ICICIBANK":"ICICI Bank","KOTAKBANK":"Kotak Bank",
  "LT":"Larsen & Toubro","WIPRO":"Wipro","ONGC":"ONGC","SBIN":"SBI",
  "ITC":"ITC","MARUTI":"Maruti Suzuki","BAJFINANCE":"Bajaj Finance",
  "TITAN":"Titan","SUNPHARMA":"Sun Pharma","HINDUNILVR":"Hindustan Unilever",
  "ASIANPAINT":"Asian Paints","TECHM":"Tech Mahindra","HCLTECH":"HCL Tech",
  "TATAMOTORS":"Tata Motors","ADANIENT":"Adani Enterprises",
  "AXISBANK":"Axis Bank","DRREDDY":"Dr. Reddy's","CIPLA":"Cipla",
  // Japan
  "7203":"Toyota","6758":"Sony","9984":"SoftBank","6861":"Keyence",
  "9983":"Fast Retailing (Uniqlo)","8306":"Mitsubishi UFJ","7267":"Honda",
  "7974":"Nintendo","9432":"NTT","6501":"Hitachi",
  // Australia
  "BHP":"BHP Group","CBA":"Commonwealth Bank","CSL":"CSL",
  "ANZ":"ANZ Bank","WBC":"Westpac","NAB":"NAB","MQG":"Macquarie",
  "WES":"Wesfarmers","FMG":"Fortescue","WOW":"Woolworths","TLS":"Telstra",
  // Singapore
  "D05":"DBS Bank","O39":"OCBC","U11":"UOB","Z74":"SingTel","C6L":"Singapore Airlines",
  // ETFs
  "SPY":"SPDR S&P 500 ETF","QQQ":"Invesco QQQ (Nasdaq 100)",
  "IWM":"iShares Russell 2000","VOO":"Vanguard S&P 500 ETF",
  "VTI":"Vanguard Total Market","GLD":"SPDR Gold ETF",
  "TLT":"iShares 20yr Treasury","AGG":"iShares Core Bond ETF",
  "ARKK":"ARK Innovation ETF","EEM":"iShares Emerging Markets",
  // Futures
  "ES.F":"S&P 500 Futures","NQ.F":"Nasdaq 100 Futures","YM.F":"Dow Futures",
  "CL.F":"Crude Oil (WTI) Futures","BZ.F":"Brent Crude Futures",
  "GC.F":"Gold Futures","SI.F":"Silver Futures","HG.F":"Copper Futures",
  "NG.F":"Natural Gas Futures","ZW.F":"Wheat Futures","ZC.F":"Corn Futures",
  "ZB.F":"Treasury Bond Futures","ZN.F":"10-Year Note Futures",
  // Mutual Funds
  "119551":"HDFC Top 100 Fund","120503":"Axis Bluechip Fund",
  "120465":"Mirae Asset Large Cap","122639":"SBI Bluechip Fund",
  "100033":"HDFC Mid-Cap Fund","120828":"Parag Parikh Flexi Cap",
};