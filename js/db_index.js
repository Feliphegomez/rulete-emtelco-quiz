// $(document).ready(function() { $.getJSON({ cache: false }); });

var preguntas = {};
preguntas.cat1 = new Array();
preguntas.cat2 = new Array();
preguntas.cat3 = new Array();
preguntas.cat4 = new Array();
preguntas.cat5 = new Array();
preguntas.cat6 = new Array();
preguntas.categorias = new Array();

var trivia = {};
trivia.indexedDB = {};
trivia.indexedDB.db = null;
trivia.webdb = {};
trivia.webdb.actual_trivia = null;
trivia.webdb.actual_usuario = 1;
trivia.webdb.actual_cantidad = null;

var usuarios = {};
var usuarios_nombres = {};
var usuarios_respuestas = {};
trivia.webdb.usuario_cantidad = 0;

var juego_nuevo = true;
if(localStorage.getItem("ongame")=="ok"){ juego_nuevo = false; };
    
// Precargar
var preload = {};
preload.categorias = false;
preload.trivias = false;
preload.pregunta = false;
preload.categoria = false;
preload.ualternativa = false; 
preload.usuarios = false;

trivia.indexedDB.onerror = function(e) { console.log(e); };  // ERRORES

trivia.indexedDB.open = function() {
    var request = indexedDB.open("appTrivia",133);
    var upgrade = false;

    request.onupgradeneeded = function(e) {
        upgrade = true;
        console.log("UP")
        var db = e.target.result;
        if(db.objectStoreNames.contains("categoria")){
            console.log("Borrando categoria")
            db.deleteObjectStore("categoria");
        } 
        if(db.objectStoreNames.contains("pregunta")){
            console.log("Borrando pregunta")
            db.deleteObjectStore("pregunta");
        } 
        if(db.objectStoreNames.contains("alternativa")){
            console.log("Borrando alternativa")
            db.deleteObjectStore("alternativa");
        } 
        if(db.objectStoreNames.contains("usuario")){
            console.log("Borrando usuario")
            db.deleteObjectStore("usuario");
        }  
        if(db.objectStoreNames.contains("usuario_alternativa")){
            console.log("Borrando usuario_alternativa")
            db.deleteObjectStore("usuario_alternativa");
        }  
        db.createObjectStore("categoria", {keyPath: "id"});
        var pregunta = db.createObjectStore("pregunta", {keyPath: "id"});
        pregunta.createIndex("by_catid", "catid", {unique: false});
        pregunta.createIndex("by_id", "id", {unique: false});
        var alternativa = db.createObjectStore("alternativa", {keyPath: "id"});
        alternativa.createIndex("by_preid", "preid", {unique: false});
        db.createObjectStore("usuario", {keyPath: "id"});
        var usuario_alternativa = db.createObjectStore("usuario_alternativa", {keyPath: "id", autoIncrement:true});
        usuario_alternativa.createIndex("by_usuid", ["usuid", "catid"], {unique: false});
        var usuario_alternativa2 = db.createObjectStore("usuario_alternativa_2", {keyPath: "id", autoIncrement:true});
        usuario_alternativa2.createIndex("by_usuid", "usuid", {unique: false});
        //usuario_alternativa.createIndex("by_catid", "catid", {unique: false});
        //Cargar data
        /*categoria.transaction.oncomplete = function(event) {
            var objCategoria = db.transaction("categoria", "readwrite").objectStore("categoria");

        }
        console.log("Cargando Data");*/

    };

    request.onsuccess = function(e) {
        trivia.indexedDB.db =  e.target.result;
        var db = trivia.indexedDB.db;
        console.log("SUCC")
        console.log(db); 
        if(upgrade){
            $.getJSON("categorias.json", function(json) { 
                var transaction = db.transaction(["categoria"],"readwrite");
                var store = transaction.objectStore("categoria");  
                var clargo = parseInt(json.length);
                var cactual = 1;
                $.each( json, function( key, val ) {
                    var catid = val.id;
                    var nombre = val.nombre;   
                    console.log(catid);
                    store.put({
                        id:catid,
                        nombre:nombre
                    });
                    if(cactual==clargo){
                        preload.categorias=true;
                        console.log("Set categorias = true");
                    }else{
                        cactual++;
                        console.log("CACTUAL + "+cactual);
                    }
                });        
            }); 
			
			
            $.getJSON("trivias.json", function(json) { 
                var transaction = db.transaction(["pregunta"],"readwrite");
                var store = transaction.objectStore("pregunta");  
                var plargo = parseInt(json.length);
                var pactual = 1;          
                $.each( json, function( key, val ) {
                    var pregunta = val.pregunta;
                    var preid = val.id;
                    console.log(pregunta)
                    var catid = val.catid;  
                    console.log(catid)
                    store.put({
                        id:preid,
                        catid:catid,
                        pregunta:pregunta
                    });
                    var transaction2 = db.transaction(["alternativa"],"readwrite");
                    var store2 = transaction2.objectStore("alternativa"); 
                    var alargo = parseInt(val.respuestas.length);
                    var aactual = 1; 
                        $.each( val.respuestas, function( key2, val2 ) {
                            var resid = val2.id;
                            var respuesta = val2.respuesta;
                            var corr = val2.correcta;
                            store2.put({
                                preid:preid,
                                id:resid,
                                respuesta:respuesta,
                                correcto:corr
                            });
                            if(plargo==pactual && alargo == aactual){
                                preload.trivias=true;
                                console.log("Set trivias = true");
                                trivia.indexedDB.cargarIdsCat();
                            }else{
                                aactual++;
                            }
                        }); 
                     pactual++;
                });        
            });         
        }else{
            preload.trivias=true;
            console.log("Set trivias = true");
            preload.categorias=true;
            console.log("Set categorias = true");
            trivia.indexedDB.cargarIdsCat();
        }
    };

    request.onfailure = function(e){
        trivia.indexedDB.onerror(e);
    };    
}

