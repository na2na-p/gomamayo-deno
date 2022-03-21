import { Gomamayo } from "./index.ts";
const inputString:string = Deno.args[0];

const gomamayo = new Gomamayo();

console.log(await gomamayo.analyse(inputString));