// function that returns a character on either side of the given character according to a qwert keyboard layout
export const getMistake = (char: string): string => {
    // if char is not a letter return it as it is
    if (!char.match(/[a-zA-Z]/)) {
        return char;
    }
    
    //  check if char is upper or lower case and store the value in a variable
    const isUpperCase = char === char.toUpperCase();
    char = char.toLowerCase();
    var returnChar = "";

    const qwerty = [
        "qwertyuiop",
        "asdfghjkl",
        "zxcvbnm",
    ];
    for (let i = 0; i < qwerty.length; i++) {
        const row = qwerty[i];
        const index = row.indexOf(char);
        if (index !== -1) {
            if (index === 0) {
                return row[index + 1];
            } else if (index === row.length - 1) {
                returnChar = row[index - 1];
            } else {
                returnChar = Math.random() > 0.5 ? row[index - 1] : row[index + 1];
            }
        }
    }
    if (isUpperCase) {
        returnChar = returnChar.toUpperCase();
    }
    return returnChar;
}