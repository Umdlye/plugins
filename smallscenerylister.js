/// <reference path="C:/Users/Steph/Desktop/plugin/openrct2.d.ts" />

var list = {};       // Empty object that will hold the counted map objects
var arr = [];        // Empty array
var windowlist = []; // Empty array that will hold the window contents

function build() {
    for (var y = 0; y < map.size.y; y++) {              // Loop over every Y tile coordinate
        for (var x = 0; x < map.size.x; x++) {             // Loop over every X tile coordinate in the Y coordinate
            var tile = map.getTile(x, y);                      // Get the tile at the current coordinate, save to 'tile' variable
            for (var i = 0; i < tile.numElements; i++) {       // Loop over every tile element on the 'tile'...
                var element = tile.getElement(i);                  // ...get the specified element, save to 'element' variable
                if (element.type === 'small_scenery') {            // If the element is a small scenery object...
                    var objindex = element.object;                     // ...save the object index to 'objindex' variable
                    if (list[objindex]) {                              // If the 'objindex' already has a key in our 'list' object...
                        list[objindex]++;                                  // ...increase its value by one
                    } else {                                           // If not...
                        list[objindex] = 1;                                // ...set its value to one (also creates the key)
                    };
                };
            };
        };
    };

    arr = Object.keys(list)                         // Put the keys (the object indexes) from our 'list' object into our empty array 'arr' (e.g. [0, 1, 2])
    .map(function(key){return [key, list[key]]})    // Turn every key in the array into an array containing the key (the object indexes) and its value (the object counts) (e.g. [[0, 34], [1, 3], [2, 12]])
    .sort(function(a, b){return a[1] - b[1]});      // Sort the array in ascending order of the values of the sub-arrays (e.g. [[1, 3], [2, 12], [0, 34]])
    
    createwindowlist();  // Generate the window contents (widgets) based on the above array (see below)
};

var entryY = 15;
var entryX = 0;      // The initial X position of a widget
var winwidth = 200;  // The initial window width
var winheight = 15;  // The initial window height

function createwindowlist() {
    for (i = 0; i < arr.length; i++) {                                  // Loop over every item in our array of map objects
        var obj = context.getObject('small_scenery', Number(arr[i][0]));    // Get the object name for the specified object index

        var entry = {                                                       // Create a widget object and save it to 'entry' variable:
            type: 'label',                                                      // - a label widget is just a bit of text
            x: entryX,                                                          // - the X position will initially be 15
            y: entryY,                                                          // - the Y position will initially be 0
            width: 200,                                                         // - the width of the widget is 200 to match the window width
            height: 10,                                                         // - using a small font so 10 pixels is high enough
            text: '{SMALLFONT}' + obj.name + ': ' + arr[i][1]                   // - list the object name and the object count
        };
        windowlist.push(entry);                                             // Put the 'entry' created above into the 'windowlist' array
        entryY += 10;                                                       // Increase 'entryY' by 10 (so the next entry will be 10 pixels lower)
        if (winheight <= 400) {                                             // If the window height is smaller than 400 pixels...
            winheight += 15;                                                    // ...increase it by 15
        };
        if (entryY >= 400) {                                                // If entryY becomes larger than 400 we'll want to start putting the new entries in a new column...
            entryY = 15;                                                        // ...so the next entry's Y position will be 15 again
            entryX += 200;                                                      // ...but it'll be 200 pixels to the right
            winwidth += 200;                                                    // ...increase the window width to match
        };
    };
};

function clear() {    // This is what we want to do when we close the window
    windowlist = [];    // Empty the widget list so it doesn't get duplicated next time we open the window
    entryY = 15;         // And reset the initial entry positions and window sizes
    entryX = 0;
    winwidth = 150;
    winheight = 15;
};

var window;                                     // Here we create the window itself
function openwindow() {                         // This will be triggered when we click the menu item for the window
    window = ui.getWindow('lister');                // Get the window specified below
    if (window) {                                   // If it's already open...
        window.bringToFront();                          // ...bring it to the front
        return;
    };

    window = ui.openWindow({                        // Specify the window here:
        classification: 'lister',                       // - 'classification' is the window's name in the script
        title: 'Small scenery object lister',           // - 'title' is the name shown in the window title bar
        x: 5,                                           // - X position on the screen
        y: 30,                                          // - Y position on the screen
        width: winwidth,                                // - the generated window width (from 'createwindowlist()')
        height: winheight,                              // - the generated window height
        widgets: windowlist,                            // - the generated list of widgets
        onClose: clear()                                // - do 'clear()' when the window is closed (see above)
    });
};

function main() {                                                    // 'main' is executed when the plug-in starts, we only do one thing:
    ui.registerMenuItem('Small scenery object lister', function() {     // Register a menu item (in the map toolbar menu)...
        build();                                                            // ...which does build() (see above)
        openwindow();                                                       // ...and openwindow() (see above)
    });
};

registerPlugin({
    name: 'Small scenery object lister',
    version: '1.0',
    authors: 'Umdlye',
    type: 'remote',
    main: main
});
