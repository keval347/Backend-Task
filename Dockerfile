FROM node:16 as node 

WORKDIR /app

COPY package.json .

RUN npm install

VOLUME [ "/app/nodemodules" ]

COPY . .

EXPOSE 3000 

CMD ["npm","start"]