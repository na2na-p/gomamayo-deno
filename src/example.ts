import * as gomamayo from "https://deno.land/x/gomamayo_deno/mod.ts";

const inputString:string = Deno.args[0];

console.log(await gomamayo.analyse(inputString));