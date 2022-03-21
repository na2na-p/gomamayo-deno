import {Gomamayo} from "../mod.ts";

const gomamayo = new Gomamayo();

const inputString:string = Deno.args[0];

console.log(await gomamayo.analyse(inputString));