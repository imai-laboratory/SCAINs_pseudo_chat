FROM node:latest
WORKDIR /frontend

COPY /front/package*.json ./
RUN npm install

COPY /front .

CMD ["npm", "start"]