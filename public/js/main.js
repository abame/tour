async function handleSubmit(event) {
    event.preventDefault();
    const status = document.getElementById(`${event.target.id}-status`);
    const form = document.getElementById(event.target.id);

    let opacity = 1; // Initial opacity

    const fadeEffect = setInterval(() => {
      if (opacity <= 0) {
        clearInterval(fadeEffect);
        status.style.display = 'none'; // Hide the element after fade out
      } else {
        opacity -= 0.05; // Decrease opacity
        status.style.opacity = opacity;
      }
    }, 300); // Adjust speed of fading

    fetch(event.target.action, {
        method: form.method,
        body: new FormData(event.target),
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            if (event.target.id === "subscribe") {
                status.innerHTML = "Thank you for subscribing to our newsletter!";
            } else if (event.target.id === "compare-packages") {
                status.innerHTML = "Thank you for your request! Our team will prepare the comparison and reach out to you in 24h.";
            } else {
                status.innerHTML = "Thank you for contacting us! Someone from our team will get back to you!";
            }
            status.classList.add('form-status-success');
            form.reset()
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ")
                    status.classList.add('form-status-error');
                } else {
                    status.innerHTML = "Oops! There was a problem with the form. Please try again!";
                    status.classList.add('form-status-error');
                }
            })
        }
    }).catch(error => {
        status.innerHTML = "Oops! There was a problem with the form. Please try again!";
        status.classList.add('form-status-error');
    });
}
