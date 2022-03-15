import { MeCab } from "https://deno.land/x/deno_mecab@v1.1.1/mod.ts";

const mecab = new MeCab(["mecab"]);

const inputString:string = Deno.args[0];


// Parse (形態素解析)
console.table(await mecab.parse(inputString));
// [{surface: "JavaScript", feature: "名詞", featureDetails: [ "固有名詞", "組織", "*" ], ...

console.log("##################################################################################")

// Dump (ダンプ出力)
console.table(await mecab.dump(inputString));
// [{nodeId: 0, surface: "BOS", feature: "BOS/EOS", featureDetails: [ "*", "*", "*" ], ...

console.log("##################################################################################")

// Wakati (わかち書き)
console.table(await mecab.wakati(inputString));
// [ "JavaScript", "は", "とても", "楽しい", "です", "。" ]

console.log("##################################################################################")

// Yomi (読み付与)
console.log(await mecab.yomi("日本語"));
// ニホンゴ