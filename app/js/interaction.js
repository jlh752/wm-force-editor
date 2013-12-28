/*unit scoller functionality*/
function sticky_relocate() {
	var window_top = $(window).scrollTop();
	var div_top = $('#scroller-anchor').offset().top;
	
	if (window_top > div_top){
		$('#scroller').addClass('sticky');
		$("#unused").height($(window).height() - $("#unused").position().top);
	}else{
		$('#scroller').removeClass('sticky');
		$("#unused").height($(window).height()+window_top - $("#unused").offset().top);
	}
}
$(function() {
	$(window).scroll(sticky_relocate);
	$(window).resize(sticky_relocate);
	$('#scroller').css("min-height", $(window).height()+$(window).scrollTop() - $("#unused").offset().top);
	sticky_relocate();
});

/*drag and drop functionality*/
var dim = 48;
var shiftDown = false;
function setShift(v){
	shiftDown = v;
}

//swap the position of 2 jquery elements
jQuery.fn.swap = function(b) {
	b = jQuery(b)[0];
	var a = this[0];
	
	var t = a.parentNode.insertBefore(document.createTextNode(''), a);
	b.parentNode.insertBefore(a, b);
	t.parentNode.insertBefore(b, t);
	t.parentNode.removeChild(t);

	return this;
};

function disableUniques(){
	$(".unit-force").removeClass("unit-drop");
	$(".unit-re").removeClass("unit-drop-re");
	$(".unique").removeClass("unit-disabled");
	$(".unit-force.unique").each(
		function(ind, el){
			$(el).removeClass("unit-disabled");
			$(".unit-sidebar"
			  +"[sid='"+$(el).attr("sid")+"']"
			  +"[mid='"+$(el).attr("mid")+"']")
				.addClass("unit-disabled");
		}
	);
	$('body').css('cursor', 'auto');
}

function removeMe($o){
	$o.effect("puff", "", 200,
		function callback(){
			$o.remove();
			disableUniques();
		}
	);
}

//finds the first available slot of the correct type and attempts to add it
function addUnit($el){
	var sid = $el.attr("sid");
	var isre = (sid == 50);
	var slots = $(".unit-force[aid][sid="+sid+"]").not(":has(div)");
	if(slots.length == 0){
		slots = $(".unit-re[aid]").not(":has(div)");
		if(slots.length == 0)
			return false;
	}
	return addToSlot(slots[0], $el);
}

//attempts to add unit to slot incorporating game logic rules (e.g. uniques, etc)
function addToSlot(slot, source){
	$slot = $(slot);
	var children = $slot.children();
	
	//make sure reinforcements are not duplicated
	if($slot.hasClass("unit-re") && !source.hasClass("unit-re")){
		if($(".unit-re[sid='"+source.attr("sid")+"'][mid='"+source.attr("mid")+"']")[0]){
			return 'reinf duplicated'
		}
	}
	
	//a unit is already in this spot
	if(children.length != 0){
		//placed a force unit onto here
		if(source.hasClass("unit-force")){//we are swapping between 2 in-force units!
			var slot1 = source;
			var slot2 = $(children[0]);
			if(slot1 != slot2){
				//swapping between reinforcements and non-reinforcements
				if((slot1.hasClass("unit-re") ^ slot2.hasClass("unit-re"))){
					slot1.toggleClass("unit-re");
					slot2.toggleClass("unit-re");
				}
				
				slot1.swap(slot2);
				return 'swap 2 unit in force'
			}
		}else if(source.hasClass("unit-sidebar")){
			$slot.empty();
		}
	}
	
	//from side to blank, or side to in-force unit
	$nd = $(document.createElement("div"));//make new div
	$nd.addClass('unit-force');
	var reinforced = false;
	if($slot.hasClass("unit-re")){
			$nd.addClass("unit-re");
			reinforced = true;
	}
	$nd.attr("sid", source.attr("sid"));
	if(source.hasClass("unique")){
		$nd.addClass("unique");
	}
	$nd.attr("mid", source.attr("mid"));
	$nd.css("background-image", source.css("background-image"));
	$nd.attr("onmouseover", 'copyTooltip('+source.attr("mid")+')');

	makeDraggable($nd);

	//drag from full to blank - remove if not using shift duplicate
	if(source.hasClass("unit-force") && (shiftDown == false || source.hasClass("unique"))){
		source.remove();
	}

	//we are putting a unit in the force
	if(shiftDown){
		if($(".sidebar").find(".unit-disabled[mid="+$nd.attr("mid")+"]").length == 0){
			//don't duplicate if disabled
			$nd.appendTo($slot);
		}
	}else{
		//add as new child
		$nd.appendTo($slot);
	}
	
	disableUniques();
	
	return 'successful add';
}

function makeDraggable(el){
	var $els = $(el);
	$els.draggable({
		cursor: "move",
		opacity: 0.7,
		cursorAt: { top: dim/2, left: dim/2},
		helper: "clone",
		revert: ($els.hasClass('unit-sidebar')?true:
			function(droppableObj){//when dropped on invalid target, remove self
				if(droppableObj === false){
					removeMe($(this));
					return false;
				}else{
					disableUniques();
					return true;
				}
			}
		),
		revertDuration: 0
	})
	.bind("drag", function(event, ui){
		ui.helper.css("width", dim);
		ui.helper.css("height", dim);
	})
	.dblclick(function(e){
		if($(this).hasClass('unit-sidebar')){
			//insert to first free suitable spot
			addUnit($(this));
		}
		if($(this).hasClass('unit-force')){
			removeMe($(this));
		}
		disableUniques();
	});
}

function makeDroppable(e){
	var $el = $(e);
	var sid = $el.attr("sid");
	var isre = (sid == 50);
	
	$el.droppable({
		//only accept non-disabled units who has the same section id as me
		accept: isre?":not(.unit-disabled)":":not(.unit-disabled)[sid="+sid+"]",
		activeClass: isre?"unit-drop-re":"unit-drop",
		hoverClass: "unit-drop-here",
		drop: function(event, ui) {
			addToSlot(this, ui.draggable);
		}
	});
}


function copyTooltip(id){console.log(id+"!");
	var el = document.getElementById('unit-' + id);console.log(el+"!");
	if(el != null)
		document.getElementById('tooltip').innerHTML = el.innerHTML;
}