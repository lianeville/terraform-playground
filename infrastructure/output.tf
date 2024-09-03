output "playground_bucket" {
  description = "The name of the S3 bucket"
  value       = aws_s3_bucket.playground_bucket.bucket
}