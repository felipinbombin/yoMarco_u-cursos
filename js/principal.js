// Configuración de googleAnalytics
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

// Configuración para spin.js
var opts = {
	lines: 7, // The number of lines to draw
	length: 0, // The length of each line
	width: 4, // The line thickness
	radius: 2, // The radius of the inner circle
	corners: 1, // Corner roundness (0..1)
	rotate: 1, // The rotation offset
	direction: 1, // 1: clockwise, -1: counterclockwise
	color: '#bb8a1d', // #rgb or #rrggbb
	speed: 1, // Rounds per second
	trail: 60, // Afterglow percentage
	shadow: false, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: '2', // Top position relative to parent in px
	left: '0' // Left position relative to parent in px
};

/** 
	Una vez que se termina de cargar la pagina www.u-cursos.cl se ejecuta la función 
*/
document.addEventListener('DOMContentLoaded', function () {

	// Seguimiento a los link de repositorio y documentación
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
		
		var hay_marcas = false;

		// Busca si hay marcas para mostrar
		for(registro in almacen_json){
			if (almacen_json[registro].length > 0) {
				hay_marcas = true;
				break;
			}
		}

		var div = document.getElementById("lista_marcas");

		// si no hay nada almacenado se detiene
		if (!hay_marcas){
			var div_sin_marcas = document.createElement("div");

			div_sin_marcas.setAttribute("class","ayuda");
			div_sin_marcas.appendChild(document.createTextNode("no has marcado ningún tema aún."));
			div.appendChild(div_sin_marcas);

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
		var nodo_div_ctd_resp = null;
		var nodo_h1_comentario = null;
		var nodo_h1_span_comentario = null;
		var nodo_h1_url = null;
		var nodo_a_eliminar = null;
		var nodo_a_comentario = null;

		for(registro in almacen_json){
			for(var id=almacen_json[registro].length - 1; 0<=id; id--) {
				
				// cada fila de la tabla tiene id='fila-registro-id'
				nodo_tr = document.createElement("tr");
				nodo_tr.setAttribute("id", "fila-" + registro + "-" + id);
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

				nodo_div_ctd_resp = document.createElement("div");
				nodo_div_ctd_resp.setAttribute("id", "ctd_resp-" + registro + "-" + id);
				nodo_div_ctd_resp.setAttribute("class", "ayuda ctd_resp");

				nodo_h2_fecha = document.createElement("h2");
				nodo_h2_fecha.appendChild(document.createTextNode(moment(almacen_json[registro][id].fecha_ingreso,"YYYY/MM/DD HH:mm:ss").lang('es').fromNow()));

				nodo_a_titulo = document.createElement("a");
				nodo_a_titulo.setAttribute("href", almacen_json[registro][id].link);
				nodo_a_titulo.setAttribute("target", "_blank");
				nodo_a_titulo.setAttribute("id", "titulo-" + registro + "-" + id);
				nodo_a_titulo.setAttribute("class", "Titulo");
				nodo_a_titulo.appendChild(document.createTextNode(almacen_json[registro][id].titulo));
				nodo_a_titulo.addEventListener("click", seguir_boton);
				nodo_a_titulo.addEventListener("click", actualizar_ctd_resp);

				nodo_h1_comentario = document.createElement("h1");
				// cada tag donde va el comentario tiene id='comentario-registro-id'
				nodo_h1_span_comentario = document.createElement("span");
				nodo_h1_span_comentario.setAttribute("id", "comentario-" + registro + "-" + id);
				nodo_h1_span_comentario.appendChild(document.createTextNode(almacen_json[registro][id].comentario)); 

				nodo_h1_url = document.createElement("h2");
				nodo_h1_url.appendChild(document.createTextNode(almacen_json[registro][id].link));

				// cada tag donde va el link que elimina una marca tiene id='eliminar-registro-id'
				nodo_a_eliminar = document.createElement("a");
				nodo_a_eliminar.setAttribute("href", "#");
				nodo_a_eliminar.setAttribute("id", "eliminar-" + registro + "-" + id);
				nodo_a_eliminar.setAttribute("class", "Eliminar");
				nodo_a_eliminar.appendChild(document.createTextNode("Eliminar"));
				nodo_a_eliminar.addEventListener("click", seguir_boton);
				nodo_a_eliminar.addEventListener("click", eliminar_marca);
				
				// cada tag donde va el link que comenta una marca tiene id='comentar-registro-id'
				nodo_a_comentario = document.createElement("a");
				nodo_a_comentario.setAttribute("href", "#");
				nodo_a_comentario.setAttribute("id", "comentar-" + registro + "-" + id);
				nodo_a_comentario.setAttribute("class", "Comentar");
				nodo_a_comentario.appendChild(document.createTextNode("Comentar"));
				nodo_a_comentario.addEventListener("click", seguir_boton);
				nodo_a_comentario.addEventListener("click", comentar);
				
				nodo_h1_comentario.appendChild(nodo_h1_span_comentario);
				nodo_h1_titulo.appendChild(nodo_a_titulo);
				nodo_td_titulo_fecha.appendChild(nodo_h1_titulo);
				nodo_td_titulo_fecha.appendChild(nodo_div_ctd_resp);
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

				// Revisa si el tema tiene nuevos mensajes
				if (almacen_json[registro][id].ctd_resp < 100)
					actualizar_info_tema(nodo_div_ctd_resp, nodo_a_titulo, almacen_json[registro][id].link, almacen_json[registro][id].ctd_resp);
			}
		}
	});
}

