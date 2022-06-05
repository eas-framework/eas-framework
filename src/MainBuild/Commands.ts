import { StaticFilesInfo } from "../CompileCode/Session";
import { pageDeps } from "../OutputInput/StoreDeps";
import { Export } from "./Settings";
import chalk from 'chalk';
import prompts from "prompts";
import { spawn } from "child_process";
import { appOnline } from "./Server";

const ShowHelp =
    `An interactive prompts for fast commands.
Helps you manage your developer server easily.`;

function checkCommand(name: string) {
    switch (name) {
        case 'help':
            console.log(
                chalk.blue('-- Help with Commands --\n') +
                chalk.blueBright(ShowHelp) +
                '\n'
            );
            break;
        case 'restart':
            appOnline?.close?.();
            //@ts-ignore
            process.emit('SIGINT');
            spawn(
                process.argv.shift(),
                process.argv,
                {
                    cwd: process.cwd(),
                    stdio: 'inherit'
                }
            ).once('exit', process.exit);
            return false;
            break
        case 'close':
            process.exit();
            break;
        case 'clear-pages':
            pageDeps.clear();
            break;
        case 'clear-static':
            StaticFilesInfo.clear();
            break;
        case 'clear':
            console.clear();
            break;
        default:
            throw new Error(`Unknown command ${name}`);
    }
}

export async function StartReadCommands() {
    if (!Export.development) return;

    const response = await prompts(
        {
            type: 'select',
            name: 'command',
            message: 'What do you want to do?',
            choices: [
                { title: 'Help', value: 'help', description: 'What is this?' },
                { title: 'Restart', value: 'restart', description: 'Restart the server' },
                { title: 'Rebuild Pages', value: 'clear-pages', description: 'Clear the cache of all pages' },
                { title: 'Rebuild Static', value: 'clear-static', description: 'Clear the cache of all static files' },
                { title: 'Clear', value: 'clear', description: 'Clear the console' },
                { title: 'Close', value: 'close', description: 'Close the server' },
            ],
        }
    );

    if (!response.command) return;

    if (checkCommand(response.command) !== false)
        StartReadCommands();
}