import boto3
from botocore.exceptions import NoCredentialsError
from flask import Flask, jsonify, request
from flask_cors import CORS

# Initialize Flask app
app = Flask(__name__)

CORS(app)

# AWS S3 setup
s3 = boto3.client('s3')
s3_resource = boto3.resource('s3')
s3_client = boto3.client('s3')
all_buckets = s3.list_buckets()['Buckets']


def get_bucket_files(bucket_name):
    pics = []
    try:
        bucket = s3_resource.Bucket(bucket_name)
        for obj in bucket.objects.all():
            url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': bucket_name, 'Key': obj.key},
                ExpiresIn=3600
            )
            pics.append(url)

    except Exception as e:
        print(f'Error listing objects: {e}')

    GREEN = '\033[92m'
    RESET = '\033[0m'

    print(f"{GREEN}Retrieved {len(pics)} images in Python{RESET}")
    return pics


def upload_to_s3(file, bucket_name, object_name=None):
    if object_name is None:
        object_name = file.filename

    try:
        s3_client.upload_fileobj(file, bucket_name, object_name)
        # Generate a URL for the uploaded file
        url = s3_client.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': object_name},
            ExpiresIn=3600  # URL expiration time in seconds
        )
        return url
    except FileNotFoundError:
        print("The file was not found")
    except NoCredentialsError:
        print("Credentials not available")
    except Exception as e:
        print(f"Error uploading file: {e}")

    return None


@app.route('/')
def home():
    return 'Hello, World!'


@app.route("/pics")
def get_pics():

    if len(all_buckets) < 1:
        return jsonify({"error": "There are no buckets."}), 400
    bucket_name = all_buckets[0]['Name']

    pics = get_bucket_files(bucket_name)
    return jsonify(pics)


@app.route("/upload", methods=["POST"])
def upload_pics():

    if len(all_buckets) < 1:
        return jsonify({"error": "There are no buckets."}), 400
    bucket_name = all_buckets[0]['Name']

    # Check if the request has files
    if 'uploadfiles' not in request.files:
        return jsonify({"error": "No files part in the request"}), 400

    files = request.files.getlist('uploadfiles')

    if not files or all(file.filename == '' for file in files):
        return jsonify({"error": "No files selected"}), 400

    successful_uploads = []
    failed_uploads = []

    for file in files:
        if file and file.filename:
            # Upload file to S3
            if upload_to_s3(file, bucket_name):
                successful_uploads.append(file.filename)
            else:
                failed_uploads.append(file.filename)
        else:
            failed_uploads.append(file.filename)

    if successful_uploads:
        response = {
            "success": True,
            "message": "Files successfully uploaded",
            "successful_uploads": successful_uploads,
            "failed_uploads": failed_uploads
        }
    else:
        response = {
            "success": False,
            "message": "Failed to upload files",
            "failed_uploads": failed_uploads
        }

    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=False, port=8080)  # Turn off debug mode in production