trivia.indexedDB.getRandPregunta = function(catid){
    var pid=null;
    switch(catid){
        case 1:
              pid = preguntas.cat1[Math.floor(Math.random()*preguntas.cat1.length)];
              var index = preguntas.cat1.indexOf(pid);
              if (index > -1) {
                  preguntas.cat1.splice(index, 1);
              }
            break;
        case 2:
              pid = preguntas.cat2[Math.floor(Math.random()*preguntas.cat2.length)];
              var index = preguntas.cat2.indexOf(pid);
              if (index > -1) {
                  preguntas.cat2.splice(index, 1);
              }
            break;
        case 3:
              pid = preguntas.cat3[Math.floor(Math.random()*preguntas.cat3.length)];
              var index = preguntas.cat3.indexOf(pid);
              if (index > -1) {
                  preguntas.cat3.splice(index, 1);
              }
            break;
        case 4:
              pid = preguntas.cat4[Math.floor(Math.random()*preguntas.cat4.length)];
              var index = preguntas.cat4.indexOf(pid);
              if (index > -1) {
                  preguntas.cat4.splice(index, 1);
              }
            break;
        case 5:
              pid = preguntas.cat5[Math.floor(Math.random()*preguntas.cat5.length)];
              var index = preguntas.cat5.indexOf(pid);
              if (index > -1) {
                  preguntas.cat5.splice(index, 1);
              }
            break;
        case 6:
              pid = preguntas.cat6[Math.floor(Math.random()*preguntas.cat6.length)];
              var index = preguntas.cat6.indexOf(pid);
              if (index > -1) {
                  preguntas.cat6.splice(index, 1);
              }
            break;
    }   
    pid = parseInt(pid);
    var db = trivia.indexedDB.db;
    var transaction = db.transaction(["pregunta"],"readwrite");
    var store = transaction.objectStore("pregunta");
    //var index = store.index("by_id");
    console.log("PID: "+pid);
    var request = store.get(pid);
	
	$(".option").hide();
	
    request.onsuccess = function(event) {
        var data = request.result;
		console.log(data);
		
        trivia.webdb.actual_trivia = data.id;
        $(".card-text p").html(data.pregunta);
        var transaction2 = db.transaction(["alternativa"],"readwrite");
        var store2 = transaction2.objectStore("alternativa");
        var rango = IDBKeyRange.only(data.id);
        var index2 = store2.index("by_preid");
        var request2 = index2.openCursor(rango); 
        var countx = 1;
        request2.onsuccess = function(e){
            var cursor = e.target.result;
            if (cursor) {
                var respuesta = cursor.value;
                var option = ".option"+countx;
                console.log(option)
                $(option).html(respuesta.respuesta);
                console.log(respuesta.respuesta)
                $(option).attr("data-id",respuesta.id);
                $(option).show(); // MOSTRAR EL OPTION
                countx++;
                cursor.continue();
            }
        }

        var transaction3 = db.transaction(["usuario_alternativa_2"],"readwrite");
        var store3 = transaction3.objectStore("usuario_alternativa_2");
        var rango3 = IDBKeyRange.only(trivia.webdb.actual_usuario);
        var index3 = store3.index("by_usuid");
        var request3 = index3.openCursor(rango3); 
        var count=1;
        request3.onsuccess = function(ev){
            var cursor = ev.target.result;
            if (cursor) {   
                count++;
                cursor.continue();
            }else{
                html.setCantidadRespuestas(count);
                trivia.webdb.actual_cantidad = count;
                usuarios_respuestas[trivia.webdb.actual_usuario] = count;
                $(".card-number").html("n° "+count);
                $(".card-category").html(preguntas.categorias[data.catid]);
                $(".ruleta-juego").addClass("hidden");
                $(".card").removeClass("hidden");
                html.setContador(); 
            }
        }
 
    }
}

