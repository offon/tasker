#!/bin/bash

sudo docker-compose stop
sudo docker-compose rm -f web
sudo docker image rm infra_web
sudo docker-compose up -d