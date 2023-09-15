FROM node:18-alpine

WORKDIR /brydz

COPY client/package.json ./client/package.json
COPY client/package-lock.json ./client/package-lock.json

RUN npm install --prefix client

COPY . /brydz

EXPOSE 3000

CMD ["npm", "start", "--prefix", "client"]