document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

const getDriversChampionshipInfo = async () => {
    try {
        const driverChampionshipResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
        const driverChampionshipData = await driverChampionshipResponse.json();
        console.log(driverChampionshipData);
        var driverChampionshipBox = document.getElementById("driverChampionshipBox");
        driverChampionshipBox.innerHTML = '';
        driverChampionshipBox.style.visibility="visible";
        driverChampionshipData.forEach(driver => {
            driverChampionshipBox.innerHTML +=`
                <div class="driverCard" style="background-color: #${driver.team_colour}">
                    <img src="${driver.headshot_url}" class="driverImage" style="border: 4px solid #${driver.team_colour}">
                    <span>${driver.first_name} ${driver.last_name}</span>
                    <span class="driverNumber">${driver.driver_number}</span>
                    <span>${driver.team_name}</span>
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
        const constructorChampionshipResponse = await fetch("https://api.openf1.org/v1/championship_teams?session_key=9839");
        const constructorChampionshipData = await constructorChampionshipResponse.json();
        console.log(constructorChampionshipData);
        var constructorsChampionshipBox = document.getElementById("constructorsChampionshipBox");
        constructorsChampionshipBox.innerHTML = '';
        constructorsChampionshipBox.style.visibility="visible";
        constructorChampionshipData.forEach(team => {
            constructorsChampionshipBox.innerHTML +=`
                <div class="teamCard">
                    <span>${team.team_name}</span>
                    <span class="teamPosition">${team.position_current}</span>
                    <span>points: ${team.points_current}</span>
                </div>
            `;    
        });
    } catch (error) {
        console.log("error: ", error);
    }
}