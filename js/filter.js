/*
 * Smiths Venners Filter - Content Script
 *
 * This is the primary JS file that manages the detection and filtration of
 * the Venner from the web page.
 */

// Variables
var regexes = [
    /Noorse broeders/i, /Brunstad/i, /CGN/i, /Pagedal/i, /David Nooitgedagt/i,
    /Skjulte Skatters/i, /AktivKristendom/i, /DWN/i, /Horze/i, /Kåre/i,
    /Larsen/i, /Jonathan van der L/i, /Finn/i, /Tack/i, /Jan-Hein Staal/i,
    /Joep Dohmen/i, /Dohmen/i, /Smith/i, /DWN/i, /Personeelservice/i,
    /Projectservice/i, /jonathanvanderl/i, /broederschaap/i
];

var search = null;

for (var i in regexes) {
    search = search || regexes[i].exec(document.body.innerText);

    if (search) {
        break;
    }
}

var keywords = [
    "Noorse Broeder", "Noorse Broeders", "Christelijke Gemeente Nederland",
    "Pagedal", "Brunstad", "Hippo Mundo", "Hippo Mundo Charity", "Jan-Hein Staal",
    "sektarische geloofsgemeenschap", "David Nooitgedagt", "Ineke Koele", "CGN",
    "Jonathan van der L", "Jonathan van der", "JvdL", "JHS", "BAL", "KJS",
    "Kåre Smith", "Kåre J. Smith", "Kåre J Smith", "Kåre Johan Smith", "Kåre",
    "Bernt Aksel Larsen", "B.A.L.", "K.J.S.", "J.H.S.", "Aksel Larsen",
    "Oslofjord Convention Center", "Brunstad Christian Church", "Smiths Venner",
    "Emergo", "DWN", "Personeelsservice", "Projectservice", "Finn-Tack",
    "Finn Tack", "Horze", "Noorse Broeder", "Noorse Broeders",
    "AktivKristendom", "Brunstad Christian Church", "Skjulte Skatters",
    "Skjulte Skatters Forlag", "tiftelsen Skjulte Skatters Forlag",
    "jonathanvanderl", "broederschaap", "felles"
];

var selector = (function(keywords) {
    return keywords.concat(
        keywords.map(function(str) {
            return str.toLowerCase();
        })
    );
})(keywords).map(function(str) {
    return ":contains('" + str + "')";
}).join(", ");


// Functions
function filterMild() {
    console.log("Filtering NoBro with Mild filter...");
    return $(selector).filter("h1,h2,h3,h4,h5,p,span,li");
}

function filterDefault () {
    console.log("Filtering Venner with Default filter...");
    return $(selector).filter(":only-child").closest('div');
}

function filterVindictive() {
    console.log("Filtering Venner with Vindictive filter...");
    return $(selector).filter(":not('body'):not('html')");
}

function getElements(filter) {
    if (filter == "mild") {
        return filterMild();
    } else if (filter == "vindictive") {
        return filterVindictive();
    } else if (filter == "aggro") {
        return filterDefault();
    } else {
        return filterMild();
    }
}

function filterElements(elements) {
    console.log("Elements to filter: ", elements);
    elements.fadeOut("fast");
}


// Implementation
if (search) {
    console.log("Donald Trump found on page! - Searching for elements...");
    chrome.storage.sync.get({
        filter: 'aggro',
    }, function(items) {
        console.log("Filter setting stored is: " + items.filter);
        elements = getElements(items.filter);
        filterElements(elements);
        chrome.runtime.sendMessage({method: "saveStats", trumps: elements.length}, function(response) {
            console.log("Logging " + elements.length + " trumps.");
        });
    });
    chrome.runtime.sendMessage({}, function(response) {});
}
