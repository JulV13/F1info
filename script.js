document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

//<div class="teamColorBox" style="backgroundColor: #${driver.team_colour}"></div>

const getDriversChampionshipInfo = async () => {
    try {
        const response = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
        const data = await response.json();
        console.log(data);
        var driverChampionshipBox = document.getElementById("driverChampionshipBox");
        driverChampionshipBox.innerHTML = '';
        driverChampionshipBox.style.visibility="visible";
        data.forEach(driver => {
            driverChampionshipBox.innerHTML +=`
                <div class="driverCard">
                    <img src="${driver.headshot_url}" class="driverImage" style="border: 4px solid #${driver.team_colour}">
                    ${driver.first_name} 
                    ${driver.last_name}
                    ${driver.driver_number}
                    ${driver.team_name}
                </div>
            `;    
        });
    } catch (error) {
        console.log("error: ", error);
        driverChampionshipBox.innerHTML = 'error occured: ' + error;
    }
}

const getConstructorsChampionshipInfo = async () => {
    try {
        const resp = await fetch("https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158");
        const data = await resp.json();
        console.log(data);
    } catch (error) {
        console.log("error: ", error);
    }
}