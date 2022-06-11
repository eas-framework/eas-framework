import fsExtra from 'fs-extra';
import path from 'path';
import { args, StreamCommand } from './tools/StreamCommand.js';

const __dirname = path.resolve();

const projectsPath = path.join(__dirname, 'projects');
const projects = await fsExtra.readdir(projectsPath, { withFileTypes: true });

for (const project of projects) {
    if (!project.isDirectory())
        continue;

    const projectPath = path.join(projectsPath, project.name);
    const buildFile = path.join(projectPath, 'build.js');
    await StreamCommand(`node ${buildFile} ${args.production ? 'release' : ''}`,  {cwd: projectPath});
}
