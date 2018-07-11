var html = {};
var cantidadTotalPreguntas = 1;
var segundos = 30;
var audio = true;
html.contador = null;

html.sonidos = {};

html.snd_general = document.getElementById("snd-general");
html.snd_cambio_jugador = document.getElementById("snd-cambio-jugador");
html.snd_despliegue = document.getElementById("snd-despliegue");
html.snd_fondo = document.getElementById("snd-fondo");
html.snd_correcto_1 = document.getElementById("snd-correcto-1");
html.snd_correcto_2 = document.getElementById("snd-correcto-2");
html.snd_incorrecto = document.getElementById("snd-incorrecto");
html.snd_tiempo = document.getElementById("snd-tiempo");
html.snd_ruleta = document.getElementById("snd-ruleta");



/*
                <audio id="snd-general" controls preload="auto" >
                    <source src="sonidos/boton_general.wav">
                </audio>   
                <audio id="snd-cambio-jugador" controls preload="auto" >
                    <source src="sonidos/cambio_jugador.wav">
                </audio> 
                <audio id="" controls preload="auto" >
                    <source src="sonidos/despliegue_cortina.wav">
                </audio>
                <audio id="" controls preload="auto" >
                    <source src="sonidos/musica_fondo.wav">
                </audio> 
                <audio id="" controls preload="auto" >
                    <source src="sonidos/respuesta_correcta_1.wav">
                </audio>  
                <audio id="" controls preload="auto" >
                    <source src="sonidos/respuesta_correcta_2.wav">
                </audio>  
                <audio id="" controls preload="auto" >
                    <source src="sonidos/respuesta_incorrecta.wav">
                </audio>     
                <audio id="" controls preload="auto" >
                    <source src="sonidos/tiempo_respuesta.wav">
                </audio>  
*/
html.setTituloUsuario = function(usuario){
    $(".player-name-title").html("<span>"+usuario+"</span>");
}

html.setStopAudio = function(){
    audio = false;
    html.snd_general.pause();
    html.snd_cambio_jugador.pause();
    html.snd_despliegue.pause();
    html.snd_fondo.pause();
    html.snd_correcto_1.pause();
    html.snd_correcto_2.pause();
    html.snd_incorrecto.pause();
    html.snd_tiempo.pause();
    html.snd_ruleta.pause();
    html.snd_general.currentTime = 0;
    html.snd_cambio_jugador.currentTime = 0;
    html.snd_despliegue.currentTime = 0;
    html.snd_fondo.currentTime = 0;
    html.snd_correcto_1.currentTime = 0;
    html.snd_correcto_2.currentTime = 0;
    html.snd_incorrecto.currentTime = 0;
    html.snd_tiempo.currentTime = 0;
    html.snd_ruleta.currentTime = 0;
}

html.setLayoutCategoria = function(catid){
    $("body").removeClass();
    var categoria = "cat-"+catid;
    $("body").addClass(categoria);
}

html.setCantidadRespuestas = function(cantidad){
    $(".player-score em").html(cantidad);
}


html.resetValidaciones = function(){
    $(".list-options").removeClass("proceso");
    $("body").removeClass();
    $(".card").addClass("hidden");
    $(".ruleta-juego").removeClass("hidden");
    $(".msg-correct").addClass("hidden");
    $(".msg-incorrect").addClass("hidden"); 
    $(".msg-time").addClass("hidden");   
    $(".option").removeClass("option-incorrect");
    $(".option").removeClass("option-correct");
    $(".option").removeClass("option-selection");
    $(".cat-label-list").removeClass("disabled");
}

html.setContador = function(){
    var c_segundos = (segundos/2)*360;
    var actualsegundo = c_segundos;
    var cantidad = 100;
    html.contador = setInterval(function(){   
        actualsegundo--;
        //console.log("actual="+actualsegundo)
        var porcentaje = (cantidad/c_segundos)*actualsegundo;
        //console.log(porcentaje)
        $(".demo")
            .val(porcentaje)
            .trigger('change');    
            if(porcentaje==0){
                 clearTimeout(html.contador);
                 trivia.indexedDB.setRespuesta(false);
                 $(".msg-time").removeClass("hidden");   
                 $(".btn-next-jugador").removeClass("hidden");
                 $(".list-options").addClass("proceso");
                 html.snd_tiempo.pause();
                 html.snd_tiempo.currentTime = 0;
                               if(audio){
                  html.snd_incorrecto.play();
              }
            }
    }, 1);
}
  

