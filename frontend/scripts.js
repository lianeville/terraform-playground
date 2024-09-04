document.getElementById("fetchImagesPython").addEventListener("click", () => {
	fetchImages(8080)
})
document.getElementById("fetchImagesGo").addEventListener("click", () => {
	fetchImages(8081)
})

document
	.getElementById("fetchLoremPicsumImages")
	.addEventListener("click", () => {
		fetchDummyImages()
	})

document.getElementById("uploadFile").addEventListener("submit", event => {
	event.preventDefault() // Prevent form from submitting the traditional way

	const port = event.submitter.dataset.port

	const fileInput = document.getElementById("fileInput")
	const files = fileInput.files // Get all selected files

	if (files.length > 0) {
		const formData = new FormData()

		// Append each file to the FormData object
		for (let i = 0; i < files.length; i++) {
			formData.append("uploadfiles", files[i])
		}

		const uploadNotifsElement = document.querySelector(".upload-notifs")
		const statusElement = document.querySelector("div.upload-notifs > span")
		const wheelElement = document.querySelector(".upload-notifs div.wheel")
		const uploadButtonsElement = document.querySelector(".upload-buttons")

		uploadNotifsElement.classList.remove("hidden")
		uploadButtonsElement.classList.add("hidden")
		statusElement.textContent = "Uploading files..."
		wheelElement.classList.remove("hidden")

		fetch(`http://localhost:${port}/upload`, {
			method: "POST",
			body: formData,
		})
			.then(response => response.json())
			.then(data => {
				console.log("Files uploaded successfully:", data)
				// Fetch images after successful upload
				fetchImages(port)
				wheelElement.classList.add("hidden")
				statusElement.textContent = "Files uploaded successfully"

				// Clear the file input
				fileInput.value = ""

				// Hide notifications and show upload buttons after 2 seconds
				setTimeout(() => {
					uploadNotifsElement.classList.add("hidden")
					uploadButtonsElement.classList.remove("hidden")
				}, 2000)
			})
			.catch(error => {
				console.error("Error uploading files or fetching images:", error)

				// Update the status to indicate error
				statusElement.textContent = "Failed to upload files."
				wheelElement.classList.add("hidden")
				uploadButtonsElement.classList.remove("hidden")

				// Clear the file input in case of error as well
				fileInput.value = ""
			})
	} else {
		alert("Please select at least one file to upload.")
	}
})

function fetchDummyImages() {
	const numberOfImages = 15 // Number of images to fetch

	const urls = []
	for (let i = 0; i < numberOfImages; i++) {
		// Generate random width and height between 100 and 800 pixels
		const width = Math.floor(Math.random() * (800 - 100 + 1)) + 100
		const height = Math.floor(Math.random() * (800 - 100 + 1)) + 100
		const url = `https://picsum.photos/${width}/${height}?random=${Math.random()}`
		urls.push(url)
	}

	updateImageContainer(urls)
}

function fetchImages(port) {
	const notifsElement = document.querySelector(".fetch-notifs")
	const statusElement = document.querySelector("div.fetch-notifs > span")
	const wheelElement = document.querySelector("div.wheel")
	const fetchButtonsElement = document.querySelector(".fetch-buttons")

	notifsElement.classList.remove("hidden")
	fetchButtonsElement.classList.add("hidden")
	statusElement.textContent = "Fetching images..."
	wheelElement.classList.remove("hidden")

	fetch(`http://localhost:${port}/pics`)
		.then(response => response.json())
		.then(urls => {
			updateImageContainer(urls)

			// Update the status to indicate done
			statusElement.textContent = "Images fetched successfully!"
			wheelElement.classList.add("hidden")

			// Hide notifications and show fetch buttons after 2 seconds
			setTimeout(() => {
				notifsElement.classList.add("hidden")
				fetchButtonsElement.classList.remove("hidden")
			}, 2000)
		})
		.catch(error => {
			console.error("Error fetching images:", error)

			// Update the status to indicate error
			statusElement.textContent = "Failed to fetch images."
			wheelElement.classList.add("hidden")
		})
}

function updateImageContainer(imageUrls) {
	const imageContainer = document.getElementById("imageContainer")
	imageContainer.innerHTML = "" // Clear previous images

	imageUrls.forEach(url => {
		const galleryItem = document.createElement("div")
		galleryItem.classList.add("gallery-item")
		const img = document.createElement("img")
		img.src = url
		img.alt = "Image"
		galleryItem.appendChild(img)
		imageContainer.appendChild(galleryItem)
	})
}
