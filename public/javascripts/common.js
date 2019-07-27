function search(event) {
    if (event.keyCode === 13) {
        //listen to 'enter' key
        const phrase = document.getElementById("search").value;
        if (phrase.length > 0) {
            console.info("phrase: " + phrase);
            window.location.href = "/search?q=" + phrase;
        } else {
            window.location.href = "/";
        }
    }
}
function redirectToSSO() {
    window.location.href = "/sso";
}
