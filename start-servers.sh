#!/bin/bash

concurrently "cd backend/go && air" "cd backend/python && nodemon app.py" "cd frontend && http-server -p 5050"
