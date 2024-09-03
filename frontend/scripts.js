document.getElementById("fetchImages").addEventListener("click", () => {
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

async function handleImageUpload(event) {
	const imageFile = event.target.files[0]
	console.log("originalFile instanceof Blob", imageFile instanceof Blob) // true
	console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`)

	const options = {
		maxSizeMB: 1,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
	}
	try {
		const compressedFile = await imageCompression(imageFile, options)
		console.log(
			"compressedFile instanceof Blob",
			compressedFile instanceof Blob
		) // true
		console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`) // smaller than maxSizeMB

		await uploadToServer(compressedFile) // write your own logic
	} catch (error) {
		console.log(error)
	}
}
