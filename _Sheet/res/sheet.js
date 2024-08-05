  
  let publ=false;       // public set
  
  let Sgen=document.getElementById('Sgen');
  let Saz=document.getElementById('Saz');
  let Sson=document.getElementById('Sson');
  let $Gen,$Son;
  let img = document.getElementById("Splash");
  let dimg = document.getElementById("dimg");
  let hsnv=document.getElementById("hsnv");  //compila pagine nascosta in verticale 
  let hsnt = hsnv.getContext("2d");
  let scnv=document.getElementById("scnv");  //visualizza finestra su pagine
  let scnt = scnv.getContext("2d");
  let mtnv=document.getElementById("mtnv");  //visualizza finestra metronomo
  let mtnt = mtnv.getContext("2d");
  let ccnv=document.getElementById("ccnv");    
  let ccnt=ccnv.getContext("2d");           
  let Box=document.getElementById("Box");
  let PgL=document.getElementById("PgL");
  let Metr=document.getElementById("Metr");
  let Mets=document.getElementById("Mets");
  let Tims=document.getElementById("Tims");
  let Timt=document.getElementById("Timt");
  let Titl=document.getElementById("Titl");
  let spq=document.getElementById("spq");
  let dt1=document.getElementById("dt1");
  let dt2=document.getElementById("dt2");
  let dt3=document.getElementById("dt3");
  let dt4=document.getElementById("dt4");
  let bpm2=document.getElementById("bpm2");
  let num2=document.getElementById("num2");
  let den2=document.getElementById("den2");
  let rnv=document.getElementById("rnv");
  let Vpx=document.getElementById("Vpx");
  let btt=document.getElementById("btt");
  let rdld=document.getElementById("rdld");
  let mdat=document.getElementById("mdat");
  let tbpm=document.getElementById("tbpm");
  let btPlay=document.getElementById("btPlay");
  let btStop=document.getElementById("btStop");
  let BtTime=document.getElementById("BtTime");
  let pdfname=document.getElementById("pdfname");
  let midname=document.getElementById("midname");
  let tdcol1=document.getElementById("tdcol1");
  let ckms=document.getElementById("ckms");
  let ckmd=document.getElementById("ckmd");
  let ckmm=document.getElementById("ckmm");
  let ckmt=document.getElementById("ckmt");
  let Pfile,Mfile;  
  let fileReader;
  let midiReader;
  let numPg="";         // number of pages
  let cpg=0;            // current page
  let scale = 1; 
  let scWi;             // screen ini width          data resizing screen
  let scHi;             // screen ini height         data resizing screen
  let scWib=true;       // blocco screen ini width   data resizing screen
  let scW;              // screen width
  let scH;              // screen height
  let stH;              // sheet total height 
  let wpdf,hpdf;        // original pdf width and height  ... indipendent by resize
  let vwidth;
  let vhight;
  let cnt=0;            // puntatore su hsnv per trasferimento su scnv
  let speed=0;          // Scroll speed
  let Mspeed=1;         // Midi speed default
  let maxH;
  let ac=[];            // array of canvas
  let ax=[];            // array of context
  let cnk=0;
  let mtc=0;            // metronome counter
  let mtx;              // metronome current fraction measure
  let mti;              // metronome setInterval
  let alpha;            // 00  to 99 transparency Metronome 
  let oct=false;        // suona gli ottavi
  let dely=1000;         // attesa caricamento pagina pdf   delz*1   delz*2
  const delz=1000;       // misura di dely
  let Mx0,My0,Mr0;      // Metronome    130,130,115
  let rfW;              // resizing factor width
  let rfH;              // resizing factor height
  let FMt=80;           // lettura Metronomo da file      
  let reg;              // Midi Mspeed to  Scroll speed  
  let fcnt;             // frame count
  var player;
  let MtOn=false;        // Metronome On-Off
//  let mySpeed=.5;       // 1.06
  let tbtm;             // table timing 
  let tbfl;             // table file txt
  let yp;               // array  dati di rigo
  let sr;               // array  sviluppo ripetizioni
  let nbt;              // numero battute
  let cbt;              // contatore battute
  let cbr;              // contatore battute sul rigo

  let crg;              // contatore righi
  let vy;               // velocità scroll
  let sd=true;          // scroll down
  let nj="&#9660";      // next jump     up:"&#9650"   down:"&#9660" 
  let tkt;              // tick time
  let rmb=false;        // remove Blue boolean
  let pxy;              // array blue position
  let brx;              // current measure in row;
  let bpm0;             // bpm original
  let MUpd=false;       // update Metronome
  let mx;
  let sgt;              // song tested
  let midiDMS;          // midi durations       in millisec
  let midiTS;           // midi time start      in millisec
  let midiTC;           // midi time current    in millisec
  let midiCR;           // midi time correction %
  let Mtso=false;       // metronome solo
  
  let vers=Vpx.value.substring(3); // remember  Sheets Source name contain  vers  5.1 for now
  LoadXML();
  //LocStoCanc();
  //LocStoListItems();
  LoadLocStrg();