html.setFullscreen = function(){
  var element = document.documentElement;
  if(element.requestFullscreen) {
    element.requestFullscreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
  }    
}

html.unsetFullscreen = function(){
  if(document.exitFullscreen) {
    document.exitFullscreen();
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  }   
}

html.calcularFin = function(){
    var bloquear = true;
    for(var i=1; i<=trivia.webdb.usuario_cantidad; i++ ){
        var tactual = 0;
        tactual = parseInt(usuarios_respuestas[i]);
        if(tactual < cantidadTotalPreguntas){
            bloquear = false;
        }
    } 
    if(bloquear){
        $('.roulette-pointer').addClass("disabled");
    }
}

html.agregarUsuarioTR = function(id){
    var html = '<tr class="usu_'+id+'" data-total="0">'+
                    '<td class="td-rank">0</td>'+
                    '<td class="td-player">'+usuarios_nombres[id]+'</td>'+
                    '<td class="td-cat-1 td-cat-x"><div class="td-border tdusu_'+id+'_1" data-total="0" data-respondidas="0" data-ok="0"><span class="num-correct">0/0</span>0%</div></td>'+
                    '<td class="td-cat-2 td-cat-x"><div class="td-border tdusu_'+id+'_2" data-total="0" data-respondidas="0" data-ok="0"><span class="num-correct">0/0</span>0%</div></td>'+
                    '<td class="td-cat-3 td-cat-x"><div class="td-border tdusu_'+id+'_3" data-total="0" data-respondidas="0" data-ok="0"><span class="num-correct">0/0</span>0%</div></td>'+
                    '<td class="td-cat-4 td-cat-x"><div class="td-border tdusu_'+id+'_4" data-total="0" data-respondidas="0" data-ok="0"><span class="num-correct">0/0</span>0%</div></td>'+
                    '<td class="td-cat-5 td-cat-x"><div class="td-border tdusu_'+id+'_5" data-total="0" data-respondidas="0" data-ok="0"><span class="num-correct">0/0</span>0%</div></td>'+
                    '<td class="td-cat-6 td-cat-x"><div class="td-border tdusu_'+id+'_6" data-total="0" data-respondidas="0" data-ok="0"><span class="num-correct">0/0</span>0%</div></td>'+
                    '<td class="td-total tdusu_'+id+'_total">0%</td>'+
            '</tr>';
    $("#modal-stats tbody").append(html);
}

html.calculoTotal = function(){
    $("#modal-stats tbody tr").each(function(){
        //Usuario
        var _this = $(this);
        var respondidas = 0;
        var ok = 0;
        _this.find(".td-border").each(function(){
            var __this = $(this);
            respondidas = respondidas + parseInt(__this.attr("data-respondidas"));
            ok = ok + parseInt(__this.attr("data-ok"));
        });
        if(respondidas===0){
            _this.find(".td-total").html("0%");  
            _this.attr("data-total","0");
        }else{
            var porcentaje = Math.round((100/respondidas)*ok);
            _this.find(".td-total").html(porcentaje+"%");     
            _this.attr("data-total",porcentaje);       
        }
        
    });
    var htmlarray = new Array();
    $("#modal-stats tbody").find("tr").each(function(){
        var _this = $(this);
        var total = _this.attr("data-total");
        var objeto = {
            puntaje: total,
            html: $(this)[0].outerHTML
        };
        htmlarray.push(objeto);
    });
    var ordenado = htmlarray.sort(compare);
    ordenado = ordenado.reverse();
    var pos_usus = 1;
    $("#modal-stats tbody").html("");
    $.each(ordenado,function(index,value){
        //console.log(index);
        //console.log(value);
        $("#modal-stats tbody").append(value.html);  
        $("#modal-stats tbody tr").last().find(".td-rank").html(pos_usus);
        pos_usus++;
    })
}

function compare(a,b) {
  if (a.puntaje < b.puntaje)
     return -1;
  if (a.puntaje > b.puntaje)
    return 1;
  return 0;
}