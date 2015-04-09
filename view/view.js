function create_dropdown(title,name,data){
htm= "<select name=lst_"+name+" id=lst_"+name+" onChange="+name+"_change(this)>"
//<option>Slower</option><option>Slow</option></select>"; 
htm+="<option value=0>"+title+"</option>";
var obj=$.parseJSON(data);
$.each(obj, function(k,v){
	htm+="<option value="+v.id+">"+v.value+"</option>";
 });	
 htm+="</select>"
 return htm;
}


function create_input_arr(pre,x,desc){
var htm="";
htm="<table>";
	for (var i=0;i<x;i++){
		htm+="<tr><td>Enter "+desc+"</td>";
		htm+="<td><input type=text id='"+pre+"_"+(i+1)+"' size=50 value=''/></td>";
		htm+="</tr>";
		}
	htm+="</table>";
	return htm;
	}


function min_looper(v){
	var lstr="<select id='lst_"+v+"' onchange=set_mins('"+v+"',$(this).val());>";
	lstr+="<option value='-1' >Choose Minutes</option>";
	for (var a=0;a<65;a+=5){
		ostr="<option  value='"+a+"'>"+a+"</option>"
	lstr+=ostr;
	}
lstr+="</select>"

return lstr;

}

function time_looper(v){
var lstr="<select id='_"+v+"' name='_"+v+"' onchange=set_time('"+v+"',$(this).val());>";
lstr+="<option value='-1' >Choose Time</option>";
for (var a=0; a<2;a++){
for (var b=0;b<12;b++){
 for(var c=0;c<4;c++){
 var vstr="";
 var tstr="tstr";
 var ostr="ostr";
 vstr= tstr=((a==1)?12+b:(b<10)?"0"+b:b)+":"+((c*15)<10?"0"+(c*15):(c*15));
 tstr=((b==0)?"12":(b<10)?"0"+b:b)+":"+((c*15)<10?"0"+(c*15):(c*15))+" "+(a==0?"AM":"PM");
 ostr="<option class='"+((a==0)?"blu":"grn")+"' value='"+vstr+"'>"+tstr+"</option>";
  lstr+=ostr;
 }
}
}
lstr+="</select>"
return lstr;
}
