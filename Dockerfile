FROM alpine:latest AS Intermediate
RUN apk update && \
   apk upgrade && \
   apk add git npm

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:10.15-alpine

ENV NODE_ENV production
ENV MICROSERVICE=jaxx
ENV TZ=America/Argentina/Buenos_Aires

RUN npm i -g pm2

WORKDIR /usr/src/app

COPY --from=Intermediate /usr/src/app ./

EXPOSE 8088

CMD ["pm2", "start", "--no-daemon", "/usr/src/app/pm2.json"]