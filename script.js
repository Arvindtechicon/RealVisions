const form = document.getElementById("text-to-image-form");
const inputText = document.getElementById("input-text");
const generatedImage = document.getElementById("generated-image");
const loadingMessage = document.getElementById("loading-message");
const downloadButton = document.getElementById("download-button");

// Replace with your Hugging Face API key and model endpoint
const API_URL = "https://api-inference.huggingface.co/models/openfree/korea-president-yoon";
const API_KEY = "your_Hugging_Face_API_key";

form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent form refresh

  const userInput = inputText.value.trim();
  if (!userInput) {
    alert("Please enter some text!");
    return;
  }

  // Show loading state
  generatedImage.src = "";
  generatedImage.style.display = "none";
  loadingMessage.textContent = "Generating image, please wait...";
  downloadButton.style.display = "none"; // Hide download button initially

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: userInput }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error: ${response.status} - ${response.statusText}. Details: ${errorText}`);
    }

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    // Display the generated image
    generatedImage.src = imageUrl;
    generatedImage.style.display = "block";
    downloadButton.href = imageUrl; // Set the download link to the image URL
    downloadButton.download = "generated_image.png"; // Set the download attribute
    downloadButton.style.display = "inline"; // Show the download button
  } catch (error) {
    alert(`Failed to generate image: ${error.message}`);
    console.error(error); // Log the error for debugging
  } finally {
    // Remove loading message
    loadingMessage.textContent = "";
  }
});

// Add event listener for download button
downloadButton.addEventListener("click", () => {
  const imageUrl = generatedImage.src;
  if (imageUrl) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = "generated_image.png"; // Set the download attribute
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    alert("No image generated to download.");
  }
});
