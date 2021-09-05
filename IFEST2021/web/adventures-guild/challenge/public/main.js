"use strict";

const placeholders = [
    "Ad astra abyssosque! Welco— *skip*",
    "I am Katheryne, the receptioni— *skip*",
    "Welcome to the— *skip*",
    "Is there somethi— *skip*",
    "How can I hel— *skip*"
];

var id_ = "";

async function open() {
    const msg = document.getElementById("msg");
    const subject = document.getElementById("subject");
    const content = document.getElementById("content");
    const button = document.getElementById("submit");
    
    if( (subject.textContent !== '') && (content.textContent !== '') ){
        const response = await fetch("/open-commission", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                subject: subject.textContent,
                content: content.textContent
            })
        });
        
        const json = await response.json();
        id_ = json.id;

        if (id_) {
            msg.innerHTML = `<a target="_blank" href="${window.location}commission/${id_}">${window.location}commission/${json.id}</a>`;
            button.removeAttribute("disabled");
        } else {
            console.error("An error occurred.");
            msg.innerText = "Something went wrong! Please try again.";
        }
    } else {
        msg.innerText = "All textfield must be filled!";
    }
}

async function submit() {
    const button = document.getElementById("submit");
    const msg = document.getElementById("msg");

    button.setAttribute("disabled", true);  

    const response = await fetch("/submit-commission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id: id_
        })
    });

    const json = await response.json();
    
    if (json.completed) {
        msg.innerText = "Your commission is being reviewed!";
    } else {
        console.error("An error occurred.");
        msg.innerText = "Something went wrong! Please try again.";
    }
}

window.addEventListener("DOMContentLoaded", _ => {
    const placeholder = placeholders[Math.floor(Math.random() * placeholders.length)];
    document.getElementById("content").setAttribute("placeholder", placeholder);
    document.getElementById("submit").setAttribute("disabled", true);

    document.getElementById("review").addEventListener("click", _ => {
        open();
    });

    document.getElementById("submit").addEventListener("click", _ => {
        submit();
    });
});