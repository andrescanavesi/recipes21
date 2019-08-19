function searchTop(event) {
    const element = document.getElementById("searchTop");
    search(event, element);
}

function searchBottom(event) {
    const element = document.getElementById("searchBottom");
    search(event, element);
}
function search(event, element) {
    if (event.keyCode === 13) {
        //listen to 'enter' key
        let phrase = element.value;
        if (phrase.length > 0) {
            window.location.href = "/search?q=" + phrase;
        } else {
            window.location.href = "/";
        }
    }
}

function redirectToSSO() {
    window.location.href = "/sso";
}

function activateElem(element) {
    element.classList.toggle("active");
}
