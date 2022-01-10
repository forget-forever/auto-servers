#!/usr/bin/env node
import { program } from "commander";
// import typeofJsonc from "typeof-jsonc";
// import { translate } from "./servers";

program.version(require("../package.json").version, '-v --version').usage('<command> [name] <option>');


program.parse(process.argv);