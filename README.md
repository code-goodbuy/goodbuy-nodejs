# Goodbuy-nodejs.

## Requirements 
Docker, Docker-compose, MongoDB 

# Setup for local developement

In the root folder of the project create a file called *.env* and fill it with the following:
```
MONGO_URI_LOCAL=mongodb://mongodb:27017/local_database
PORT=8080
```
Create a nodemodules volume:
```
docker volume create --name nodemodules
```
Start your local MongoDB (MAC):
```
brew services start mongodb-community@4.4
```
Build and run with Docker-compose:
```
docker-compose up --build
```

## Connection to the docker image of the database:
```
sudo docker exec -it nodeapi_mongodb_1 bash
```
Accessing the Docker database from the docker image terminal:
```
mongo
```

## Mongo local db commands

Insert a product:
```
db.product.insertOne({name: "test_name", brand: "test_brand", corporation: "test_corp", barcode: "123456789", state: "unverified"})
```
Search for all products:
```
db.product.find().pretty()
```
Search for specific product:
```
db.product.find({ name: "test_name"}).pretty()
```
Delete a product:
```
db.product.deleteOne({ name: "Coca Cola"})
```

