FROM node:14

# Create app directory
WORKDIR /usr/src/app

# TODO: Shoulnd't be necessary to install it seperatly
RUN npm install -g nodemon

# Install dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Install Mongotools
RUN curl https://fastdl.mongodb.org/tools/db/mongodb-database-tools-debian92-x86_64-100.3.1.deb -o mongodb-database-tools-debian92-x86_64-100.3.1.deb
RUN dpkg -i mongodb-database-tools-debian92-x86_64-100.3.1.deb

# Install awscli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

RUN npx tsc

EXPOSE 8080
