window.onload = function(){
    var en_proceso = false;
    var cantidad_usuario = 1;
    var posicion_usuario = 1;
    var fullscreen = false;
    var fin_juego = false;
    var intervalo = false;
    var usuario1_fix = "";
    
    if(localStorage.getItem("ongame")!="ok"){
        //trivia.indexedDB.setReset();
        //html.snd_fondo.loop=true;
        //html.snd_fondo.play();
        intervalo = setInterval(function(){
            if(preload.categorias == true && preload.trivias == true && preload.pregunta == true && preload.categoria == true && preload.ualternativa == true && preload.usuarios == true){
                clearInterval(intervalo);
                $("#preload-app").addClass("hidden");
                $("body").removeClass("page-preloader");
                $("#contenedor-app").removeClass("hidden");
                html.snd_fondo.loop=true;
                html.snd_fondo.play();
            }
            console.log("INTERVALO | categorias = " + preload.categoria)
        }, 500);
    }else{
        intervalo = setInterval(function(){
            if(preload.categorias==true&&preload.trivias==true&&preload.pregunta==true&&preload.categoria==true&&preload.ualternativa==true&&preload.usuarios==true){
                clearInterval(intervalo);
                $("#preload-app").addClass("hidden");
                $("body").removeClass("page-preloader");
                $("#contenedor-app").removeClass("hidden");
                html.snd_fondo.loop=true;
                html.snd_fondo.play();
            }
            console.log("INTERVALO | categorias="+preload.categoria)
        }, 500);
        juego_nuevo = false;
    }
    trivia.indexedDB.open();  
    
    var current_em_puntaje = $(".player-score em").html();
    $(".player-score").html("<em>"+current_em_puntaje+"</em>/"+cantidadTotalPreguntas);
    
    $("#comenzar-juego").click(function(){
        for(var p=1;p<=posicion_usuario;p++){
            var nombre_jugador;
            if(p==1){ nombre_jugador=usuario1_fix; }
			else{ 
                var clase = ".input-jugador"+p;
                nombre_jugador = $(clase).val();
            }
            if(nombre_jugador==""){ return false; };
        }
        
        if(audio===true){ html.snd_general.play(); };
		
        var _this = $(this);
        $(".splash-title").addClass("hidden");
        $("#li-jugar").addClass("hidden");
        $(".main-title").removeClass("hidden");
        trivia.webdb.usuario_cantidad = posicion_usuario;
        for(var p=1;p<=posicion_usuario;p++){
            var nombre_jugador;
            if(p==1){ nombre_jugador=usuario1_fix; }
			else{ 
                var clase = ".input-jugador"+p;
                nombre_jugador = $(clase).val();
            }
			
            if(nombre_jugador==""){ return false; };
        }
        
        var cantidad  = parseInt(trivia.webdb.usuario_cantidad);
        switch(cantidad){
            case 1:
                    cantidadTotalPreguntas = 10;
                break;
            case 2:
                    cantidadTotalPreguntas = 3;                    
                break;
            case 3:
            case 4:
            case 5:
            case 6:                  
                break;                
        }
		
        localStorage.setItem("ongame", "ok");
        $(".item-cat").removeClass("disabled");
        trivia.webdb.actual_usuario = 1;
        //var current_em_puntaje = $(".player-score em").html();
        $(".player-score").html("<em>1</em>/"+cantidadTotalPreguntas);
        for(var p=1;p<=posicion_usuario;p++){
            var nombre_jugador = "";
            if(p==1){
                nombre_jugador=usuario1_fix;
            }else{
                var clase = ".input-jugador"+p;
                nombre_jugador = $(clase).val();
                
            }
            usuarios[p] = p;
            usuarios_nombres[p] = nombre_jugador;
            trivia.indexedDB.setUsuario(nombre_jugador,p);
            usuarios_respuestas[p] = 0;
            html.agregarUsuarioTR(p);
        }
        html.setTituloUsuario(usuarios_nombres[1]);
        usuarios_respuestas[1] = 0;
        html.setCantidadRespuestas(0);
        $.magnificPopup.close();
        $(".cat-label-list").removeClass("disabled");
        if(audio===true){
            html.snd_fondo.pause();
        }
        setTimeout(function(){
             $(".modal-open-tips").trigger("click");
        },500);
    })
    
    $("#agregar-jugador").click(function(){
        if(audio===true){ html.snd_general.play(); };
        cantidad_usuario++;
        if(cantidad_usuario>6){ return false; };
        var contenido = 
                '               <div class="box jugador'+cantidad_usuario+'">'+
                '        		<h4 class="title">Jugador '+cantidad_usuario+'</h4>'+
                '			<input class="input-text input-jugador'+cantidad_usuario+'" data-id="'+cantidad_usuario+'" type="text" maxlength="20" placeholder="Tu nombre">'+
		'		</div>';
        $(".player-slider").cycle('add',contenido);
        $('.player-slider').cycle('next');
        //$(".player-create").attr("data-posicion")
    })
    
    $( '.player-slider' ).on( 'cycle-next cycle-prev', function( event, opts ) {
        posicion_usuario = $(".cycle-slide-active input").attr("data-id");
        console.log(posicion_usuario);
    });
    
    
    $(".modal-close").click(function(){ $.magnificPopup.close(); });
    
    $(".ruleta-juego .cat-label-list a").click(function(){
        if($(this).hasClass("item-cat")){
            if(!$(".cat-label-list").hasClass("disabled")){
                console.log("NO DISABLE")
                $(".ruleta-juego").addClass("hidden");
                $(".ruleta-categoria").removeClass("hidden");                
            }
        }else{
            $(".ruleta-juego").addClass("hidden");
            $(".ruleta-categoria").removeClass("hidden");            
        }
    })
    $(".btn-close-categoria").click(function(){
        $(".ruleta-categoria").addClass("hidden");
        $(".ruleta-juego").removeClass("hidden");
    })
    
    $(".option").click(function(e){
        var _this = $(this);
        e.preventDefault();
        if(!$(".list-options").hasClass("proceso")){
            $(".list-options").addClass("proceso");
            var altid = _this.attr("data-id");
            var catid = $(".card-category").attr("data-id");
            _this.addClass("option-selection");
            //console.log(altid);
            clearTimeout(html.contador);
            //var ccrespuestas = parseInt(usuarios_respuestas[trivia.webdb.actual_usuario])+1;
            //usuarios_respuestas[trivia.webdb.actual_usuario] = ccrespuestas;
            trivia.indexedDB.setRespuesta(altid,_this,catid);
            html.snd_tiempo.pause();
            html.snd_tiempo.currentTime = 0;
            $(".btn-next-jugador").removeClass("hidden");
            html.calcularFin();
        }
    })
	
    $(".btn-next-jugador").click(function(){
		if(audio===true){ html.snd_general.play(); };
	
		var actual = trivia.webdb.actual_usuario;
		var cantidad = trivia.webdb.usuario_cantidad;
		switch(true){
			case (actual==cantidad):
					trivia.webdb.actual_usuario=1;
					var crespuestas = parseInt(usuarios_respuestas[1])+1;
					usuarios_respuestas[1] = crespuestas;
					html.setTituloUsuario(usuarios_nombres[1]);
					html.setCantidadRespuestas(crespuestas);
					html.resetValidaciones();
					if(audio===true){
						html.snd_cambio_jugador.play();
					}
				break;
			case (actual<=cantidad):
					var plusactual=parseInt(actual)+1;
					trivia.webdb.actual_usuario = plusactual;
					var plusrespuestas = parseInt(usuarios_respuestas[plusactual])+1;
					html.setTituloUsuario(usuarios_nombres[plusactual]);
					html.setCantidadRespuestas(plusrespuestas);
					html.resetValidaciones();
					if(audio===true){
						html.snd_cambio_jugador.play();
					}                        
				break;
			 
		}
    });
    
    $(".demo").knob({
                readOnly: true,
                displayInput: false,
                width: 76,
                height: 76,
                thickness: ".5",
                fgColor: "rgba(0,0,0,0.4)",
                bgColor: "transparent",
                
    });
	
    $(".demo").val(100).trigger('change');
    
    $(".input-jugador").change(function(){
        var valor = ($(this).val());
        var id = ($(this).attr("data-id"));
        usuario1_fix=valor; 
    });
    
    $("#switch-sonido").click(function(){
        console.log(audio);
        if(audio===true){
            $("#switch-sonido span").addClass("ico-mute");
            audio=false;
            html.setStopAudio();
        }else{
            $("#switch-sonido span").removeClass("ico-mute");
            audio=true;
            /*html.snd_fondo.loop=true;
            html.snd_fondo.currentTime = 0;
            html.snd_fondo.play();*/
        }
    });
    
    $("#li-jugar a").click(function(){
            if(audio===true){
                html.snd_general.play();
            }        
    });
    
    $("#como-jugar a").click(function(){
            if(audio===true){
                //html.snd_general.play();
                html.snd_despliegue.play();
            }        
    });
	
    $("#terminar-juego").click(function(){
        //localStorage.removeItem("ongame");
        //location.reload();
        trivia.indexedDB.preExit();
    });
    
    $("#btn-fullscreen").click(function(){
        if(fullscreen){
            fullscreen=false;
            html.unsetFullscreen();
        }else{
            fullscreen=true;
            html.setFullscreen();
        }
    });
    
    if(!fin_juego){ $(".ribbon-felicitaciones").addClass("hidden"); }
	else{ $(".ribbon-felicitaciones").removeClass("hidden"); };
}


