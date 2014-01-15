/*unit scroller functionality*/
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