//-----------------------------------------------------START---------------- 
  //--------ini midi 
  function report(s) { return function() { alert(s);};}
  JZZ.synth.Tiny.register('Web Audio');
  var out = JZZ().or(report('Cannot start MIDI engine!')).openMidiOut().or(report('Cannot open MIDI Out!'));
  window.onresize=Resize;
  Resize();
  scnv.width=scW-10;scnv.height=scH;

    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');

  window.onload = function(){scnt.drawImage(img,0,0,scW,scH)}
  SetAlpha(40);
  Metr.style.display="none";
  setInterval(Anim, 100);   // only one setInterval()
if(publ){// Modalità PUBLIC
  BtTime.style.display="none";   // tasto Time
  rmb=true;                      // remove measure blue
  if(publ){tdcol1.style.backgroundColor="#aaf";}else{tdcol1.style.backgroundColor="#ffa";}
}



function GetBlue(){
  let cl,b,w,k,fx,f=true;    // f evita ripetizioni per numeri lunghi >99 
  let px=0;
  let xy=[[],[],[]];             
  hsnt.fillStyle="#00f";
  hsnt.beginPath();
  for(let y=0;y<hsnv.height;y+=3){
    for(let x=0;x<hsnv.width;x+=3){       // correggere  per numeri > 99
      cl=hsnt.getImageData(x,y,1,1).data; // rgba e [0,255]
      if(f&&cl[1]<100&&cl[2]>100){        // blue found 
        b=true;f=false;fx=x;              // posizione primo pixel blue
        for(let i=0;i<xy[1].length;i++){
          if(Math.abs(x-xy[1][i])<40&&Math.abs(y-xy[2][i])<40){b=false;}    
        }
        if(b){
          hsnt.moveTo(x,y);
          if(ckmt.checked){//------------------test measure detect
            hsnt.fillStyle="#f005";
            hsnt.fillRect(x-13,y-8,43,25);}
          xy[1][px]=x;xy[2][px]=y;
          x+=50;px++;
        }
      }
      else{if(!f&&x-fx>40){f=true;}}  //  evita di ripetere entro 60 pixels
    }
  }
  hsnt.fill();
  removeBlue(rmb);
  // ordinamento per riga e colonna
  w=0;
  // normalize y  
  for(let i=0;i<xy[1].length;i++){
    if(xy[2][i]-w>30){w=xy[2][i];}else{xy[2][i]=w;}
  }
  // sort x
  for(let i=0;i<xy[1].length-1;i++){
    for(let j=i+1;j<xy[1].length-1;j++){
      if(xy[2][i]==xy[2][j]&&xy[1][i]>xy[1][j]){
        w=xy[1][i];xy[1][i]=xy[1][j];xy[1][j]=w;
      }
    }  
  }
  // compile progressive measure for each row
  w=0;k=0;
  for(let i=0;i<xy[1].length;i++){
    if(xy[2][i]==w){k++;}else{k=0;w=xy[2][i];}
    xy[0][i]=k;
  }
  return xy;
}




function ViewTims(){
  if(Tims.style.display=="none"){Tims.style.display="block";}
  else{Tims.style.display="none";}
}

function SaveTime(){
  let t;
  s=bpm2.value+"/"+num2.value+"/"+den2.value;
  for(let i=0;i<tbtm.rows.length-1;i++){
    s+="|"+document.getElementById("t3"+i).value;   // jumps array  
  }
  t=Sson.value.substring(0,Sson.value.length-2);
  saveTxt(s,t+".txt");
}  

function SetSong(){
  let sA,sB,sC,sD;
  let h,cnt=0;
  Mets.style.display='none';
  Titl.innerHTML="";// remove all child
  Titl.style.display="block";
  for(let i=0;i< $Son.length; i++) {
    sA=$Son[i].getElementsByTagName("A")[0].childNodes[0].nodeValue; //Iniziali
    sB=$Son[i].getElementsByTagName("B")[0].childNodes[0].nodeValue; //IdGenr
    sC=$Son[i].getElementsByTagName("C")[0].childNodes[0].nodeValue; //Titolo
    sD=$Son[i].getElementsByTagName("D")[0].childNodes[0].nodeValue; //Tested
    if(sB==Sgen.value.split(',')[1]){
      if(Saz.value=="0"){cnt++;GetSong(sC,sD);}
      else{
        if(sA==Saz.value){cnt++;GetSong(sC,sD);}
      }
    }
  }
  if(cnt==0){Sson.value="";}
  scnt.drawImage(img,0,0,scW,scH);
  MtOn=false;
  Metr.style.display ="none";mdat.style.backgroundColor="yellow";
  Tims.style.display="none";
}

function GetSong(sC,sD){
  let test;
  if(sD==0){test="  ";}else{test=" *";} // 2 char
  let s,spn;
  let e=document.createElement("input");
  e.style.fontSize="1.2em";
//  e.style.width=scW; 
  e.style.height=scH/14;
  e.style.border= "0px solid #fff";
  e.style.backgroundColor="#0000";
  e.value=sC+test; // set table title + test
  e.addEventListener('mouseover', function() { 
  e.style.border= "1px solid #000";});
  e.addEventListener('mouseout', function() { 
  e.style.border= "0px solid #fff";});
  e.addEventListener('click', function() {
  SetLink(e.value,sD);
  Sson.value=e.value;
  Titl.style.display="none";});
  Titl.appendChild(e);
}


