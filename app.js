const GROUPS = [
  {
    id: "market",
    label: "Market",
    features: [
      {
        id: "windows",
        title: "Ten-second windows",
        table: "symbol_windows",
        question: "Is this symbol busy, broad, and one-sided right now?",
        columns: [
          ["symbol", "Symbol"],
          ["ts", "Window", "time"],
          ["trade_count", "Trades", "num"],
          ["unique_users", "Customers", "num"],
          ["imbalance", "Imbalance", "num", "signed"]
        ]
      },
      {
        id: "forecast",
        title: "Count forecast",
        table: "trades_forecast",
        question: "Is the next window expected to print more trades than this one?",
        columns: [
          ["symbol", "Symbol"],
          ["ts", "Window", "time"],
          ["current_count", "Now", "num"],
          ["forecast_count", "Forecast", "num"],
          ["upper_bound", "Upper", "num"]
        ]
      },
      {
        id: "jumps",
        title: "Price jumps",
        table: "price_jumps",
        question: "Did the last print move the price, separate from the trade count?",
        columns: [
          ["symbol", "Symbol"],
          ["price", "Price", "num"],
          ["prev_price", "Previous", "num"],
          ["return_pct", "Return", "num", "signed"]
        ]
      },
      {
        id: "regions",
        title: "Region pressure",
        table: "region_pressure",
        question: "Which region is putting notional into the tape on this same clock?",
        columns: [
          ["regionid", "Region"],
          ["ts", "Window", "time"],
          ["trade_count", "Trades", "num"],
          ["unique_users", "Customers", "num"],
          ["unique_symbols", "Symbols", "num"]
        ]
      },
      {
        id: "horizon",
        title: "Minute horizon",
        table: "symbol_horizon",
        question: "Does the buy-versus-sell tilt still hold when the clock is a full minute?",
        columns: [
          ["symbol", "Symbol"],
          ["ts", "Window", "time"],
          ["trade_count", "Trades", "num"],
          ["unique_users", "Customers", "num"],
          ["imbalance", "Imbalance", "num", "signed"]
        ]
      }
    ],
    blurb: "What the tape is doing, whether the next window looks busier, which region is pushing it, and whether that tilt lasts a minute.",
    subgroups: [
      { label: "Tape", ids: ["windows", "jumps"] },
      { label: "Outlook", ids: ["forecast"] },
      { label: "Geography", ids: ["regions"] },
      { label: "Horizon", ids: ["horizon"] }
    ]
  },
  {
    id: "customers",
    label: "Customers",
    features: [
      {
        id: "profiles",
        title: "Profiles",
        table: "users_keyed",
        question: "What region and profile belong to this customer right now?",
        columns: [
          ["userid", "Customer"],
          ["regionid", "Region"],
          ["gender", "Profile"]
        ]
      },
      {
        id: "positions",
        title: "Positions",
        table: "positions",
        question: "What inventory does this customer still hold in this symbol?",
        columns: [
          ["userid", "Customer"],
          ["symbol", "Symbol"],
          ["net_quantity", "Net quantity", "num", "signed"],
          ["buy_count", "Buys", "num"],
          ["sell_count", "Sells", "num"]
        ]
      },
      {
        id: "sessions",
        title: "Sessions",
        table: "customer_sessions",
        question: "Did one customer spray several symbols inside a short burst?",
        columns: [
          ["userid", "Customer"],
          ["window_start", "Start", "time"],
          ["window_end", "End", "time"],
          ["trade_count", "Trades", "num"],
          ["symbols_touched", "Symbols", "num"]
        ]
      }
    ],
    blurb: "Who is trading, what they still hold, and whether one customer is spraying symbols.",
    subgroups: [
      { label: "Identity", ids: ["profiles"] },
      { label: "Book", ids: ["positions", "sessions"] }
    ]
  },
  {
    id: "reversals",
    label: "Reversals",
    features: [
      {
        id: "trips",
        title: "Round trips",
        table: "round_trips",
        question: "Did the same customer buy and then sell the same symbol within two minutes?",
        columns: [
          ["userid", "Customer"],
          ["symbol", "Symbol"],
          ["first_side", "First"],
          ["second_side", "Second"],
          ["first_price", "Buy", "num"],
          ["second_price", "Sell", "num"]
        ]
      },
      {
        id: "pnl",
        title: "Profit and loss",
        table: "reversal_economics",
        question: "Did that reversal make or lose money?",
        columns: [
          ["userid", "Customer"],
          ["symbol", "Symbol"],
          ["buy_price", "Buy", "num"],
          ["sell_price", "Sell", "num"],
          ["quantity", "Quantity", "num"],
          ["realized_pnl", "P&L", "num", "signed"]
        ]
      }
    ],
    blurb: "A buy followed by a sell in the same symbol, and whether that pair made money.",
    subgroups: [
      { label: "Matches", ids: ["trips"] },
      { label: "Economics", ids: ["pnl"] }
    ]
  },
  {
    id: "decisions",
    label: "Decisions",
    features: [
      {
        id: "journal",
        title: "Decision journal",
        table: "desk_decisions",
        question: "What should the desk do with this symbol in this window?",
        columns: [
          ["symbol", "Symbol"],
          ["ts", "Window", "time"],
          ["trade_count", "Trades", "num"],
          ["unique_users", "Customers", "num"],
          ["imbalance", "Imbalance", "num", "signed"],
          ["action", "Action", "action"]
        ]
      },
      {
        id: "alerts",
        title: "Alerts",
        table: "desk_alerts",
        question: "Which of those decisions is worth a person looking at?",
        columns: [
          ["symbol", "Symbol"],
          ["trade_count", "Trades", "num"],
          ["action", "Action", "action"]
        ]
      },
      {
        id: "shifts",
        title: "Action changes",
        table: "decision_shifts",
        question: "Did this symbol's action change from one window to the next?",
        columns: [
          ["symbol", "Symbol"],
          ["from_action", "From", "action"],
          ["to_action", "To", "action"],
          ["trade_count", "Trades", "num"],
          ["imbalance", "Imbalance", "num", "signed"]
        ]
      }
    ],
    blurb: "The action for each symbol window, the ones a person should look at, and the moment that action changes.",
    subgroups: [
      { label: "Record", ids: ["journal"] },
      { label: "Queue", ids: ["alerts"] },
      { label: "Changes", ids: ["shifts"] }
    ]
  }
];

