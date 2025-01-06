const toggleCheckbox = document.querySelector("#toggleCheckbox")
const toggleWrapper = document.querySelector("#toggleWrapper");

toggleCheckbox.addEventListener("change", () => {
    toggleWrapper.classList.toggle("d-none");
    const toggleWrapperInputs = toggleWrapper.querySelectorAll("input");
    const isRequired = !toggleWrapper.classList.contains("d-none")
    for (let input of toggleWrapperInputs) {
        if (isRequired) {
            input.setAttribute("required", "true");
            input.removeAttribute("disabled");
        } else {
            input.removeAttribute("required");
            input.setAttribute("disabled", "true");
        }
    }
});