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

export function generateBackupDir(currentDate: Date) {
    let backupDir =
        currentDate.getFullYear() +
        '-' +
        (currentDate.getMonth() + 1) +
        '-' +
        currentDate.getDate();
    return backupDir;
}

export function dbAutoBackup() {
    if (dbOptions.autoBackup) {
        let date = new Date();
        let beforeDate: Date, oldBackupDir, oldBackupPath: fs.PathLike;
        let db: string = config.get('DBHost');

        let currentDate: Date = stringToDate(date);
        let newBackupDir = generateBackupDir(currentDate);

        let newBackupPath = dbOptions.autoBackupPath + '-mongodump' + newBackupDir;

        if(dbOptions.removeOldBackup) {
            beforeDate = _.clone(currentDate);
            beforeDate.setDate(beforeDate.getDate() - dbOptions.keepLastDaysBackup);
            oldBackupDir = generateBackupDir(currentDate);
            oldBackupPath = dbOptions.autoBackupPath + 'mongodump-' + oldBackupDir;
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


