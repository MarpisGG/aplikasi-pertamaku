FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml first to leverage Docker cache
COPY package*.json ./

# Install pnpm globally
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node","server.js"]
