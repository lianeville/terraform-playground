document.getElementById("fetchImagesPython").addEventListener("click", () => {
	fetchImages(8080)
})
document.getElementById("fetchImagesGo").addEventListener("click", () => {
	fetchImages(8081)
})

document
	.getElementById("fetchLoremPicsumImages")
	.addEventListener("click", () => {
		const numberOfImages = 15 // Number of images to fetch
		const imageContainer = document.getElementById("imageContainer")
		imageContainer.innerHTML = "" // Clear previous images

		const requests = []
		for (let i = 0; i < numberOfImages; i++) {
			// Generate random width and height between 100 and 800 pixels
			const width = Math.floor(Math.random() * (800 - 100 + 1)) + 100
			const height = Math.floor(Math.random() * (800 - 100 + 1)) + 100
			const url = `https://picsum.photos/${width}/${height}?random=${Math.random()}`
			requests.push(fetch(url).then(response => response.blob()))
		}

		Promise.all(requests)
			.then(blobs => {
				blobs.forEach(blob => {
					const galleryItem = document.createElement("div")
					galleryItem.classList = "gallery-item"
					const img = document.createElement("img")
					img.src = URL.createObjectURL(blob)
					img.alt = "Lorem Picsum Image"
					galleryItem.append(img)
					imageContainer.appendChild(galleryItem)
				})
			})
			.catch(error => {
				console.error("Error fetching Lorem Picsum images:", error)
			})
	})

document.getElementById("uploadFile").addEventListener("submit", event => {
	event.preventDefault() // Prevent form from submitting the traditional way

	port = event.submitter.dataset.port

	const fileInput = document.getElementById("fileInput")
	const files = fileInput.files // Get all selected files

	if (files.length > 0) {
		const formData = new FormData()

		// Append each file to the FormData object
		for (let i = 0; i < files.length; i++) {
			formData.append("uploadfiles", files[i])
		}

		fetch(`http://localhost:${port}/upload`, {
			method: "POST",
			body: formData,
		})
			.then(response => response.json())
			.then(data => {
				console.log("Files uploaded successfully:", data)
				// Fetch images after successful upload
				fetchImages(port)
			})
			.catch(error => {
				console.error("Error uploading files or fetching images:", error)
			})
	} else {
		alert("Please select at least one file to upload.")
	}
})

function fetchImages(port) {
	fetch(`http://localhost:${port}/pics`)
		.then(response => response.json())
		.then(data => {
			const imageContainer = document.getElementById("imageContainer")
			imageContainer.innerHTML = "" // Clear previous images

			// Assuming the data is an array of image URLs
			data.forEach(url => {
				const galleryItem = document.createElement("div")
				galleryItem.classList = "gallery-item"
				const img = document.createElement("img")
				img.src = url
				img.alt = "Image"
				galleryItem.appendChild(img)
				imageContainer.appendChild(galleryItem)
			})
		})
		.catch(error => {
			console.error("Error fetching images:", error)
		})
}
