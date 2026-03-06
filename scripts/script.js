document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

const getLatestMeetingInfo = async () => {
    try {
        const weatherResponse = await fetch("https://api.openf1.org/v1/weather?session_key=latest");
        const weatherData = await weatherResponse.json();
        console.log(weatherData); 
        const sessionResponse = await fetch("https://api.openf1.org/v1/sessions?session_key=latest");
        const sessionData = await sessionResponse.json();
        console.log(sessionData); 

        const meetingResponse = await fetch("https://api.openf1.org/v1/meetings?meeting_key=latest");
        const meetingData = await meetingResponse.json();
        console.log(meetingData); 

        var latestMeetingBox = document.getElementById("latestMeetingBox");

        latestMeetingBox.innerHTML = '';

        console.log("weather length: ",weatherData.length);

        let weatherDirection = '';
        if (weatherData[weatherData.length-1].wind_direction >=0 && weatherData[weatherData.length-1].wind_direction <=89) weatherDirection='NE';
        if (weatherData[weatherData.length-1].wind_direction >=90 && weatherData[weatherData.length-1].wind_direction <=189) weatherDirection='SE';
        if (weatherData[weatherData.length-1].wind_direction >=190 && weatherData[weatherData.length-1].wind_direction <=269) weatherDirection='SW';
        if (weatherData[weatherData.length-1].wind_direction >=270 && weatherData[weatherData.length-1].wind_direction <=359) weatherDirection='NW';

        latestMeetingBox.innerHTML += `
            <br>
                <span class="latestMeetingTitle">${meetingData[0].meeting_official_name}</span>
                <span class="latestMeetingTitle">${sessionData[0].session_name}</span> 
            <hr>
            <div class="latestMeetingDataCountry">     
                <span>${sessionData[0].country_name}</span>
                <img src=${meetingData[0].country_flag}>            
            </div>
            <div class="latestMeetingDataCircuit">
                <span>${sessionData[0].circuit_short_name}</span>
                <img src=${meetingData[0].circuit_image}>
            </div>
            <hr>
            WEATHER CONDITIONS:
            <div class="lastestSessionWeatherBox">
                <span class="weatherData">🌡️ ${weatherData[weatherData.length-1].air_temperature ?? "-"}&deg</span>
                <span class="weatherData">🛣️ ${weatherData[weatherData.length-1].track_temperature ?? "-"}&deg</span>
                <span class="weatherData">💧 ${weatherData[weatherData.length-1].humidity ?? "-"}%</span>
                <span class="weatherData">⚠️ ${weatherData[weatherData.length-1].pressure ?? "-"} Pa</span>
                <span class="weatherData">🌧️ ${weatherData[weatherData.length-1].rainfall ?? "-"}</span>
                <span class="weatherData">💨 ${weatherData[weatherData.length-1].wind_speed ?? "-"} km/h - ${weatherDirection ?? "-"}</span>
            </div>
            <hr>
        `               
        
        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000);

        const latestResultsResponse = await fetch("https://api.openf1.org/v1/session_result?session_key=latest");
        const latestResultsData = await latestResultsResponse.json();
        console.log(latestResultsData);
        const driversResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
        const driversData = await driversResponse.json();

        let latestResultsTable = ``;

        if(`${sessionData[0].session_type}`=="Practice"){
            latestResultsTable = `
            <div style="overflow-x:auto; margin-top: 20px;">
            <table>
                <thead>
                <tr>
                    <td>POS.</td>
                    <td>DRIVER</td>
                    <td>LAPS</td>
                    <td>TIME</td>
                    <td>DNF</td>
                    <td>DSQ</td>
                    <td>DNS</td>
                </tr>
                </thead>
                <tbody>
            `;
            latestResultsData.forEach(driver => { 
                let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
                let fullName = driverInfo.full_name ?? "-";

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

                if (practicemiliSeconds / 100 < 1){
                    practicemiliSeconds = `0${practicemiliSeconds}`;
                }

                let practiceTime = `${practiceMinutes}:${practiceSeconds}.${practicemiliSeconds}`;
                if (practiceTime==`00:00.00` || practiceTime==`0:00.00` || practiceTime==`00:00.000`) {
                    practiceTime='-';
                }
                
                latestResultsTable+=`
                    <tr>
                        <td>${driver.position ?? "-"}</td>
                        <td>${fullName} #${driver.driver_number}</td>
                        <td>${driver.number_of_laps}</td>
                        <td>${practiceTime ?? "-"}</td>
                        <td>${driver.dnf === false ? "❌" : "✅"}</td>
                        <td>${driver.dsq === false ? "❌" : "✅"}</td>
                        <td>${driver.dns === false ? "❌" : "✅"}</td>
                    </tr>
                `;
            });
        }

        if(`${sessionData[0].session_type}`=="Qualifying"){
            latestResultsTable = `
            <div style="overflow-x:auto; margin-top: 20px;">
            <table>
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
            latestResultsData.forEach(driver => { 
                let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
                let fullName = driverInfo.full_name ?? "-";

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

                    if(q1miliSeconds / 100 < 1) {
                        q1miliSeconds = `0${q1miliSeconds}`;
                    }

                    if(q2miliSeconds / 100 < 1) {
                        q2miliSeconds = `0${q2miliSeconds}`;
                    }

                    if(q3miliSeconds / 100 < 1) {
                        q3miliSeconds = `0${q3miliSeconds}`;
                    }

                    let q1fullTime = `${q1Minutes}:${q1Seconds}.${q1miliSeconds}`;
                    if (q1fullTime == '00:00.0' || q1fullTime == '0:00.0' || q1fullTime == '0:00.00') {
                        q1fullTime = '-'
                    }

                    let q2fullTime = `${q2Minutes}:${q2Seconds}.${q2miliSeconds}`;
                    if (q2fullTime == '00:00.0' || q2fullTime == '0:00.0' || q2fullTime == '0:00.00') {
                        q2fullTime = '-'
                    }
                    
                    let q3fullTime = `${q3Minutes}:${q3Seconds}.${q3miliSeconds}`;
                    if (q3fullTime == '00:00.0' || q3fullTime == '0:00.0' || q3fullTime == '0:00.00') {
                        q3fullTime = '-'
                    }

                latestResultsTable+=`
                    <tr>
                        <td>${driver.position ?? "-"}</td>
                        <td>${fullName} #${driver.driver_number}</td>
                        <td>${driver.number_of_laps}</td>
                        <td>${q1fullTime ?? "-"}</td>
                        <td>${q2fullTime ?? "-"}</td>
                        <td>${q3fullTime ?? "-"}</td>
                        <td>${driver.dnf === false ? "❌" : "✅"}/${driver.dsq === false ? "❌" : "✅"}/${driver.dns === false ? "❌" : "✅"}</td>
                    </tr>
                `;
            });
        }

        if(`${sessionData[0].session_type}`=="Race"){
            latestResultsTable = `
            <div style="overflow-x:auto; margin-top: 20px;">
            <table>
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
            latestResultsData.forEach(driver => { 
                let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
                let fullName = driverInfo.full_name ?? "-";

                let raceHours = Math.trunc(driver.duration / 3600);
                let raceMinutes = Math.trunc((driver.duration / 60) - (raceHours*60));
                let raceSeconds = Math.trunc((driver.duration) - (raceHours*3600) - (raceMinutes*60));
                let raceMiliseconds = Math.trunc((driver.duration % 1) * 1000);

                if(raceMiliseconds / 100 < 1) {
                    raceMiliseconds = `0${raceMiliseconds}`;
                }

                if (raceSeconds / 10 < 1){
                    raceSeconds = `0${raceSeconds}`;
                }

                if (raceHours / 10 < 1){
                    raceHours = `0${raceHours}`;
                }

                let raceTime = `${raceHours}:${raceMinutes}:${raceSeconds}.${raceMiliseconds}`;
                if (raceTime==`0:0:00` || raceTime==`00:0:00` || raceTime==`00:0:00.00`) {
                    raceTime='-';
                }

                latestResultsTable+=`
                    <tr>
                        <td>${driver.position ?? "-"}</td>
                        <td>${fullName} #${driver.driver_number}</td>
                        <td>${driver.number_of_laps}</td>
                        <td>${raceTime ?? "-"}</td>
                        <td>${driver.dnf === false ? "❌" : "✅"}/${driver.dsq === false ? "❌" : "✅"}/${driver.dns === false ? "❌" : "✅"}</td>
                    </tr>
                `;
            });
        }


        latestResultsTable+=`
            </tbody>
        </table>
        </div>
        `;
        latestMeetingBox.innerHTML += latestResultsTable;
    } catch (error) {
        console.log("error: ", error);
    }
}