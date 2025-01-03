// JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.validated-form')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')

        }, false)
    })

})();

(() => {
    'use strict'
    const forms = document.querySelectorAll('.realtime-form-validation')
    Array.from(forms).forEach(form => {
        Array.from(form.elements).forEach(element => {
            element.addEventListener('input', event => {
                setElementValidity(element)
            })
        });
    })
})();

function setElementValidity(element) {
    let feedback;
    if (element.checkValidity()) {
        element.classList.add('is-valid')
        element.classList.remove('is-invalid')
        feedback = element.parentElement.querySelector('.valid-feedback');
        if (feedback) { feedback.innerText = 'Hyvältä näyttää!'; }

    } else {
        element.classList.add('is-invalid')
        element.classList.remove('is-valid')

        feedback = element.parentElement.querySelector('.invalid-feedback');
        if (!feedback) { return; }
        if (element.validity.valueMissing) {
            feedback.innerText = `${element.labels[0].innerText} puuttuu.`;
        } else if (element.validity.rangeUnderflow) {
            feedback.innerText = `Luvun pitää olla suurempi tai yhtä suuri kuin ${element.min}.`;
        } else if (element.validity.rangeOverflow) {
            feedback.innerText = `Luvun pitää olla pienempi kuin ${element.max}.`;
        } else if (element.validity.tooShort) {
            feedback.innerText =
                `Vähimmäispituus on ${element.minLength} merkkiä. ${element.minLength - element.value.length} merkkiä puuttuu.`;
        } else if (element.validity.typeMismatch) {
            feedback.innerText = `${element.labels[0].innerText} ei ole oikeassa muodossa.`;
        }
    }
    if (!feedback) { return; }
    if (element.maxLength > 0 && element.value.length <= element.maxLength) {
        feedback.innerText += ` ${element.maxLength - element.value.length} merkkiä jäljellä.`;
    }

}