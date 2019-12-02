document.getElementById('search').addEventListener('click', getAPI);

function getAPI(){
    let url = '/randoname';
    fetch(url)
    .then((res) => { return res.json() })
    .then((data) => {
        console.log(data);
        document.getElementById('result').innerHTML = data.name;
        })
    .catch ((error) => {
        console.log("error");
    })
}


