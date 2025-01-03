const years = document.querySelectorAll('.year');
const currentYear = new Date().getFullYear();
for (let year of years) {
    year.innerText = currentYear;
}

document.addEventListener('DOMContentLoaded', function () {
    const dropdownToggles = document.getElementsByClassName('dropdown-toggle');

    function updateDropdownToggle() {
        if (window.innerWidth < 1023) {
            for (let dropdownToggle of dropdownToggles) {
                dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
            }
        } else {
            for (let dropdownToggle of dropdownToggles) {
                dropdownToggle.removeAttribute('data-bs-toggle');
            }
        }
    }

    // Run on initial load
    updateDropdownToggle();

    // Update on window resize
    window.addEventListener('resize', updateDropdownToggle);
});