/**
	Función que se ejecuta cuando se hace click en el link 'comentar' de una marca
*/
function comentar(e) {
	var fila_marca = e.target.parentNode.parentNode;
	var fila_comentario = document.getElementById("fila_comentario");

	/**
		Si no hay un form comentar, se agrega, de lo contrario se revisa si el existente
		es para la misma marca, si es así, no se hace nada, de lo contrario se elimina el existente y se agrega uno para la marca actual.
	*/
	if (fila_comentario === null)
		abrir_comentario(fila_marca);
	else if (fila_comentario.previousSibling != fila_marca) {
		fila_comentario.parentNode.removeChild(fila_comentario);
		abrir_comentario(fila_marca);		
	}
}

/**
	Crea un formulario para escribir un comentario asociado a una marca
*/
function abrir_comentario(fila_marca) {

	var arr_id_marca = fila_marca.id.split("-");
	var nombre_registro = arr_id_marca[1];
	var id_registro = arr_id_marca[2];

	var tr_comentario = null;
	var td_responder = null;
	var form = null;
	var div_textarea = null;
	var textarea = null;
	var div_botones = null;
	var input_grabar = null;
	var input_cancelar = null;

	tr_comentario = document.createElement("tr");
	tr_comentario.setAttribute("id", "fila_comentario");

	td_responder = document.createElement("td");
	td_responder.setAttribute("class", "responder");
	td_responder.setAttribute("colspan", "4");

	form = document.createElement("form");
	form.setAttribute("accept-charset", "utf-8");

	div_textarea = document.createElement("div");
	div_textarea.setAttribute("class", "textarea");

	textarea = document.createElement("textarea");
	textarea.setAttribute("type", "text");
	textarea.setAttribute("name", "comentario");
	textarea.setAttribute("placeholder", "...");
	chrome.storage.sync.get(nombre_registro, function(almacen_json) {
		textarea.appendChild(document.createTextNode(almacen_json[nombre_registro][id_registro].comentario));
	});
	
	div_botones = document.createElement("div");
	div_botones.setAttribute("class", "botones");

	input_grabar = document.createElement("input");
	input_grabar.setAttribute("type", "button");
	input_grabar.setAttribute("name", "grabar");
	input_grabar.setAttribute("value", "Grabar");
	input_grabar.setAttribute("class", "boton");
	input_grabar.setAttribute("id", "grabar-" + nombre_registro + "-" + id_registro);	
	input_grabar.addEventListener("click", grabar_comentario);

	input_cancelar = document.createElement("input");
	input_cancelar.setAttribute("type", "button");
	input_cancelar.setAttribute("name", "cancelar");
	input_cancelar.setAttribute("value", "Cancelar");
	input_cancelar.setAttribute("class", "boton cancelar");
	input_cancelar.addEventListener("click", cerrar_form_comentar);

	tr_comentario.appendChild(td_responder);
	td_responder.appendChild(form);
	form.appendChild(div_textarea);
	form.appendChild(div_botones);
	div_textarea.appendChild(textarea);
	div_botones.appendChild(input_grabar);
	div_botones.appendChild(input_cancelar);

	// El form para comentar se inserta debajo de la marca asociada
	fila_marca.parentNode.insertBefore(tr_comentario, fila_marca.nextSibling);

	textarea.focus();
}

function cerrar_form_comentar() {
	// Tag <tr> del form para comentar
	var tr_comentar = document.getElementById("fila_comentario");
	if (tr_comentar != null)
		tr_comentar.parentNode.removeChild(tr_comentar);
}

function grabar_comentario(e) {
	// Tag <tr> de la marca asociada al comentario
	var arr_fila = e.target.id.split("-");
	var nombre_registro = arr_fila[1];
	var id_registro = arr_fila[2];

	// Comentario ingresado en el textarea
	var comentario = document.getElementsByTagName("textarea")[0].value;

	if (comentario != null) {
		if (comentario.length > 50) {
			alert("Tú comentario no puede exceder los 50 caracteres(" + comentario.length + ")");
		} else {
			chrome.storage.sync.get(nombre_registro, function(almacen_json) {
				almacen_json[nombre_registro][id_registro].comentario = comentario;
				// se actualizan los datos
				chrome.storage.sync.set(almacen_json, function() {
					// una vez guardado se cierra el form
					cerrar_form_comentar(e);
					var com = document.getElementById("comentario-" + nombre_registro + "-" + id_registro);
					com.childNodes[0].nodeValue = comentario;
				});
			});
		}
	}
}