trivia.indexedDB.setRespuesta = function(altid,_this,catid){
    console.log(altid);
    if(altid===false){
        trivia.indexedDB.setUsuarioTrivia(trivia.webdb.actual_trivia,0,trivia.webdb.actual_usuario,0,0);
        trivia.indexedDB.setRespuestaCorrecta(trivia.webdb.actual_trivia);
          var mostrarnext = false;
          for(var aa=1;aa<=trivia.webdb.usuario_cantidad;aa++){
              //console.log("A="+aa+" | "+usuarios_respuestas[aa]+" | "+cantidadTotalPreguntas);
              if(usuarios_respuestas[aa]<cantidadTotalPreguntas){
                  mostrarnext = true;
              }
          }
          if(mostrarnext){
                $(".btn-next-jugador").removeClass("hidden");
          }else{
              $(".btn-next-jugador").addClass("hidden");
              $("#modal-stats").addClass("fin");
              $(".ribbon-felicitaciones").removeClass("hidden");
              //trivia.webdb.getRanking();
              setTimeout(function(){
                  $(".modal-open-stats").trigger('click');
              },1000)

          }
          return false;
    }
    altid=parseInt(altid);
    var db = trivia.indexedDB.db;
    var transaction = db.transaction(["alternativa"],"readwrite");
    var store = transaction.objectStore("alternativa");
    //var index = store.index("id");
	console.log(altid);
	
    var request = store.get(altid);
    console.log(request)
    request.onsuccess = function(e){
        var data = request.result;
        console.log(data);
        if(data.correcto==1){
              $(".msg-correct").removeClass("hidden");
              _this.addClass("option-correct");
              if(audio){
                  html.snd_correcto_1.play();
              }
              trivia.indexedDB.setUsuarioTrivia(trivia.webdb.actual_trivia,altid,trivia.webdb.actual_usuario,1,catid);            
        }else{
              trivia.indexedDB.setRespuestaCorrecta(trivia.webdb.actual_trivia);
              $(".msg-incorrect").removeClass("hidden");  
              _this.addClass("option-incorrect");
              if(audio){
                  html.snd_incorrecto.play();
              }
              trivia.indexedDB.setUsuarioTrivia(trivia.webdb.actual_trivia,altid,trivia.webdb.actual_usuario,0,catid);
          }
          var mostrarnext = false;
          for(var aa=1;aa<=trivia.webdb.usuario_cantidad;aa++){
              //console.log("A="+aa+" | "+usuarios_respuestas[aa]+" | "+cantidadTotalPreguntas);
              if(usuarios_respuestas[aa]<cantidadTotalPreguntas){
                  mostrarnext = true;
              }
          }
          if(mostrarnext){
                $(".btn-next-jugador").removeClass("hidden");
          }else{
              $(".btn-next-jugador").addClass("hidden");
              $('.roulette-pointer').addClass("disabled");
              $(".ribbon-felicitaciones").removeClass("hidden");
              $("#modal-stats").addClass("fin");
              //trivia.webdb.getRanking();
              setTimeout(function(){
                  $(".modal-open-stats").trigger('click');
              },1000)

          }
    }
        
}

