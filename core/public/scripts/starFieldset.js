const starLabels = Array.from(document.querySelectorAll(".stars-fieldset .star"));
const form = document.querySelector("#review-form");
const starsFormWrapper = document.querySelector("#stars-form-wrapper");

function updateStarLabels(rating) {
    for (let i = 0; i < starLabels.length; i++) {
        starLabels[i].innerText = i < rating ? '★' : '☆';
    }
}
function handleStarHover(event) {
    const labelIndex = starLabels.indexOf(event.target);
    if (labelIndex !== -1) {
        starsFormWrapper.classList.remove("text-danger");
        updateStarLabels(labelIndex + 1);
    }
}
function handleStarOut() {
    const selectedRadio = document.querySelector('input[name="review[rating]"]:checked');
    if (selectedRadio) {
        updateStarLabels(selectedRadio.value); // Revert to the selected rating
    } else {
        if (form.classList.contains("was-validated")) {
            starsFormWrapper.classList.add("text-danger");
        }
        updateStarLabels(0); // Reset if no rating is selected
    }
}
function handleFormSubmit() {
    const selectedRating = document.querySelector('input[name="review[rating]"]:checked');
    if (!selectedRating) {
        starsFormWrapper.classList.add("text-danger");
    }
}
starsFormWrapper.addEventListener("mouseover", handleStarHover);
starsFormWrapper.addEventListener("mouseout", handleStarOut);
form.addEventListener("submit", handleFormSubmit);
updateStarLabels(0);
