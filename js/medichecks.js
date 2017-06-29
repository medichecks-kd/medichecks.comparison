/**
 *
 * commonly used functions, mainly for backward compatibility
 *
 **/
function Medichecks()
{
    // Create object to prevent scope issues
}

// Returns whether element has the specified class
Medichecks.prototype.hasClass = function(element, className)
{
    if (element.classList)
        return element.classList.contains(className);
    else
        return new RegExp('(^| )' + className + '( |$)', 'gi').test(element.className);
}

// Add a class to an element (IE8+)
// Base on http://youmightnotneedjquery.com
Medichecks.prototype.addClass = function(element, className)
{
    if (element.classList)
        element.classList.add(className);
    else
        element.className += ' ' + className;
}


// Remove a class from an element (IE8+)
// Base on http://youmightnotneedjquery.com
Medichecks.prototype.removeClass = function(element, className)
{
    if (element.classList)
        element.classList.remove(className);
    else
        element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};


/** Debugging **/

function _m(msg)
{
    console.log(msg);
}
