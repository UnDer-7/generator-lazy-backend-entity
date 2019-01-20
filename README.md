# generator-lazy-backend-entity
Entity generator for [lazy-backend](https://github.com/UnDer-7/generator-lazy-backend)
## Video exemple
![Fail to load the video](https://media.giphy.com/media/62789RPCUl8xGsoWMA/giphy.gif)
## About the project
Creates an entity (controller, model, validation and routes)
## Prerequisites
- You need to have yeoman installed. If you don't have it, type the following command: 
```
npm i -g yo
```
- **You need to have a project generated with [lazy-backend](https://github.com/UnDer-7/generator-lazy-backend)**
## Installation
You can install the package from npm
```
npm i -g generator-lazy-backend-entity
```
## Usage
- First you need to be inside the project folder. *e.g. \user\workspace\project-name*
- Once inside the folder, run the following command
```
yo lazy-backend-entity
```
- It's recommended that the entity's name starts with an uppercase letter and the fields with a lowercase letter
## Generated Files
The generetor will create the following files
- Model
- Controller
- Validator
- The endpoints for the entity will be added on route.js file
## Author
Mateus Gomems da Silva Cardoso | mateus7532@gmail.com
