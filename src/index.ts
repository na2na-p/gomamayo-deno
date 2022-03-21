import { MeCab } from "https://deno.land/x/deno_mecab@v1.1.1/mod.ts";
import { Database } from "https://deno.land/x/aloedb@0.9.0/mod.ts";

interface ParsedWord {
  // 0
  surface: string;
  // 1
  feature: string;
  // 2..4
  featureDetails: string[];
  // 5..6
  conjugationForms: string[];
  // 7
  originalForm: string;
  // 8
  reading?: string;
  // 9
  pronunciation?: string;
}

interface gomamayoResult {
  isGomamayo: boolean;
  combo: number; // inputString中にあるゴママヨの総数
  detail: gomamayoDetail[];
}

interface gomamayoDetail {
  surface: string; // 該当の2語を入れる
  dimension: number; // n次ゴママヨのn
  rawResult1: ParsedWord; // mecab.parseの結果 気持ち的にはMeCabのParsedWordって型を使いたい。
  rawResult2: ParsedWord; // mecab.parseの結果 気持ち的にはMeCabのParsedWordって型を使いたい。
}

interface ignoreWord {
  surface: string;
}

class Gomamayo {
  private vowelDefine: string;
  private mecab = new MeCab(["mecab"]);
  private db: Database<ignoreWord> | null = null;

  constructor(dbPath: string | null = null) {
    this.vowelDefine = Deno.readTextFileSync("./assets/vowel_define.json");
    if (dbPath) {
      this.db = new Database<ignoreWord>(dbPath);
      console.log(`${dbPath} を読み込みました。`);
    } else {
      this.db = null;
    }
  }
  
  /**
   * @param {string} inputString
   * @return {ParsedWord[]}
   */
  public async parse(inputString: string): Promise<ParsedWord[]> {
    const rawResult = await this.mecab.parse(inputString);

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

  /**
   * @param {string} rawReading
   * @return {string}
   */
  public prolongedSoundMarkVowelize(rawReading: string): string {
    const vowelDefineJSON = JSON.parse(this.vowelDefine);
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

  /**
   * @param {string} inputString 判定したい文字列
   * @param isIgnored 除外設定を使うかどうか。指定した文字列を除外する場合はtrue。デフォルトはtrue。
   * @return 分析結果
   */
  public async analyse(
    inputString: string,
    isIgnored = true,
  ): Promise<gomamayoResult> {
    const gomamayoResult: gomamayoResult = {
      isGomamayo: false,
      combo: 0,
      detail: [],
    };
    const rawParseResult = await this.parse(inputString);

    if (isIgnored) {
      console.log("除外設定を使用します。");
      if (this.db) {
        const ignoreWords = await this.db.findMany();
        // ignoreWords[i].surfaceが、inputStringに含まれているかどうかを判定する
        for (let i = 0; i < ignoreWords.length; i++) {
          if (inputString.includes(ignoreWords[i].surface)) {
            console.log(`除外ワード\n${ignoreWords[i].surface}\nが含まれていたため、判定を中断します。`);
            return gomamayoResult;
          }
        }
      }
    }

    // rawParseResult[i].readingに「ー」が含まれていたらprolongedSoundMarkVowelizeを実行し、それに置き換える
    rawParseResult.map((raw) => {
      if (typeof raw.reading !== "undefined") {
        if (raw.reading.includes("ー")) {
          raw.reading = this.prolongedSoundMarkVowelize(raw.reading);
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
              rawResult1: first,
              rawResult2: second,
            });
            gomamayoResult.combo++;
          }
        }
      }
    }
    return gomamayoResult;
  }

  /**
   * ゴママヨではない語を設定する。設定ファイルが必要。
   * @param word
   * @returns
   */
  public addIgnoreWord(word: string): Promise<boolean> {
    if (this.db) {
      this.db.insertOne({
        surface: word,
      })
      .then(() => {
        console.log(`${word} を除外設定に追加しました。`);
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
      return Promise.resolve(true);
    } else {
      return Promise.resolve(false);
    }
  }
}

export { Gomamayo };