const ACTIONS = ["HEATING", "SURGE", "IMBALANCED", "FLAG_REVIEW", "QUIET"];

function rowsOf(id) {
  const feature = (window.DESK_SNAPSHOT.features || {})[id];
  return feature && Array.isArray(feature.rows) ? feature.rows : [];
}

function num(value) {
  if (value === null || value === undefined || value === "" || value === "NULL") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function checks() {
  const windows = rowsOf("windows");
  const forecast = rowsOf("forecast");
  const jumps = rowsOf("jumps");
  const regions = rowsOf("regions");
  const profiles = rowsOf("profiles");
  const positions = rowsOf("positions");
  const sessions = rowsOf("sessions");
  const trips = rowsOf("trips");
  const pnl = rowsOf("pnl");
  const journal = rowsOf("journal");
  const alerts = rowsOf("alerts");
  const horizon = rowsOf("horizon");
  const shifts = rowsOf("shifts");

  const busy = windows.filter((row) => num(row.trade_count) >= 5);
  const imbalances = busy.map((row) => num(row.imbalance)).filter((n) => n !== null);
  const regionIds = new Set(regions.map((row) => row.regionid).filter(Boolean));
  const nets = positions.map((row) => num(row.net_quantity)).filter((n) => n !== null);
  const touched = sessions.map((row) => num(row.symbols_touched)).filter((n) => n !== null);
  const pnls = pnl.map((row) => num(row.realized_pnl)).filter((n) => n !== null);
  const journalActions = new Set(journal.map((row) => row.action));
  const alertActions = alerts.map((row) => row.action);
  const returns = jumps.map((row) => num(row.return_pct)).filter((n) => n !== null);

  return {
    windows: result(
      busy.length > 0 && imbalances.every((n) => n >= -1 && n <= 1),
      busy.length + " busy windows, imbalance stays inside -1 to 1"
    ),
    forecast: result(
      forecast.some((row) => num(row.forecast_count) !== null && num(row.current_count) !== null),
      "forecast sits beside the current window count"
    ),
    jumps: result(
      returns.length > 0,
      returns.length + " print-to-print returns"
    ),
    regions: result(
      regionIds.size >= 2,
      regionIds.size + " regions on the ten-second clock"
    ),
    profiles: result(
      profiles.some((row) => row.userid && row.regionid),
      profiles.length + " customer profiles with a region"
    ),
    positions: result(
      nets.some((n) => n > 0) && nets.some((n) => n < 0),
      "book has both a long and a short"
    ),
    sessions: result(
      touched.length > 0 && Math.min(...touched) < Math.max(...touched),
      touched.length ? "symbols touched range " + Math.min(...touched) + " to " + Math.max(...touched) : "no closed sessions"
    ),
    trips: result(
      trips.some((row) => row.userid && row.userid.indexOf("User_") === 0 && row.symbol && row.symbol.indexOf("User_") !== 0 && row.first_side === "BUY" && row.second_side === "SELL"),
      trips.length + " buy-then-sell matches for a customer and a symbol"
    ),
    pnl: result(
      pnls.some((n) => n > 0) && pnls.some((n) => n < 0) && pnl.some((row) => row.userid && row.userid.indexOf("User_") === 0 && row.symbol && row.symbol.indexOf("User_") !== 0),
      "reversals include both a gain and a loss"
    ),
    journal: result(
      ["HEATING", "SURGE", "IMBALANCED"].every((action) => journalActions.has(action)),
      "journal contains " + [...journalActions].filter((action) => ACTIONS.includes(action)).join(", ")
    ),
    alerts: result(
      alertActions.length > 0 && alertActions.every((action) => action && action !== "QUIET"),
      alertActions.length + " alerts, none quiet"
    ),
    horizon: result(
      horizon.some((row) => num(row.trade_count) >= 5) &&
        horizon.map((row) => num(row.imbalance)).filter((n) => n !== null).every((n) => n >= -1 && n <= 1) &&
        horizon.some((row) => windows.some((win) => win.symbol === row.symbol)),
      horizon.filter((row) => num(row.trade_count) >= 5).length + " busy minutes, imbalance stays inside -1 to 1"
    ),
    shifts: result(
      shifts.length > 0 && shifts.every((row) => row.from_action && row.to_action && row.from_action !== row.to_action),
      shifts.length + " action changes"
    )
  };
}

function result(ok, detail) {
  return { ok: Boolean(ok), detail: detail };
}

function featureById(id) {
  for (const group of GROUPS) {
    const feature = group.features.find((item) => item.id === id);
    if (feature) return { group, feature };
  }
  return null;
}

function clockText(value) {
  const match = String(value).match(/(\d{2}:\d{2}:\d{2})(\.\d+)?/);
  if (!match) return String(value);
  const fraction = match[2] && !/^\.0+$/.test(match[2]) ? match[2].slice(0, 4) : "";
  return match[1] + fraction;
}

function sampleDate(rows) {
  for (const row of rows) {
    for (const value of Object.values(row)) {
      const match = String(value).match(/^(\d{4}-\d{2}-\d{2}) /);
      if (match) return match[1];
    }
  }
  return "";
}

function displayRows(rows) {
  return rows.slice().sort((a, b) => {
    const primaryA = a.userid || a.regionid || a.symbol || "";
    const primaryB = b.userid || b.regionid || b.symbol || "";
    if (primaryA !== primaryB) return primaryA < primaryB ? -1 : 1;
    const secondaryA = a.userid ? (a.symbol || a.regionid || "") : "";
    const secondaryB = b.userid ? (b.symbol || b.regionid || "") : "";
    if (secondaryA !== secondaryB) return secondaryA < secondaryB ? -1 : 1;
    const timeA = a.ts || a.window_start || "";
    const timeB = b.ts || b.window_start || "";
    if (timeA !== timeB) return timeA < timeB ? -1 : 1;
    return 0;
  });
}

function sortValue(row, column) {
  const kind = column[3] || column[2];
  const value = row[column[0]];
  if (kind === "num" || kind === "signed") {
    const n = num(value);
    return n === null ? null : n;
  }
  if (value === null || value === undefined || value === "") return null;
  return String(value);
}

function orderedRows(rows, columns, state) {
  if (!state || state.index < 0) return displayRows(rows);
  const column = columns[state.index];
  const dir = state.dir || 1;
  return rows.slice().sort((a, b) => {
    const left = sortValue(a, column);
    const right = sortValue(b, column);
    if (left === null && right === null) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    if (typeof left === "number" && typeof right === "number") return (left - right) * dir;
    if (left < right) return -dir;
    if (left > right) return dir;
    return 0;
  });
}

const viewSort = {};

function viewState(id) {
  if (!viewSort[id]) viewSort[id] = { index: -1, dir: 1 };
  return viewSort[id];
}

function formatCell(value, kind) {
  if (value === null || value === undefined || value === "") return "";
  if (kind === "action") return value;
  if (kind === "time") return clockText(value);
  if (kind === "signed") {
    const n = num(value);
    if (n === null) return String(value);
    const abs = Math.abs(n);
    const body = abs >= 100 ? Math.round(abs).toLocaleString("en-US") : abs.toFixed(2);
    if (n > 0) return "+" + body;
    if (n < 0) return "-" + body;
    return abs >= 100 ? "0" : "0.00";
  }
  return String(value);
}

function cellClass(value, kind) {
  if (kind !== "signed") return "";
  const n = num(value);
  if (n === null || n === 0) return "";
  return n > 0 ? "up" : "down";
}

let pageReport = null;

function pageChecks() {
  if (!pageReport) pageReport = checks();
  return pageReport;
}

function statusOf(id) {
  const rows = rowsOf(id);
  const check = pageChecks()[id];
  if (!rows.length) return { label: "No sample", tone: "empty" };
  if (check.ok) return { label: "Passing", tone: "pass" };
  return { label: "Check failed", tone: "fail" };
}

function subgroupOf(group, featureId) {
  return (group.subgroups || []).find((sub) => sub.ids.includes(featureId)) || null;
}

function navButton(id, title) {
  const button = document.createElement("button");
  button.className = "nav-button";
  button.type = "button";
  button.dataset.page = id;
  button.textContent = title;
  button.addEventListener("click", () => show(id));
  return button;
}

function setFold(button, drawer, open) {
  button.setAttribute("aria-expanded", open ? "true" : "false");
  drawer.classList.toggle("open", open);
  drawer.toggleAttribute("inert", !open);
}

function makeFold(label, owns) {
  const block = document.createElement("div");
  block.className = "fold-block";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "fold";
  button.dataset.owns = owns.join(",");
  const name = document.createElement("span");
  name.className = "fold-name";
  name.textContent = label;
  const chev = document.createElement("span");
  chev.className = "chev";
  chev.setAttribute("aria-hidden", "true");
  button.append(name, chev);
  const drawer = document.createElement("div");
  drawer.className = "drawer";
  const inner = document.createElement("div");
  inner.className = "drawer-inner";
  drawer.appendChild(inner);
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    setFold(button, drawer, button.getAttribute("aria-expanded") !== "true");
  });
  setFold(button, drawer, false);
  block.append(button, drawer);
  return { block, inner, button, drawer };
}

