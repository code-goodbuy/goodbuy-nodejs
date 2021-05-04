# Goobuy's own base image containing: Node 14, nodemon, mongotools, awscli
FROM goodbuy/nodejs-webserver-baseimage

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN npx tsc
