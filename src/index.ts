#!/usr/bin/env node
import { program } from "commander";

program.version(require("../package.json").version, '-v --version').usage('<command> [name] <option>');



program.parse(process.argv);