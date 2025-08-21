#!/bin/bash

echo "Starting deployment Process!"

# download new version of our application

cd /home/ubuntu/lf-backend/

echo "Git stash"

git stash

git checkout master

git pull origin master

npx prisma migrate deploy

echo "Installing dependencies!"

sudo rm -r node_modules/

npm install 

cd dist/

npm run build

# install all the dependencies

echo "starting the application!"

pm2 restart 0

echo "deployment process completed!"