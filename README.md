# Goodbuy-nodejs.

## Requirements
Docker, Docker-compose, MongoDB

# Setup for local developement

Create a nodemodules volume:
```
docker volume create --name nodemodules
```
Build and run with Docker-compose:
```
docker-compose up --build
```

## Connection to the docker image of the database:
```
docker exec -it goodbuy-nodejs_mongodb_1 bash
```
Accessing the Docker database from the docker image terminal:
```
mongo
```

## Mongo local db commands

Insert a product:
```
db.products.insertOne({name: "test_name", brand: "test_brand", corporation: "test_corp", barcode: "123456789", state: "unverified"})
```
Search for all products:
```
db.products.find().pretty()
```
Search for specific product:
```
db.products.find({ name: "test_name"}).pretty()
```
Delete a product:
```
db.products.deleteOne({ name: "Coca Cola"})
```
