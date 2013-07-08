
/** 
	una vez que se termina de cargar la pagina se ejecuta la función 
*/
document.addEventListener('DOMContentLoaded', function () {
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
  	document.getElementById("toggle-credito").addEventListener('click', mostrar_creditos);
  	cargar_marcas();
});

/*
	Carga las marcas almacenadas en el localStorage del navegador
*/
function cargar_marcas(){
	var marcas = localStorage["marcas"];

	var div = document.getElementById("lista_marcas");

	// si no hay nada almacenado se detiene
	if (typeof marcas === "undefined" || JSON.parse(marcas).length === 0){
		var nodo_ayuda_texto = document.createTextNode("no has marcado ningún tema aún.");
		var div_ayuda = document.createElement("div");

		div_ayuda.setAttribute("class","ayuda");
		div_ayuda.appendChild(nodo_ayuda_texto);
		div.appendChild(div_ayuda);

		return;
	}

	marcas = JSON.parse(marcas);

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

	for(var i=marcas.length-1; 0<=i;i--) {
		
		nodo_tr = document.createElement("tr");
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
		nodo_h2_fecha.appendChild(document.createTextNode(moment(marcas[i].fecha_ingreso,"D/M/YYYY HH:mm:ss").lang('es').fromNow()));

		nodo_a_titulo = document.createElement("a");
		nodo_a_titulo.setAttribute("href", marcas[i].link);
		nodo_a_titulo.setAttribute("target", "_blank");
		nodo_a_titulo.appendChild(document.createTextNode(marcas[i].titulo));

		nodo_h1_comentario = document.createElement("h1");
		nodo_h1_span_comentario = document.createElement("span");
		nodo_h1_span_comentario.appendChild(document.createTextNode(marcas[i].comentario)); 

		nodo_h1_url = document.createElement("h2");
		nodo_h1_url.appendChild(document.createTextNode(marcas[i].link));

		nodo_a_eliminar = document.createElement("a");
		nodo_a_eliminar.setAttribute("href", "#");
		nodo_a_eliminar.setAttribute("id", i);
		nodo_a_eliminar.appendChild(document.createTextNode("Eliminar"));
		nodo_a_eliminar.addEventListener("click", function() {
			if (confirm("¿Estás segur@ que deseas eliminar la marca?") && eliminar_marca(this.id)) {
				refrescar_vista();
			}
		});
		
		nodo_a_comentario = document.createElement("a");
		nodo_a_comentario.setAttribute("href", "#");
		nodo_a_comentario.setAttribute("id", i);
		nodo_a_comentario.appendChild(document.createTextNode("Comentar"));
		nodo_a_comentario.addEventListener("click", function() {
			var comentario = prompt("comenta la marca:", get_comentario(this.id));
			if (comentario != null) {
				set_comentario(comentario, this.id);
				refrescar_vista();
			}
		});

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

function refrescar_vista() {
	var div = document.getElementById("lista_marcas");
	div.innerHTML = "";
	cargar_marcas();
}

function get_comentario(id) {
	var marcas = localStorage["marcas"];
	marcas = JSON.parse(marcas);

	return marcas[id].comentario;
}

function set_comentario(comentario, id) {
	var marcas = localStorage["marcas"];
	marcas = JSON.parse(marcas);
		
	marcas[id].comentario = comentario;
	localStorage["marcas"] = JSON.stringify(marcas);
}

function eliminar_marca(id) {
	try {
		var marcas = localStorage["marcas"];
		marcas = JSON.parse(marcas);

		marcas.splice(id, 1);

		localStorage["marcas"] = JSON.stringify(marcas);
		return true;
	} catch(err) {
		console.log("Error al eliminar: " + err.message);
		return false;
	}
}

function mostrar_creditos() {
	var creditos = document.getElementById("creditos");

	if (creditos.style.display == "block")
		creditos.style.display = "none";
	else if (creditos.style.display == "none" || creditos.style.display == "" )
		creditos.style.display = "block";
}