function draw(){

  let a,r,y,m,j,nr,jp,tc,tm,cr,im,nb;
  yp=[[],[],[],[],[],[]];//row y,time,jump array, jump counter, time correction, array measure x
  sr=[[],[],[],[],[],[]];//row y,test,time progress,row mesures,row x mesures array,row measure all
  if(!player){
    tdcol1.style.backgroundColor="#faf";}
  a=GetBlue();pxy=a;;
  r=-1;
  for(let p=0;p<a[0].length;p++){
    if(a[0][p]==0){                   // if first measure
      r++;m=1;                  
      y=a[2][p];                      // get y
      yp[0][r]=y;                     // row y
      yp[1][r]=m;                     // measure one   
      yp[5][r]=""+a[1][p];}           // measure(x) one   
    else{
      m++;                
      yp[1][r]=m;                     // measure update  
      yp[5][r]+=(","+a[1][p]);        // measure(x) update array
    }
    yp[2][r]=0;                       // correction    : inutile per ora
    yp[3][r]="";                      // jump array    : no jump per ora
    yp[4][r]=0;                       // jump counter  : 0       per ora
  }

if(tbfl!=""){
    s=tbfl.split("|");//-----array rows
    t=s[0].split("/");//--------array rows elements:  row y, measure, correction, jump array
    bpm2.value=t[0];  //tick/sec  
    num2.value=t[1];  //nominator
    den2.value=t[2];  //denominator
    bpm0=t[0];        //original 
  //-----------------------------------------------for each row
    for(let p=1;p<s.length;p++){
      yp[3][p-1]=s[p];                     //jump array
      if(s[p]==""){j=0;}                   // no jump row
      else{j=s[p].split(";").length;}      // array of jumps
      yp[4][p-1]=j;                        // jumps counter
    }
  } 
  //alert(yp[5]);
  //--------compile timing table
  let dv=document.getElementById("Timt");
  dv.innerHTML="";
  tbtm=null;
  tbtm=document.createElement("table");tbtm.border="1";
  for(var i = 0; i < yp[0].length; i++) {
    var row = tbtm.insertRow(i);
    row.insertCell(0).innerHTML = 
      "<input              type='number' class='rw11' value="+(i+1)+" disabled>";
    row.insertCell(1).innerHTML = 
      "<input id='t2"+i+"' type='number' min='1' max='20' class='rw11' value="+yp[1][i]+" disabled>";
    row.insertCell(2).innerHTML = 
      "<input id='t3"+i+"' type='text'   class='rw12' value="+yp[3][i]+">";  // jump array
    if(!rmb){ // set number row in canvas
      hsnt.fillStyle="#000";
      hsnt.font="20px Arial";
      hsnt.fillText((i+1)+" : "+yp[1][i],10,yp[0][i]+60);
    }
  }
  
  tbtm.innerHTML+="<thead><tr>"+
  "<th class='rw1'>Rigo n°</th>"+
  "<th class='rw3'>N° Misure</th>"+
  "<th class='rw4'>Salti: &nbsp Rigo, Misure(da), Misure(a); &nbsp &nbsp (no jump is ;)</th>"+
  "</tr></thead>";
  dv.appendChild(tbtm);
  cr=0;tm=0; 
  //--------------------------------development of repetitions
  nbt=0;
  for(i=0;i<yp[0].length;i++){//----for each row
    nr=yp[3][i].split(";");      // jumps array
    // if nr=="" :       no jumps in row
    // if yp[4][i]==0  : current jumps counter  terminate 
    if(nr==""||yp[4][i]==0){jp="";}    // if no jumps or jumps terminate
    else{jp=nr[nr.length-Number(yp[4][i])].split(",");}// current array:row y,measure from, measure to
    // jp : no jump-> ""  or  current row jump
    //------if no jump->""  or jumps counter = 0   or current jump is no jump 
    // current no jump = ""   :<;1,2,3>  first no jump  ,  second to row 1 from 2 measure  to 3 measure
 //   alert(i+"  "+yp[4][i]+"  "+nr);

    if(nr==""||yp[4][i]==0||(nr!=""&&nr[yp[4][i]-2]=="")){//---add current row
      sr[0][cr]=yp[0][i];                  // row y 
      tc=10+Number(yp[2][i]);              // correction
      tm+=Number(yp[1][i])*tc;
      sr[2][cr]=tm;                        // time progress
      sr[1][cr]="("+(i+1)+","+yp[1][i]+","+tm/10+")";     // test
      sr[4][cr]=yp[5][i];                  // row measure x array (all measure)
      sr[5][cr]=yp[5][i].split(",").length;// row measure all
      nb=sr[4][cr].split(",").length;
      nbt+=nb;
      sr[3][cr]=nb;                        // row measures  
      if(nr!=""&&nr[yp[4][i]-2]==""){yp[4][i]--;}  // decrement jumps counter if jump is no jump
      cr++;
    }
    else{//--------------------------if jumps exist
     //----------------jump in the same row
      if(jp[0]==0){
        sr[0][cr]=yp[0][i];                  // row y 
        tc=10+Number(yp[2][i]);              // correction
        tm+=Number(jp[1])*tc;                // measure from     jp[1]:measure from 
        sr[2][cr]=tm;                        // time progress
        sr[1][cr]="(inrow:"+(i+1)+","+jp[1]+","+tm/10+")";   // test 
        sr[4][cr]=RowX("inrow",yp[5][i],jp[1]-1,jp[2],i);    // row measure 0  to  measure from   
 //       alert(yp[5][i].split(",")+"\n"+sr[4][cr]);
        sr[5][cr]=sr[4][cr].length;          // row measure
        nb=sr[4][cr].split(",").length;
        nbt+=nb;
        sr[3][cr]=nb;                        // row measures  
        cr++; 
      }
      else{
      //----------------add row from
        sr[0][cr]=yp[0][i];                  // row y 
        tc=10+Number(yp[2][i]);              // correction
        tm+=Number(jp[1])*tc;                // measure from     jp[1]:measure from 
        sr[2][cr]=tm;                        // time progress
        sr[1][cr]="(from:"+(i+1)+","+jp[1]+","+tm/10+")";   // test 
        sr[4][cr]=RowX("from",yp[5][i],0,jp[1],i); // row measure 0  to  measure from   
        sr[5][cr]=yp[5][i].split(",").length;// row measure all
        nb=sr[4][cr].split(",").length;
        nbt+=nb;
        sr[3][cr]=nb;                        // row measures  
        cr++; 
        //---------------fetch new data out of for loop    
        jp=nr[Number(nr.length-yp[4][i])].split(",");    // current array:row y,measure from, measure to
        yp[4][i]--;                          // decrement jumps counter
        im=i;                                // im = i from
        i=Number(jp[0])-1;                   // next row  :  override for counter
      //---------------add row to
        sr[0][cr]=yp[0][i];                  // row y 
        sr[4][cr]=RowX("to",yp[5][i],jp[2],-1,im);      // row measure to  to last measure
        sr[1][cr]="(to:"+(i+1)+","+jp[2]+","+(Number(tm/10)+Number(sr[3][i])-1+Number(jp[2]))+")"; // test 
        sr[5][cr]=yp[5][i].split(",").length;// row measure all
        nb=sr[4][cr].split(",").length;
        nbt+=nb;
        sr[3][cr]=nb;                                   // row measures  
        tc=10+Number(yp[2][jp[0]-1]);                   // correction  : tc=10 per ora
        tm+=Number(sr[3][cr])*tc;                       // measure to     
        sr[2][cr]=tm;                                   // time progress
        cr++; 
      }
    }   
  }
//  alert(yp[5]);
//  alert(sr[1]); // test measure progression
//  alert(sr[3]); // measure in all developed rows
  tbpm.value=bpm2.value;
  hsnt.fillStyle="#fff";
  crg=0;
  GoTop();
  // test
  if(ckmt.checked){ 
    tkt=60000/bpm2.value * 4/den2.value;
    let test=(midiDMS*bpm2.value)/(60000*num2.value)*den2.value/4;
 //   alert("Test:\n\nnumero battute :"+nbt+"\ncalcolate            :"+test+
 //     "\ntkt           :"+tkt+"\ncalcolate :"+midiDMS/nbt/num2.value);
  }
}

