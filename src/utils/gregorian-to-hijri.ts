// Gregorian -> Hijri
export function gregorianToHijri(gy: number, gm: number, gd: number) {
  let jd =
    Math.floor((1461 * (gy + 4800 + Math.floor((gm - 14) / 12))) / 4) +
    Math.floor((367 * (gm - 2 - 12 * Math.floor((gm - 14) / 12))) / 12) -
    Math.floor(
      (3 *
        Math.floor((gy + 4900 + Math.floor((gm - 14) / 12)) / 100)) /
        4
    ) +
    gd -
    32075;

  let l = jd - 1948440 + 10632;
  let n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;

  let j =
    Math.floor((10985 - l) / 5316) *
      Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) *
      Math.floor((43 * l) / 15238);

  l =
    l -
    Math.floor((30 - j) / 15) *
      Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) *
      Math.floor((15238 * j) / 43) +
    29;

  const m = Math.floor((24 * l) / 709);
  const d = l - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  return {
    year: y,
    month: m,
    day: d,
  };
}



// Hijri -> Gregorian
export function hijriToGregorian(hy:number,hm:number,hd:number){

  const jd =
    Math.floor((11 * hy + 3) / 30) +
    354 * hy +
    30 * hm -
    Math.floor((hm - 1) / 2) +
    hd +
    1948440 -
    385;

  let l = jd + 68569
  let n = Math.floor((4 * l) / 146097)
  l = l - Math.floor((146097 * n + 3) / 4)

  let i = Math.floor((4000 * (l + 1)) / 1461001)
  l = l - Math.floor((1461 * i) / 4) + 31

  let j = Math.floor((80 * l) / 2447)
  let gd = l - Math.floor((2447 * j) / 80)

  l = Math.floor(j / 11)
  let gm = j + 2 - 12 * l
  let gy = 100 * (n - 49) + i + l

  return {
    gy,
    gm,
    gd
  }
}
