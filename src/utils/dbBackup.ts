import fs from 'fs';
import config from 'config';
import {ExecException} from "child_process";
const _ = require('lodash');
const exec = require('child_process').exec;
const path = require('path');

const backupDirPath = path.join(__dirname, 'db-backup');

const dbOptions = {
    autoBackup: true,
    removeOldBackup: true,
    keepLastDaysBackup: 2,
    autoBackupPath: backupDirPath
};

export function stringToDate(dateString: string | number | Date) {
    return new Date(dateString);
}

export function generateBackupFolder(currentDate: Date) {
    let backupFolder=
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate();
    return backupFolder;
};

export function generateBackupPath(currentDate: Date) {
    let newBackupFolder = generateBackupFolder(currentDate);
    let newBackupPath: fs.PathLike = dbOptions.autoBackupPath + '-mongodump' + newBackupFolder;
    return newBackupPath;
};

export function generateOldBackupPath(currentDate: Date) {
    let beforeDate: Date = _.clone(currentDate);
    beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
    let oldBackupDir = generateBackupFolder(currentDate);
    let oldBackupPath: fs.PathLike = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir;
    return oldBackupPath;
};

export function dbAutoBackup() {
    if (dbOptions.autoBackup) {
        let date = new Date();
        let db: string = config.get('DBHost');

        let currentDate: Date = stringToDate(date);

        let newBackupPath: fs.PathLike = generateBackupPath(currentDate);
        let oldBackupPath: fs.PathLike = '';

        if(dbOptions.removeOldBackup) {
            oldBackupPath = generateOldBackupPath(currentDate);
        }

        let cmd = 'mongodump --uri ' + db + ' --out ' + newBackupPath;

        exec(cmd, (error: ExecException, stdout: any, stderr: any) => {
            if (_.isEmpty(error.toString())) {
                // check for remove old backup after keeping # of days given in configuration.
                if (dbOptions.removeOldBackup) {
                    if (fs.existsSync(oldBackupPath)) {
                        exec('rm -rf ' + oldBackupPath);
                    }
                }
            }
        });
    }
}


