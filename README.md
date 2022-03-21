# これは何

言葉遊びである、[ゴママヨ](https://thinaticsystem.com/glossary/gomamayo/)を MeCab を用いて検出しよう、という物です。  
すでに Node.js で動作する[gomamayo.js](https://github.com/ThinaticSystem/gomamayo.js)は存在していますが、こちらは Deno で動作するものとなっております。

# お借りしたもの

長音対応にあたり、ThinaticSystem 氏より許可を頂いて、[gomamayo.js/assets/vowel_define.json](https://github.com/ThinaticSystem/gomamayo.js/blob/main/assets/vowel_define.json)をそのまま使用しています。

# 使い方

## 必要なもの

- Deno
- MeCab
- MeCab 辞書  
  - [mecab-ipadic-neologd](https://github.com/neologd/mecab-ipadic-neologd)がおすすめです。
- 除外設定用設定ファイル  
  - 必須ではありません。作成する場合は空ファイルのjsonを作成してください。AloeDBを使用しています。そちらの設定を確認してもらうのもいいかもしれません。

## 実行例

`deno run --allow-run --allow-read https://deno.land/x/gomamayo_deno/src/cli.ts analyse 株式公開買付`  
あるいは、`https://deno.land/x/gomamayo_deno/src/example.ts`を参考にしてください。

## 実行結果

```
{
  isGomamayo: true,
  combo: 1,
  detail: [
    {
      surface: "株式公開|買付",
      dimension: 2,
      rawResult1: {
        surface: "株式公開",
        feature: "名詞",
        featureDetails: [Array],
        conjugationForms: [Array],
        originalForm: "株式公開",
        reading: "カブシキコウカイ",
        pronunciation: "カブシキコーカイ"
      },
      rawResult2: {
        surface: "買付",
        feature: "名詞",
        featureDetails: [Array],
        conjugationForms: [Array],
        originalForm: "買い付け",
        reading: "カイツケ",
        pronunciation: "カイツケ"
      }
    }
  ]
}
```

# ライセンス

このソフトウェアは [MIT ライセンス](https://opensource.org/licenses/MIT) で配布されています。
