const getRacesInfo = async () => {
    try {
        const d = new Date();
        let year = d.getFullYear();
        var seasonSelect = document.getElementById("seasonSelect").value ?? year;
        const seasonResponse = await fetch(`https://api.openf1.org/v1/sessions?year=${seasonSelect}&session_type=Race`);
        const seasonData = await seasonResponse.json();
        console.log(seasonData);
        const racesBox = document.getElementById("racesBox");

        seasonData.forEach(race => { 
            racesBox.innerHTML+=`
                <div id="raceBox">
                    <span>${race.circuit_short_name}</span>
                    <span>${race.country_name}</span>
                    <span>${race.session_name}</span>
                </div>
            `
        });
    } catch (error) {
        console.log("error: ", error);
    }
}