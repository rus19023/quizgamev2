
var jsonFile;

var selectGame = (gameChoice) => {

    jsonFile  = document.getElementById('gameChoice').value.options[value.selectedIndex].value;
    console.log("jsonFile: " + jsonFile);
        
    //debugger;
    /*
    switch (gameChoice) {
        case gameChoice.lower().includes('exam'):
            console.log("it's an exam chosen");
            break;
        case gameChoice.lower().includes('quiz'):
            console.log("it's a quiz chosen");
            break;
        default:
            break;
    }
    if (gameChoice.includes('exam')) {
    } else {
    }  
    */  
}
