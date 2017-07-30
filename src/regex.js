/**
 * Return a string representation of a RegExp pattern, which will match any of the words given
 *
 * @param {Array} words
 */
var eitherWordPattern = (words) => {
    return `\\b(?:${words.join('|')})\\b`;
};

/**
 * perform a safe regexp replacement that preserves capitalization
 *
 * @param {String} text
 * @param {String} find string regex pattern
 * @param {String|Array} replace if not a string, will assume an array and try and use the first item
 */
var safeReplace = (text, find, replace) => {
    if (!(typeof replace === 'string' || replace instanceof String)) {
        replace = replace[0];
    }
        
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