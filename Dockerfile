# Use Node.js LTS
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose API port
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
