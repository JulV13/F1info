document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

const getSessionsInfo = async () => {
    try {
        const d = new Date();
        let year = d.getFullYear();
        var seasonSelect = document.getElementById("seasonSelect").value ?? year;
        var sessionTypeSelect = document.getElementById("sessionTypeSelect").value;
        var seasonResponse = '';
        if (sessionTypeSelect=="All") {
            seasonResponse = await fetch(`https://api.openf1.org/v1/sessions?year=${seasonSelect}`);
        } else {
            seasonResponse = await fetch(`https://api.openf1.org/v1/sessions?year=${seasonSelect}&session_type=${sessionTypeSelect}`);
        }
        const seasonData = await seasonResponse.json();
        console.log(seasonData);
        const allSessionsBox = document.getElementById("allSessionsBox");
        allSessionsBox.innerHTML='';
        allSessionsBox.style.visibility = "visible";

        meetingResponse = await fetch(`https://api.openf1.org/v1/meetings?year=${seasonSelect}`);
        const meetingData = await meetingResponse.json();

        seasonData.forEach(session => {
            let meetingInfo = meetingData.find(m => m.meeting_key == session.meeting_key);
            allSessionsBox.innerHTML+=`
                <div class="sessionBox">
                    <span>${session.session_name} - ${session.circuit_short_name} - ${session.country_name}</span>   
                    <img src=${meetingInfo.country_flag} alt="country flag"></img>
                    <img src=${meetingInfo.circuit_image} alt="circuit image"></img>
                    <button id="sessionResultsButton" onclick="sessionResults(${session.session_key})">Results</button>
                    <button id="hideResultsButton" onclick="hideResults(${session.session_key})">Hide</button>
                </div>
                <div id="results_${session.session_key}" class="chosenSessionInfoBox"></div>
            `
        });
    } catch (error) {
        console.log("error: ", error);
    }
}

const sessionResults = async (session_key) => {
      try {

        const sessionResultsResponse = await fetch(`https://api.openf1.org/v1/session_result?session_key=${session_key}`);
        const sessionResultsData = await sessionResultsResponse.json();
        console.log(sessionResultsData);

        const driversResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${session_key}`);
        const driversData = await driversResponse.json();

        const driversChampionshipResponse = await fetch(`https://api.openf1.org/v1/championship_drivers?session_key=${session_key}`);
        const driversChampionshipData = await driversChampionshipResponse.json();

        const chosenSessionInfoBox = document.getElementById(`results_${session_key}`);
        chosenSessionInfoBox.innerHTML = '';
        const sessionResultsButton = document.getElementById("sessionResultsButton");
        sessionResultsButton.disabled = true;
        const hideResultsButton = document.getElementById("hideResultsButton");
        hideResultsButton.disabled = false;

        const target = document.getElementById(`results_${session_key}`);
        sessionResultsButton.addEventListener("click", () => {
            target.scrollIntoView({behavior: 'smooth'});
        });

        let chosenSessionResultsTable = `
        <div style="overflow-x:auto">
        <table class="sessionResults">
            <thead>
            <tr>
                <td>POS.</td>
                <td>DRIVER</td>
                <td>#</td>
                <td>PTS [<]</td>
                <td>PTS [>]</td>
                <td>WDC [<]</td>
                <td>WDC [>]</td>
                <td>LAPS</td>
                <td>DNF/DSQ/DNS</td>
            </tr>
            </thead>
            <tbody>
        `;
        sessionResultsData.forEach(driver => { 

            let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
            let championshipInfo = driversChampionshipData.find(c => c.driver_number == driver.driver_number);
            let lastName = `${driverInfo.last_name}`;
            let lastNameSliced = lastName.slice(0,3).toUpperCase();

            chosenSessionResultsTable+=`
                <tr>
                    <td>${driver.position ?? "-"}</td>
                    <td>${lastNameSliced}</td>
                    <td>${driver.driver_number}</td>
                    <td>${championshipInfo.points_start}</td>
                    <td>${championshipInfo.points_current}</td>
                    <td>${championshipInfo.position_start ?? "-"}</td>
                    <td>${championshipInfo.position_current}</td>
                    <td>${driver.number_of_laps}</td>
                    <td>${driver.dnf === false ? "❌" : "✅"}/${driver.dsq === false ? "❌" : "✅"}/${driver.dns === false ? "❌" : "✅"}</td>
                </tr>
            `;
        });
        chosenSessionResultsTable+=`
            </tbody>
        </table>
        </div>
        `;
        chosenSessionInfoBox.innerHTML += chosenSessionResultsTable;
    } catch (error) {
        console.log("error: ", error);
    } 
}

const hideResults = async (session_key) => {
    try {
        const sessionResults = document.getElementById(`results_${session_key}`);
        sessionResults.innerHTML = '';
        const resultsButton = document.getElementById("sessionResultsButton");
        resultsButton.disabled = false;

    } catch (error) {
        console.log("error: ", error);
    }
}