trivia.indexedDB.setUsuarioTrivia = function(idtrivia,idalternativa,idusuario,puntaje,catid) {
    var db = trivia.indexedDB.db;
    
    var trans = db.transaction(["usuario_alternativa_2"],"readwrite");
    var stor = trans.objectStore("usuario_alternativa_2");
    stor.put({
        triid:idtrivia,
        altid:idalternativa,
        usuid:idusuario,
        puntaje:puntaje,
        catid:catid
    });
    
    
    var transaction = db.transaction(["usuario_alternativa"],"readwrite");
    var store = transaction.objectStore("usuario_alternativa");
    /*store.put({
        triid:idtrivia,
        altid:idalternativa,
        usuid:idusuario,
        puntaje:puntaje,
        catid:catid
    });*/
    var index = store.index("by_usuid");
    var request = index.get([parseInt(idusuario),String(catid)]);
    request.onsuccess = function(e){
        var data = request.result;
        var cantidad_respondidas = 1;
        var cantidad_respondidas_ok = parseInt(puntaje);
        if(data){
            cantidad_respondidas = parseInt(data.respondidas);
            cantidad_respondidas_ok = parseInt(data.respondidas_ok);
            cantidad_respondidas = cantidad_respondidas + 1;
            cantidad_respondidas_ok = cantidad_respondidas_ok + parseInt(puntaje);
            var id = data.id;
            var transaction2 = db.transaction(["usuario_alternativa"],"readwrite");
            var store2 = transaction2.objectStore("usuario_alternativa");
            var request2 = store2.delete(id);
            request2.onsuccess = function(e){
                var transaction3 = db.transaction(["usuario_alternativa"],"readwrite");
                var store3 = transaction3.objectStore("usuario_alternativa");
                store3.put({
                    usuid:idusuario,
                    catid:catid,
                    respondidas:cantidad_respondidas,
                    respondidas_ok:cantidad_respondidas_ok
                });   
                trivia.indexedDB.getRanking();
            }
        }else{
            var transaction2 = db.transaction(["usuario_alternativa"],"readwrite");
            var store2 = transaction2.objectStore("usuario_alternativa");
            store2.put({
                usuid:idusuario,
                catid:catid,
                respondidas:cantidad_respondidas,
                respondidas_ok:cantidad_respondidas_ok
            });
            trivia.indexedDB.getRanking();
        }

    }
}

trivia.indexedDB.setRespuestaCorrecta = function(trid){
    var db = trivia.indexedDB.db;
    var transaction = db.transaction(["alternativa"],"readwrite");
    var store = transaction.objectStore("alternativa");  
    var rango = IDBKeyRange.only(trid);
    var index = store.index("by_preid");
    var request = index.openCursor(rango);
    request.onsuccess = function(e){
        var cursor = e.target.result;
        if (cursor) {
            var respuesta = cursor.value;
            if(respuesta.correcto==1){
                  $(".option").each(function(){
                      var _this = $(this);
                      if(_this.attr("data-id")==respuesta.id){
                          _this.addClass("option-correct");
                      }
                  })                
            }
            cursor.continue();
        }        
    }
    
}

trivia.indexedDB.setUsuario = function(nombre,id) {
    var db = trivia.indexedDB.db;
    var transaction = db.transaction(["usuario"],"readwrite");
    var store = transaction.objectStore("usuario");
    store.put({
        id:id,
        nombre:nombre,
        puntaje:0
    });
    
}

trivia.indexedDB.getRanking = function(){
    var db = trivia.indexedDB.db;
	
	//USER ID
    for(var i=1; i<=trivia.webdb.usuario_cantidad; i++ ){
        //CAT ID
		for(var c=1; c<=6; c++ ){
            console.log(i+" "+c)
            var transaction3 = db.transaction(["usuario_alternativa"],"readwrite");
            var store = transaction3.objectStore("usuario_alternativa");
            //var rango = IDBKeyRange.only([1,2]);
            var index = store.index("by_usuid");
            var requestu = index.get([parseInt(i),String(c)]);
            var actual_usuid = i;
            requestu.onsuccess = function(e){
                var data = e.target.result;
                console.log(e);
                if(data){
                    var usuid = data.usuid;
                    var catid = data.catid;
                    var cantidad_respondidas = parseInt(data.respondidas);
                    var cantidad_respondidas_ok = parseInt(data.respondidas_ok);
                    //actual_usuid = usuid;
                    var clase = ".tdusu_"+usuid+"_"+catid;
                    var porcentaje = Math.round((100/cantidad_respondidas)*cantidad_respondidas_ok);
                    var htmltd = '<span class="num-correct">'+cantidad_respondidas_ok+'/'+cantidad_respondidas+'</span>'+porcentaje+'%';
                    //console.log(htmltd);
                    $(clase).attr("data-total",porcentaje);
                    $(clase).attr("data-respondidas",cantidad_respondidas);
                    $(clase).attr("data-ok",cantidad_respondidas_ok);
                    $(clase).html(htmltd);
                    html.calculoTotal();
                }else{
                    html.calculoTotal();
                }
            }            
        }
    }
}

