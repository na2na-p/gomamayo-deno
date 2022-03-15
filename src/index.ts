import { MeCab } from "https://deno.land/x/deno_mecab@v1.1.1/mod.ts";
const mecab = new MeCab(["mecab"]);

type gomamayo = {
  isGomamayo: boolean;
  combo?: number; // 実装はまだ先
  detail?: gomamayoDetail[];
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

async function analyse(inputString: string) {
  const gomamayoResult: gomamayo = {
    isGomamayo: false,
    combo: 0,
    detail: [],
  };
  const rawParseResult = await parse(inputString);

  console.table(rawParseResult);
  console.log(
    "##################################################################################",
  );

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
      for (let j = 0; j < minLength; j++) {
        const firstReading = first.reading.slice(first.reading.length - j - 1);
        const secondReading = second.reading.slice(0, j + 1);
        console.log(firstReading, secondReading);
        if (firstReading === secondReading) {
          gomamayoResult.isGomamayo = true;
          gomamayoResult.detail!.push({
            surface: first.surface + second.surface,
            dimension: j + 1,
          });
          gomamayoResult.combo!++;
        }
      }
    }
  }
  return gomamayoResult;
}

export { analyse, parse };
