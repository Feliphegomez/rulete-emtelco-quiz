/*
	COLORES DE LA RULETA Y CATEGORIAS
	
	* Gris Claro: 1
	* Verde Amarillo: 2
	* Azul Claro: 3
	* Gris Oscuro: 4
	* Amarillo: 5
	* Azul Oscuro: 6
*/

//<![CDATA[
    $(function(){
        window.WHEELOFFORTUNE = {
            cache: {},
            init: function () {
                console.log('controlador init...');
                var _this = this;
                this.cache.wheel = $('.wheel');
                this.cache.wheelMarker = $('.marker');
                this.cache.wheelSpinBtn = $('.roulette-pointer'); /* Estoy usando un botón de giro para dar giro a la ruleta. */
                /* el mapeo está hacia atrás a medida que la rueda gira en el sentido de las agujas del reloj */
                this.cache.wheelMapping = [1,2,3,4,5,6].reverse(); /* "Gris Claro","Verde Amarillo","Azul Claro","Gris Oscuro","Amarillo","Azul Oscuro" */
                this.cache.wheelSpinBtn.on('click', function (e) {
                    e.preventDefault();
                    if (!$(this).hasClass('disabled')) _this.spin();
                });               
                this.resetSpin(); /* restablecer la rueda */
                //setup prize events
                //this.prizeEvents();
            },

            spin: function () {
                $(".btn-next-jugador").addClass("hidden");
                console.log('spinning wheel');                
                if(audio===true){
                    html.snd_general.play();
                    //html.snd_ruleta.loop=true;
                    html.snd_ruleta.play();
                }   
                var _this = this;                
                this.resetSpin(); /* restablecer la rueda */
                // Desactivar el botón de centrifugado mientras está en progreso
                this.cache.wheelSpinBtn.addClass('disabled');
                $(".cat-label-list").addClass("disabled");
                /* La rueda tiene 6 secciones. - Cada sección es 360/6 = 36deg. */
                var deg = 1500 + (Math.floor((Math.random() * 999) + 111)); /* ó Math.round(Math.random() * 12345),*/
                        duration = 3300; //6 segundos óptimos
                console.log(deg);
                _this.cache.wheelPos = deg;
				
                //colas de transición
                //si falla con easeOutBack
                this.cache.wheel.transition({ rotate: '0deg' }, 0).transition({ rotate: deg + 'deg' }, duration, 'easeOutCubic');
				
                //marcador de movimiento
                /* 
					_this.cache.wheelMarker.transition({ rotate: '-20deg' }, 0, 'snap');

					//just before wheel finish
					setTimeout(function () {
						//reset marker
						_this.cache.wheelMarker.transition({
							rotate: '0deg'
						}, 300, 'easeOutQuad');
					}, duration - 500);
				*/

                //acabado de la rueda
                setTimeout(function () {
                    // ¿Ganó ??!?!?!
                    var spin = _this.cache.wheelPos,
                            degrees = spin % 360,
                             /*percent = (degrees / 360) * 100,
                            segment = Math.ceil((percent / 4)),  //divided by number of segments*/
                            aa = (6/360)*degrees;
                            bb = Math.ceil((aa))-1;
                            win = _this.cache.wheelMapping[bb]; //zero based array

					// console.log('spin = ' + spin);
                    // console.log('degrees = ' + degrees);
                    /*
						console.log('percent = ' + percent);
						console.log('segment = ' + segment);
					*/
                    console.log('bb ' + bb);
                    console.log('win = ' + win);

					// Mostrar el diálogo con un ligero retraso para darse cuenta de si gana o no.
                    setTimeout(function () {                        
                        html.setLayoutCategoria(win);
                        trivia.indexedDB.getRandPregunta(win);
                        $(".card-category").attr("data-id",win);
                        var cantidad = parseInt(trivia.webdb.actual_cantidad)+1;
                        if(audio){
                            html.snd_ruleta.pause();
                            html.snd_ruleta.currentTime = 0;
                            html.snd_tiempo.loop=true;
                            html.snd_tiempo.play();
                        }
                        if(cantidad==cantidadTotalPreguntas){ $(".btn-next-jugador").addClass("hidden"); };
                    }, 500);

                    //volver a habilitar el giro de la rueda
                    _this.cache.wheelSpinBtn.removeClass('disabled');
                }, duration);
            },

            resetSpin: function () {
                this.cache.wheel.transition({
                    rotate: '0deg'
                }, 0);
                this.cache.wheelPos = 0;
            }
        }
        window.WHEELOFFORTUNE.init();
    });//]]>