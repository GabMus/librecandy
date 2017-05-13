#!/bin/bash
mkdir -p ./dbdir/data
mongod --dbpath=dbdir/data --port 27017
