FROM node:22

WORKDIR /usr/src/app

RUN npm install --save-dev hardhat @nomiclabs/hardhat-waffle ethers

COPY . .

WORKDIR pong-blockchain

RUN chmod +xrw init_hardhat.sh

CMD ["sh", "init_hardhat.sh"]