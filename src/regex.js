/**
 * Return a string representation of a RegExp pattern, which will match any of the words given
 *
 * @param {Array} words
 */
var eitherWordPattern = (words) => {
    return`\b(${words.join('|')})\b`
};

/**
 * perform a safe regexp replacement that preserves capitalization
 *
 * @param {String} text
 * @param {String} find string regex pattern
 * @param {String} replace
 */
var safeReplace = (text, find, replace) => {
    const pattern = new RegExp(find, 'gi');
    text = text.replace(pattern, (match, specific) => {
        if (/[A-Z]/.test(specific.substring(0, 1))){
            return replace.charAt(0).toUpperCase() + replace.substring(1);
        }
        return replace;
    });
    return text;
};

export {eitherWordPattern, safeReplace};