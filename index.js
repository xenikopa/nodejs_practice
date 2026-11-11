import { copyFolder } from "./modules/copyFolder.js";

copyFolder('./files/source', './files/target', (message) => console.log(message))