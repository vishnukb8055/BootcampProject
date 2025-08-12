FROM node:20-alpine
 
ENV NODE_ENV=DEV
 
WORKDIR /code
 
COPY package.json .
 
RUN npm install
 
EXPOSE 3000
 
COPY . .
 
CMD ["npm","run","start"]