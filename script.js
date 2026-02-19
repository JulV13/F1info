document.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    const pageReadenPercent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    document.getElementById("read-progress-bar").style.width = pageReadenPercent + "%";

});

const getDriverInfo = async () => {
    try {
        const resp = await fetch("https://api.openf1.org/v1/drivers?driver_number=1&session_key=9158");
        const data = await resp.json();
        console.log(data);
    } catch (error) {
        console.log("error: ", error);
    }
}