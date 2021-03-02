# Goodbuy-nodejs.

## Requirements
Docker, Docker-compose

# Setup Developement

## Log into dockerhub from terminal:
```
docker login --username=USERNAME
```
# Without npm installed: 

## Build the image:
```
docker build -t goodbuy-nodejs-image .
```
## Run the tests:
```
docker-compose -f docker-compose.yml -f docker-compose.test.yml up
```
## Run the local server:
```
docker-compose -f docker-compose.yml -f docker-compose.local.yml up
```
## Run the dev server:
```
docker-compose up
```
# With npm installed: 

## Run tests:
Run tests using Docker:
```
$ npm run docker_test
```
## Run local:
Run local using Docker:
```
$ npm run docker_local
```
## Run dev:
Run dev using Docker:
```
$ npm run docker_dev
```
## Compile typescript to javascript
```
$ npx tsc
```
## Compile typescript live
```
$ npx tsc -w -p .
```
## Build Docker-Image
When you added a new node package to the *package.json* you have to build the docker image again. ( Push the image to docker hub if you know what you are doing. Instructions below. )
```
$ npm run docker_build
```
## Push image to dockerhub:
Requierment account to
list all docker images:
```
docker images 
```

we need the image id to tag, example:

```
docker tag 633778e642b6 dockerhubaccountname/reponame:tagnameofyourchoice
```

then you can push it:

```
docker push dockhubaccountname/reponame:tagnameofyourchoice
```


## Connection to the Docker Image of the Database:
```
$ docker exec -it goodbuy_database bash
```
Accessing the Docker database from the docker image terminal:
```
mongo
```

### Start your local MongoDB (MAC) for development with out docker:

brew services start mongodb-community@4.4

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


