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

const rabbit_user = process.env.RABBITMQ_USER
const rabbit_pass = process.env.RABBITMQ_USER_PW
const rabbit_host =  process.env.RABBITMQ_DEV_HOST
const rabbit_port =  process.env.RABBITMQ_PORT

export function sendEanToRabbitMQ(ean: string) {
    try {
        amqp.connect(`amqp://${rabbit_user}:${rabbit_pass}@${rabbit_host}:${rabbit_port}`, function(error0: Error, connection: ConnectionType) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function(error1, channel) {
                if (error1) {
                    throw error1;
                }
                console.log("Sending Ean ", ean)
                let queue = 'buycott';
                let msg = ean;

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
    } catch (e) {
        console.log(e);
    }
}