function renderNav(activeId) {
  const rail = document.querySelector(".rail-groups");
  if (!rail.dataset.ready) {
    rail.appendChild(navButton("overview", "Overview"));
    const floor = makeFold("Floor", ["floor"]);
    const now = makeFold("Now", ["floor"]);
    now.block.classList.add("nested");
    now.inner.appendChild(navButton("floor", "Live floor"));
    floor.inner.appendChild(now.block);
    rail.appendChild(floor.block);
    for (const group of GROUPS) {
      const top = makeFold(group.label, group.features.map((feature) => feature.id));
      for (const sub of group.subgroups) {
        const nested = makeFold(sub.label, sub.ids);
        nested.block.classList.add("nested");
        for (const featureId of sub.ids) {
          const feature = group.features.find((item) => item.id === featureId);
          nested.inner.appendChild(navButton(feature.id, feature.title));
        }
        top.inner.appendChild(nested.block);
      }
      rail.appendChild(top.block);
    }
    rail.dataset.ready = "yes";
  }
  rail.querySelectorAll(".nav-button").forEach((button) => {
    if (button.dataset.page === activeId) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  rail.querySelectorAll(".fold").forEach((button) => {
    const owns = button.dataset.owns.split(",");
    const on = owns.includes(activeId);
    button.classList.toggle("branch", on);
    if (on) setFold(button, button.nextElementSibling, true);
  });
}

function renderOverview() {
  const main = document.querySelector(".main");
  main.innerHTML = "";
  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = "Overview";
  const title = document.createElement("h1");
  title.textContent = "Market, customers, reversals, and decisions";
  const question = document.createElement("p");
  question.className = "question";
  const captured = window.DESK_SNAPSHOT.capturedAt;
  question.textContent = captured
    ? "Checks below use the captured sample, " + captured + "."
    : "No captured sample is loaded. The live floor still follows the tape.";
  main.append(kicker, title, question);

  const grid = document.createElement("div");
  grid.className = "summary";
  const lead = document.createElement("section");
  lead.className = "card lead";
  const leadHeading = document.createElement("h2");
  leadHeading.textContent = "Floor";
  const leadCopy = document.createElement("p");
  leadCopy.className = "blurb";
  leadCopy.textContent = "The ten-second book on the live tape, and the stream action with the counts that justified it.";
  const leadLink = document.createElement("button");
  leadLink.className = "feature-link";
  leadLink.type = "button";
  const leadName = document.createElement("strong");
  leadName.textContent = "Live floor";
  leadLink.appendChild(leadName);
  leadLink.addEventListener("click", () => show("floor"));
  lead.append(leadHeading, leadCopy, leadLink);
  grid.appendChild(lead);
  for (const group of GROUPS) {
    const card = document.createElement("section");
    card.className = "card";
    const heading = document.createElement("h2");
    heading.textContent = group.label;
    const passing = group.features.filter((feature) => statusOf(feature.id).tone === "pass").length;
    const tally = document.createElement("p");
    tally.className = "tally";
    tally.textContent = passing + " of " + group.features.length + " checks passing";
    const blurb = document.createElement("p");
    blurb.className = "blurb";
    blurb.textContent = group.blurb;
    card.append(heading, tally, blurb);
    for (const sub of group.subgroups) {
      const nested = makeFold(sub.label, sub.ids);
      nested.block.classList.add("nested");
      for (const featureId of sub.ids) {
        const feature = group.features.find((item) => item.id === featureId);
        const button = document.createElement("button");
        button.className = "feature-link";
        button.type = "button";
        const name = document.createElement("strong");
        name.textContent = feature.title;
        const state = document.createElement("span");
        const status = statusOf(feature.id);
        state.className = "status " + status.tone;
        state.textContent = status.label;
        button.append(name, state);
        button.addEventListener("click", () => show(feature.id));
        nested.inner.appendChild(button);
      }
      card.appendChild(nested.block);
    }
    grid.appendChild(card);
  }
  main.appendChild(grid);
}

function renderFeature(id) {
  const found = featureById(id);
  const report = pageChecks()[id];
  const rows = rowsOf(id);
  const main = document.querySelector(".main");
  main.innerHTML = "";
  const sub = subgroupOf(found.group, id);
  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = found.group.label + " / " + sub.label;
  const title = document.createElement("h1");
  title.textContent = found.feature.title;
  const question = document.createElement("p");
  question.className = "question";
  question.textContent = found.feature.question;
  main.append(kicker, title, question);

  const sheet = document.createElement("section");
  sheet.className = "sheet";
  const meta = document.createElement("div");
  meta.className = "meta";
  const tableName = document.createElement("span");
  tableName.innerHTML = "Table <code></code>";
  tableName.querySelector("code").textContent = found.feature.table;
  const count = document.createElement("span");
  count.textContent = rows.length + (rows.length === 1 ? " row" : " rows");
  const when = sampleDate(rows);
  if (when) {
    const day = document.createElement("span");
    day.textContent = when;
    meta.append(tableName, day, count);
  } else {
    meta.append(tableName, count);
  }
  const check = document.createElement("p");
  check.className = "check " + (report.ok ? "pass" : "fail");
  check.textContent = (report.ok ? "Check passed. " : "Check failed. ") + report.detail;
  sheet.append(meta, check);

  if (!rows.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "This sample does not contain rows yet.";
    sheet.appendChild(empty);
  } else {
    const columns = found.feature.columns;
    const state = viewState(id);
    const menu = makeFold("Sort", []);
    menu.block.classList.add("sort-menu");
    function sortTitle() {
      menu.button.querySelector(".fold-name").textContent = state.index < 0
        ? "Sort · grouped"
        : "Sort · " + columns[state.index][1] + (state.dir > 0 ? "  ↑" : "  ↓");
    }
    const grouped = document.createElement("button");
    grouped.type = "button";
    grouped.className = "sort-option";
    grouped.textContent = "Grouped";
    menu.inner.appendChild(grouped);
    columns.forEach((column, index) => {
      const option = document.createElement("button");
      option.type = "button";
      option.className = "sort-option";
      option.textContent = column[1];
      option.addEventListener("click", () => choose(index));
      menu.inner.appendChild(option);
    });
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const tbody = document.createElement("tbody");
    function choose(index) {
      if (index < 0) {
        state.index = -1;
        state.dir = 1;
      } else if (state.index === index) {
        state.dir *= -1;
      } else {
        state.index = index;
        state.dir = 1;
      }
      setFold(menu.button, menu.drawer, false);
      paint();
    }
    grouped.addEventListener("click", () => choose(-1));
    columns.forEach((column, index) => {
      const th = document.createElement("th");
      if (column[2] === "num") th.className = "num";
      const control = document.createElement("button");
      control.type = "button";
      control.className = "sort-head";
      const name = document.createElement("span");
      name.textContent = column[1];
      const mark = document.createElement("span");
      mark.className = "sort-mark";
      control.append(name, mark);
      control.addEventListener("click", () => choose(index));
      th.appendChild(control);
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    function paint() {
      sortTitle();
      menu.inner.querySelectorAll(".sort-option").forEach((option, index) => {
        const selected = index === 0 ? state.index < 0 : state.index === index - 1;
        if (selected) option.setAttribute("aria-current", "true");
        else option.removeAttribute("aria-current");
      });
      headRow.querySelectorAll("th").forEach((th, index) => {
        const mark = th.querySelector(".sort-mark");
        const active = state.index === index;
        th.querySelector(".sort-head").classList.toggle("active", active);
        if (active) {
          th.setAttribute("aria-sort", state.dir > 0 ? "ascending" : "descending");
          mark.textContent = state.dir > 0 ? "↑" : "↓";
        } else {
          th.removeAttribute("aria-sort");
          mark.textContent = "";
        }
      });
      tbody.innerHTML = "";
      const banded = state.index < 0 || state.index === 0;
      let previous = "";
      for (const row of orderedRows(rows, columns, state)) {
        const tr = document.createElement("tr");
        const entity = row.userid || row.regionid || row.symbol || "";
        if (banded && entity !== previous) tr.className = "band";
        previous = entity;
        columns.forEach((column, index) => {
          const td = document.createElement("td");
          const kind = column[3] || column[2];
          const value = row[column[0]];
          const classes = [];
          if (index === 0) classes.push("entity");
          if (column[2] === "action") {
            const pill = document.createElement("span");
            pill.className = "pill " + String(value || "");
            pill.textContent = value || "";
            td.appendChild(pill);
          } else {
            td.textContent = formatCell(value, kind);
            if (column[2] === "num") classes.push("num");
            if (column[2] === "time") classes.push("time");
            const tone = cellClass(value, kind);
            if (tone) classes.push(tone);
          }
          td.className = classes.join(" ");
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }
      tbody.classList.remove("settling");
      void tbody.offsetWidth;
      tbody.classList.add("settling");
    }
    paint();
    table.append(thead, tbody);
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    wrap.appendChild(table);
    sheet.append(menu.block, wrap);
  }
  main.appendChild(sheet);
}

let floorSource = null;

function stopFloor() {
  if (floorSource) {
    floorSource.close();
    floorSource = null;
  }
}

function signed(value) {
  return formatCell(value, "signed");
}

function plain(value) {
  const n = num(value);
  if (n === null) return "";
  const abs = Math.abs(n);
  return abs >= 100 ? Math.round(abs).toLocaleString("en-US") : abs.toFixed(2);
}

function clock(ms) {
  if (ms == null) return "";
  const when = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return pad(when.getUTCHours()) + ":" + pad(when.getUTCMinutes()) + ":" + pad(when.getUTCSeconds());
}

function clockPair(count, imbalance) {
  if (count == null) return { text: "", cls: "num" };
  return {
    text: String(count) + "  " + signed(imbalance),
    cls: ["num", cellClass(imbalance, "signed")].filter(Boolean).join(" ")
  };
}

function renderFloor() {
  const main = document.querySelector(".main");
  main.innerHTML = "";
  const kicker = document.createElement("p");
  kicker.className = "kicker";
  kicker.textContent = "Floor / Now";
  const title = document.createElement("h1");
  title.textContent = "Live floor";
  const question = document.createElement("p");
  question.className = "question";
  question.textContent = "What did the stream just decide, which counts justified it, and what changed in the last ten seconds?";
  const sheet = document.createElement("section");
  sheet.className = "sheet";
  const meter = document.createElement("div");
  meter.className = "meter";
  const dot = document.createElement("span");
  dot.className = "live-dot";
  const liveLabel = document.createElement("strong");
  liveLabel.textContent = "Connecting";
  const liveItem = document.createElement("span");
  liveItem.append(dot, liveLabel);
  const ageValue = document.createElement("strong");
  const rateValue = document.createElement("strong");
  const printValue = document.createElement("strong");
  const streamValue = document.createElement("strong");
  function meterItem(label, valueNode) {
    const item = document.createElement("span");
    item.append(label + " ", valueNode);
    return item;
  }
  meter.append(
    liveItem,
    meterItem("Last print", ageValue),
    meterItem("Each second", rateValue),
    meterItem("Prints", printValue),
    meterItem("Stream rows", streamValue)
  );
  const boardWrap = document.createElement("div");
  boardWrap.className = "table-wrap";
  const tapeTitle = document.createElement("h2");
  tapeTitle.className = "tape-title";
  tapeTitle.textContent = "Prints";
  const tapeWrap = document.createElement("div");
  tapeWrap.className = "table-wrap";
  sheet.append(meter, boardWrap, tapeTitle, tapeWrap);
  main.append(kicker, title, question, sheet);

  const columns = ["Symbol", "Live read", "Trades", "Customers", "Imbalance", "Last", "Stream action", "Evidence", "Last change", "10s", "1 min"];
  const floorKeys = ["symbol", "liveRead", "liveCount", "liveCustomers", "liveImbalance", "lastPrice", "streamAction", "streamTs", "shiftTs", "windowCount", "horizonCount"];
  const numeric = { 2: true, 3: true, 4: true, 5: true, 9: true, 10: true };
  const floorSort = { index: 0, dir: 1 };
  let latest = null;
  const sortMenu = makeFold("Sort", []);
  sortMenu.block.classList.add("sort-menu");
  function floorTitle() {
    sortMenu.button.querySelector(".fold-name").textContent = "Sort · " + columns[floorSort.index] + (floorSort.dir > 0 ? "  ↑" : "  ↓");
  }
  columns.forEach((name, index) => {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "sort-option";
    option.textContent = name;
    option.addEventListener("click", () => chooseFloor(index));
    sortMenu.inner.appendChild(option);
  });
  sheet.insertBefore(sortMenu.block, boardWrap);
  function chooseFloor(index) {
    if (floorSort.index === index) floorSort.dir *= -1;
    else {
      floorSort.index = index;
      floorSort.dir = 1;
    }
    setFold(sortMenu.button, sortMenu.drawer, false);
    if (latest) paint(latest, false);
  }
  function sortFloor(rows) {
    const key = floorKeys[floorSort.index];
    const dir = floorSort.dir;
    const numericKey = numeric[floorSort.index] || key === "streamTs" || key === "shiftTs";
    return rows.slice().sort((a, b) => {
      const left = a[key];
      const right = b[key];
      if (numericKey) {
        const na = num(left);
        const nb = num(right);
        if (na === null && nb === null) return 0;
        if (na === null) return 1;
        if (nb === null) return -1;
        return (na - nb) * dir;
      }
      const sa = String(left || "");
      const sb = String(right || "");
      if (sa < sb) return -dir;
      if (sa > sb) return dir;
      return 0;
    });
  }
  let signature = null;
  let tapeSignature = "";
  const slots = {};

  function setText(node, text, cls) {
    if (node.textContent !== text) node.textContent = text;
    if (cls !== undefined && node.className !== cls) node.className = cls;
  }

  function paintRow(row) {
    const slot = slots[row.symbol];
    const last = row.lastSide ? row.lastSide + " " + plain(row.lastPrice) : "";
    const ten = clockPair(row.windowCount, row.windowImbalance);
    const minute = clockPair(row.horizonCount, row.horizonImbalance);
    const change = row.shiftFrom ? row.shiftFrom + " → " + row.shiftTo + (clock(row.shiftTs) ? "  " + clock(row.shiftTs) : "") : "";
    const why = row.streamWhy ? (clock(row.streamTs) ? clock(row.streamTs) + "  " : "") + row.streamWhy : "";
    setText(slot.live, row.liveRead || "", "pill " + (row.liveRead || ""));
    setText(slot.trades, String(row.liveCount));
    setText(slot.customers, String(row.liveCustomers));
    setText(slot.imbalance, signed(row.liveImbalance), ["num", cellClass(row.liveImbalance, "signed")].filter(Boolean).join(" "));
    setText(slot.last, last);
    setText(slot.ten, ten.text, ten.cls);
    setText(slot.action, row.streamAction || "", "pill " + (row.streamAction || ""));
    setText(slot.why, why);
    setText(slot.change, change);
    setText(slot.minute, minute.text, minute.cls);
  }

  function buildBoard(symbols) {
    boardWrap.innerHTML = "";
    Object.keys(slots).forEach((key) => delete slots[key]);
    const table = document.createElement("table");
    table.className = "board";
    const thead = document.createElement("thead");
    const groups = document.createElement("tr");
    const symbolHead = document.createElement("th");
    symbolHead.rowSpan = 2;
    groups.appendChild(symbolHead);
    [["Tape", 5], ["Decision", 3], ["Closed windows", 2]].forEach((group) => {
      const th = document.createElement("th");
      th.colSpan = group[1];
      th.className = "band-label";
      th.textContent = group[0];
      groups.appendChild(th);
    });
    function sortCell(th, index) {
      th.innerHTML = "";
      if (numeric[index]) th.classList.add("num");
      const control = document.createElement("button");
      control.type = "button";
      control.className = "sort-head";
      const name = document.createElement("span");
      name.textContent = columns[index];
      const mark = document.createElement("span");
      mark.className = "sort-mark";
      control.append(name, mark);
      control.addEventListener("click", () => chooseFloor(index));
      th.appendChild(control);
      const active = floorSort.index === index;
      control.classList.toggle("active", active);
      if (active) {
        th.setAttribute("aria-sort", floorSort.dir > 0 ? "ascending" : "descending");
        mark.textContent = floorSort.dir > 0 ? "↑" : "↓";
      }
    }
    sortCell(symbolHead, 0);
    const head = document.createElement("tr");
    columns.forEach((name, index) => {
      if (index === 0) return;
      const th = document.createElement("th");
      if (numeric[index]) th.className = "num";
      sortCell(th, index);
      head.appendChild(th);
    });
    thead.append(groups, head);
    const tbody = document.createElement("tbody");
    if (!symbols.length) {
      const tr = document.createElement("tr");
      const td = document.createElement("td");
      td.colSpan = columns.length;
      td.textContent = "Waiting for the next print.";
      tr.appendChild(td);
      tbody.appendChild(tr);
    }
    symbols.forEach((row) => {
      const tr = document.createElement("tr");
      const symbol = document.createElement("td");
      symbol.textContent = row.symbol;
      const liveCell = document.createElement("td");
      const live = document.createElement("span");
      liveCell.appendChild(live);
      const trades = document.createElement("td");
      trades.className = "num";
      const customers = document.createElement("td");
      customers.className = "num";
      const imbalance = document.createElement("td");
      const last = document.createElement("td");
      last.className = "num";
      const ten = document.createElement("td");
      const actionCell = document.createElement("td");
      const action = document.createElement("span");
      actionCell.appendChild(action);
      const why = document.createElement("td");
      why.className = "evidence";
      const change = document.createElement("td");
      change.className = "evidence";
      const minute = document.createElement("td");
      tr.append(symbol, liveCell, trades, customers, imbalance, last, actionCell, why, change, ten, minute);
      tbody.appendChild(tr);
      slots[row.symbol] = { live, trades, customers, imbalance, last, ten, action, why, change, minute };
    });
    table.append(thead, tbody);
    boardWrap.appendChild(table);
    symbols.forEach(paintRow);
  }

  function paintTape(items) {
    const shown = items.slice(0, 12);
    const next = shown.map((item) => item.kind + "|" + item.symbol + "|" + item.text).join("\n");
    if (next === tapeSignature) return;
    tapeSignature = next;
    const log = document.createElement("table");
    log.className = "tape";
    const head = document.createElement("thead");
    const headRow = document.createElement("tr");
    ["Kind", "Symbol", "Detail"].forEach((name) => {
      const th = document.createElement("th");
      th.textContent = name;
      headRow.appendChild(th);
    });
    head.appendChild(headRow);
    const body = document.createElement("tbody");
    items.slice(0, 12).forEach((item) => {
      const tr = document.createElement("tr");
      const kind = document.createElement("td");
      kind.className = "kind";
      kind.textContent = item.kind;
      const symbol = document.createElement("td");
      symbol.textContent = item.symbol;
      const text = document.createElement("td");
      text.textContent = item.text;
      tr.append(kind, symbol, text);
      body.appendChild(tr);
    });
    log.append(head, body);
    tapeWrap.innerHTML = "";
    tapeWrap.appendChild(log);
  }

  function paint(state, keepBoard) {
    const held = !state.connected && state.status === "Captured";
    const age = state.ageMs == null ? "waiting" : state.ageMs < 1000 ? state.ageMs + " ms" : Math.round(state.ageMs / 1000) + " s";
    dot.className = state.connected ? "live-dot" : (held ? "live-dot held" : "live-dot down");
    liveLabel.textContent = state.connected ? "Live" : (state.status || "Not connected");
    ageValue.textContent = held ? "at capture" : age;
    rateValue.textContent = String(state.perSecond);
    printValue.textContent = String(state.trades);
    streamValue.textContent = String(state.flink);
    latest = state;
    floorTitle();
    sortMenu.inner.querySelectorAll(".sort-option").forEach((option, index) => {
      if (floorSort.index === index) option.setAttribute("aria-current", "true");
      else option.removeAttribute("aria-current");
    });
    const symbols = sortFloor(state.symbols || []);
    const next = floorSort.index + ":" + floorSort.dir + ":" + symbols.map((row) => row.symbol).join("|");
    if (!keepBoard || next !== signature) {
      buildBoard(symbols);
      signature = next;
    } else symbols.forEach(paintRow);
    if (!keepBoard || state.tape) paintTape(state.tape || []);
  }

  let liveSeen = false;
  const captured = typeof window !== "undefined" ? window.DESK_FLOOR : null;
  if (captured && captured.symbols && captured.symbols.length) {
    paint(captured, false);
  } else {
    paint({ connected: false, status: "Connecting", perSecond: 0, trades: 0, flink: 0, symbols: [], tape: [] }, false);
  }
  floorSource = new EventSource("/api/stream");
  floorSource.onmessage = function (event) {
    liveSeen = true;
    paint(JSON.parse(event.data), true);
  };
  floorSource.onerror = function () {
    if (liveSeen) {
      dot.className = "live-dot down";
      liveLabel.textContent = "Not connected";
      return;
    }
    if (captured && captured.symbols && captured.symbols.length) {
      dot.className = "live-dot held";
      liveLabel.textContent = "Captured";
      return;
    }
    dot.className = "live-dot down";
    liveLabel.textContent = "Not connected";
  };
}

function show(id) {
  stopFloor();
  pageReport = null;
  document.querySelector(".main").classList.toggle("wide", id === "floor");
  renderNav(id);
  if (id === "overview") renderOverview();
  else if (id === "floor") renderFloor();
  else renderFeature(id);
  history.replaceState(null, "", "#" + id);
}

function routeFromHash() {
  const next = location.hash.replace("#", "") || "overview";
  show(next === "floor" || featureById(next) ? next : "overview");
}

if (typeof document !== "undefined") {
  window.addEventListener("hashchange", routeFromHash);
  routeFromHash();
}

if (typeof module !== "undefined") {
  module.exports = { checks, GROUPS };
}
