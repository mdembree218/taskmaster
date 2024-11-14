# Use the official Node.js image as the base image
FROM node:22.11.0

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the Docker-specific environment file
COPY .env.docker .env

# Expose port 8000
EXPOSE 3000

# Command to run the npm program
CMD ["npm", "start"]