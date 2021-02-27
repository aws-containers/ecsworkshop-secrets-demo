FROM node:14

RUN apt-get update || : && apt-get install python -y

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json server.js ./
COPY src ./src
COPY public ./public
RUN npm install --loglevel=error
RUN npm run build

EXPOSE 4000
CMD npm start