var user = "";
var apiUrl = "https://localhost:44362/";
//var apiUrl = "http://192.168.0.5:8091/";
//var apiUrl = "https://www.solucioneserp.com.ar/API_DINAMICA_API/";
var apis = [];
var datosGrilla=[];
var strApi='';
var apiActualizada=false;

getUser = () => {
  mostrarLoading();
  const queryString = window.location.search;
  if (queryString) {
    if (queryString.length > 0) {
      const urlParams = new URLSearchParams(queryString);
      if (urlParams) {
        const u = urlParams.get("user");
        if (u) {
          user = u;
        }
      }
    }
  }

  console.log(user);
  if (user) {
    getApis();
  }
  else{
      ocultarLoading();
  }
};

const getApis = () => {
  var json = {};
  const url = apiUrl + "api/SolERP/Get_Apis?user=" + user.trim();
  const requestOptions = {
    method: "GET",
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      json = data;
      llenarComboApi(json);
      ocultarLoading();
    })
    .catch((error) => {
      console.log("error", error);
      console.log("server is down!!");
      ocultarLoading();
    });
};

llenarComboApi = (json) => {
  if (!json) {
    apis.unshift(apiVacia());
  } else {
    if (json.resultado === "ok") {
      apis = json.apis;
      apis.unshift(apiVacia());
    } else {
      apis.push(apiVacia());
    }
  }

  var comboApi = document.getElementById("comboApi");

  apis.forEach((i) => {
    let option = document.createElement("option");
    option.text = i.nombre;
    option.value = i.codigo;
    comboApi.add(option);
  });
};

apiVacia = () => {
  const x = {
    codigo: "",
    nombre: "SELECCIONAR",
    parametros: [],
  };
  return x;
};

inicializarValores= () =>{
  apiActualizada=false;
  spanRegirstros.innerHTML='0';
  const toppagina= document.getElementById("toppagina");
  toppagina.innerHTML='';
  limiteRegistros.innerHTML='';
  datosGrilla=[];
  llenarTabla([]);
  cerrarAlerta();
}

onchangeApi = () => {
  inicializarValores();
  const comboApi = document.getElementById("comboApi");
  const valor = comboApi.value;
  const datosApi = getDatosApi(valor);

  const input1 = document.getElementById("input01");
  const input2 = document.getElementById("input02");
  const input3 = document.getElementById("input03");
  const input4 = document.getElementById("input04");

  const label1 = document.getElementById("lbl01");
  const label2 = document.getElementById("lbl02");
  const label3 = document.getElementById("lbl03");
  const label4 = document.getElementById("lbl04");

  input1.setAttribute("style", "display:none;");
  label1.setAttribute("style", "display:none;");

  input2.setAttribute("style", "display:none;");
  label2.setAttribute("style", "display:none;");

  input3.setAttribute("style", "display:none;");
  label3.setAttribute("style", "display:none;");

  input4.setAttribute("style", "display:none;");
  label4.setAttribute("style", "display:none;");

  if (datosApi) {
    let i = 0;
    datosApi.parametros.forEach((x) => {
      switch (i) {
        case 0:
          input1.setAttribute("type", x.tipo.trim());
          input1.setAttribute("style", "display:block;");
          label1.innerHTML = x.parametro.trim();
          label1.setAttribute("style", "display:block;");
          break;
        case 1:
          input2.setAttribute("type", x.tipo.trim());
          input2.setAttribute("style", "display:block;");
          label2.innerHTML = x.parametro.trim();
          label2.setAttribute("style", "display:block;");
          break;
        case 2:
          input3.setAttribute("type", x.tipo.trim());
          input3.setAttribute("style", "display:block;");
          label3.innerHTML = x.parametro.trim();
          label3.setAttribute("style", "display:block;");
          break;
        case 3:
          input4.setAttribute("type", x.tipo.trim());
          input4.setAttribute("style", "display:block;");
          label4.innerHTML = x.parametro.trim();
          label4.setAttribute("style", "display:block;");
          break;
      }
      i++;
    });
  }
};

getDatosApi = (codigo) => {
  return apis.find((x) => {
    return x.codigo === codigo;
  });
};

