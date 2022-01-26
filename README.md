# Imgrater
Very small example project using Behavior Driven Development (BDD) with Cucumber, Node.js and TypeScript to develop an image uploading and rating web application.

Under development and currently only provides a single microservice with a REST API to upload, download and rate image files. Only intended as an example project.

## Dependencies
The following dependencies are necessary for developing and/or running the application. Dependencies not mentioned here will be resolved through yarn, refer the projects package.json file to see them.

### [Azure Storage](https://docs.microsoft.com/en-us/azure/storage/)
Used to store and retrieve the images.
For development you can emulate Azure Storage locally using [Azurite](https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azurite).
Azurite needs to be configured in loose mode, see this [GitHub issue](https://github.com/Azure/Azurite/issues/676).

### [Docker](https://www.docker.com/)
For packaging the application as a docker image.

### [Node.js](https://nodejs.org/)
The runtime environment used to execute the application. Requires version 16 or newer.

### [Yarn](https://yarnpkg.com/)
For dependency management of Node.js packages

## Setup

1. Install [Node.js](https://nodejs.org/en/download/) version 16 or newer
2. Install [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
3. Run the following command: `yarn`

## Configuration
Add a `.env` file containing the following variables:

* `AZURE_STORAGE_CONNECTION_STRING`
  - [Connection string](https://docs.microsoft.com/en-us/azure/storage/common/storage-configure-connection-string) to use for Azure Storage. If you are running Azurite locally for development on port 10000 this would e.g. be `DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;`
  - Required
* `AZURE_STORAGE_CONTAINER_NAME`
  - [Container name](https://docs.microsoft.com/en-us/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata#container-names) to use for storing images in Azure Storage.
  - Optional, default is `imgrater-images`
* `ACCEPTANCE_TEST_BASE_URL`
  - The base URL to make HTTP requests to in the acceptance tests. If you are running the application locally on port 9001 this would be `http://localhost:9001`
  - Optional, only required to run acceptance tests
* `PORT`
  - the TCP port the application should listen to for its REST API, e.g. `9001`
  - Optional, default is `9001`

## Running the application
### Prerequisites:
1. Make sure all necessary dependencies are installed (see Dependencies and Setup above)
2. Make sure the application is correctly configured (see Configuration above)
3. If not using real Azure Storage make sure that Azurite is running (and configured in loose mode)
4. If you wish to run the application with Docker, make sure Docker is installed and running

### Run the application with Node.js
To run the application locally with `ts-node` without first transpiling the TypeScript to JavaScript, run the following command
`yarn start`

Alternatively first transpile the TypeScript code to JavaScript by running the following command:
`yarn build`

And then launch the application directly using node:
`node dist/index.js`

### Run the application with Node.js for development:
To run the application locally with `ts-node-dev` and automatically restarting on code changes, run the following command:
`yarn start:dev`

If you want to see the code coverage of the application after executing e.g. acceptance tests, you can launch the application with `nyc`:
`yarn start:coverage`

### Run the application with Docker
To build a docker image run the following command: `yarn docker:build`, this will produce a docker image with the tag `imgrater`.

To start the application using the `.env` file from the project and exposing port `9001`, you can e.g. run the following command:
`docker run --env-file .env --publish 9001:9001 imgrater`

If you are using Azurite instead of real Azure Storage it needs to be accessible to the docker container. This can be achieved by e.g. running Azurite using docker as well on the same network as the docker container running the application:
1. Create a new docker network:
`docker network create imgrater_network`
2. Run the application in a docker container attached to this network:
`docker run --net imgrater_network --name imgrater --rm --env-file .env.docker --publish 9001:9001 imgrater`
3. Run Azurite (in loose mode) in a docker container attached to the same network:
`docker run --net imgrater_network --name azurite --rm --publish 10000:10000 mcr.microsoft.com/azure-storage/azurite azurite-blob --blobHost 0.0.0.0 --loose`

To stop the running containers you can run: `docker stop imgrater` and `docker stop azurite`.

### Run the application with Azurite using Docker Compose
You can also build the docker image and then start both the application and Azurite in docker containers on the same network using the `docker-compose.yml` file by running the following command:
`yarn docker:start`

## Tests
### Unit tests
To execute the unit tests for the application, run the following command: `yarn test`

### Cucumber acceptance tests
There are acceptance tests for the application written in the [Gherkin](https://cucumber.io/docs/gherkin/) language. To execute these tests follow these steps:

1. Make sure the application is running (e.g. by running `yarn start` or `yarn docker:start` see previous section on running the application)
2. Make sure `ACCEPTANCE_TEST_BASE_URL` is configured correctly in `.env`, see previous section on configuration
3. Run the following command `yarn test:acceptance`

To run the acceptance tests and also generate and open an HTML report for the acceptance tests run the following command:
`yarn test:acceptance:report`

## API
The application provides a RESTful HTTP API. This is documented with an OpenAPI specification in the file `swagger.yaml`.
