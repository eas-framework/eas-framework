import path from 'path';
import {promises} from 'fs';

const file = path.resolve() + '/.gitlab-ci.yml';
let content = await promises.readFile(file, 'utf8');

content = content.replace(/\"[\W\w]+?\"/, `"${process.argv[2]} - auto build"`);
promises.writeFile(file, content);