actualizar = () => {
    mostrarLoading();
    cerrarAlerta();
    apiActualizada=true;
    getConsulta();
};



const getConsulta = () => {
  const spanRegirstros= document.getElementById("spanRegirstros");
  const toppagina= document.getElementById("toppagina");
  const limiteRegistros = document.getElementById("limiteRegistros");
  
  spanRegirstros.innerHTML='0';
  toppagina.innerHTML='';
  limiteRegistros.innerHTML='';
  const comboApi = document.getElementById("comboApi");
  const parametros=getConsultaParametros();
  const url = apiUrl + "api/SolERP/Consulta?user=" + user.trim()+ '&v=' + comboApi.value.trim() + parametros;
  strApi=url;
  const requestOptions = {
    method: "GET",
  };
  fetch(url, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      datosGrilla = data;
      llenarTabla(datosGrilla);
      spanRegirstros.innerHTML=datosGrilla.length || 0;

      toppagina.innerHTML=datosGrilla.length===10000 ? 'Página 1/…' : '';
      ocultarLoading();
      
    })
    .catch((error) => {
        spanRegirstros.innerHTML=datosGrilla.length || 0;
        ocultarLoading();
        alert(error);      
    });
    
};

const getConsultaParametros = () => {
  strParametros = "";
  const comboApi = document.getElementById("comboApi");
  const input1 = document.getElementById("input01");
  const input2 = document.getElementById("input02");
  const input3 = document.getElementById("input03");
  const input4 = document.getElementById("input04");

  const valor = comboApi.value;
  const datosApi = getDatosApi(valor);
  let i = 0;
  datosApi.parametros.forEach((x) => {
    switch (i) {
      case 0:
        strParametros += "&p1=" + input1.value.trim();
        break;
      case 1:
        strParametros += "&p2=" + input2.value.trim();
        break;
      case 2:
        strParametros += "&p3=" + input3.value.trim();
        break;
      case 3:
        strParametros += "&p4=" + input4.value.trim();
        break;
    }
    i++;
  });
  return strParametros;
};


llenarTabla = (json)=>{
    //
    const registros=json.length;
    if(registros>2000){
      limiteRegistros.innerHTML='El reporte devuelve mas de 2000 registros, consulte este reporte desde Excel';
      let jsonAux=json.slice(0,10);
      json=jsonAux;
    }

    // Crear la tabla con los datos recibidos de la API Rest
    var tabla = new Tabulator("#tablaDatos", {
        data: json,
        layout: "fitColumns",
        autoColumns: true,
      });
}


function mostrarLoading() {
    var loadingContainer = document.getElementById("loadingContainer");
    loadingContainer.style.display = "block";
  }
  
  function ocultarLoading() {
    var loadingContainer = document.getElementById("loadingContainer");
    loadingContainer.style.display = "none";
  }

  descargar=()=>{
    var worksheet = XLSX.utils.json_to_sheet(datosGrilla);
    var workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    var excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    var blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
    var link= document.getElementById('descargar');
    link.href = window.URL.createObjectURL(blob);
    link.download = "data.xlsx";
    link.click();

  }

  
  mostrarAlerta= () => {
    var divApi= document.getElementById("divApi");
    divApi.style.display = "flex";
    //divApi.setAttribute('display','block'); 
    
  }
  

  cerrarAlerta= () =>{
    var divApi= document.getElementById("divApi");
    divApi.style.display = "none";
  }

  verApi = () =>{
    var spanApi= document.getElementById("spanApi");
    var mensaje=strApi
    spanApi.innerHTML=mensaje;
    // var popup = window.open("", "popup", "width=300,height=200"); // Abre una ventana popup sin URL
      
    //   // Escribe los datos en el popup
    //   popup.document.write("<h1>API:</h1>");
    //   popup.document.write("<p>" + strApi + "</p>");
      
    //   // Cierra el documento y muestra el contenido
    //   popup.document.close();
    if(apiActualizada){
      mostrarAlerta();
    }
    else{
      cerrarAlerta();
    }
    
  }

  
