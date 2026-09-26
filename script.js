const menu = document.getElementById("side-menu");
const form = document.getElementById("contact-form");
const statusText = document.getElementById("form-status");

function openMenu() {
    menu.classList.add("open");
}

function closeMenu() {
    menu.classList.remove("open");
}

document.querySelectorAll("#side-menu a").forEach(link => {
    link.addEventListener("click", closeMenu);
});

function openTab(tabId, button) {
    document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
    });

    document.querySelectorAll(".tab-link").forEach(btn => {
        btn.classList.remove("active");
    });

    document.getElementById(tabId).classList.add("active");
    button.classList.add("active");
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        message: document.getElementById("message").value.trim()
    };

    statusText.textContent = "Sending...";

    try {
        const response = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Something went wrong");
        }

        statusText.textContent = "Message sent successfully!";
        form.reset();

        setTimeout(() => {
            statusText.textContent = "";
        }, 5000);
    } catch (error) {
        statusText.textContent = error.message;
    }
});

document.getElementById("year").textContent = new Date().getFullYear();
