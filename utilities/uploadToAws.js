// npm i multer aws-sdk multer-s3
import aws from 'aws-sdk'; 
import multer from 'multer';
import multerS3 from 'multer-s3';

import dotenv from 'dotenv';
dotenv.config();

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION
})

console.log(process.env.AWS_SECRET_ACCESS_KEY)
console.log(process.env.AWS_ACCESS_KEY_ID)
console.log(process.env.AWS_DEFAULT_REGION)
console.log(process.env.AWS_BUCKET_NAME)

const s3 = new aws.S3();

const storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: function (req, file, cb) {
        cb(null, Date.now().toString() + "-" + file.originalname)
    }
   
})

const awsUpload = multer({ storage: storage })

export default awsUpload;




// email - >  vertfication otp 
// email -> verfication link

// => Gmail to send emails 

// => non gmail services to send emails
