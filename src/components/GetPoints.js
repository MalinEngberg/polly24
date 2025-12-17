
function GetPoints(starttime,timeleft,placement) {
    const basePoints = 300;
    let timeBonus = 0;
    if(timeleft >= starttime*0.8){
        timeBonus = timeleft * 30;
    }
    else{
         timeBonus = timeleft * 20;
    }
     // 10 points per second left
    const placementMultiplier = Math.max(0,3 - placement);

    const totalPoints = (basePoints + timeBonus) * placementMultiplier;
    return totalPoints;
}
export default GetPoints;