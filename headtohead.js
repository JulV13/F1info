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

        driversData.forEach(driver => {
            let driverName = driverData.find(d => d.driver_number === driver.driver_number)
            headToHeadSelect1.innerHTML += `
            <option value="${driver.driver_number}">${driverName.full_name}</option>
            `;
            headToHeadSelect2.innerHTML += `
            <option value="${driver.driver_number}">${driverName.full_name}</option>
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

        const driverResponse = await fetch("https://api.openf1.org/v1/drivers?session_key=9839");
        const driverData = await driverResponse.json();

        var headToHeadBox = document.getElementById("headToHeadBox");
        headToHeadBox.innerHTML = '';
        headToHeadBox.style.visibility="visible";
        headToHeadData.forEach(driver => {
            let driverName = driverData.find(d => d.driver_number === driver.driver_number)
            headToHeadBox.innerHTML += `
                <div class="headToHeadCard">
                    <span>${driverName.full_name}</span>
                    <span class="driverNumber">#${driver.driver_number}</span>
                    <span>position: ${driver.position_current}</span>
                    <span>points: ${driver.points_current}</span>
                </div>
            `
        });
    } catch (error) {
       console.log("error: ", error); 
    }
}