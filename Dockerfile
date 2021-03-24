FROM node:14

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# TODO: Shoulnd't be necessary to install it seperatly
RUN npm install -g nodemon

# Install dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

RUN npx tsc

EXPOSE 8080
