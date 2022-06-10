function handleSubmit(event) {
    event.preventDefault();

    let inputText = document.getElementById('name').value;
    inputText = {
        text: inputText
        // text: 'Main dishes were quite good but desserts were too sweet for me'
    };

    if (inputText.text == '') {
        alert('An empty field is not allowed!');
    } else {
        apiRequest(inputText);
    }
}

async function apiRequest(inputText) {
    console.log('QuellText: ' + inputText.text);
    fetch('http://localhost:8081/api', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        // Body data type must match "Content-Type" header
        body: JSON.stringify(inputText)
    })
        .then((apiResponse) => {
            const result = apiResponse.json();
            return result;
        })
        .then((result) => {
            console.log(result);

            document.querySelector(
                '#results_text'
            ).innerHTML = `Your Text: ${result.text}`;
            document.querySelector(
                '#results_irony'
            ).innerHTML = `Is it Irony? ${result.irony}`;
            document.querySelector(
                '#results_polarity'
            ).innerHTML = `How is the Polarity? ${result.polarity}`;
        })
        .catch((error) => console.log('ERROOORRR: ', error));
}

export { handleSubmit };
