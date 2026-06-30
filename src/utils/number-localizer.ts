const persianNumbers = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
const englishNumbers = ["0","1","2","3","4","5","6","7","8","9"];

export function localizeNumber(value: string | number, language: string) {
  const str = String(value);

  if (language === "fa") {
    return str.replace(/\d/g, (d) => persianNumbers[Number(d)]);
  }

  return str.replace(/[۰-۹]/g, (d) => englishNumbers[persianNumbers.indexOf(d)]);
}
