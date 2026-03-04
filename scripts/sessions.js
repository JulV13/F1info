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
            let sessionDate = `${session.date_start}`.slice(0,10);
            let meetingInfo = meetingData.find(m => m.meeting_key == session.meeting_key);
            allSessionsBox.innerHTML+=`
                <div class="sessionBox">
                    <div class="sessionTypeInfo">
                        <span>${session.session_name}</span>
                        <span>${session.country_name}</span>
                        <span>${session.circuit_short_name}</span>
                        <span>${sessionDate}</span>
                    </div>
                    <div class="sessionImages">
                        <img class="sessionCountryImage" src=${meetingInfo.country_flag} alt="country flag"></img>
                        <img class="sessionCircuitImage" src=${meetingInfo.circuit_image} alt=""></img>
                    </div>
                    <div class="sessionButtons">
                        <button id="sessionResultsButton" onclick="sessionResults(${session.session_key})">results</button>
                        <button id="hideResultsButton" onclick="hideResults(${session.session_key})">hide</button>
                    </div>
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

        const sessionResponse = await fetch(`https://api.openf1.org/v1/sessions?session_key=${session_key}`);
        const sessionData = await sessionResponse.json();
        console.log(sessionData);

        const driversResponse = await fetch(`https://api.openf1.org/v1/drivers?session_key=${session_key}`);
        const driversData = await driversResponse.json();

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000);

        const driversChampionshipResponse = await fetch(`https://api.openf1.org/v1/championship_drivers?session_key=${session_key}`);
        const driversChampionshipData = await driversChampionshipResponse.json();

        const chosenSessionInfoBox = document.getElementById(`results_${session_key}`);
        chosenSessionInfoBox.innerHTML = '';
        const sessionResultsButton = document.getElementById("sessionResultsButton");
        sessionResultsButton.disabled = true;
        const hideResultsButton = document.getElementById("hideResultsButton");
        hideResultsButton.disabled = false;
    
        let chosenSessionResultsTable = ``;

        if(`${sessionData[0].session_type}`=="Race") {

            chosenSessionResultsTable = `
            <div style="overflow-x:auto">
            <table class="sessionResults">
                <thead>
                <tr>
                    <td>POS.</td>
                    <td>DRIVER</td>
                    <td>POINTS</td>
                    <td>WDC</td>
                    <td>LAPS</td>
                    <td>TIME</td>
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

                    let raceHours = Math.trunc(driver.duration / 3600);
                    let raceMinutes = Math.trunc((driver.duration / 60) - (raceHours*60));
                    let raceSeconds = Math.trunc((driver.duration) - (raceHours*3600) - (raceMinutes*60));

                    if (raceSeconds / 10 < 1){
                        raceSeconds = `0${raceSeconds}`;
                    }

                    if (raceHours / 10 < 1){
                        raceHours = `0${raceHours}`;
                    }

                    let raceTime = `${raceHours}:${raceMinutes}:${raceSeconds}`;
                    if (raceTime==`0:0:00` || raceTime==`00:0:00`) {
                        raceTime='-';
                    }

                    chosenSessionResultsTable+=`
                        <tr>
                            <td>${driver.position ?? "-"}</td>
                            <td>${lastNameSliced} #${driver.driver_number}</td>
                            <td>${championshipInfo.points_start} -> ${championshipInfo.points_current} [+${championshipInfo.points_current - championshipInfo.points_start}]</td>
                            <td>${championshipInfo.position_start ?? "0"} -> ${championshipInfo.position_current}</td>
                            <td>${driver.number_of_laps}</td>
                            <td>${raceTime}</td>
                            <td>${driver.dnf === false ? "❌" : "✅"}/${driver.dsq === false ? "❌" : "✅"}/${driver.dns === false ? "❌" : "✅"}</td>
                        </tr>
                    `;
            });
        }

        if(`${sessionData[0].session_type}`=="Qualifying"){

            chosenSessionResultsTable = `
            <div style="overflow-x:auto">
            <table class="sessionResults">
                <thead>
                <tr>
                    <td>POS.</td>
                    <td>DRIVER</td>
                    <td>LAPS</td>
                    <td>Q1</td>
                    <td>Q2</td>
                    <td>Q3</td>
                    <td>DNF/DSQ/DNS</td>
                </tr>
                </thead>
                <tbody>
            `;        
            
            sessionResultsData.forEach(driver => { 

                    let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
                    let sessionResultsInfo = sessionResultsData.find(ss => ss.driver_number == driver.driver_number)
                    let lastName = `${driverInfo.last_name}`;
                    let lastNameSliced = lastName.slice(0,3).toUpperCase();

                    let q1time = driver.duration[0];
                    let q2time = driver.duration[1];
                    let q3time = driver.duration[2];

                    let q1Minutes = Math.trunc((q1time / 60));
                    let q1Seconds = Math.trunc((q1time) - (q1Minutes*60));
                    let q1miliSeconds = Math.trunc((q1time % 1) * 1000);

                    let q2Minutes = Math.trunc((q2time / 60));
                    let q2Seconds = Math.trunc((q2time) - (q2Minutes*60));
                    let q2miliSeconds = Math.trunc((q2time % 1) * 1000);

                    let q3Minutes = Math.trunc((q3time / 60));
                    let q3Seconds = Math.trunc((q3time) - (q3Minutes*60));
                    let q3miliSeconds = Math.trunc((q3time % 1) * 1000);

                    if (q1Seconds / 10 < 1){
                        q1Seconds = `0${q1Seconds}`;
                    }

                    if (q2Seconds / 10 < 1){
                        q2Seconds = `0${q2Seconds}`;
                    }

                    if (q3Seconds / 10 < 1){
                        q3Seconds = `0${q3Seconds}`;
                    }

                    let q1fullTime = `${q1Minutes}:${q1Seconds}.${q1miliSeconds}`;
                    if (q1fullTime == '00:00.0' || q1fullTime == '0:00.0') {
                        q1fullTime = '-'
                    }

                    let q2fullTime = `${q2Minutes}:${q2Seconds}.${q2miliSeconds}`;
                    if (q2fullTime == '00:00.0' || q2fullTime == '0:00.0') {
                        q2fullTime = '-'
                    }
                    
                    let q3fullTime = `${q3Minutes}:${q3Seconds}.${q3miliSeconds}`;
                    if (q3fullTime == '00:00.0' || q3fullTime == '0:00.0') {
                        q3fullTime = '-'
                    }

                    chosenSessionResultsTable+=`
                        <tr>
                            <td>${driver.position ?? "-"}</td>
                            <td>${lastNameSliced} #${driver.driver_number}</td>
                            <td>${sessionResultsInfo.number_of_laps ?? "-"}</td>
                            <td>${q1fullTime}</td>
                            <td>${q2fullTime}</td>
                            <td>${q3fullTime}</td>
                            <td>${sessionResultsInfo.dnf === false ? "❌" : "✅"}/${sessionResultsInfo.dsq === false ? "❌" : "✅"}/${sessionResultsInfo.dns === false ? "❌" : "✅"}</td>
                        </tr>
                    `;                
            });
        }

        if(`${sessionData[0].session_type}`=="Practice"){

            chosenSessionResultsTable = `
            <div style="overflow-x:auto">
            <table class="sessionResults">
                <thead>
                <tr>
                    <td>POS.</td>
                    <td>DRIVER</td>
                    <td>LAPS</td>
                    <td>TIME</td>
                    <td>DNF/DSQ/DNS</td>
                </tr>
                </thead>
                <tbody>
            `;        
            
            sessionResultsData.forEach(driver => { 

                    let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
                    let sessionResultsInfo = sessionResultsData.find(ss => ss.driver_number == driver.driver_number)
                    let lastName = `${driverInfo.last_name}`;
                    let lastNameSliced = lastName.slice(0,3).toUpperCase();

                    let practiceMinutes = Math.trunc((driver.duration / 60));
                    let practiceSeconds = Math.trunc((driver.duration) - (practiceMinutes*60));
                    let practicemiliSeconds = Math.trunc((driver.duration % 1) * 1000);

                    if (practiceMinutes / 10 < 1){
                        practiceMinutes = `0${practiceMinutes}`;
                    }

                    if (practiceSeconds / 10 < 1){
                        practiceSeconds = `0${practiceSeconds}`;
                    }

                    if (practicemiliSeconds / 10 < 1){
                        practicemiliSeconds = `0${practicemiliSeconds}`;
                    }

                    let practiceTime = `${practiceMinutes}:${practiceSeconds}.${practicemiliSeconds}`;
                    if (practiceTime==`00:00.00` || practiceTime==`0:00.00`) {
                        practiceTime='-';
                    }

                    chosenSessionResultsTable+=`
                        <tr>
                            <td>${driver.position ?? "-"}</td>
                            <td>${lastNameSliced} #${driver.driver_number}</td>
                            <td>${sessionResultsInfo.number_of_laps ?? "-"}</td>
                            <td>${practiceTime}</td>
                            <td>${sessionResultsInfo.dnf === false ? "❌" : "✅"}/${sessionResultsInfo.dsq === false ? "❌" : "✅"}/${sessionResultsInfo.dns === false ? "❌" : "✅"}</td>
                        </tr>
                    `;                
            });
        }

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