trivia.indexedDB.preExit = function(){
    var db = trivia.indexedDB.db;
    var transactionus = db.transaction(["usuario"],"readwrite");
    var storeus = transactionus.objectStore("usuario");
    var requestus = storeus.openCursor();
    requestus.onsuccess = function(e){
        var cursor = e.target.result;
        if (cursor) {            
            var primaryKey = cursor.primaryKey;
            storeus.delete(primaryKey);
            cursor.continue();
        }else{
            var transactional = db.transaction(["usuario_alternativa"],"readwrite");
            var storeal = transactional.objectStore("usuario_alternativa");
            var requestal = storeal.openCursor();
            requestal.onsuccess = function(e){
                var cursor = e.target.result;
                if (cursor) {            
                    var primaryKey = cursor.primaryKey;
                    storeal.delete(primaryKey);
                    cursor.continue();
                }else{
                    var transactional2 = db.transaction(["usuario_alternativa_2"],"readwrite");
                    var storeal2 = transactional2.objectStore("usuario_alternativa_2");
                    var requestal2 = storeal2.openCursor();
                    requestal2.onsuccess = function(e){
                        var cursor = e.target.result;
                        if (cursor) {            
                            var primaryKey = cursor.primaryKey;
                            storeal2.delete(primaryKey);
                            cursor.continue();
                        }else{
                            localStorage.removeItem("ongame");
                            location.reload();                                                
                        }
                    }                                         
                }
            }

        }
    }
  
}

trivia.indexedDB.cargarIdsCat = function(){
        var db = trivia.indexedDB.db;
        //Cargar ids en cat
        var transaction = db.transaction(["pregunta"],"readwrite");
        var store = transaction.objectStore("pregunta");
        var respuestaCursor = store.openCursor();
        respuestaCursor.onsuccess = function(evt){
            var cursor = evt.target.result;
            if (cursor) {
               var pregunta = cursor.value;
               switch(pregunta.catid){
                   case 1:
                        preguntas.cat1.push(pregunta.id);
                        //console.log("PUSH cat1: "+pregunta.id);
                       break;
                   case 2:
                        preguntas.cat2.push(pregunta.id);
						//console.log("PUSH cat2: "+pregunta.id);
                       break;
                   case 3:
                        preguntas.cat3.push(pregunta.id);
						//console.log("PUSH cat3: "+pregunta.id);
                       break;
                   case 4:
                        preguntas.cat4.push(pregunta.id);
						//console.log("PUSH cat4: "+pregunta.id);
                       break;
                   case 5:
                        preguntas.cat5.push(pregunta.id);
						//console.log("PUSH cat5: "+pregunta.id);
                       break;
                   case 6:
                        preguntas.cat6.push(pregunta.id);
						//console.log("PUSH cat6: "+pregunta.id);
                       break;
               }
               cursor.continue();
            }else{
                preload.pregunta=true;
                console.log("Set pregunta = true");
                trivia.indexedDB.cargarCategorias();
            }           
        }    
}
     
trivia.indexedDB.cargarCategorias = function(){
        var db = trivia.indexedDB.db;
        var transaction = db.transaction(["categoria"],"readwrite");
        var store = transaction.objectStore("categoria");
        var respuestaCursor = store.openCursor();
        respuestaCursor.onsuccess = function(evt){
            var cursor = evt.target.result;
            if (cursor) {
               var categoria = cursor.value;
               preguntas.categorias[categoria.id]=categoria.nombre;
               cursor.continue();
            }else{
                preload.categoria=true;
                console.log("Set categoria = true");
                trivia.indexedDB.existentes();
            }            
        }
}

