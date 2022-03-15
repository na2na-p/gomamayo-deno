import { parse, analyse } from "./index.ts";
const inputString:string = Deno.args[0];

console.log(await analyse(inputString));