document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

const getRacesInfo = async () => {
    try {
        const d = new Date();
        let year = d.getFullYear();
        var seasonSelect = document.getElementById("seasonSelect").value ?? year;
        const seasonResponse = await fetch(`https://api.openf1.org/v1/sessions?year=${seasonSelect}`);
        const seasonData = await seasonResponse.json();
        console.log(seasonData);
        const allRacesBox = document.getElementById("allRacesBox");
        allRacesBox.innerHTML='';
        allRacesBox.style.visibility = "visible";
        seasonData.forEach(race => { 
            allRacesBox.innerHTML+=`
                <div id="raceBox">
                    <span>${race.circuit_short_name}</span>
                    <span>${race.country_name}</span>
                    <span>${race.session_name}</span>
                    <button onclick="raceResults(${race.session_key})">results</button>
                </div>
            `
        });
    } catch (error) {
        console.log("error: ", error);
    }
}

const raceResults = async (session_key) => {
      try {
        const sessionResultsResponse = await fetch(`https://api.openf1.org/v1/session_result?session_key=${session_key}`);
        const sessionResultsData = await sessionResultsResponse.json();
        console.log(sessionResultsData);
        const driversResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${session_key}`);
        const driversData = await driversResponse.json();
        const driversChampionshipResponse = await fetch(`https://api.openf1.org/v1/championship_drivers?session_key=${session_key}`);
        const driversChampionshipData = await driversChampionshipResponse.json();

        const chosenRaceInfoBox = document.getElementById("chosenRaceInfoBox");
        chosenRaceInfoBox.style.visibility = "visible";
        let chosenRaceResultsTable = `
        <table>
            <thead>
            <tr>
                <td>POS.</td>
                <td>POINTS START</td>
                <td>POINTS CURRENT</td>
                <td>WDC # START</td>
                <td>WDC # CURRENT</td>
                <td>#</td>
                <td>DRIVER</td>
                <td>LAPS</td>
                <td>DNF</td>
                <td>DSQ</td>
                <td>DNS</td>
            </tr>
            </thead>
            <tbody>
        `;
        sessionResultsData.forEach(driver => { 
            let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
            let championshipInfo = driversChampionshipData.find(c => c.driver_number == driver.driver_number);
            let fullName = driverInfo.full_name ?? "-";
            chosenRaceResultsTable+=`
                <tr>
                    <td>${driver.position ?? "-"}</td>
                    <td>${championshipInfo.points_start}</td>
                    <td>${championshipInfo.points_current}</td>
                    <td>${championshipInfo.position_start}</td>
                    <td>${championshipInfo.position_current}</td>
                    <td>${driver.driver_number}</td>
                    <td>${fullName}</td>
                    <td>${driver.number_of_laps}</td>
                    <td>${driver.dnf === false ? "❌" : "✅"}</td>
                    <td>${driver.dsq === false ? "❌" : "✅"}</td>
                    <td>${driver.dns === false ? "❌" : "✅"}</td>
                </tr>
            `;
        });
        chosenRaceResultsTable+=`
            </tbody>
        </table>
        `;
        chosenRaceInfoBox.innerHTML += chosenRaceResultsTable;
    } catch (error) {
        console.log("error: ", error);
    } 
}