まだ作成中...

# これは何

言葉遊びである、[ゴママヨ](https://thinaticsystem.com/glossary/gomamayo/)を MeCab を用いて検出しよう、という物です。  
すでに Node.js で動作する[gomamayo.js](https://github.com/ThinaticSystem/gomamayo.js)は存在していますが、こちらは Deno で動作するものとなっております。

# お借りしたもの

長音対応にあたり、ThinaticSystem氏より許可を頂いて、[gomamayo.js/assets/vowel_define.json](https://github.com/ThinaticSystem/gomamayo.js/blob/main/assets/vowel_define.json)をそのまま使用しています。

# 使い方

`deno run --allow-run --allow-read src/cli.ts 株式公開買付`で実行できます。

実行結果
![実行結果](https://misskey.na2na.dev/media/media/dcd6b37b-205c-427e-a4d3-391023cec7bc.png)