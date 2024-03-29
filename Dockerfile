FROM node:16.15.0

WORKDIR /app

COPY package*.json ./

# RUN npm install
RUN npm install --production

COPY . .

RUN npx prisma generate

CMD ["npm","start"]