function RowX(j,jump,from,to,i){ // 
  let r="";
  let s=jump.split(",");
  if(to==-1){
    to=s.length;
    if(i!=from){from--;} // salta sullo stesso rigo
  }  
  for(let k=from;k<to-1;k++){r+=(s[k]+",");}; //    virgola intermedia
    r+=s[to-1];                               // no virgola finale
  return r;
} 

  
function Play(v){ //https://jazz-soft.net/doc/JZZ/midifile.html
  //player.durationMS(): return duration in millisec
  //player.positionMS(): return position in millisec
  //player.jumpMS(pos) : jump in pos position in millisec
Mtso=false;                // no metronome solo
Mets.style.display='none';
if(v==1){
  //------------------------------------------------------------------
  switch(btPlay.value){
    case "0":
      Sson.disabled=true;
      Sgen.disabled=true;
      Saz.disabled=true;
      btPlay.style.background="url('res/Pause.gif')";
      btPlay.title="Pause";btPlay.value="1";if(player){player.play();}
   //--------------------------interface  
      SetBPM(bpm2.value);
      MtOn=true;mtc=0;mtx=0;   // start metronome
     // mdat.style.backgroundColor="red";
      // bpm=tick/min  ; bpm= tick/(60*1000 millisec) ;   tick = 60*1000/bpm  : semiminima= 1/4 
      tkt=60000/bpm2.value * 4/den2.value; //----   !!!!
      try{clearInterval(mti);}catch{}      
      mti=setInterval(Metronome,tkt);
      midiTS=Date.now();  // Time start;
   //-------------------------------------
      break;
    case "1":
      Sson.disabled=false;
      Sgen.disabled=false;
      Saz.disabled=false;
      btPlay.style.background="url('res/Play.gif')";
      btPlay.title="Continue";btPlay.value="2";if(player){player.pause();}
      speed=0;
      MtOn=false;
      clearInterval(mti);
      break;
    case "2":     // continue
      Sson.disabled=true;
      Sgen.disabled=true;
      Saz.disabled=true;
      btPlay.style.background="url('res/Pause.gif')";
      btPlay.title="Continue";btPlay.value="1";if(player){player.resume();}
      MtOn=true;
      tkt=60000/bpm2.value * 4/den2.value; //----   !!!!
      try{clearInterval(mti);}catch{}      
      mti=setInterval(Metronome,tkt);
      midiTS=Date.now()-player.positionMS();  // Time resume;
      break;
  }}
else{ // stop - rewind
  btPlay.style.background="url('res/Play.gif')";  
  btPlay.title="Play";btPlay.value="2";
  if(player){player.stop();}
  clearInterval(mti);
  GoTop();
  MtOn=false;}
}


