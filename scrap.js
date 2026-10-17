// Lets the CSS know JavaScript is running, so content is only hidden for the
// slide-in effect when something is there to reveal it again.
document.documentElement.classList.add("js");

// Sections slide in as they come into view. Anything inside them that animates
// (count-ups, drawn diagrams, chart bars) starts at the same moment.
(function () {
  let pending = [...document.querySelectorAll(".reveal")];
  if (!pending.length) return;

  function check() {
    const line = window.innerHeight * 0.9;
    pending = pending.filter((el) => {
      if (el.getBoundingClientRect().top > line) return true;
      el.classList.add("is-visible");
      el.dispatchEvent(new CustomEvent("revealed", { bubbles: true }));
      return false;
    });
  }

  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; check(); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  check();
})();

// Numbers count up the first time their section appears.
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("[data-to]").forEach((el) => {
    const target = parseInt(el.dataset.to, 10);
    const section = el.closest(".reveal");
    if (reduce || !section) return;
    el.textContent = "0";
    let done = false;
    function run() {
      if (done) return;
      done = true;
      const start = performance.now();
      function step(now) {
        const t = Math.min(1, (now - start) / 1400);
        el.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))).toLocaleString("en-US");
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    section.addEventListener("revealed", run);
    if (section.classList.contains("is-visible")) run();
  });
})();

// Journey map: a dashed route through the four stops, with the pen airplane
// flying along it as the map scrolls past.
(function () {
  const map = document.querySelector(".map");
  const svg = document.querySelector(".route-line");
  const path = document.getElementById("route-path");
  const plane = document.querySelector(".map .plane");
  if (!map || !svg || !path || !plane) return;
  const stacked = window.matchMedia("(max-width: 900px)");
  let length = 0;

  function centres() {
    const o = map.getBoundingClientRect();
    return [...map.querySelectorAll(".stop .badge")].map((p) => {
      const b = p.getBoundingClientRect();
      return { x: b.left - o.left + b.width / 2, y: b.top - o.top + b.height / 2 };
    });
  }

  // A smooth curve through the points (Catmull-Rom written as Bezier segments).
  function smooth(pts) {
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      d += ` C ${p1.x + (p2.x - p0.x) / 6} ${p1.y + (p2.y - p0.y) / 6}, ${p2.x - (p3.x - p1.x) / 6} ${p2.y - (p3.y - p1.y) / 6}, ${p2.x} ${p2.y}`;
    }
    return d;
  }

  function draw() {
    const w = map.offsetWidth, h = map.offsetHeight;
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const s = centres();
    if (s.length < 2) return;
    const pts = [];
    if (stacked.matches) {
      pts.push({ x: s[0].x, y: s[0].y - 70 });
      s.forEach((p, i) => {
        pts.push(p);
        if (s[i + 1]) pts.push({ x: i % 2 ? w * 0.1 : w * 0.9, y: (p.y + s[i + 1].y) / 2 + 60 });
      });
    } else {
      pts.push({ x: Math.max(10, s[0].x - 120), y: s[0].y - 120 });
      s.forEach((p, i) => {
        pts.push(p);
        if (s[i + 1]) pts.push({ x: (p.x + s[i + 1].x) / 2, y: (p.y + s[i + 1].y) / 2 });
      });
      pts.push({ x: Math.min(w - 10, s[s.length - 1].x + 160), y: Math.max(20, s[s.length - 1].y - 60) });
    }
    path.setAttribute("d", smooth(pts));
    length = path.getTotalLength();
    place();
  }

  function place() {
    if (!length) return;
    const box = map.getBoundingClientRect();
    const progress = Math.min(1, Math.max(0, (window.innerHeight * 0.75 - box.top) / (box.height * 0.95)));
    const at = path.getPointAtLength(progress * length);
    const a = path.getPointAtLength(Math.min(length, progress * length + 3));
    const b = path.getPointAtLength(Math.max(0, progress * length - 3));
    const angle = Math.atan2(a.y - b.y, a.x - b.x) * 180 / Math.PI;
    plane.style.transform = `translate(${at.x - 24}px, ${at.y - 24}px) rotate(${angle}deg)`;
  }

  let queued = false;
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; place(); });
  }, { passive: true });
  window.addEventListener("resize", draw);
  window.addEventListener("load", draw);
  if (document.fonts) document.fonts.ready.then(draw);
  draw();
})();

// Stop pages: the pen airplane flies across the top of the screen as you read.
(function () {
  const flight = document.querySelector(".flight");
  const plane = document.querySelector(".flight-plane");
  if (!flight || !plane) return;
  function place() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    const travel = flight.offsetWidth - 36;
    plane.style.transform = `translate(${p * travel}px, ${Math.sin(p * Math.PI * 6) * 3}px)`;
  }
  let queued = false;
  window.addEventListener("scroll", () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; place(); });
  }, { passive: true });
  window.addEventListener("resize", place);
  place();
})();

// FeedMatters chart: bars grow in, and the switch re-scores all five platforms
// with equal weights or with my weights. The order never changes.
(function () {
  const chart = document.querySelector(".fit-chart");
  if (!chart) return;
  const rows = [...chart.querySelectorAll(".bars li")];
  const buttons = [...chart.querySelectorAll(".toggle button")];
  const note = chart.querySelector(".hand-note");
  let mode = "weighted";
  let drawn = false;

  function render() {
    rows.forEach((row) => {
      const value = parseFloat(row.dataset[mode]);
      row.querySelector(".bar").style.width = value * 10 + "%";
      row.querySelector(".val").textContent = value.toFixed(2);
    });
  }
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      mode = button.dataset.mode;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
      note.textContent = mode === "equal"
        ? "equal weights, and Indie Hackers still wins. same order!"
        : "my weights: paying customers count most.";
      if (drawn) render();
    });
  });
  function draw() { if (!drawn) { drawn = true; render(); } }
  chart.addEventListener("revealed", draw);
  if (chart.classList.contains("is-visible") || !chart.classList.contains("reveal")) draw();
})();
