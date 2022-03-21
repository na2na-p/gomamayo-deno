import { Gomamayo } from "./index.ts";
const mode = Deno.args[0]; // "analyse" or "addIgnore"
const inputString: string = Deno.args[1];

// "../data/ignoreWords.json"に設定ファイルがあると想定しています。
// なければ作成してください。
const gomamayo = new Gomamayo("./data/ignoreWords.json");

switch (mode) {
  case "addIgnore":
    console.log("addIgnore");
    console.log(await gomamayo.addIgnoreWord(inputString));
    break;

  case "analyse":
    console.log(await gomamayo.analyse(inputString));
    break;

  default:
    console.log("第一引数で、実行モード(analyse/addIgnore)の指定をしてください。");
    break;
}
