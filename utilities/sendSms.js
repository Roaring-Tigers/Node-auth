// npm i aws-sdk 

import aws from 'aws-sdk';


import dotenv from 'dotenv';
dotenv.config();

console.log("send sms: region",process.env.AWS_DEFAULT_REGION)
console.log("access key",process.env.AWS_ACCESS_KEY_ID)
console.log("secret key",process.env.AWS_SECRET_ACCESS_KEY)

aws.config.update({
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_DEFAULT_REGION
})


function sendSms(message, phone){

    const params = {
        Message: message,
        PhoneNumber: phone,
        
    }

    let publishTextPromise = new aws.SNS({apiVersion: "2010-03-31"}).publish(params).promise();
    publishTextPromise.then(data => console.log(data))
    publishTextPromise.catch(err => console.log(err))
}

export default sendSms;


