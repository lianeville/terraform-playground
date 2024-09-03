package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	http.HandleFunc("/pics", getPicsHandler)
	http.HandleFunc("/upload", uploadPicHandler)
	fmt.Println("Server starting on http://localhost:8080/")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
