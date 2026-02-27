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
        let driverCounter = 0;
        let firstPoints = 0;
        let pointsLeft = 0;
        let placeText = '';
        driversChampionshipData.forEach(driver => {
            driverCounter++;
            if (driverCounter==1){
                placeText = '🏆';
                firstPoints = driver.points_current;
                pointsLeft='';
            } else if (driverCounter==2){
                placeText = '🥈';
                pointsLeft = `[-${firstPoints-driver.points_current}]`;
            } else if(driverCounter==3){
                placeText = '🥉';
                pointsLeft = `[-${firstPoints-driver.points_current}]`;
            } else {
                placeText = ''+driverCounter;
                pointsLeft = `[-${firstPoints-driver.points_current}]`;
            }
            let stats = driverData.find(stat => stat.driver_number === driver.driver_number);
            if(stats){
                let teamColor = stats.team_colour ? `#${stats.team_colour}` : '#FFFFFF';
                let driverPhoto = stats.headshot_url ? stats.headshot_url : 'https://www.formula1.com/etc/designs/f1/images/driver-placeholder.png';
                driverChampionshipBox.innerHTML +=`
                    <div class="driverCard" style="background-color: ${teamColor}">
                        <img src="${driverPhoto}" class="driverImage" style="border: 4px solid ${teamColor}">
                        <span class="driverName">${stats.full_name} <span class="driverNumber">${driver.driver_number}</span></span>
                        <div style="background-color: black;display: flex;justify-content:center;align-items:center;font-size: 50px">${placeText}</div>
                        <span class="driverPoints">pts. ${driver.points_current} <span style="color: black">${pointsLeft}</span></span>
                        <span class="driverTeam">${stats.team_name}</span>
                    </div>
                `; 
            }
        });

    } catch (error) {
        console.log("error: ", error);
        driverChampionshipBox.innerHTML = 'error occured: ' + error;
    }
}