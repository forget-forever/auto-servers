import { program } from "commander";


program.version(require('../package.json').version, '-v --version').usage('<command> [name] <option>');