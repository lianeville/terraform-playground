resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

resource "aws_s3_bucket" "playground_bucket" {
  bucket        = "my-tf-playground-bucket-${random_string.suffix.result}"
  force_destroy = true
}

resource "aws_s3_bucket_ownership_controls" "playground_bucket" {
  bucket = aws_s3_bucket.playground_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "playground_bucket" {
  bucket = aws_s3_bucket.playground_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_acl" "playground_bucket" {
  depends_on = [
    aws_s3_bucket_ownership_controls.playground_bucket,
    aws_s3_bucket_public_access_block.playground_bucket,
  ]

  bucket = aws_s3_bucket.playground_bucket.id
  acl    = "public-read"
}