function Resize(){
 // ----soluzione corretta su web o localhost
 //  scW = window.outerWidth;
 //  scH = window.outerHeight*.9;    // esclude menu superiore
 //  ---soluzioni corretta in locale  
   scW = window.innerWidth;
   scH = parseInt(window.innerHeight*.9);  // 90% screen height
 //  scW = document.body.clientWidth;
 //  scH = document.body.clientHeight*.9; 
   if(!scWi){scWi=scW;scHi=scH}    // first access
   rfW=scWi/scW;                   //resizing factor width           
   rfH=scHi/scH;                   //resizing factor height           
   scnv.width=scW;scnv.height=scH;
   scnt.drawImage(img,0,0,scW,scH);
   rnv.style.top=scH*.1+"px";
   rnv.style.left=(scW-60)+"px";
   rnv.style.height=scH+"px";
   rnv.style.width="90px";
   trsp.style.width=scW*.1+"px";
   trsp.style.height=scH*.03+"px";
   Mx0=parseInt(scW/8);My0=Mx0;Mr0=Mx0*.8;
   Doframe(false);
//   alert(wpdf); 
}  

function SetDelay(v){if(v){dely=delz*2;}else{dely=delz};}

function SetAlpha(v){alpha=("00"+(100-v).toString(16)).slice(-2);}  

function SetMet(){
  if(Mets.style.display=="none"){Mets.style.display="block";}else{Mets.style.display="none";}
  SaveLocStrg();
}

function SetBPM(v){if(v==0){v=60;}
bpm2.value=v;
tbpm.value=v;
//tbpm.value=bpm2.value;
}

function MetrOnOff(){
  Mets.style.display='none';
  mtnv.width=scW/3;mtnv.height=scW/3;
  if( Metr.style.display=="none"){
    Metr.style.display ="block";mdat.style.backgroundColor="red";
    if(btPlay.title=="Play"){
      mdat.style.backgroundColor="#8f8";
      MtOn=true;Mtso=true;
      tkt=60000/bpm2.value * 4/den2.value; //----   !!!!
      mti=setInterval(Metronome,tkt);
    }}
  else{Metr.style.display ="none";mdat.style.backgroundColor="yellow";
    //MtOn=false;
    //Mtso=false;
    if(Mtso){clearInterval(mti);Mtso=false;}
  }
}

function clearMetr(){
  let sn,cs,a=2*Math.PI/num2;
  mtnt.clearRect(0,0,Mx0*2,My0*2);
  mtnt.strokeStyle="#0000aa"+alpha;
  mtnt.fillStyle="#0000aa"+alpha;
  mtnt.lineWidth=1;
  mtnt.lineCap = "round";
  mtnt.beginPath();
  mtnt.arc(Mx0,My0,Mr0,0,6.29);
  mtnt.stroke();
  for(let  i=0;i<num2.value;i++){
    sn=Math.sin(a*i);cs=Math.cos(a*i);
    mtnt.beginPath();
    mtnt.arc(Mx0+Mr0*sn,My0-Mr0*cs,4,0,6.29);
    mtnt.fill();}
}

//Buzz(frequency,length,type) : Type : 0:sine,  1:square,  2:sawtooth, 3:triangle, 4:custom

function Metronome(){
// mtx: metronome current fraction measure  
let a=2*Math.PI/num2.value;
if(mtx==0){MetrUpd();} // Update metronome in measure 0
rnv.value=maxH-cnt;    // blue input vertical scrollbar 
if(MtOn){
  mtc++;
  mtx=mtc%num2.value;
  if(Metr.style.display=="block"){
    clearMetr();
    if(mtx==0){
      if(ckms.checked){Buzz(700,.01,3);} 
      mtnt.strokeStyle="#ff0000"+alpha;mtnt.fillStyle="#ff0000"+alpha;}
    else{
      if(ckms.checked){Buzz(400,.01,3);} 
      mtnt.strokeStyle="#0000ff"+alpha;mtnt.fillStyle="#0000ff"+alpha;}
    mtnt.lineWidth=30;
    mtnt.beginPath();
    mtnt.arc(Mx0,My0,Mr0,a*mtx-1.45,a*(mtx+1)-1.69); // 1.57 *- 12  accorcia arco
    mtnt.stroke();
    mtnt.font="250px serif";
    mtnt.fillText(mtx+1,Mx0-60,My0+90);
  }
if(!Mtso){
  mx=sr[4][crg].split(",");                      // array of measure x in current row
  btt.innerHTML=nj;
}
}

if(Mtso){return;}

if(mtx==num2.value-1&&cbt<nbt-1){cbt++;brx++;cbr++;} // scroll from last measure
//.................next jump 
if(sr[0][crg+1]>=(cnt-scH+280)){nj="&#9660";} //▲ sale  se il prossimo rigo sarà sotto  dy=280...
                           else{nj="&#9650";} //▼ scende 
//---------------------------------------finale
if(cbt>nbt-2){
  //alert("finale :"+cbt+"   "+nbt);
  mx=null;
  Doframe(false);
  btPlay.style.visibility="hidden";
  Metr.style.display="none";btt.innerHTML="End";
  clearInterval(mti);
  MtOn=false;}
}


