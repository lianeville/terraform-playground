package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
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

	// Retrieve multiple files
	files := r.MultipartForm.File["uploadfiles"]
	if len(files) == 0 {
		http.Error(w, "No files uploaded", http.StatusBadRequest)
		return
	}

	var uploadResults []map[string]interface{}
	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			log.Printf("Error opening file: %v", err)
			uploadResults = append(uploadResults, map[string]interface{}{
				"filename": fileHeader.Filename,
				"success":  false,
				"message":  fmt.Sprintf("Failed to open file: %v", err),
			})
			continue
		}
		defer file.Close()

		err = uploadFileToS3(file, fileHeader.Filename)
		if err != nil {
			uploadResults = append(uploadResults, map[string]interface{}{
				"filename": fileHeader.Filename,
				"success":  false,
				"message":  fmt.Sprintf("Failed to upload file: %v", err),
			})
			continue
		}

		uploadResults = append(uploadResults, map[string]interface{}{
			"filename": fileHeader.Filename,
			"success":  true,
			"message":  fmt.Sprintf("Successfully uploaded %q to S3", fileHeader.Filename),
		})
	}

	message := "Uploaded " + strconv.Itoa(len(uploadResults)) + " images in Go"
	printColor(message)

	// Return the results as JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(uploadResults)
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
