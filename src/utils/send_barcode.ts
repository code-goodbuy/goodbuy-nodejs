#!/usr/bin/env node

import config from "config";

import amqp from 'amqplib/callback_api';

interface ChannelType {
    assertQueue: (queue: string, params: { durable: boolean }) => void
    sendToQueue: (queue: string, buffer: Buffer) => void
}

interface ConnectionType {
    createChannel: (err: (err: Error, ch: ChannelType) => void) => void
    close: () => void
}

const rabbit_user = process.env.RABBITMQ_USER || config.get("RABBITMQ_USER")
const rabbit_pass = process.env.RABBITMQ_USER_PW ||  config.get("RABBITMQ_USER_PW")
const rabbit_host =  process.env.RABBITMQ_DEV_HOST || config.get("RABBITMQ_DEV_HOST")
const rabbit_port =  process.env.RABBITMQ_PORT || config.get("RABBITMQ_PORT")

export function sendBarcodeToRabbitMQ(barcode: string) {
    amqp.connect(`amqp://${rabbit_user}:${rabbit_pass}@${rabbit_host}:${rabbit_port}`, function(error0: Error, connection: ConnectionType) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function(error1, channel) {
            if (error1) {
                throw error1;
            }
            console.log("Sending Barcode ", barcode)
            let queue = 'buycott';
            let msg = barcode;

            channel.assertQueue(queue, {
                durable: true
            });
            channel.sendToQueue(queue, Buffer.from(msg));

            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function() {
            connection.close();
        }, 500);
    });
}
