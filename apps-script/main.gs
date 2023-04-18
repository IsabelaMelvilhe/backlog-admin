function doGet() {
  var template = HtmlService.createTemplateFromFile("index");
  return template.evaluate()
  
}
function include(fileName){

  return HtmlService.createHtmlOutputFromFile(fileName).getContent();

}


//-----------------------------------Encontrar Casos-----------------------------------

// Função para puxar os casos da planilha 
function getCasos(){

  //Puxa um array da Planilha com todos os casos (04 colunas)
  var planilha = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/")
  var aba = planilha.getSheetByName("Casos")
  var dados = aba.getRange(1,1,aba.getLastRow(),4).getValues()

  //Separa o array em 4 arrays (IDHugme, Ticket,	Respondido	e Status)

  var idHugme = dados.map(function(r){return r[0];});
  var ticket = dados.map(function(r){return r[1];});
  var status = dados.map(function(r){return r[2];});
  var respondido = dados.map(function(r){return r[3];});
  

  var casos = []


  for(let index=0; index < idHugme.length;index++){
    if(!respondido[index]){

      var resultado = {
        idHugme:idHugme[index],
        ticket:ticket[index],
        status:status[index]
      }

      casos.push(resultado)
      
    }

  }

  Logger.log(casos)
  Logger.log(Session.getActiveUser().getEmail())

  //Retorna o array
  return casos
}

function getStatus(){
  var planilha = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/")
  var aba = planilha.getSheetByName("Status")
  var dados = aba.getRange(1,1,aba.getLastRow(),1).getValues()
  var status = dados.map(function(r){return r[0];});
  Logger.log(status)
  return status.sort()

}

function updateCaso(id_hugme,status,respondido=false,dataFinalizacao=""){

    var planilha = SpreadsheetApp.openByUrl("https://docs.google.com/spreadsheets/")
    var aba = planilha.getSheetByName("Casos")
    var dados = aba.getRange(1,1,aba.getLastRow(),1).getValues()

    for(let i=0;i<dados.length;i++){

      if(id_hugme == dados[i][0]){
        aba.getRange(i+1,3).setValue(status)
        if(respondido){
          aba.getRange(i+1,4).setValue(respondido)
          aba.getRange(i+1,5).setValue(new Date (dataFinalizacao))

        } 
      }
    }
    return id_hugme
}

function salvarNaPlanilha(caso){
  var url = "https://docs.google.com/spreadsheets/";

  var ss = SpreadsheetApp.openByUrl(url);
  var ws = ss.getSheetByName("Casos");

  ws.appendRow([caso.idHugme,caso.ticket, caso.status,false]);

}

