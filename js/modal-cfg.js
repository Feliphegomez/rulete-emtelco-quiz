//=========================================
// MODAL CFG - Magnific Popup http://dimsemenov.com/plugins/magnific-popup/
//=========================================

$(document).ready(function() {
	$('.modal-open').magnificPopup({
	  type:'inline',
	  showCloseBtn: false,
	  midClick: true,
	  mainClass: 'animate-modal' //add class on display         
	});

	$('.modal-close').click(function() {
		$.magnificPopup.close();
	});

	$('.modal-open-top').magnificPopup({
	  type:'inline',
	  showCloseBtn: false,
	  midClick: true,
	  alignTop: true,
	  mainClass: 'animate-modal-top', //add class on display
          callbacks: {
            close: function() {
              var src = String(this.currItem.src);
              if(src == "#modal-stats"){
                  console.log("stats")
                  if($(src).hasClass("fin")){
                      trivia.indexedDB.preExit();
                  }
              }
            }
            // e.t.c.
          } 
	});

	$('.modal-close-self').magnificPopup({
	  type:'inline',
	  showCloseBtn: false,
	  midClick: true,
	  alignTop: true,
	  closeOnContentClick: true,
	  mainClass: 'animate-modal-top' //add class on display
	});
        
});