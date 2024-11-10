FROM node:alpine

RUN mkdir -p /usr/src/app/node_modules && chown -R node:node /usr/src/app

WORKDIR /usr/src/app

COPY package*.json ./

USER node

RUN npm install

COPY . .

RUN npm run build

COPY --chown=node:node . .

EXPOSE 3000

CMD node build/App.js