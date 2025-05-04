# Use Node.js LTS
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Railway uses PORT=8080 internally; default to 3000 if not set
ENV PORT=${PORT:-3000}

EXPOSE $PORT

CMD ["node", "server.js"]
