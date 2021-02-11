# Goodbuy-nodejs

## Requirements 
Docker, Docker-compose, MongoDB 

# Setup 

Start your local MongoDB (MAC):
```
brew services start mongodb-community@4.4
```
Build and run with Docker-compose:
```
docker-compose up --build --remove-orphans
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
