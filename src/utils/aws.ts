
const path = require("path");

const REGION = "eu-central-1";

const uploadParams = {
    Bucket: "BUCKET_NAME",
    Key: ""
};

const s3 = new S3Client({region: REGION});

export function uploadFileToS3(file: string, bucket: string) {
    uploadParams.Bucket = bucket;
    const run = async() => {
        uploadParams.Key = path.basename(file);
        try {
            const data = await s3.send(new PutObjectCommand(uploadParams));
            console.log("Uploaded file!", data);
        } catch (err) {
            console.log("Error", err);
        }
    }
    run();
}

