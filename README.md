## Install
```shell
npm i
npm install -g ts-node
```

## Manual Run 
```shell
ts-node-esm ./src/app.ts 
```

## Deploy
Deployment is handled entirely by Render. there is a Render action used only to store the build and signal render to deploy.


So all tokens are handled by Render.


Build Command:
```shell
npm install -g ts-node; npm i; npm ci; npm run build; ls
```

Start Command:
```shell
node app.js
```

Enviroment:
```
NODE_VERSION=18.16.0
```

## FireBase Info
https://medium.com/boca-code/the-basic-process-is-that-we-will-use-firebase-cloud-functions-to-create-a-single-function-app-13ba3b852077

### Generate a deploy token
```shell
firebase init hosting:github
```
