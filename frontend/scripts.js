document.getElementById("fetchImages").addEventListener("click", () => {
	fetchImages()
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

	const fileInput = document.getElementById("fileInput")
	const file = fileInput.files[0]
	if (file) {
		const formData = new FormData()
		formData.append("uploadfile", file)

		fetch("http://localhost:8080/upload", {
			method: "POST",
			body: formData,
		})
			.then(response => response.json())
			.then(data => {
				console.log("File uploaded successfully:", data)
				// Fetch images after successful upload
				fetchImages()
			})
			.catch(error => {
				console.error("Error uploading file or fetching images:", error)
			})
	} else {
		alert("Please select a file to upload.")
	}
})

function fetchImages() {
	fetch("http://localhost:8080/pics")
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
