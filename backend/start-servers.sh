#!/bin/bash

concurrently "cd go && air" "cd python && nodemon app.py"
