FROM node:latest

COPY . /game/

WORKDIR /game/server

RUN rm package-lock.json
RUN npm install

CMD ["npm", "start"]
