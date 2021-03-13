FROM python:3

ENV RABBITMQ_USER ""
ENV RABBITMQ_USER_PW ""
ENV RABBITMQ_DEV_HOST ""
ENV MONGODB_DEV_URI ""

WORKDIR scraper

COPY . .

RUN pip install -r requirements.txt

# The flag -u give unbuffered output, in order to see logs from python script
CMD ["python", "-u", "receive_barcode.py"]