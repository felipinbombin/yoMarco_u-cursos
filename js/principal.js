// configuración de googleAnalytics
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42211163-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function seguir_boton(e) {
	_gaq.push(['_trackEvent', e.target.className, 'clicked']);
}

/** 
	una vez que se termina de cargar la pagina se ejecuta la función 
*/
document.addEventListener('DOMContentLoaded', function () {

	document.getElementById("link_repositorio").addEventListener("click",seguir_boton);
	document.getElementById("link_documentacion").addEventListener("click",seguir_boton);

	// Configuración de moment.js a español
	moment.lang('es', {
	    months : "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
	    monthsShort : "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_"),
	    weekdays : "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
	    weekdaysShort : "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
	    weekdaysMin : "Do_Lu_Ma_Mi_Ju_Vi_Sá".split("_"),
	    longDateFormat : {
	        LT : "H:mm",
	        L : "DD/MM/YYYY",
	        LL : "D [de] MMMM [de] YYYY",
	        LLL : "D [de] MMMM [de] YYYY LT",
	        LLLL : "dddd, D [de] MMMM [de] YYYY LT"
	    },
	    calendar : {
	        sameDay : function () {
	            return '[hoy a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextDay : function () {
	            return '[mañana a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        nextWeek : function () {
	            return 'dddd [a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastDay : function () {
	            return '[ayer a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        lastWeek : function () {
	            return '[el] dddd [pasado a la' + ((this.hours() !== 1) ? 's' : '') + '] LT';
	        },
	        sameElse : 'L'
	    },
	    relativeTime : {
	        future : "en %s",
	        past : "hace %s",
	        s : "unos segundos",
	        m : "un minuto",
	        mm : "%d minutos",
	        h : "una hora",
	        hh : "%d horas",
	        d : "un día",
	        dd : "%d días",
	        M : "un mes",
	        MM : "%d meses",
	        y : "un año",
	        yy : "%d años"
	    },
	    ordinal : '%dº',
	    week : {
	        dow : 1, // Monday is the first day of the week.
	        doy : 4  // The week that contains Jan 4th is the first week of the year.
	    }
	});

	// Asocia un evento click al enlace 'créditos'
	document.getElementById("toggle-credito").addEventListener('click', function(){
		var creditos = document.getElementById("creditos");

		if (creditos.style.display == "block")
			creditos.style.display = "none";
		else if (creditos.style.display == "none" || creditos.style.display == "" )
			creditos.style.display = "block";
	});
  	
	// Asocia evento click al enlace mostrar JSON
  	document.getElementById("toggle-json").addEventListener('click', function(){
		var json_marcas = document.getElementById("json");
		this.innerHTML = "";

		if (json_marcas.style.display == "block") {
			json_marcas.style.display = "none";
				
			this.appendChild(document.createTextNode(">Mostrar json"));
		} else if (json_marcas.style.display == "none" || json_marcas.style.display == "" ) {

			var ref_toggle_json = this;
			chrome.storage.sync.get(null, function(almacen_json) {

				json_marcas.innerHTML = "";
				json_marcas.appendChild(document.createTextNode(JSON.stringify(almacen_json)));
				json_marcas.style.display = "block";

				ref_toggle_json.appendChild(document.createTextNode("<Ocultar json"));
			});
		}
  	});

  	cargar_marcas();
});

