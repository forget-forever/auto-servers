import { program } from "commander";
import { version } from "../package.json"

program.version(version, '-v --version').usage('<command> [name] <option>');

program.parse(process.argv);