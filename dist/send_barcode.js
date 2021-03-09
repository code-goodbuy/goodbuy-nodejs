#!/usr/bin/env node
"use strict";
let amqp = require('amqplib/callback_api');
amqp.connect(`amqp://${process.env.RABBITMQ_USER}:${process.env.RABBITMQ_USER_PW}@${process.env.RABBITMQ_DEV_HOST}`, function (error0, connection) {
    console.log("connection", typeof connection);
    if (error0) {
        throw error0;
    }
    connection.createChannel(function (error1, channel) {
        if (error1) {
            throw error1;
        }
        let queue = 'buycott';
        let msg = '7622300336738';
        channel.assertQueue(queue, {
            durable: true
        });
        channel.sendToQueue(queue, Buffer.from(msg));
        console.log(" [x] Sent %s", msg);
    });
    setTimeout(function () {
        connection.close();
        process.exit(0);
    }, 500);
});
