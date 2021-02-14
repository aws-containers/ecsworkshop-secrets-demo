FROM node:12

RUN apt-get update || : && apt-get install python -y

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY package.json wait.sh ./
COPY src ./src
COPY public ./public
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.7.3/wait /wait
RUN chmod +x /wait
RUN npm install
RUN npm run build

EXPOSE 4000
CMD /wait && npm start