import { App as TinyApp } from '@tinyhttp/app'
import { Request, Response } from './types'
import formidable from 'formidable'
import { multipartType } from 'formidable/src/plugins/multipart.js'
import { querystringType } from 'formidable/src/plugins/querystring.js'
import { GlobalSettings } from '../Settings/GlobalSettings'
import { SystemAutoError } from '../Logger/ErrorLogger'
import processURL from './ProcessURL/ProcessURL'
import { loadSettings } from '../Settings/SettingsLoader'

let currentSettingsFile: string
export function connectRequests(app: TinyApp, settingsFile: string) {
    currentSettingsFile = settingsFile
    app.all('*', parseRequest)
}

export function parseFormidableFields(form, fields, exceptions = []) {
    /**
     * Go over every field and check if an array with on item, if so then replace it with the item
     */
    if (form.type !== querystringType && form.type !== multipartType) {
        return fields
    }

    return Object.fromEntries(
        Object.entries(fields).map(([key, value]) => {
            if (exceptions.includes(key) || !Array.isArray(value) || value.length) {
                return [key, value];
            }
            return [key, value[0]];
        }),
    )
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
                req.body = parseFormidableFields(form, fields)
                req.files = parseFormidableFields(form, files)
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