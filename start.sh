#!/bin/bash

terminate() {
  kill %1
  kill %2
}

WATCHING=1 nodemon --ignore web/ --harmony_destructuring -L bin/www &
cd web && npm run watch &

trap terminate SIGINT
wait
