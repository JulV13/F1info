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

        driverData.forEach(driver => {
            const stats = driversChampionshipData.find(stat => stat.driver_number === driver.driver_number);
            driverChampionshipBox.innerHTML +=`
                <div class="driverCard" style="background-color: #${driver.team_colour}">
                    <img src="${driver.headshot_url}" class="driverImage" style="border: 4px solid #${driver.team_colour}">
                    <span>${driver.first_name} ${driver.last_name}</span>
                    <span class="driverNumber">${driver.driver_number}</span>
                    <span class="driverNumber">points:${stats ? stats.points_current : 0}</span>
                    <span>${driver.team_name}</span>
                </div>
            `;    
        });
    } catch (error) {
        console.log("error: ", error);
        driverChampionshipBox.innerHTML = 'error occured: ' + error;
    }
}