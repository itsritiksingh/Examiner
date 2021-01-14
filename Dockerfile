FROM alpine:latest
RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY package*.json /app/

RUN npm install

COPY . /app

EXPOSE 5000

ENTRYPOINT ["node"]

CMD ["server.js"]
