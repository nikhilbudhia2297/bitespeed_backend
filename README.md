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
```
  docker build . --tag identity-service
```

* Run image: (db used is a remotely hosted postgresql)
``` 
 docker run -e NODE_ENV='production' --publish 3000:3000 identity_service
```

* Run image with ENV variables: (provide DB credentials and remember to run migration)
``` 
docker run -e NODE_ENV="production" \	
     	-e DB_HOST="DB_HOST" \
     	-e DB_PORT="DB_PORT" \
     	-e DB_USER="DB_USER" \
     	-e DB_PASS="DB_PASS" \
     	-e DB_NAME="DB_NAME" \
     	--publish 3000:3000
     	identity-service
```

### Accessing the api ###
* Run the docker image
* The server will be up on localhost:3000
* Use the below CURL
``` 
curl --location 'http://localhost:3000/identify' \
--header 'Content-Type: application/json' \
--data '{
    "email" : "abc",
    "phoneNumber" : "123"
}'
```
