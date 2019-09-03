const path = require('path');
const { readdirSync, lstatSync } = require('fs');
const { red, yellow, reset, bold, blink, dim} = require('./consoleColors');

const isDirectory = (source) => {
    return lstatSync(source).isDirectory();
}

/**
 * findContentEntryFile - Will return the index file in a path. Supports files ending with js, ts and tsx.
 *                        Throws error if more than one index file is present in the folder with the supported extensions.
 *                        returns undefined if no file exists.
 * @param contentPath - String representaion of the content path.
 * @returns - The index file name if exists in the given path. 
 */
const findContentEntryFile = (contentPath) => {
    const files = readdirSync(contentPath).filter((name) => /index.(js|ts|tsx)/.test(name));
    if (!files || files.length < 1) {
        console.log(`${yellow}Could not find any index files in path:${reset}\n${contentPath}\n`);
        return undefined;
    }
    else if (files.length == 1) {
        return files.pop();
    }
    else {
        throw `${red}Found ${files.length} index files, ${files}, in path:${reset}\n${contentPath}\nOnly one should be set.\n`;
    }
}

/**
 * getDirectories - scans a folder and returns a list directories within.
 *                  If a directory was found,
 *                  an object containing the full path and folder name will be returned in the list.
 * @param rootPath - String representaion of the root path.
 * @returns - A list of objects containing path and folder name
 */
const getDirectories = (rootPath) => {
    return readdirSync(rootPath)
        .map(name => {
            return {
                path: path.join(rootPath, name),
                folderName: name
            }
        })
        .filter((dir) => isDirectory(dir.path));
}

const locateContentScripts = (rootPath) => {
    const entries = {};
    const directories = getDirectories(rootPath);
    directories.forEach((dir) => {
        const entryFile = findContentEntryFile(dir.path);
        if (entryFile) { entries[dir.folderName] = path.join(dir.path, entryFile) }
    })
    return entries;
}

module.exports = locateContentScripts;