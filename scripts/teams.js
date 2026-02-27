document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

const getConstructorsChampionshipInfo = async () => {
    try {
        const constructorChampionshipResponse = await fetch("https://api.openf1.org/v1/championship_teams?session_key=9839");
        const constructorChampionshipData = await constructorChampionshipResponse.json();
        console.log(constructorChampionshipData);
        const driversResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=9839");
        const driverData = await driversResponse.json();

        var constructorsChampionshipBox = document.getElementById("constructorsChampionshipBox");
        constructorsChampionshipBox.innerHTML = '';
        constructorsChampionshipBox.style.visibility="visible";
        let placeText = '';
        let firstPoints = 0;
        let pointsLeft = 0;
        constructorChampionshipData.forEach(team => {
            if (team.position_current==1){
                placeText = '🏆';
                firstPoints = team.points_current;
                pointsLeft = '';
            } else if (team.position_current==2){
                placeText = '🥈';
                pointsLeft = `[-${firstPoints-team.points_current}]`;
            } else if(team.position_current==3){
                placeText = '🥉';
                pointsLeft = `[-${firstPoints-team.points_current}]`;
            } else {
                placeText = ''+team.position_current;
                pointsLeft = `[-${firstPoints-team.points_current}]`;
            }
            let driver = driverData.find(d => d.team_name === team.team_name)
            let teamColor = driver.team_colour ? `#${driver.team_colour}` : '#FFFFFF';
            constructorsChampionshipBox.innerHTML +=`
                <div class="teamCard" style="background-color: ${teamColor}">
                    <span>${team.team_name}</span>
                    <div style="width: 100%;background-color: black;display: flex;justify-content:center;align-items:center;font-size: 50px">${placeText}</div>
                    <span>pts. ${team.points_current} <span style="color: black">${pointsLeft}</span></span>
                </div>
            `;    
        });
    } catch (error) {
        console.log("error: ", error);
    }
}