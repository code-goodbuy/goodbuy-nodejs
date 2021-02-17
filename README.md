# Goodbuy-nodejs.

## Requirements
Docker, Docker-compose



# Setup for Local Developement
## Build Docker-Image
You only need to run "docker build" when you set up the project for the first time OR when a new node packages was added to the *package.json*.
```
$ npm run docker_build
```
Run tests using Docker:
```
$ npm run docker_test
```
Run local using Docker:
```
$ npm run docker_local
```
Run dev using Docker:
```
$ npm run docker_dev
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

## Push image to dockerhub:
Requierment account fo
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


