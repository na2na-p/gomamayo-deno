import { MeCab } from "https://deno.land/x/deno_mecab@v1.1.1/mod.ts";
// assets/vowel_define.jsonを読み込む
const vowelDefine = await Deno.readTextFile("./assets/vowel_define.json");
const mecab = new MeCab(["mecab"]);

type gomamayoResult = {
  isGomamayo: boolean;
  combo: number; // 実装はまだ先
  detail: gomamayoDetail[];
};

type gomamayoDetail = {
  surface: string; // 該当の2語を入れる
  dimension: number; // n次ゴママヨのn
};

async function parse(inputString: string) {
  const rawResult = await mecab.parse(inputString);

  // rawResult.pronunciationがundefinedの場合、rawResult.pronunciation = rawResult.surfaceとなるようにする
  const parseResult = rawResult.map((raw) => {
    if (raw.pronunciation === undefined) {
      raw.pronunciation = raw.surface;
    }
    if (raw.reading === undefined) {
      raw.reading = raw.surface;
    }
    return raw;
  });
  return parseResult;
}

function prolongedSoundMarkVowelize(rawReading: string) {
  const vowelDefineJSON = JSON.parse(vowelDefine);
  // readingに長音が含まれている場合はすべてカタカナに変換する
  let returnReading = "";
  rawReading.replace(/[ぁ-ゖ]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 0x60);
  });
  for (let i = 0; i < rawReading.length; i++) {
    const prev = rawReading[i - 1];
    const current = rawReading[i];
    returnReading += (current === "ー") ? vowelDefineJSON[prev] : current;
  }
  return returnReading;
}

async function analyse(inputString: string) {
  const gomamayoResult: gomamayoResult = {
    isGomamayo: false,
    combo: 0,
    detail: [],
  };
  const rawParseResult = await parse(inputString);

  // rawParseResult[i].readingに「ー」が含まれていたらprolongedSoundMarkVowelizeを実行し、それに置き換える
  rawParseResult.map((raw) => {
    if (typeof raw.reading !== "undefined") {
      if (raw.reading.includes("ー")) {
        raw.reading = prolongedSoundMarkVowelize(raw.reading);
      }
    }
    return raw;
  });

  for (let i = 0; i < rawParseResult.length - 1; i++) {
    const first = rawParseResult[i];
    const second = rawParseResult[i + 1];
    if (
      first.feature !== "名詞" && first.feature !== "数詞" ||
      second.surface === first.surface
    ) {
      continue;
    }
    // first.readingを後ろから1文字ずつ見ていく
    // 同時に、second.readingを先頭から1文字ずつ見ていく
    // 一致したら、gomamayoResultにpushする
    if (first.reading && second.reading) {
      // firstとsecondのreading.lengthのうち、短い方を
      const minLength = Math.min(first.reading.length, second.reading.length);
      for (let j = 1; j < minLength; j++) {
        const firstReading = first.reading.slice(first.reading.length - j);
        const secondReading = second.reading.slice(0, j);
        if (firstReading === secondReading) {
          gomamayoResult.isGomamayo = true;
          gomamayoResult.detail.push({
            surface: first.surface + "|" + second.surface,
            dimension: j,
          });
          gomamayoResult.combo++;
        }
      }
    }
  }
  return gomamayoResult;
}

export { analyse, parse };
