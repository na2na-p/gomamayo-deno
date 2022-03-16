# What

This is an attempt to detect [gomamayo](https://thinaticsystem.com/glossary/gomamayo/), a play on words, using MeCab.
Only work on Japanese.

# Getting Started

## Dependencies

- deno
- MeCab
- MeCab dictionary
  We recommend the use of mecab-ipadic-neologd. (https://github.com/neologd/mecab-ipadic-neologd)

## Example

`deno run --allow-run --allow-read https://deno.land/x/gomamayo_deno/src/cli.ts 株式公開買付`  
Alternatively, you can use the Please refer to `https://deno.land/x/gomamayo_deno/src/example.ts`.

## Example Result

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

# License

This software is released under the MIT License.
