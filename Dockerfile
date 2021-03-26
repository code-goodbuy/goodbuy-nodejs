FROM node:14

# Create app directory
WORKDIR /usr/src/app

RUN npm install -g nodemon

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN npx tsc

EXPOSE 8080
