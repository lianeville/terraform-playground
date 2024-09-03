package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func uploadPicHandler(w http.ResponseWriter, r *http.Request) {
	setCommonHeaders(w)

	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	err := r.ParseMultipartForm(10 << 20) // 10 MB
	if err != nil {
		http.Error(w, "Unable to parse form", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("uploadfile")
	if err != nil {
		log.Printf("Error retrieving the file: %v", err)
		http.Error(w, "Error retrieving the file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	err = uploadFileToS3(file, handler.Filename)
	if err != nil {
		http.Error(w, fmt.Sprintf("Failed to upload file: %v", err), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Successfully uploaded %q to S3\n", handler.Filename)
}

func getPicsHandler(w http.ResponseWriter, r *http.Request) {
	setCommonHeaders(w)

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	svc, err := createS3Session()
	if err != nil {
		http.Error(w, "Failed to create AWS session", http.StatusInternalServerError)
		return
	}

	bucketName, err := getMostRecentBucketName(svc)
	if err != nil {
		http.Error(w, "Failed to get bucket name", http.StatusInternalServerError)
		return
	}

	files, err := getBucketFiles(svc, bucketName)
	if err != nil {
		http.Error(w, "Failed to retrieve files", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(files); err != nil {
		http.Error(w, "Failed to encode response as JSON", http.StatusInternalServerError)
		log.Printf("Failed to encode JSON response: %v", err)
	}
}

func setCommonHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}