function MetrUpd(){  // ---Update Metronome speed 
  MtOn=false;
  tbpm.value=bpm0*Mspeed;
  bpm2.value=bpm0*Mspeed;
  SetBPM(bpm2.value);
  if(player){player.speed(Mspeed+midiCR);}
  tkt=60000/bpm2.value * 4/den2.value; //----   !!!!
  clearInterval(mti);
  mti=setInterval(Metronome,tkt);
  MtOn=true;
  Mupd=false;      // ---Update only in measure 0 
}
 
function GoTop(){
cnt=scH;speed=0;Doframe(false);rnv.value=maxH+scH;crg=0;fcnt=0;vy=0;sd=true;
cbt=0;MtOn=false;cbr=0;nx=null;Mtso=false;
btt.style.display="block";btt.innerHTML="";
mtc=0;brx=0;// reset metronome
midiCR=0;
btPlay.style.visibility="visible";
mdat.style.backgroundColor="yellow";
Metr.style.display="none";
Sson.disabled=false;
Sgen.disabled=false;
Saz.disabled=false;
}

function Anim(){ // called every 100 msec
// crg : contatore righi  inizia con 1

if(Mtso){return;}



let vs=20;           // velocità di scroll  
let dy,t1,tt;
if(MtOn){fcnt++;}else{return;} 
tbpm.value=parseInt(FMt*Mspeed)+" bpm";
dy=280;                                         // ordinata di rigo corrente              
if(!MtOn){return;}
tbpm.value=bpm2.value;
if(sd){                  
//--------------------------------scende
  if(sr[0][crg]-(cnt-scH+dy)>=vs*2){vy=vs;}     // se scarto è >vs*2 accellera
  else{vy=0;cnt=sr[0][crg]+scH-dy;}}            // altrimenti raggiungi la riga e ferma
else{
//--------------------------------sale
  if((cnt-scH+dy)-sr[0][crg]>=vs*20){vy=-vs*10;}  // se scarto è >vs*8 accellera
  else{vy=0;cnt=sr[0][crg]+scH-dy;}}            // altrimenti raggiungi la riga e ferma
//-------------------------------------------------------------------
if((cbt+1)*10>sr[2][crg]){                      //se completate battute di rigo

  brx=0;                                        //first measure in new row
  crg++;                                        //nuovo rigo
  cbr=0;                                        //azzera contetore battute sul rigo 

  if(sr[0][crg]>=(cnt-scH+dy)){                 //se il nuovo rigo è sotto 
    sd=true;}                                   //sale
  else{sd=false;}                               //scende
}
cnt+=vy;
Doframe(false);
tt=parseInt(sr[2][sr[2].length-1]/k);
 
dt1.value=parseInt((cnt-scH+dy))  +"  "+sr[0][crg];                
dt2.value=parseInt(mtc*k)+"  "+sr[2][crg]+"  "+crg; 
dt3.value=mtc+"   "+mtx;
dt4.value=tt;

if(mtc>tt){MtOn=false;Metr.style.display ="none";return;}// end animation :end pages
} 

 function Doframe(b){         // true : only for onmousemove vertical scroll bar
  let a,c,p,t;
  let rwy=200;              // row y screen position 
  if(b){cnt=maxH-rnv.value;}
  scnt.fillStyle="#FFF";    // last   rows screen  gray
  scnt.fillRect(0,0,scW,scH);
  scnt.drawImage(hsnv,0,100+cnt-scH,scW,scH,0,0,scW,scH); // : 100  vertical ini
  scnt.fillStyle="#bbb";    // last   rows screen  gray
  scnt.fillRect(0,0,scW,scH*.18);
  scnt.font="60px Arial";
  //------------------------------------syncro  error control
  if(player&&btPlay.value=="1"){
    midiTC=Date.now()-midiTS;                         // tempo trascorso
    p=parseInt(midiTC-player.positionMS()/Mspeed);    // scarto
    if(p>=0){midiCR=1.05;scnt.fillStyle="#0f0";}      // correzione per ridurre scarto
    else    {midiCR=.95; scnt.fillStyle="#f00";}    
    scnt.moveTo(27,80);
    scnt.arc(27,80,5,0,6.28);                              // controller
    scnt.fill();
    if(player){player.speed(Mspeed*midiCR);}          // correzione velocità
  }
  scnt.fillStyle="#00c";    // title
  t=Sson.value.substring(0,Sson.value.length-2);      // scarta ultimi 2 char
  scnt.fillText(t+" "+sgt,400,60);
  scnt.font="20px Arial";
  if(!player){scnt.fillText("<no midi>",100,50);}
 
 /*  // data test
  scnt.font="30px Arial";
  scnt.fillText(Sson.value+"    Mspeed: "+Mspeed+"   scarto: "+p,200,20);
  scnt.fillText("midiCR  :"+parseInt(midiCR*100)/100,200,50);

  scnt.font="20px Arial";
  scnt.fillText("measure:   x     y", 80,20)
  scnt.fillText(cbt+"/"+nbt+"          "+(cbr+1)+"    "+(crg+1),80,50);
*/
  //---------------------------------------measure cursor in screen
  // nbt        :  measure number
  // cbt        :  measure global counter
  // sr[3][crg] :  row measure
  // sr[5][crg] :  row measure all

  // mtx        :  metronome current fraction measure
  // cbr        :  row measure counter
  // mx         :  current row measure x array  (set in Metronome())
  // crg        :  row developed counter 
  // cnt        :  pointer in hsnv for translation to scnv
  // sr[0][crg] :  row y

  if(mx&&mtx==0&&ckmm.checked){
    if(cbr==0){scnt.fillStyle="#F008";
      scnt.fillRect(mx[cbr]-5,sr[0][crg]-cnt+scH-80,10,80);}
    else{scnt.fillStyle="#00F8";
      scnt.fillRect(mx[cbr]-5,rwy,10,80);}
  }
} 


