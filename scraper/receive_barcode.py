#!/usr/bin/env python3
import pika, sys, os, json, pymongo
from buycott_scraper import BuycottScraper


def main():
    credentials = pika.PlainCredentials(os.environ['RABBITMQ_USER'], os.environ['RABBITMQ_USER_PW'])
    connection = pika.BlockingConnection(pika.ConnectionParameters(
        host=os.environ['RABBITMQ_DEV_HOST'],
        credentials=credentials))
    channel = connection.channel()

    channel.queue_declare(queue='buycott', durable=True)

    def callback(ch, method, properties, code):
        print(" [!] Received %r" % code)
        scraper = BuycottScraper(code)
        product = scraper.scrape()
        print("New Product:\n", json.dumps(product, indent=4, sort_keys=True))
        client = pymongo.MongoClient(
            os.environ['MONGODB_DEV_URI'])
        db = client.test
        db["products"].insert_one(product)
        print(" [+] Product successfully saved.")
        print(' [*] Waiting for messages. To exit press CTRL+C')

    channel.basic_consume(queue='buycott', on_message_callback=callback, auto_ack=True)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('Interrupted')
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
