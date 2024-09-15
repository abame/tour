const form = document.getElementById("contact-form");

async function handleSubmit(event) {
    event.preventDefault();
    const status = document.getElementById("contact-form-status");
    fetch(event.target.action, {
        method: form.method,
        body: new FormData(event.target),
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Thank you for contacting us! Someone from our team will get back to you!";
            status.classList.add('contact-form-status-success');
            form.reset()
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                    status.classList.add('contact-form-status-error');
                } else {
                    status.innerHTML = "Oops! There was a problem submitting the form. Please try again!";
                    status.classList.add('contact-form-status-error');
                }
            })
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem submitting the form. Please try again!";
        status.classList.add('contact-form-status-error');
    });
}
form.addEventListener("submit", handleSubmit)
