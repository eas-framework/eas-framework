import { App as TinyApp } from '@tinyhttp/app'
import { Request, Response } from './types'
import formidable from 'formidable'
import {firstValues} from 'formidable/src/helpers/firstValues.js'
import { GlobalSettings } from '../Settings/GlobalSettings'
import { SystemAutoError } from '../Logger/ErrorLogger'
import processURL from './ProcessURL/ProcessURL'
import { loadSettings } from '../Settings/SettingsLoader'

let currentSettingsFile: string
export function connectRequests(app: TinyApp, settingsFile: string) {
    currentSettingsFile = settingsFile
    app.all('*', parseRequest)
}

async function parseRequest(req: Request, res: Response) {
    await loadSettings(currentSettingsFile)

    if (req.method === 'POST') {
        return new Promise(async (resolve: any) => {
            if (req.headers['content-type']?.startsWith?.('application/json')) {
                GlobalSettings.middleware.bodyParser(req, res, async () => {
                    await getCorrectResource(req, res)
                    resolve()
                })
                return
            }

            const form = formidable(GlobalSettings.middleware.formidable)
            form.parse(req, async (err, fields, files) => {
                if (err) {
                    SystemAutoError(err)
                }
                req.body = firstValues(form, fields)
                req.files = firstValues(form, files)
                await getCorrectResource(req, res)
                resolve()
            })
        })
    }

    await getCorrectResource(req, res)
}

async function getCorrectResource(req: Request, res: Response) {
    const warper = await processURL(req, res)


    
}