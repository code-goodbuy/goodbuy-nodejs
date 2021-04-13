let dbBackup = require('../dist/utils/dbBackup');
const path = require('path');
const {stringToDate,
       generateBackupFolder,
       generateBackupPath,
       generateOldBackupPath} = require("../dist/utils/dbBackup");

let chai = require('chai');
let expect = chai.expect;

describe('StringToDate', () => {
    it('it should convert a string to Date', (done) => {
        expect(stringToDate('2021 08 21')).to.be.a('Date');
        done();
    });
    it('it should convert a number to Date', (done) => {
        expect(stringToDate(20210821)).to.be.a('Date');
        done();
    });
    it('it should convert a Date to Date', (done) => {
        expect(stringToDate(Date.now())).to.be.a('Date');
        done();
    });
});

describe('generateBackupFolder', () => {
    const currentDate = new Date();
    const backupFolder = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    it('it should generate a backup folder with the date in the name', (done) => {
        expect(generateBackupFolder(currentDate)).to.be.equal(backupFolder);
        done();
    });
});

// describe('generateBackupPath', () => {
//     const currentDate = new Date();
//     const backupDirPath = path.join(__dirname, 'db-backup-mongodump');
//     const backupFolder = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
//     it('it should generate a backup path with the current date in it', () => {
//         expect(generateBackupPath(currentDate)).to.be.equal(backupDirPath + backupFolder);
//     });
// });
//
// describe('generateOldBackupPath', () => {
//     const currentDate = new Date();
//     const backupDirPath = path.join(__dirname, 'db-backupmongodump-');
//     const backupFolder = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate();
//     it('it should generate the old backup path with the old current date in it', () => {
//         expect(generateOldBackupPath(currentDate)).to.be.equal(backupDirPath + backupFolder);
//     });
// })




