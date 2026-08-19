// Build the wave so its mathematical extrema land exactly on the markers.
//
// The markers are fixed at local x=44 with their current y. Between two
// consecutive extrema the curve is one cubic with HORIZONTAL tangents at both
// ends, so each marker is a true turning point (slope exactly 0) with no flat
// section either side.
//
// For such a segment with amplitude A and handle h, the curvature at both ends
// is (2/3)·A/h². Choosing each segment's handle so that value matches its
// neighbour's makes the curvature continuous through every marker as well, not
// just the tangent.
const PITCH = 257.142857;          // 336px column + 24px gutter at scale 1.4
const g = (panel, x) => panel * PITCH + x;

// markers, exactly where they sit today
const m1 = [g(0, 44), 29.8];
const m2 = [g(1, 44), 14];
const m3 = [g(2, 44), 28];
const tip = [g(2, 199), 7];
const EXIT = 33.8 * Math.PI / 180;  // the logo's departure angle

// segment 1 sets the reference curvature; the others are matched to it
const h1 = (m2[0] - m1[0]) / 3;
const A1 = Math.abs(m2[1] - m1[1]);
const K = (2 / 3) * A1 / (h1 * h1);          // target curvature at every marker

const A2 = Math.abs(m3[1] - m2[1]);
const h2 = Math.sqrt((2 / 3) * A2 / K);

// lead-in: descends into m1 so the marker is a genuine minimum, handle capped
// at half its span, amplitude then fixed by the curvature match
const span0 = m1[0] - -10;
const h0 = span0 / 2;
const A0 = K * h0 * h0 / (2 / 3);
const start = [-10, m1[1] - A0];

// departure: horizontal at m3, exits at the logo angle
const d3 = 30;
const P2_3 = [tip[0] - d3 * Math.cos(EXIT), tip[1] + d3 * Math.sin(EXIT)];
const h3 = Math.sqrt((2 / 3) * Math.abs(P2_3[1] - m3[1]) / K);

const sym = (P0, P3, h) => [P0, [P0[0] + h, P0[1]], [P3[0] - h, P3[1]], P3];
const segs = [
  sym(start, m1, h0),
  sym(m1, m2, h1),
  sym(m2, m3, h2),
  [m3, [m3[0] + h3, m3[1]], P2_3, tip],
];

// ---- bezier helpers -------------------------------------------------------
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
function split(P, t) {
  const a = lerp(P[0], P[1], t), b = lerp(P[1], P[2], t), c = lerp(P[2], P[3], t);
  const d = lerp(a, b, t), e = lerp(b, c, t), f = lerp(d, e, t);
  return [[P[0], a, d, f], [f, e, c, P[3]]];
}
const at = (P, t) => {
  const u = 1 - t;
  return [u*u*u*P[0][0] + 3*u*u*t*P[1][0] + 3*u*t*t*P[2][0] + t*t*t*P[3][0],
          u*u*u*P[0][1] + 3*u*u*t*P[1][1] + 3*u*t*t*P[2][1] + t*t*t*P[3][1]];
};
const der = (P, t) => {
  const u = 1 - t;
  return [3*u*u*(P[1][0]-P[0][0]) + 6*u*t*(P[2][0]-P[1][0]) + 3*t*t*(P[3][0]-P[2][0]),
          3*u*u*(P[1][1]-P[0][1]) + 6*u*t*(P[2][1]-P[1][1]) + 3*t*t*(P[3][1]-P[2][1])];
};
const tAtX = (P, X) => { let lo=0, hi=1; for (let i=0;i<80;i++){const m=(lo+hi)/2; at(P,m)[0]<X?lo=m:hi=m;} return (lo+hi)/2; };

// ---- carve the wave into the three panels ---------------------------------
const ranges = [[g(0,-10), g(0,250)], [g(1,-10), g(1,250)], [g(2,-10), g(2,199)]];
const names = ['choose','pay','fly'];
const f = (n) => +n.toFixed(2);

ranges.forEach(([lo, hi], i) => {
  const parts = [];
  for (const S of segs) {
    const x0 = S[0][0], x3 = S[3][0];
    if (x3 <= lo + 1e-9 || x0 >= hi - 1e-9) continue;   // outside this panel
    let C = S;
    if (x0 < lo) C = split(C, tAtX(C, lo))[1];
    if (x3 > hi) C = split(C, tAtX(C, hi))[0];
    parts.push(C);
  }
  const off = i * PITCH;
  const P = (p) => `${f(p[0] - off)} ${f(p[1])}`;
  let d = `M${P(parts[0][0])}`;
  for (const C of parts) d += `C${P(C[1])} ${P(C[2])} ${P(C[3])}`;
  console.log(names[i] + ':');
  console.log('  ' + d);
});

// ---- verification ---------------------------------------------------------
console.log('\nmarker checks (slope must be exactly 0, curvature must match):');
const curvAt = (P, t) => {
  const d1 = der(P, t);
  const u = 1 - t;
  const d2 = [6*u*(P[2][0]-2*P[1][0]+P[0][0]) + 6*t*(P[3][0]-2*P[2][0]+P[1][0]),
              6*u*(P[2][1]-2*P[1][1]+P[0][1]) + 6*t*(P[3][1]-2*P[2][1]+P[1][1])];
  return Math.abs(d1[0]*d2[1] - d1[1]*d2[0]) / Math.pow(Math.hypot(...d1), 3);
};
[[0,1,'m1 (trough)'],[1,2,'m2 (peak)'],[2,3,'m3 (trough)']].forEach(([a,b,label]) => {
  const inSlope = der(segs[a],1), outSlope = der(segs[b],0);
  console.log(`  ${label}: slope in ${(inSlope[1]/inSlope[0]).toExponential(1)}, out ${(outSlope[1]/outSlope[0]).toExponential(1)}` +
    `  |  curvature in ${curvAt(segs[a],1).toFixed(6)}, out ${curvAt(segs[b],0).toFixed(6)}`);
});
console.log('\nhandles: h0 ' + f(h0) + '  h1 ' + f(h1) + '  h2 ' + f(h2) + '  h3 ' + f(h3));
console.log('lead-in starts at y ' + f(start[1]) + ' and descends ' + f(A0) + ' into the first trough');
