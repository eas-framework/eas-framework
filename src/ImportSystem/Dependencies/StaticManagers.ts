import { pagesStorage, staticFilesStorage } from "../../Storage/StaticStorage.js";
import DepManager from "./DepManager.js";

export const MSFiles = new DepManager(staticFilesStorage);
export const MPages = new DepManager(pagesStorage);