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
        const meetingResponse = await fetch("https://api.openf1.org/v1/meetings?meeting_key=latest");
        const meetingData = await meetingResponse.json();
        console.log(meetingData); 

        var latestMeetingBox = document.getElementById("latestMeetingBox");

        let weatherDirection = '';
        if (weatherData[558].wind_direction >=0 && weatherData[558].wind_direction <=89) weatherDirection='North-East';
        if (weatherData[558].wind_direction >=90 && weatherData[558].wind_direction <=189) weatherDirection='South-East';
        if (weatherData[558].wind_direction >=190 && weatherData[558].wind_direction <=269) weatherDirection='South-West';
        if (weatherData[558].wind_direction >=270 && weatherData[558].wind_direction <=359) weatherDirection='North-West';

        latestMeetingBox.innerHTML += `
            <br>
            <span>${meetingData[0].meeting_official_name}</span>
            <div style="display: flex; flex-direction: row; align-items: center; justify-content: center; margin: 0 auto; gap: 20px;">
                <img src="${meetingData[0].country_flag}">                
                <img src="${meetingData[0].circuit_image}">
                <span>${meetingData[0].country_name}</span>
                <span>${meetingData[0].circuit_short_name}</span>   
            </div>
            <div style="display: flex; flex-direction: column; margin-top: 20px;">
                <span class="weatherData">🌡️ air: ${weatherData[558].air_temperature}&deg</span>
                <span class="weatherData">🌡️ track: ${weatherData[558].track_temperature}&deg</span>
                <span class="weatherData">💧 humidity: ${weatherData[558].humidity}</span>
                <span class="weatherData">⚠️ pressure: ${weatherData[558].pressure}</span>
                <span class="weatherData">🌧️ rainfall: ${weatherData[558].rainfall}</span>
                <span class="weatherData">🧭 wind: ${weatherDirection} (${weatherData[558].wind_direction})</span>
                <span class="weatherData">💨 wind speed: ${weatherData[558].wind_speed}</span>
            </div>
        `

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        await sleep(1000);

        const latestResultsResponse = await fetch("https://api.openf1.org/v1/session_result?session_key=latest");
        const latestResultsData = await latestResultsResponse.json();
        console.log(latestResultsData);
        const driversResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=latest");
        const driversData = await driversResponse.json();

        let latestResultsTable = `
        <div style="overflow-x:auto; margin-top: 20px;">
        <table>
            <thead>
            <tr>
                <td>POS.</td>
                <td>#</td>
                <td>DRIVER</td>
                <td>LAPS</td>
                <td>DNF/DSQ/DNS</td>
            </tr>
            </thead>
            <tbody>
        `;
        latestResultsData.forEach(driver => { 
            let driverInfo = driversData.find(d => d.driver_number == driver.driver_number);
            let fullName = driverInfo.full_name ?? "-";
            latestResultsTable+=`
                <tr>
                    <td>${driver.position ?? "-"}</td>
                    <td>${driver.driver_number}</td>
                    <td>${fullName}</td>
                    <td>${driver.number_of_laps}</td>
                    <td>${driver.dnf === false ? "❌" : "✅"}/${driver.dsq === false ? "❌" : "✅"}/${driver.dns === false ? "❌" : "✅"}</td>
                </tr>
            `;
        });
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