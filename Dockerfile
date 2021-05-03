FROM goodbuy/nodejs-webserver-baseimage:anthony

# Create app directory
WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN npx tsc
