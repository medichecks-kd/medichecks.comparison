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

/** Debugging **/

function _m(msg)
{
    console.log(msg);
}
