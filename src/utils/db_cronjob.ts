import * as schedule from "node-schedule";
import { dbAutoBackup } from "./db_backup";


class job {
    constructor() {
    }

    public backupDB() {
        // var rule = new schedule.RecurrenceRule();
        // rule.dayOfWeek = [0, new schedule.Range(0, 7)];
        // rule.hour = [0, new schedule.Range(0, 23)];
        // rule.minute = [0, new schedule.Range(0, 59)];
        schedule.scheduleJob('*/1 * * * *', async function () {
            await dbAutoBackup();
        })
    }
}

export default new job();