function eliminar_marca(e) {

	var arr_id = e.target.id.split("-");
	
	var nombre_registro = arr_id[1];
	var id_registro = arr_id[2];

	if (confirm("¿Estás segur@ que deseas eliminar la marca?")) {
		chrome.storage.sync.get(nombre_registro, function(almacen_json) {
			// Se elimina la marca específicada por el id
			almacen_json[nombre_registro].splice(id_registro, 1);		
			
			// Se actualizan los datos
			chrome.storage.sync.set(almacen_json, function() {
				// fila de la marca que se va a eliminar
				var fila = document.getElementById("fila-" + nombre_registro + "-" + id_registro);
				
				// Si la fila para comentar esta debajo de la fila a eliminar -> se cierra.
				if(fila.nextSibling != null && fila.nextSibling.id == "fila_comentario")
					cerrar_form_comentar();
				// Se elimina la fila de la tabla que contiene la marca
				fila.parentNode.removeChild(fila);
			});
		});	
	}
}

/**
	Actualiza la cantidad de respuestas vistas una vez que se hace click en el titulo del tema.
*/
function actualizar_ctd_resp(e) {
	var ctd_nueva_resp = parseInt(e.target.parentNode.nextSibling.childNodes[0].nodeValue.match(/[0-9]+/));

	var nombre_registro = e.target.id.split("-")[1];
	var id_registro = e.target.id.split("-")[2];

	chrome.storage.sync.get(nombre_registro, function(almacen_json) {
		// Se elimina la marca específicada por el id
		almacen_json[nombre_registro][id_registro].ctd_resp = almacen_json[nombre_registro][id_registro].ctd_resp + ctd_nueva_resp;		
		
		// Se actualizan los datos
		chrome.storage.sync.set(almacen_json, function() {
			console.log("cantidad de mensajes leídos actualizado.");
		});
	});	
}

/**
	Llamada AJAX que revisa si el tema tiene nuevos mensajes, si es así destaca el titulo e imprime
	la cantidad de mensajes nuevos a la derecha del titulo
*/
function actualizar_info_tema(tag_div, tag_titulo, url, ctd_respuestas) {
	
	// Aparece spin que indica que se esta consultando info del tema.
	var spinner = new Spinner(opts).spin(tag_div);
	var xmlhttp;

	if (window.XMLHttpRequest) {// Código para IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	} else {// código para IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange = function() {
		// Si el servidor responde positivamente (sin errores = 200) y termino la llamada
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			spinner.stop();

			// Obtiene de la cadena el string <body>...</body>
			var string_html = xmlhttp.responseText;
			var tag_body = string_html.substring(string_html.search("<body>"), string_html.search("</body>")+7);
			//tag_body = xmlhttp.responseText.substring(xmlhttp.responseText.search(/\)<\/h1>/) + 7, xmlhttp.responseText.search(/<ul class="paginas">/));
			//tag_body = tag_body.replace(/(\r\n|\n|\r)/gm,"");

			/* NO FUNCIONA!!!
			// Convierte el string <body>...</body> en objetos DOM
			//var parser = new DOMParser();
			var tag_parse = parser.parseFromString(xmlhttp.responseText, "text/xml");*/

			// Id del mensaje de u-cursos
			var id_mensaje = url.split("/");
			id_mensaje = "mensaje_" + id_mensaje[id_mensaje.length-1];
			
			// crea un arreglo con el string de cada tema [inicio->raiz_tema1, raiz_tema1->raiz_tema2, etc...]
			arr_body = tag_body.split(/<div id="mensaje_[0-9]*" class=".* raiz.*">.*\n.*\n.*\n.*/g);
			
			for(var i=0;i<arr_body.length;i++) {
				// Si el mensaje se encuentra en esta parte
				if (arr_body[i].match(id_mensaje) != null) {
					var arr_raiz = tag_body.match(/<div id="mensaje_[0-9]*" class=".* raiz.*">.*\n.*\n.*\n.*/g);
					
					var cantidad_respuestas = parseInt(arr_raiz[i-1].match(/[0-9]* resp/g)[0].split(" ")[0]);

					// Tiene nuevos comentarios
					if (cantidad_respuestas === ctd_respuestas) {
						tag_div.innerHTML = "(0)";
					} else if (cantidad_respuestas > ctd_respuestas) {
						// Se resalta el titulo
						tag_titulo.setAttribute("class", "tiene_mensajes");
						tag_div.innerHTML = "(" + (cantidad_respuestas - ctd_respuestas) + ")";	
					}
				}
			}
		}
	};

	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

/*
function refrescar_vista() {
	var div = document.getElementById("lista_marcas");
	div.innerHTML = "";
	cargar_marcas();
}
*/