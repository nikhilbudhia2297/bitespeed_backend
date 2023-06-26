# README #

### BiteSpeed Backend Project : Identity Service ###

##### Tech stack
* NodeJs
* TypeScript
* TypeOrm
* Postgres SQL

### Setup ###
* To generate migration:
```sh
typeorm migration:generate -n <migrationName>
```
* To run migration:
```sh
npm run typeorm -- migration:run 
```
* To revert migration:
```sh
npm run typeorm -- migration:revert
```
* To run for development:
```bash
npm run dev:server
```

#### Docker Setup ####
* Build docker image:
  ```sudo docker build --tag identity-service```
* Run image: (db used is a remotely hosted postgresql)
``` 
sudo docker run --publish 3000:3000  --name identity-service \
     	-e NODE_ENV="production" \	
     	identity-service
```
* Run image with ENV variables: (provide DB credentials and remember to run migration)
``` 
sudo docker run --publish 3000:3000  --name identity-service \
     	-e NODE_ENV="production" \	
     	-e DB_HOST="DB_HOST" \
     	-e DB_PORT="DB_PORT" \
     	-e DB_USER="DB_USER" \
     	-e DB_PASS="DB_PASS" \
     	-e DB_NAME="DB_NAME" \
     	identity-service
```