function LoadPdf(url){
  var xhr = new XMLHttpRequest();
  xhr.open('GET',url, true);
  xhr.onerror = function(e) { alert('error'); };
  xhr.responseType = 'arraybuffer';
  xhr.onload = function(e) {
    if (this.status == 200) {
      var B64 = new Uint8Array(this.response);
//----------------------------------------
//      alert(B64.length);
    const loadingTask = pdfjsLib.getDocument(B64);
    loadingTask.promise.then(function(pdf){
      btPlay.style.visibility="hidden";
      scWib=true;
      Box.style.display="block";

      LoadPages(pdf);
    });
   
   //-----------------------------------------
      xhr.onerror = function(e) { alert('error'); };
    }
  };
  xhr.send();
}

function LoadMid(url){
  let data;
  player=null;
  var xhr = new XMLHttpRequest();
  xhr.open('GET',url, true);
  xhr.responseType = 'arraybuffer';
  xhr.onerror = function(e) { alert('error'); };
  xhr.onload = function(e) {
    if (this.status == 200) {
      var uInt8Array = new Uint8Array(this.response);
      var i = uInt8Array.length;
      var A64 = new Array(i);
      while (i--) {A64[i] = String.fromCharCode(uInt8Array[i]);}
      var C64 = A64.join('');
      data = window.btoa(C64);
//----------------------------------------
 //     try {
        if(ckmd.checked){
          player = JZZ.MIDI.SMF(JZZ.lib.fromBase64(data)).player();
          player.connect(out);
          midiDMS=player.durationMS();
          player.speed(Mspeed+midiCR);     //  correction speed 
        }else{player=null;}
        btPlay.disabled=false;btPlay.title="Play";
        btStop.disabled=false;btStop.title="Stop/Rewind";
        Mets.style.display="none";
        Mspeed=1;
        GoTop();
    }
    else{   // midi not found
        btPlay.disabled=false;btPlay.title="Play";
        btStop.disabled=false;btStop.title="Stop/Rewind";
        //sgt+=" -no midi"//
        Mets.style.display="none";
        Mspeed=1;
        GoTop();

      }

  };
  xhr.send();
}

function LoadTxt(url){
  tbfl="";
  let xhr = new XMLHttpRequest();
  xhr.open('GET',url, true);
//  xhr.responseType = 'text';
  xhr.onerror = function(e) { alert('error'); };
  xhr.onload = function(e) {
    if (this.status == 200) {tbfl=xhr.responseText;}
  };
  xhr.send();
}





/*
smfTempo(tttttt) - imposta il tempo in microsecondi per nota da un quarto; restituisce FF51 03 tttttt , dove tttttt è un numero intero a 24 bit.

smfBPM(bpm) - imposta il tempo in battiti al minuto; calcola tttttt e restituisce smfTempo(tttttt) .
*/

function load(data, name) {

  try {
  //  alert(JZZ.MIDI.SMF(data));
    player = JZZ.MIDI.SMF(data).player();

    player.connect(out);
    player.onEnd = function() {
//      btn.innerHTML = 'Play';
    }
  }
  catch (e) {alert(e);}
}


function LoadPages(pdf){
  let t;
  numPg=pdf.numPages;
  for(let i=1;i<=numPg;i++){
    ac[i]=document.createElement('canvas');
    ax[i]=ac[i].getContext("2d");
  }
  t=Sson.value.substring(0,Sson.value.length-2);
  //----------------------------------compile title table
//  LoadTxt("../_Spartiti"+vers+"/"+Sgen.value.split(",")[0]+"/"+t+"/"+t+".txt");
  //----------------------------------loop of promise-await

  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  (async function loop() {
//    for (let i = 1; i <= numPg+1; i++) {  //----tenta una pagina in più....per caricare l'ultima..
    for (let i = 0; i <= numPg+1; i++) { 
      await delay(dely);
      if(i==0){LoadTxt("../_Spartiti"+vers+"/"+Sgen.value.split(",")[0]+"/"+t+"/"+t+".txt");}
      else{getSheet(pdf,i);}
    }
    for(let i=1;i<=numPg;i++){
      hsnt.drawImage(ac[i],0,0,scW,stH,0,(i-1)*stH,scW,stH);
    }
    rnv.max=maxH-scH;
    draw();
    Doframe(false);
    btPlay.style.visibility="visible";
    Box.style.display="none";
  })();
}


