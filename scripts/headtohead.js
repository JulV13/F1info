document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

window.onload = headToHeadSelectLoad = async () => {
    try {
        const driversResponse = await fetch("https://api.openf1.org/v1/championship_drivers?session_key=9839");
        const driversData = await driversResponse.json();
        console.log(driversData);

        const driverResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=9839");
        const driverData = await driverResponse.json();

        var headToHeadSelect1 = document.getElementById("headToHeadSelect1");
        var headToHeadSelect2 = document.getElementById("headToHeadSelect2");

        let select1data = '', select2data = '';
        driversData.forEach(driver => {
            let driverName = driverData.find(d => d.driver_number === driver.driver_number)
            if(driverName !== undefined) {
            select1data+=`
                <option value="${driver.driver_number}">${driverName.full_name}</option>
            `;
            select2data+=`
                <option value="${driver.driver_number}">${driverName.full_name}</option>
            `
            } 
        });
        headToHeadSelect1.innerHTML += select1data;
        headToHeadSelect2.innerHTML += select2data;
    } catch (error) {
        console.log("error: ", error);
        var headToHeadBox = document.getElementById("headToHeadBox");
        headToHeadBox.innerHTML = '';
        headToHeadBox.style.visibility="visible";
        headToHeadBox.innerHTML = 'error occured: ' + error;
    }
}

const headToHead = async () => {
    try {
        let driver1 = document.getElementById("headToHeadSelect1").value;
        let driver2 = document.getElementById("headToHeadSelect2").value;
        const headToHeadResponse = await fetch(`https://api.openf1.org/v1/championship_drivers?session_key=9839&driver_number=${driver1}&driver_number=${driver2}`);
        const headToHeadData = await headToHeadResponse.json();
        console.log(headToHeadData);

        const driverResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=9839");
        const driverData = await driverResponse.json();

        var headToHeadBox = document.getElementById("headToHeadBox");
        headToHeadBox.innerHTML = '';
        headToHeadBox.style.visibility="visible";
        headToHeadData.forEach(driver => {
            let driverInfo = driverData.find(d => d.driver_number === driver.driver_number)
            headToHeadBox.innerHTML += `
                <div class="driverCard" style="background-color: #${driverInfo.team_colour}">
                    <img src="${driverInfo.headshot_url}" class="driverImage" style="border: 4px solid #${driverInfo.team_colour}">
                    <span class="driverName">${driverInfo.full_name} <span class="driverNumber">${driver.driver_number}</span></span>
                    <span class="driverPoints">pts. ${driver.points_current}</span>
                    <span class="driverTeam">${driverInfo.team_name}</span>
                </div>
            `
        });
    } catch (error) {
       console.log("error: ", error); 
    }
}