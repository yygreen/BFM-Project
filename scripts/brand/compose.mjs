import { readFileSync, writeFileSync } from "fs";
const wm = JSON.parse(readFileSync("wordmark.json", "utf8"));
const f2 = (n) => +n.toFixed(2);

// arc-length machinery: place things at true distances along the curve,
// so spacing survives any tweak to the control points
function curveTools(P) {
  const bez = (t) => {
    const u = 1 - t;
    return {
      x: u*u*u*P[0].x + 3*u*u*t*P[1].x + 3*u*t*t*P[2].x + t*t*t*P[3].x,
      y: u*u*u*P[0].y + 3*u*u*t*P[1].y + 3*u*t*t*P[2].y + t*t*t*P[3].y,
    };
  };
  const N = 400, pts = [], len = [0];
  for (let i = 0; i <= N; i++) pts.push(bez(i / N));
  for (let i = 1; i <= N; i++) len.push(len[i-1] + Math.hypot(pts[i].x-pts[i-1].x, pts[i].y-pts[i-1].y));
  const total = len[N];
  const at = (s) => { // point at arc distance s
    const target = Math.max(0, Math.min(total, s));
    let i = len.findIndex((l) => l >= target);
    if (i <= 0) i = 1;
    const k = (target - len[i-1]) / (len[i] - len[i-1]);
    return { x: pts[i-1].x + (pts[i].x-pts[i-1].x)*k, y: pts[i-1].y + (pts[i].y-pts[i-1].y)*k,
             t: (i-1+k)/N };
  };
  const split = (t) => {
    const l = (a,b,k)=>({x:a.x+(b.x-a.x)*k, y:a.y+(b.y-a.y)*k});
    const A=l(P[0],P[1],t), B=l(P[1],P[2],t), C=l(P[2],P[3],t);
    const D=l(A,B,t), E=l(B,C,t), F=l(D,E,t);
    return [P[0],A,D,F];
  };
  const endTangent = () => {
    const t = { x: P[3].x-P[2].x, y: P[3].y-P[2].y }, L = Math.hypot(t.x,t.y);
    return { x: t.x/L, y: t.y/L };
  };
  return { total, at, split, endTangent };
}

// ---- lockup mark ----------------------------------------------------------
// gentler entry than v1 (no flat hockey-stick foot), steady climb
const P = [ {x:3,y:35}, {x:14,y:34}, {x:30,y:27}, {x:41,y:11} ];
const C = curveTools(P);
// solid route: first 58% of the arc
const S = C.split(C.at(C.total*0.58).t).map(p=>({x:f2(p.x),y:f2(p.y)}));
const solid = `M${S[0].x} ${S[0].y}C${S[1].x} ${S[1].y} ${S[2].x} ${S[2].y} ${S[3].x} ${S[3].y}`;
// three dots at clear arc distances — the site's tether, literally
const dots = [0.70, 0.82, 0.94].map((k)=>C.at(C.total*k)).map((p)=>({cx:f2(p.x),cy:f2(p.y)}));
// ring past the end on the tangent
const u = C.endTangent();
const ring = { x: f2(P[3].x + u.x*8), y: f2(P[3].y + u.y*8) };

const mark = (route, coral) => `
  <g fill="none" stroke-linecap="round">
    <path d="${solid}" stroke="${route}" stroke-width="3.4"/>
  </g>
  <g fill="${coral}">
    ${dots.map((d)=>`<circle cx="${d.cx}" cy="${d.cy}" r="1.9"/>`).join("\n    ")}
  </g>
  <circle cx="${ring.x}" cy="${ring.y}" r="4" fill="none" stroke="${route}" stroke-width="3"/>`;

const word = (ink) => `
  <g fill="${ink}">
    <path d="${wm.buy}"/>
    <path d="${wm.flight}"/>
    <path d="${wm.miles}"/>
  </g>`;

const W = Math.ceil(wm.end + 4);
const svg = (inner) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} 44" role="img" aria-label="buyflightmiles">${inner}\n</svg>\n`;
writeFileSync("logo.svg", svg(mark("#2540FF","#FF5C3A") + word("#10122B")));
writeFileSync("logo-light.svg", svg(mark("#8FA0FF","#FF6B4A") + word("#FFFFFF")));

// ---- favicon --------------------------------------------------------------
// same grammar, recomposed for a square: balanced diagonal, ring sized as a
// waypoint rather than an eye, two dots (three merge at 16px)
const FP = [ {x:10,y:38}, {x:18,y:37}, {x:26,y:32}, {x:32,y:23} ];
const FC = curveTools(FP);
const FS = FC.split(FC.at(FC.total*0.60).t).map(p=>({x:f2(p.x),y:f2(p.y)}));
const fsolid = `M${FS[0].x} ${FS[0].y}C${FS[1].x} ${FS[1].y} ${FS[2].x} ${FS[2].y} ${FS[3].x} ${FS[3].y}`;
const fdots = [0.74, 1.0].map((k)=>FC.at(FC.total*k)).map((p)=>({cx:f2(p.x),cy:f2(p.y)}));
const fu = FC.endTangent();
const fring = { x: f2(FP[3].x + fu.x*9.5), y: f2(FP[3].y + fu.y*9.5) };
writeFileSync("favicon.svg", `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" rx="11" fill="#2540FF"/>
  <path d="${fsolid}" fill="none" stroke="#FFFFFF" stroke-width="4.2" stroke-linecap="round"/>
  <g fill="#FF6B4A">
    ${fdots.map((d)=>`<circle cx="${d.cx}" cy="${d.cy}" r="2.3"/>`).join("\n    ")}
  </g>
  <circle cx="${fring.x}" cy="${fring.y}" r="3.8" fill="none" stroke="#FFFFFF" stroke-width="3.2"/>
</svg>\n`);
console.log("ring:", ring, "| favicon ring:", fring, "| dots:", dots.length);
