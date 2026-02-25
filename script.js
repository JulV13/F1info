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

window.onload = headToHeadSelectLoad = async () => {
    try {
        const driversResponse = await fetch("https://api.openf1.org/v1/championship_drivers?session_key=9839");
        const driversData = await driversResponse.json();
        console.log(driversData);
        var headToHeadSelect1 = document.getElementById("headToHeadSelect1");
        var headToHeadSelect2 = document.getElementById("headToHeadSelect2");
        driversData.forEach(driver => {
            headToHeadSelect1.innerHTML += `
            <option>${driver.driver_number}</option>
            `;
            headToHeadSelect2.innerHTML += `
            <option>${driver.driver_number}</option>
            `;
        });
    } catch (error) {
        console.log("error: ", error);
    }
}

const headToHead = async () => {
    try {
        let driver1 = document.getElementById("headToHeadSelect1").value;
        let driver2 = document.getElementById("headToHeadSelect2").value;
        const headToHeadResponse = await fetch(`https://api.openf1.org/v1/championship_drivers?session_key=9839&driver_number=${driver1}&driver_number=${driver2}`);
        const headToHeadData = await headToHeadResponse.json();
        console.log(headToHeadData);
        var headToHeadBox = document.getElementById("headToHeadBox");
        headToHeadBox.innerHTML = '';
        headToHeadBox.style.visibility="visible";
        headToHeadData.forEach(driver => {
            headToHeadBox.innerHTML += `
                <div class="headToHeadCard">
                    <span class="driverNumber">number: ${driver.driver_number}</span>
                    <span>position: ${driver.position_current}</span>
                    <span>points: ${driver.points_current}</span>
                </div>
            `
        });
    } catch (error) {
       console.log("error: ", error); 
    }
}