trivia.indexedDB.existentes = function(){
        var db = trivia.indexedDB.db;
       //Remover ya existentes
        var transaction = db.transaction(["usuario_alternativa_2"],"readwrite");
        var store = transaction.objectStore("usuario_alternativa_2");
        var respuestaCursor = store.openCursor();
        respuestaCursor.onsuccess = function(evt){
            var cursor = evt.target.result;
            if (cursor) {
               var ualternativa = cursor.value;
               var catid = ualternativa.catid;
               var pid = ualternativa.triid;
               var usuid = ualternativa.usuid;
               if(isNaN(parseInt(usuarios_respuestas[usuid]))){
                   usuarios_respuestas[usuid]=0;
               }
               var cantidad = parseInt(usuarios_respuestas[usuid])+1;
               //console.log("CANTIDAD: "+cantidad+" USUID: "+usuid);
               usuarios_respuestas[usuid]=cantidad;
                switch(catid){
                    case 1:
                          var index = preguntas.cat1.indexOf(pid);
                          if (index > -1) {
                              preguntas.cat1.splice(index, 1);
                          }
                        break;
                    case 2:
                          var index = preguntas.cat2.indexOf(pid);
                          if (index > -1) {
                              preguntas.cat2.splice(index, 1);
                          }
                        break;
                    case 3:
                          var index = preguntas.cat3.indexOf(pid);
                          if (index > -1) {
                              preguntas.cat3.splice(index, 1);
                          }
                        break;
					case 4:
						  pid = preguntas.cat4[Math.floor(Math.random()*preguntas.cat4.length)];
						  var index = preguntas.cat4.indexOf(pid);
						  if (index > -1) {
							  preguntas.cat4.splice(index, 1);
						  }
						break;
					case 5:
						  pid = preguntas.cat5[Math.floor(Math.random()*preguntas.cat5.length)];
						  var index = preguntas.cat5.indexOf(pid);
						  if (index > -1) {
							  preguntas.cat5.splice(index, 1);
						  }
						break;
					case 6:
						  pid = preguntas.cat6[Math.floor(Math.random()*preguntas.cat6.length)];
						  var index = preguntas.cat6.indexOf(pid);
						  if (index > -1) {
							  preguntas.cat6.splice(index, 1);
						  }
						break;
                }                  
               cursor.continue();
            }else{
                
                preload.ualternativa=true;
                console.log("Set ualternativa = true");
                
                var transaction = db.transaction(["usuario"],"readwrite");
                var store = transaction.objectStore("usuario");
                var respuestaCursor = store.openCursor();
                var existen_usuarios = false;
                respuestaCursor.onsuccess = function(evt){
                    var cursor = evt.target.result;
                    if(cursor){
                        existen_usuarios=true;
                        var usuario = cursor.value;
                        var usuid = usuario.id;
                        var nombre = usuario.nombre;
                        usuarios_nombres[usuid]=nombre;
                        
                        html.agregarUsuarioTR(usuid);
                        
                        trivia.webdb.usuario_cantidad = parseInt(trivia.webdb.usuario_cantidad)+1;
                        cursor.continue();
                    }else{
                        if(existen_usuarios){
                            if(!juego_nuevo){
                                console.log("NO ES NUEVO")
                                var cantidad_mayor = 0;
                                var cantidad_menor = 0;
                                var usuario_mayor = 1;
                                var usuario_menor = 1;
                                if(trivia.webdb.usuario_cantidad==1){
                                    if(isNaN(usuarios_respuestas[1])){
                                            usuarios_respuestas[1]=0;
                                    }
                                    cantidad_menor = parseInt(usuarios_respuestas[1]);
                                }else{
                                    for(var i=parseInt(trivia.webdb.usuario_cantidad); i>=1; i-- ){
                                        var tactual = 0;
                                        if(isNaN(usuarios_respuestas[i])){
                                            usuarios_respuestas[i]=0;
                                        }
                                        tactual = parseInt(usuarios_respuestas[i]);
                                        console.log("USUARIO: "+i+" CANTIDAD: "+tactual);
                                        //console.log("TACTUAL "+tactual+" I "+i);
                                        /*if(tactual > cantidad_mayor){
                                            cantidad_mayor = tactual;
                                            usuario_mayor = i;
                                            console.log(">  | tactual:"+tactual+" canmayor:"+cantidad_mayor)
                                        }
                                        if(tactual < cantidad_mayor){
                                            cantidad_menor = (tactual-1);
                                            usuario_menor = i;
                                            console.log("<=  | tactual:"+tactual+" canmayor:"+cantidad_mayor)
                                        }*/
                                        if(i==parseInt(trivia.webdb.usuario_cantidad)){
                                            cantidad_mayor=usuarios_respuestas[i];
                                            cantidad_menor=usuarios_respuestas[i];
                                        }
                                        
                                        if(tactual<=cantidad_menor){
                                            usuario_menor=i;
                                        }
                                        
                                    }                                    
                                }
                                console.log("UusuarioMenor "+usuario_menor);
                                var usuarios_cantidad = parseInt(trivia.webdb.usuario_cantidad);
                                switch(usuarios_cantidad){
                                    case 1:
                                            cantidadTotalPreguntas = 10;
                                        break;
                                    case 2:
                                            cantidadTotalPreguntas = 10;                    
                                        break;
                                    case 3:
                                            cantidadTotalPreguntas = 10;
                                        break;
                                    case 4:
                                            cantidadTotalPreguntas = 10;                    
                                        break;
                                    case 5:
                                            cantidadTotalPreguntas = 10;                      
                                        break;
                                    case 6:
                                            cantidadTotalPreguntas = 10;                  
                                        break;                
                                }
                                //console.log("CANTIDAD MENOR : "+usuario_menor);
                                cantidad_menor = cantidad_menor+1;
                                trivia.webdb.actual_usuario = usuario_menor;
                                $(".player-score").html("<em>"+cantidad_menor+"</em>/"+cantidadTotalPreguntas);
                                //console.log(usuario_mayor)
                                html.setTituloUsuario(usuarios_nombres[usuario_menor]);
                                $(".splash-title").addClass("hidden");
                                $("#li-jugar").addClass("hidden");
                                $(".main-title").removeClass("hidden");
                                $(".item-cat").removeClass("disabled");
                                trivia.indexedDB.getRanking();
                                
                                //Calculo
                                var mostrarnext = false;
                                for(var aa=1;aa<=trivia.webdb.usuario_cantidad;aa++){
                                    //console.log("A="+aa+" | "+usuarios_respuestas[aa]+" | "+cantidadTotalPreguntas);
                                    if(isNaN(usuarios_respuestas[aa])){
                                        usuarios_respuestas[aa]=0;
                                    }
                                    if(usuarios_respuestas[aa]<cantidadTotalPreguntas){
                                        mostrarnext = true;
                                    }
                                }
                                
                                preload.usuarios=true;
                                console.log("Set usuarios = true");
                                
                                if(mostrarnext){                                    
                                      setTimeout(function(){
                                           $(".modal-open-tips").trigger("click");
                                      },500);              
                                }else{
                                    $("#modal-stats").addClass("fin");
                                    $(".ribbon-felicitaciones").removeClass("hidden");
                                    //trivia.webdb.getRanking();
                                    setTimeout(function(){
                                        $(".modal-open-stats").trigger('click');
                                    },1000)

                                }
                                

                            }                    
                        }else{
                            preload.usuarios=true;
                            console.log("Set usuarios = true");
                        }
                    }
                }
                    if(juego_nuevo){
                        var transactionus = db.transaction(["usuario"],"readwrite");
                        var storeus = transactionus.objectStore("usuario");
                        var requestus = storeus.openCursor();
                        requestus.onsuccess = function(e){
                            var cursor = e.target.result;
                            if (cursor) {            
                                var primaryKey = cursor.primaryKey;
                                storeus.delete(primaryKey);
                                cursor.continue();
                            }
                        }
                        var transactional = db.transaction(["usuario_alternativa"],"readwrite");
                        var storeal = transactional.objectStore("usuario_alternativa");
                        var requestal = storeal.openCursor();
                        requestal.onsuccess = function(e){
                            var cursor = e.target.result;
                            if (cursor) {            
                                var primaryKey = cursor.primaryKey;
                                storeal.delete(primaryKey);
                                cursor.continue();
                            }
                        }
                        var transactional2 = db.transaction(["usuario_alternativa_2"],"readwrite");
                        var storeal2 = transactional2.objectStore("usuario_alternativa_2");
                        var requestal2 = storeal2.openCursor();
                        requestal2.onsuccess = function(e){
                            var cursor = e.target.result;
                            if (cursor) {            
                                var primaryKey = cursor.primaryKey;
                                storeal2.delete(primaryKey);
                                cursor.continue();
                            }
                        }
                }
            }        
        }    
}