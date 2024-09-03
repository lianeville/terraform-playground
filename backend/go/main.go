package main

import (
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/pics", getPicsHandler)
	http.HandleFunc("/upload", uploadPicHandler)
	printColor("Server starting on http://localhost:8081/")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
