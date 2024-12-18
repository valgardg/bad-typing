// function that returns a character on either side of the given character according to a qwert keyboard layout
export const getMistake = (char: string): string => {
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
                return row[index - 1];
            } else {
                return Math.random() > 0.5 ? row[index - 1] : row[index + 1];
            }
        }
    }
    return "";
}