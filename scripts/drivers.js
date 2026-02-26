document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

const getDriversChampionshipInfo = async () => {
    try {
        const driversResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=9839");
        const driverData = await driversResponse.json();
        console.log(driverData);
        const driversChampionshipResponse = await fetch("https://api.openf1.org/v1/championship_drivers?session_key=9839");
        const driversChampionshipData = await driversChampionshipResponse.json();
        console.log(driversChampionshipData );

        var driverChampionshipBox = document.getElementById("driverChampionshipBox");
        driverChampionshipBox.innerHTML = '';
        driverChampionshipBox.style.visibility="visible";

        driversChampionshipData.forEach(driver => {
            let stats = driverData.find(stat => stat.driver_number === driver.driver_number);
            if(stats){
                let teamColor = stats.team_colour ? `#${stats.team_colour}` : '#FFFFFF';
                let driverPhoto = stats.headshot_url ? stats.headshot_url : 'https://www.formula1.com/etc/designs/f1/images/driver-placeholder.png';
                driverChampionshipBox.innerHTML +=`
                    <div class="driverCard" style="background-color: ${teamColor}">
                        <img src="${driverPhoto}" class="driverImage" style="border: 4px solid ${teamColor}">
                        <span>${stats.full_name}</span>
                        <span class="driverNumber">${driver.driver_number}</span>
                        <span class="driverNumber">points:${driver.points_current}</span>
                        <span>${stats.team_name}</span>
                    </div>
                `; 
            }
        });

    } catch (error) {
        console.log("error: ", error);
        driverChampionshipBox.innerHTML = 'error occured: ' + error;
    }
}