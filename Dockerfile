FROM node:14


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g nodemon


# Install dependencies
COPY package.json .
RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "nodemon", "server.js" ]