import { pagesStorage, staticFilesStorage } from "../../Storage/StaticStorage";
import DepManager from "./DepManager";

export const MSFiles = new DepManager(staticFilesStorage);
export const MPages = new DepManager(pagesStorage);