/*
	Carga las marcas almacenadas en chrome.storage.sync del navegador
*/
function cargar_marcas(){
	
	chrome.storage.sync.get(null, function(almacen_json) {
        
        var marcas;
        var hay_marcas = false;

        // Busca si hay marcas para mostrar
        for(marcas in almacen_json){
            if (typeof marcas != "undefined" && almacen_json[marcas].length > 0) {
                hay_marcas = true;
                break;
            }
        }

		var div = document.getElementById("lista_marcas");

		// si no hay nada almacenado se detiene
		if (!hay_marcas){
			var nodo_ayuda_texto = document.createTextNode("no has marcado ningún tema aún.");
			var div_ayuda = document.createElement("div");

			div_ayuda.setAttribute("class","ayuda");
			div_ayuda.appendChild(nodo_ayuda_texto);
			div.appendChild(div_ayuda);

			return;
		}

		/**
			creación de tabla
		*/
		var nodo_table = null;
		var nodo_thead = null;
		var nodo_tr = null;
		var nodo_th_titulo = null;
		var nodo_th_comentario = null;
		var nodo_th_opciones = null;
		var nodo_tbody = null;

		nodo_table = document.createElement("table");
		nodo_table.setAttribute("class", "sortable");
		nodo_thead = document.createElement("thead");
		nodo_tr = document.createElement("tr");
		nodo_tr.setAttribute("class", "odd");
		nodo_th_titulo = document.createElement("th");
		nodo_th_titulo.setAttribute("class", "string");
		nodo_th_titulo.appendChild(document.createTextNode("Titulo"));
		nodo_th_comentario = document.createElement("th");
		nodo_th_comentario.setAttribute("class", "number gris");
		nodo_th_comentario.appendChild(document.createTextNode("Comentario"));
		nodo_th_opciones = document.createElement("th");
		nodo_th_opciones.setAttribute("class", "opciones");
		nodo_th_opciones.setAttribute("colspan", "2");
		nodo_th_opciones.appendChild(document.createTextNode("Opciones"));
		nodo_tbody = document.createElement("tbody");
		nodo_tbody.setAttribute("id", "body");

		nodo_tr.appendChild(nodo_th_titulo);
		nodo_tr.appendChild(nodo_th_comentario);
		nodo_tr.appendChild(nodo_th_opciones);
		nodo_thead.appendChild(nodo_tr);

		nodo_table.appendChild(nodo_thead);
		nodo_table.appendChild(nodo_tbody);

		div.appendChild(nodo_table);

		/**
			creación de cada fila de la tabla
		*/
		var nodo_tr = null;
		var nodo_td_titulo_fecha = null;
		var nodo_td_comentario_url = null;
		var nodo_td_eliminar = null;
		var nodo_td_comentar = null;
		var nodo_h1_titulo = null;
		var nodo_h2_fecha = null;
		var nodo_a_titulo = null;
		var nodo_h1_comentario = null;
		var nodo_h1_span_comentario = null;
		var nodo_h1_url = null;
		var nodo_a_eliminar = null;
		var nodo_a_comentario = null;

		for(marcas in almacen_json){
			for(var i=almacen_json[marcas].length-1; 0<=i;i--) {
				
				nodo_tr = document.createElement("tr");
				nodo_tr.setAttribute("id", "fila-" + marcas + "-" + i);
				nodo_tr.setAttribute("class", "odd");

				nodo_td_titulo_fecha = document.createElement("td");
				nodo_td_titulo_fecha.setAttribute("class", "string");
				nodo_td_comentario_url = document.createElement("td");
				nodo_td_comentario_url.setAttribute("class", "number");
				nodo_td_eliminar = document.createElement("td");
				nodo_td_eliminar.setAttribute("class", "opciones");
				nodo_td_comentar = document.createElement("td");
				nodo_td_comentar.setAttribute("class", "opciones");

				nodo_h1_titulo = document.createElement("h1");
				nodo_h2_fecha = document.createElement("h2");
				nodo_h2_fecha.appendChild(document.createTextNode(moment(almacen_json[marcas][i].fecha_ingreso,"YYYY/MM/DD HH:mm:ss").lang('es').fromNow()));

				nodo_a_titulo = document.createElement("a");
				nodo_a_titulo.setAttribute("href", almacen_json[marcas][i].link);
				nodo_a_titulo.setAttribute("target", "_blank");
				nodo_a_titulo.setAttribute("class", "Titulo");
				nodo_a_titulo.appendChild(document.createTextNode(almacen_json[marcas][i].titulo));
				nodo_a_titulo.addEventListener("click", seguir_boton);

				nodo_h1_comentario = document.createElement("h1");
				nodo_h1_span_comentario = document.createElement("span");
				nodo_h1_span_comentario.setAttribute("id", "comentario-" + marcas + "-" + i);
				nodo_h1_span_comentario.appendChild(document.createTextNode(almacen_json[marcas][i].comentario)); 

				nodo_h1_url = document.createElement("h2");
				nodo_h1_url.appendChild(document.createTextNode(almacen_json[marcas][i].link));

				nodo_a_eliminar = document.createElement("a");
				nodo_a_eliminar.setAttribute("href", "#");
				nodo_a_eliminar.setAttribute("id", marcas + "-" + i);
				nodo_a_eliminar.setAttribute("class", "Eliminar");			
				nodo_a_eliminar.appendChild(document.createTextNode("Eliminar"));
				nodo_a_eliminar.addEventListener("click", seguir_boton);
				nodo_a_eliminar.addEventListener("click", eliminar_marca);
				
				nodo_a_comentario = document.createElement("a");
				nodo_a_comentario.setAttribute("href", "#");
				nodo_a_comentario.setAttribute("id", marcas + "-" + i);
				nodo_a_comentario.setAttribute("class", "Comentar");
				nodo_a_comentario.appendChild(document.createTextNode("Comentar"));
				nodo_a_comentario.addEventListener("click", seguir_boton);
				nodo_a_comentario.addEventListener("click", editar_comentario);
				
				nodo_h1_comentario.appendChild(nodo_h1_span_comentario);
				nodo_h1_titulo.appendChild(nodo_a_titulo);
				nodo_td_titulo_fecha.appendChild(nodo_h1_titulo);
				nodo_td_titulo_fecha.appendChild(nodo_h2_fecha);
				nodo_td_comentario_url.appendChild(nodo_h1_comentario);
				nodo_td_comentario_url.appendChild(nodo_h1_url);		
				nodo_td_eliminar.appendChild(nodo_a_eliminar);
				nodo_td_comentar.appendChild(nodo_a_comentario);
				nodo_tr.appendChild(nodo_td_titulo_fecha);
				nodo_tr.appendChild(nodo_td_comentario_url);
				nodo_tr.appendChild(nodo_td_eliminar);
				nodo_tr.appendChild(nodo_td_comentar);
				nodo_tbody.appendChild(nodo_tr);
			}
		}
	});
}

