import { Gomamayo } from "./index.ts";
const mode = Deno.args[0]; // "analyze" or "addIgnore"
const inputString: string = Deno.args[1];

// "../data/ignoreWords.json"に設定ファイルがあると想定しています。
// なければ作成してください。
const gomamayo = new Gomamayo("./data/ignoreWords.json");

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
