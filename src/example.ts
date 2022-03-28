import { Gomamayo } from "https://deno.land/x/gomamayo_deno/mod.ts";

const ignoreSettingsPath = "./data/ignoreWords.json"; // 除外ファイル設定を書いてください。設定しない場合はnull、あるいは new Gomamayo(ignoreSettingsPath) としてください。
const gomamayo = new Gomamayo(ignoreSettingsPath);
const mode = Deno.args[0]; // "analyze" or "addIgnore"
const inputString: string = Deno.args[1];

// deno run --allow-run --allow-read https://deno.land/x/gomamayo_deno/src/cli.ts analyze 株式公開買付
// deno run --allow-run --allow-read https://deno.land/x/gomamayo_deno/src/cli.ts addIgnore 株式公開買付

switch (mode) {
  case "addIgnore":
    console.log("addIgnore");
    console.log(await gomamayo.addIgnoreWord(inputString));
    break;

  case "removeIgnore":
    console.log("removeIgnore");
    console.log(await gomamayo.removeIgnoreWord(inputString));
    break;

  case "analyze":
    console.log(await gomamayo.analyze(inputString));
    break;

  default:
    console.log("第一引数で、実行モード(analyze/addIgnore)の指定をしてください。");
    break;
}
