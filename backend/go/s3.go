package main

import (
	"fmt"
	"log"
	"mime/multipart"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

const (
	defaultRegion = "us-west-2"
)

func createS3Session() (*s3.S3, error) {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(getRegion()),
	})
	if err != nil {
		return nil, fmt.Errorf("failed to create AWS session: %w", err)
	}
	return s3.New(sess), nil
}

func getRegion() string {
	return defaultRegion
}

func getMostRecentBucketName(svc *s3.S3) (string, error) {
	result, err := svc.ListBuckets(nil)
	if err != nil {
		return "", fmt.Errorf("failed to list buckets: %w", err)
	}

	if len(result.Buckets) == 0 {
		return "", fmt.Errorf("no buckets found")
	}

	// Find the most recently created bucket
	var latestBucket *s3.Bucket
	for _, bucket := range result.Buckets {
		if latestBucket == nil || bucket.CreationDate.After(*latestBucket.CreationDate) {
			latestBucket = bucket
		}
	}

	if latestBucket == nil {
		return "", fmt.Errorf("failed to determine the most recent bucket")
	}

	return *latestBucket.Name, nil
}

func uploadFileToS3(file multipart.File, fileName string) error {
	svc, err := createS3Session()
	if err != nil {
		return err
	}

	bucketName, err := getMostRecentBucketName(svc)
	if err != nil {
		return fmt.Errorf("failed to get most recent bucket: %w", err)
	}

	input := &s3.PutObjectInput{
		Bucket: aws.String(bucketName),
		Key:    aws.String(fileName),
		Body:   file,
		ACL:    aws.String("public-read"),
	}

	_, err = svc.PutObject(input)
	if err != nil {
		return fmt.Errorf("failed to upload file to S3: %w", err)
	}

	return nil
}

func getBucketFiles(svc *s3.S3, bucketName string) ([]string, error) {
	var urls []string

	err := svc.ListObjectsV2Pages(&s3.ListObjectsV2Input{
		Bucket: aws.String(bucketName),
	}, func(page *s3.ListObjectsV2Output, lastPage bool) bool {
		for _, object := range page.Contents {
			url := generatePresignedURL(svc, bucketName, *object.Key, 15*time.Minute)
			urls = append(urls, url)
		}
		return !lastPage
	})

	if err != nil {
		return nil, fmt.Errorf("failed to list objects in bucket: %w", err)
	}

	return urls, nil
}

func generatePresignedURL(svc *s3.S3, bucket, key string, expiration time.Duration) string {
	req, _ := svc.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(bucket),
		Key:    aws.String(key),
	})

	url, err := req.Presign(expiration)
	if err != nil {
		log.Fatalf("Failed to sign request: %v", err)
	}

	return url
}
