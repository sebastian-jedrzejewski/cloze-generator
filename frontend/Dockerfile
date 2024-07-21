FROM node:18-alpine

RUN apk --no-cache add dos2unix && mkdir -p /app && chown node:node /app
WORKDIR /app

USER node
COPY --chown=node:node package.json .

RUN npm install

COPY --chown=node:node . .

EXPOSE 5173

CMD [ "npm", "run", "dev" ]