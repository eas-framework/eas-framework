import { Response, Request } from '@tinyhttp/app';
export default function BuildFile(SmallPath: string, isDebug: boolean, fullCompilePath?: string): Promise<boolean>;
interface buildIn {
    path?: string;
    ext?: string;
    type: string;
    inServer?: string;
}
export declare function serverBuild(path: string, checked?: boolean): Promise<null | buildIn>;
export declare function GetFile(SmallPath: string, isDebug: boolean, Request: Request, Response: Response): Promise<void>;
export {};
