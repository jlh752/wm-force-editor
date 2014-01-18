War Metal Force Editor
======================

This project allows you to build a force for War Metal using a web browser drag-and-drop interface.

##Usage
A live copy of this is available here: http://greymarch.x10.mx/force_ed.php

Drag units from the left-hand area to valid slot in the formation in the right-hand area. The game logic of War Metal is implemented here; for example, you may only use one instance of unique units. Holding shift while dragging a unit in your formation will attempt to duplicate the unit if possible (rather than just moving it). By double clicking on a unit, it will perform the action which would happen in the actual War Metal force builder (e.g. a unit in formation will be removed, a unit in the left-hand area will be added to the first available slot).

There is a drop-down menu in the formation area which will allow you switch which formation you are using. When you switch formation, the units already in your formation will be preserved (or removed if the new formation is smaller).

In the top of the left-hand area, there are 2 options to help you locate units easier:
* Type Filter - filter the list of units by their type
* Unit Search - search for a unit. This searches all of the properties of the unit including their name and ability description. The language used in the ability description is designed to be easy to search; for example, searching for 'jam xeno' will bring up all units who can jam a Xeno type unit.

Also in the left hand are the save and load buttons. The save button will open a dialog containing some text representing your force, you can save this and use it later. Such uses include:
* sharing with friends
* import it into War Metal with an appropriate script or browser extension
* load it using the force editor later
* test it in a War Metal simulator
The load button will open a dialog box where you should paste a force code, it will then load it into the formation area.

A box containing a short description of the last unit your mouse went over is displayed at the bottom of the left-hand area.

##Technology
As this project was an exercise to learn AngularJS, it is the main framework used. jQueryUI and some plugins for it were also used.