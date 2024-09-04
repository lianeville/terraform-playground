document.getElementById("fetchImagesPython").addEventListener("click", () => {
	fetchImages(8080)
})
document.getElementById("fetchImagesGo").addEventListener("click", () => {
	fetchImages(8081)
})

// document
// 	.getElementById("fetchLoremPicsumImages")
// 	.addEventListener("click", () => {
// 		fetchDummyImages()
// 	})

document.getElementById("uploadFile").addEventListener("submit", event => {
	event.preventDefault() // Prevent form from submitting the traditional way

	const port = event.submitter.dataset.port

	const fileInput = document.getElementById("fileInput")
	const files = fileInput.files // Get all selected files

	if (files.length > 0) {
		const formData = new FormData()
		for (let i = 0; i < files.length; i++) {
			formData.append("uploadfiles", files[i])
		}

		sendNotif("Uploading files..", "upload", "default", false, true)

		fetch(`http://localhost:${port}/upload`, {
			method: "POST",
			body: formData,
		})
			.then(response => response.json())
			.then(data => {
				console.log(files.length)
				console.log("Files uploaded successfully:", data)
				fetchImages(port)
				message = files.length + " files uploaded successfully."
				sendNotif(message, "upload", "success", true)
				fileInput.value = ""
			})
			.catch(error => {
				console.error("Error uploading files or fetching images:", error)
				sendNotif("Failed to upload files.", "upload", "error", true)
				fileInput.value = ""
			})
	} else {
		sendNotif("No files selected.", "upload", "error", true)
	}
})

// function fetchDummyImages() {
// 	const numberOfImages = 15 // Number of images to fetch

// 	const urls = []
// 	for (let i = 0; i < numberOfImages; i++) {
// 		// Generate random width and height between 100 and 800 pixels
// 		const width = Math.floor(Math.random() * (800 - 100 + 1)) + 100
// 		const height = Math.floor(Math.random() * (800 - 100 + 1)) + 100
// 		const url = `https://picsum.photos/${width}/${height}?random=${Math.random()}`
// 		urls.push(url)
// 	}

// 	updateImageContainer(urls)
// }

function fetchImages(port) {
	sendNotif("Fetching images...", "fetch", "default", false, true)

	fetch(`http://localhost:${port}/pics`)
		.then(response => response.json())
		.then(urls => {
			if (urls.length == 0) {
				sendNotif("No images uploaded yet.", "fetch", "default", true)
			} else {
				sendNotif("Images fetched.", "fetch", "success", true)
				updateImageContainer(urls)
			}
		})
		.catch(error => {
			console.error("Error fetching images:", error)

			sendNotif("Failed to fetch images.", "fetch", "error", true)
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

function sendNotif(
	message,
	element,
	status = "default",
	reset = false,
	useWheel = false
) {
	parentEl =
		element == "fetch"
			? document.getElementById("header-utils")
			: document.getElementById("footer-utils")

	const buttonsEl = parentEl.querySelector(".buttons")
	const notifsEl = parentEl.querySelector(".notifs")
	const statusEl = notifsEl.querySelector("span")
	const wheelEl = parentEl.querySelector(".wheel")

	if (useWheel) {
		wheelEl.classList.remove("hidden")
	} else {
		wheelEl.classList.add("hidden")
	}

	notifsEl.classList.remove("hidden")
	buttonsEl.classList.add("hidden")

	statusEl.textContent = message

	if (status == "success") {
		statusEl.style.color = "green"
	} else if (status == "error") {
		statusEl.style.color = "red"
	} else {
		statusEl.style.color = "black"
	}

	if (reset) {
		setTimeout(() => {
			notifsEl.classList.add("hidden")
			buttonsEl.classList.remove("hidden")
		}, 2000)
	}
}