function refrescar_vista() {
	var div = document.getElementById("lista_marcas");
	div.innerHTML = "";
	cargar_marcas();
}

function editar_comentario(e) {
	var arr_id = e.target.id.split("-");
	
	var registro = arr_id[0];
	var id = arr_id[1];

	chrome.storage.sync.get(null, function(almacen_json) {
		for (marcas in almacen_json) {
			if (marcas === registro) {
				var comentario = prompt("comenta la marca:", almacen_json[marcas][id].comentario);

				if (comentario != null)
					if (comentario.length > 50) {
						alert("Tú comentario no puede exceder los 50 caracteres(" + comentario.length + ")");
					} else {
						almacen_json[marcas][id].comentario = comentario;
						// se actualizan los datos
					    chrome.storage.sync.set(almacen_json, function() {
					    	var com = document.getElementById("comentario-" + e.target.id);
					    	com.childNodes[0].nodeValue = comentario;
					    });
					}
			}
		}
	});
}

function eliminar_marca(e) {
	var arr_id = e.target.id.split("-");
	
	var registro = arr_id[0];
	var id = arr_id[1];

	if (confirm("¿Estás segur@ que deseas eliminar la marca?")) {
		chrome.storage.sync.get(null, function(almacen_json) {
			for (marcas in almacen_json) {
				if (marcas === registro) {
					// se elimina la marca específicada por el id
					almacen_json[marcas].splice(id, 1);		
				}
			}			

			// se actualizan los datos
		    chrome.storage.sync.set(almacen_json, function() {
		    	var fila = document.getElementById("fila-" + e.target.id);
		    	fila.parentNode.removeChild(fila);
		    });
		});	
	}
}