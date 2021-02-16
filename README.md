# Goodbuy-nodejs.

## Requirements
Docker, Docker-compose



# Setup for Local Developement
Create a Nodemodules Volume:
```
$ docker volume create --name nodemodules
```
##Build Docker-Image
You only need to run "docker build" when you set up the project for the first time OR when a new node packages was added to the *package.json*.
```
$ docker build -t goodbuy-nodejs-image .
```
Run with Docker-Compose:
```
$ docker-compose -f docker-compose.yml -f docker-compose.local.yml up
```
# Local Development on Online Hosted Database

Run with Docker-Compose:
```
$ docker-compose up
```

## Connection to the Docker Image of the Database:
```
$ docker exec -it goodbuy_database bash
```
Accessing the Docker database from the docker image terminal:
```
mongo
```

## Mongo Local DB Commands
Insert a Product:
```
db.products.insertOne({name: "test_name", brand: "test_brand", corporation: "test_corp", barcode: "123456789", state: "unverified"})
```
Search for all Products:
```
db.products.find().pretty()
```
Search for a Specific Product:
```
db.products.find({ name: "test_name"}).pretty()
```
Delete a Product:
```
db.products.deleteOne({ name: "Coca Cola"})
```
