document.getElementById("updateButton").addEventListener("click", updateEntry)
document.getElementById("deleteButton").addEventListener("click", deleteEntry)
document.querySelector("#getButton").addEventListener("click", apiRequest)

async function updateEntry() {
    try {
        const response = await fetch("updateEntry", {
            method: "put",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: document.getElementsByName("name")[0].value,
                albumName: document.getElementsByName("albumName")[0].value,
                yearReleased: document.getElementsByName("yearReleased")[0].value,
                length: document.getElementsByName("length")[0].value,
                image: document.getElementsByName("image")[0].value,
                peakChartPositionUK: document.getElementsByName("peakChartPositionUK")[0].value,
                singles: document.getElementsByName("singles")[0].value
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}

async function deleteEntry() {
    const input = document.getElementById("deleteInput")
    try {
        const response = await fetch("deleteEntry", {
            method: "delete",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                name: input.value
            })
        })
        const data = await response.json()
        location.reload()
    } catch(err) {
        console.log(err)
    }
}

async function apiRequest() {
    const albumName = document.querySelector("select").value
    try {
        const response = await fetch(`https://radiohead-albums-app.herokuapp.com/api/${albumName}`)
        const data = await response.json()
        console.log(data)

        document.getElementById("albumName").innerText = data.albumName
        document.getElementById("yearReleased").innerText = data.yearReleased
        document.getElementById("length").innerText = data.length
        document.getElementById("singles").innerText = data.singles
        document.getElementById("albumImage").src = data.image
        document.getElementById("peakChartPositionUK").innerText = data.peakChartPositionUK

    } catch(error) {
        console.log(error)
    }
}
