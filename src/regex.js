// @flow

// Return a string representation of a RegExp pattern, which will match any of the words given
var eitherWordPattern = (words: string[]) => {
    return `\\b(?:${words.join('|')})\\b`;
};

// Perform a safe regexp replacement that preserves capitalization
var safeReplace = (text: string, find: string, replace: string) => {        
    const pattern = new RegExp(find, 'gi');
    var replacedText = text.replace(pattern, (match, specific) => {
        var isTextCapitalized = /[A-Z]/.test(text.substring(specific, specific + 1));
        var sensitiveReplace = replace;
        if (isTextCapitalized === true) {
            sensitiveReplace = replace.charAt(0).toUpperCase() + replace.substring(1);
        }
        return sensitiveReplace;
    });
    return replacedText;
};

export {eitherWordPattern, safeReplace};