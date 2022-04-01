Create a new project and install EAS-Framework
```bash
npm install @@eas-framework/server
```

Make your project a module project, add this to your `package.json`
```json
"type": "module"
```

Create `index.js` file in your root folder
```js
import server from '@@eas-framework/server';

server(); //start the server (all the settings via Settings.js file)
```

Create 'www' folder in your root folder that will contain all the SSR and static content of your website

### VS Code debug support

Create `.vscode/launch.json`
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program Node",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}\\index.js",
            "args": ["allowSourceDebug", "rebuild"], // allow source debug in browser and rebuild even on production mode
            "outFiles": [
                "${workspaceFolder}/node_modules/eas-framework/dist/*",
                "${workspaceFolder}/**/*.js"
            ]
        }
    ]
}