function getSheet(pdf,p){ // carica ogni pagina in array canvas ac
  pdf.getPage(p).then(function(page) {
    scale=1;
    var viewport = page.getViewport({scale: scale});
    vwidth=viewport.width;
    scale=scW/vwidth;//standard format scale 
    viewport = page.getViewport({scale: scale});
    if(p==1){//-----------------------------------------set data view
      wpdf=page.view[2];hpdf=page.view[3];
      stH=hpdf*scale-120; // 120 riduce spazio tra le pagine
      maxH=stH*numPg;
      rnv.max=maxH;
      hsnv.height=maxH;
      hsnv.width=scW;
      if(scWib){scWib=false;scWi=scW;} // set ini new pdf screen width
    }
    ac[p].width = viewport.width;ac[p].height = viewport.height;   
    scnv.width = viewport.width;scnv.height = scH;
    var renderContext = {canvasContext: ax[p],viewport: viewport};
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function (){
      document.getElementById('PgL').innerHTML="...rendering...";
    });
  });
} 

function LoadXML(){
  let parser = new DOMParser(); // compatibility whit Android Localhost
  if (window.XMLHttpRequest) {var xhttp = new XMLHttpRequest();}
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let xmlDoc = parser.parseFromString(this.responseText,"text/xml");
      $Gen=xmlDoc.getElementsByTagName("Gn");
      $Son = xmlDoc.getElementsByTagName("Br");
      SetGenr();SetSong();
    };
  }  
  xhttp.open("GET","res/Music.xml",true);
  xhttp.send();
}


function SetGenr() {
  let gA,gB;
  let op="";
  for (let i = 0; i < $Gen.length; i++) { 
    gA=$Gen[i].getElementsByTagName("A")[0].childNodes[0].nodeValue; //Genr
    gB=$Gen[i].getElementsByTagName("B")[0].childNodes[0].nodeValue; //IdGenr
    op+="<option  value= '"+gA+","+gB+"' >"+gA+"</option>";
  }
  Sgen.innerHTML=op;
}


function SetLink(title,sD){// call new song
  title=title.substring(0,title.length-2);
  let link="../_Spartiti"+vers+"/"+Sgen.value.split(",")[0]+"/"+title+"/"+title+".pdf";
  LoadPdf(link);
  link="../_Spartiti"+vers+"/"+Sgen.value.split(",")[0]+"/"+title+"/"+title+".mid";
  LoadMid(link);
  mdat.disabled=false;
  GoTop();
  if(sD==1){sgt="*";}else{sgt="";} //song tested
}

function saveTxt(txt,name){ //(cnf,txt,name) 
//if(confirm(cnf) == true) {
  var textFileAsBlob = new Blob([txt], {type:'text/plain'});
  var downloadLink = document.createElement("a");
  downloadLink.download = name;
  window.URL = window.URL || window.webkitURL;
  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  document.body.appendChild(downloadLink);
  downloadLink.click();
//} 
} 


function Print(){
  let url = hsnv.toDataURL(); //attempt to save base64 string to server using this var  
  let win = window.open();
  win.document.write("<img src='" + url + "'/>");
  win.document.close(); //this seems to be the thing doing the trick
  win.focus();
  win.setTimeout(() => win.print(),100);
  win.setTimeout(() => win.close(),100);
}


function removeBlue(b) {
  if(b){
    const im = hsnt.getImageData(130, 0, hsnv.width, hsnv.height);
    for (var i = 0; i < im.data.length; i += 4) {
      if (
        im.data[i] < 200  &&
        im.data[i + 1] <200  &&
        im.data[i + 2] >200
      ) {
        im.data[i] = 255;
        im.data[i + 1] = 255;
        im.data[i + 2] = 255;
      }
    }
    hsnt.putImageData(im, 130, 0);
  }
}
//--------------------------------------LocalStorage
function SaveLocStrg(){
  //     measure bar             midi             buzz         transparency
  let ss=""+ckmm.checked+","+ckmd.checked+","+ckms.checked+","+ckmt.checked+","+trsp.value;
  localStorage.setItem("Sheet", ss);//-----encode
}

function LoadLocStrg(){
  let st="",msg;
  let key = "";
  let ii=-1;
  for (var i = 0; i <= localStorage.length - 1; i++){
    key = localStorage.key(i);
    if(key=="Sheet"){ii=i;}
  }
  if(ii!=-1){
    key = localStorage.key(ii);
    st=localStorage.getItem("Sheet").split(",");
    //-------decode
    if(st[0]=="true"){ckmm.checked=true;}else{ckmm.checked=false;}
    if(st[1]=="true"){ckmd.checked=true;}else{ckmd.checked=false;}
    if(st[2]=="true"){ckms.checked=true;}else{ckms.checked=false;}
    if(st[3]=="true"){ckmt.checked=true;}else{ckmt.checked=false;}
    trsp.value=Number(st[4]);
    msg="key is OK  Data.length = "+st.length;
  }
  else{msg="key is not ";}
  return msg;
}

function LocStoCanc(){localStorage.clear();} 

function LocStoListItems(){
let s="LocalStorage Items :\n";
  for (var i = 0; i <= localStorage.length - 1; i++){
    s+=(localStorage.key(i)+"\n");
  }
alert(s);
}   

function SetSpeed(v){ // -50 to 50
  tbpm.value=parseInt(bpm0*(1+v/100));
  bpm2.value=tbpm.value;
  SetBPM(bpm2.value);
  Mspeed=(1+v/100);    
  btPlay.style.background="url('res/Play.gif')";  
  btPlay.title="Play";
  //btPlay.value="2";
  if(player){player.stop();}
  clearInterval(mti);
  GoTop();
}