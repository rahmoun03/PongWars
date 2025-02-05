#!/bin/sh

npx hardhat compile

npx hardhat node &

sleep 2s

npx hardhat run scripts/deploy.js --network localhost

while true
do
  sleep 1
done