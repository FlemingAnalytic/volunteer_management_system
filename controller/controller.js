_model_header='model/index.php?';

_user_id="0";
_user_name="";
_user_email="";
_user_status="";

_event_context="0";
_event_id="0";
_event_role_title="";
_event_short_name="";
_event_long_name="";
_event_template_id="";
_event_date="";
_event_start_time="12:15 PM";
_event_end_time="05:30 PM";
_event_short_name="";
_event_long_name="";
_event_location="";
_ervent_address="";
_event_city="";
_event_state="";
_event_zip="";
_event_phone="";
_event_email="";
_event_contact="";
_event_owner="";
_event_status=-1;

_event_copy_volunteers=true;
_event_role_id="-1";
_event_role_title="";
_event_role_description="";
_event_role_qualifications="";
_event_role_pre_mins="0";
_event_role_post_mins="0";
_event_role_qty="0";


_volunteer_id="0";
_volunteer_email="";
_volunteer_name="";

_new_event_id="0";



function commit_event_role_mobile(event_id,event_role_id,user_id)
{
 if (confirm('Confirm to volunteer!')) {
query=_model_header+"action=volunteers_insert&event_id="+event_id+"&event_role_id="+event_role_id+"&volunteer_id="+user_id+"&seq=0";
$.get(query,function(data){
	alert("Thank you for volunteering!\nYou should receive an email confirm shortly.");
	$("#btnret").click();
	})

	}

}

function cancel_event_role_mobile(event_id,event_role_id,user_id){
qry=	_model_header+"action=volunteer_role_delete&event_role_id="+event_role_id+"&volunteer_id="+user_id;
	console.log(qry);
	$.get(qry,function(data){
		alert(data);
			$("#btnret").click();
	});

}



function get_event_mobile(event_id,volunteer_id,flag){
	qry=	_model_header+"action=get_event_roles_mobile&event_id="+event_id+"&volunteer_id="+volunteer_id+"&flag="+flag;
	$.get(qry,function(data)
	{
	objEventRoles=$.parseJSON(data);
	objEvent=objEventRoles[0];
	htm="<h3>"+objEvent.event_name+"</h3>";
	htm+="<p>Date: "+objEvent.event_date+"<br/>";
	htm+="<p>Start:"+objEvent.event_start_time+"<br/>";
	htm+="<p>End:"+objEvent.event_end_time+"</p>";
	htm+="<ul data-role='listview' data-inset='true' id='lstroleview'>";
	$.each(objEventRoles, function (k,v){
	htm+="<li><a href='#' onclick=event.preventDefault();";

	if (flag<=0){
	htm+="commit";
	}
	else{
	htm+="cancel";	
	}
	htm+="_event_role_mobile("+v.event_id+","+v.event_role_id+","+_user_id+");><h2>"+v.event_role_title+"</h2>";
	htm+="<p>"+v.event_role_description+"</p>";
	htm+="<p>"+v.event_role_qualifications+"</p>";		
	htm+="<p>Pre Minutes: "+v.pre_mins+"</p>";
	htm+="<p>Post Minutes:"+v.post_mins+"</p>";
	htm+="<p class='ui-li-aside'>";
console.log(flag);	
	if (flag<=0){
	htm+="volunteer!";
	}
	else {
	htm+="Cancel!";
	}
	htm+="</p></li>";

	});
	htm+="</ul>";	
	htm+="<a href='#' data-role='button' data-icon='home' id=btnret onclick='event.preventDefault();get_calendar_mobile();return false;'>Return</a>";
	$("#content").html(htm).trigger('create');
	
	});
	
	
}



function get_calendar_mobile(){
data="";
var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
var dte=new Date();
var prev_date=new Date(0);

query = _model_header+"action=get_event_dates&user_id="+_user_id;
$.get(query,function(data){
var retstr="";

	htm="<ul data-role='listview' data-inset='true' id='"+name+"'>";
	var objEventDates=$.parseJSON(data);
	$.each(objEventDates, function (k,v){
   	dte=new Date(v.event_date);
	var x=dte.getDay()+1;
if(dte > prev_date){
		htm+="<li data-role='list-divider'>"+days[x]+" "+v.event_date+"<span class='ui-li-count'>"+ v.event_count +"</span></li>";
		prev_date=new Date(dte);
		}
		htm+="<li>";

		if ((v.need >0 )|| (v.vflag>0)){ 
		htm+="<a href='#' onclick=get_event_mobile("+v.event_id+","+_user_id+","+v.flag+");>";
		}
		htm+="<h2>"+v.event_name+"</h2><p>"+v.event_start_time+" - "+v.event_end_time+"</p>";
		if (v.flag>0){
			htm+="<p class='ui-li-aside'>VOL</p></a>"
		}
		else if (v.need>0){
			htm+="<p class='ui-li-aside'>"+v.need+" OPEN</p></a>";
		}
		else {
			htm+="<p class='ui-li-aside'>CLOSED</p>";
		}
				
		htm+="</a></li>"
	});
		htm+="</ul>";
		$("#content").html(htm).trigger('create');
	});
}

	/* eventSources:[_model_header+"action=index_events&user_id="+_user_id,
	_model_header+"action=index_new_events&user_status="+xx(_user_status),
	_model_header+"action=admin_events&user_id="+_user_id]
		*/




function index_controller_mobile(){
  if(_user_id>0)
 	 {

	$.get("view/mobile.html", function(data){
	$("#header").html("<img src='lib/images/Raised-Hands-small.png' /><b> Serve for All Network<br /><center>Welcome "+_user_name+"</center></b>");


	$("#content").html(data);
$("#footer").html("<center>&copy;2015 Serve For All Network</center>");
	/*
	$("#footer").html("<div data-role='footer'><div data-role='navbar'><ul><li><a id='btnHome' href='#' data-icon='home'>Home</a></li></ul></div></div>");
	*/
	});
 } 

}



function index_controller(){
//get_cities();
if(_user_id>0){
$("#content").removeClass("ui-helper-hidden");
get_calendar();
}

}







function volunteer_click(){
query=_model_header+"action=volunteers_get_role_id_need&event_role_id="+_event_role_id;
$.get(query,function(data){
 objNeed=$.parseJSON(data);
if (objNeed.need==0){
alert("Thank you, but the role has already filled!");
index_controller();
}
else{
var objVolunteerRole=new Object();
objVolunteerRole.event_id=_event_id;
objVolunteerRole.date=_event_date;
objVolunteerRole.event_name=_event_name;
objVolunteerRole.location=_event_location;
objVolunteerRole.address=_event_address;
objVolunteerRole.city=_event_city;
objVolunteerRole.state=_event_state;
objVolunteerRole.event_role_id=_event_role_id;
objVolunteerRole.role_title=_event_role_title;
objVolunteerRole.date=_event_date;
objVolunteerRole.starttime=_event_start_time;
objVolunteerRole.endtime=_event_end_time;
objVolunteerRole.pre_mins=_event_role_pre_mins;
objVolunteerRole.post_mins=_event_role_post_mins;
objVolunteerRole.volunteer_id=_user_id;
objVolunteerRole.volunteer_name=_user_name;
objVolunteerRole.volunteer_email=_user_email;
query2=_model_header+"action=volunteers_insert";
$.post(query2,objVolunteerRole,function(data2){
		alert("Thank you for signing up for "+_event_role_title+" at "+_event_name+".\r\nPlease check your junk/spam email folder if your confirmation has not arrived.");	
	$("#dlg_close").click();
	});
	
}
	
});

}



function adm_request(){
query=_model_header+"action=admin_request&email="+xx(_user_email)+"&user_name="+xx(_user_name);
$.get(query, function(data){
	alert(data);
});
}


function e_r_v_u(){
	
query=_model_header+"action=event_role_volunteers_clean&event_role_id="+_event_role_id;
$.get(query, function(data){

query=_model_header+"action=event_role_volunteers_add";
console.log(_event_role_qty);
for (var i=0;i<_event_role_qty;i++){
id="#vol_seq_"+(i+1);

var objEventRoleVolunteer = Object();
objEventRoleVolunteer.event_id=_event_id;
objEventRoleVolunteer.event_role_id=_event_role_id;
objEventRoleVolunteer.event_role_seq=(i+1);
if ($(id).val()==""){
	}
else
   {
objEventRoleVolunteer.email=$(id).val();
	$.post(query,objEventRoleVolunteer, function(data){
	});
   }
 }
alert("Updated");
$("#volunteer_role_assignment_close").click();
});


}


function event_role_volunteers_ready(){
$("#event_role_volunteer_event_name").html(_event_long_name);
$("#event_role_volunteer_event_role_name").html(" Event Role Name")	;
var htm=create_input_arr("vol_seq",_event_role_qty,"Volunteer Email");
$("#volunteer_assignments").html(htm);
get_role_volunteers();
}

function get_role_volunteers(){
query=_model_header+"action=event_role_volunteers&event_role_id="+_event_role_id;
$.get(query,function(data){
var Obj=$.parseJSON(data);
$.each(Obj, function(k,v){
	var id="#vol_seq_"+(v.event_role_seq);
	$(id).val(v.user_email);
	});
 });	

}
	
function event_role_reset(){
_event_role_id="-1";
_event_role_title="";
_event_role_description="";
_event_role_qualifications="";
_event_role_pre_mins="0";
_event_role_post_mins="0";
_event_role_qty="1";
	
}

function event_role_update(){
// can't find another way to get right..
_event_role_qty=$("#event_role_qty").val();

var objEventRole=new Object();
objEventRole.event_id=_event_id;
objEventRole.event_role_id=_event_role_id;
objEventRole.event_role_title=_event_role_title;
objEventRole.event_role_description=_event_role_description;
objEventRole.event_role_qualifications=_event_role_qualifications;
objEventRole.event_role_pre_mins=_event_role_pre_mins;
objEventRole.event_role_post_mins=_event_role_post_mins;
objEventRole.event_role_qty=_event_role_qty;
query=_model_header+"action=event_role_update";	
$.post(query,objEventRole,function(data){
		event_roles_ready();
				});

	

	}


function event_role_change(evt){
_event_role_id=evt.value;
if(_event_role_id==-1){
event_role_reset();
	$("#event_role_title").val("");	
	$("#event_role_description").val("");
	$("#event_role_qualifications").val("");
	$("#lst_event_role_pre_mins").val(0);
	$("#lst_event_role_post_mins").val(0);
	$("#event_role_qty").val(0);
	$("#btn_event_role_volunteers").addClass("ui-helper-hidden");
}
else
{
query=_model_header+"action=event_get_role&event_role_id="+_event_role_id;
$.get(query,function(data){
	var objEventRole=$.parseJSON(data);
	$("#event_role_title").val(objEventRole.event_role_title);	
	$("#event_role_description").val(objEventRole.event_role_description);
	$("#event_role_qualifications").val(objEventRole.event_role_qualifications);
	$("#lst_event_role_pre_mins").val(objEventRole.event_role_pre_mins);
	$("#lst_event_role_post_mins").val(objEventRole.event_role_post_mins);
	$("#event_role_qty").val(objEventRole.event_role_qty);
	$("#btn_event_role_volunteers").removeClass("ui-helper-hidden");
	_event_role_title=objEventRole.event_role_title;
	_event_role_description=objEventRole.event_role_description;
	_event_role_qualifications=objEventRole.event_role_qualifications;
	_event_role_pre_mins=objEventRole.event_role_pre_mins;
	_event_role_post_mins=objEventRole.event_role_post_mins;
	_event_role_qty=objEventRole.event_role_qty;
	});
}
	
}




function fillin_event_info(){
ret=time_looper("start_time");
$("#start_time").html(ret);
ret=time_looper("end_time");
$("#end_time").html(ret);
$("#datepicker").datepicker(
{
 onSelect:function(dateText){
 _event_date=dateText.substring(6,10)+"-"+dateText.substring(0,2)+"-"+dateText.substring(3,5);
 }
 });	

query=_model_header+"action=events_get_event&event_id="+_event_id;
$.get(query, function(data){

var objEvent=$.parseJSON(data);		
$("#event_short_name").val(objEvent.event_short_name);
$("#event_long_name").val(objEvent.event__name);
$("#_start_time").val(objEvent.event_start_time.substring(0,5));
$("#event_long_name").val(objEvent.event_name);
$("#_end_time").val(objEvent.event_end_time.substring(0,5));
$("#event_location").val(objEvent.event_location);
$("#event_address").val(objEvent.event_address);
$("#event_city").val(objEvent.event_city);
$("#event_state").val(objEvent.event_state);
$("#event_zip").val(objEvent.event_zip);
$("#event_contact").val(objEvent.event_contact);
$("#event_phone").val(objEvent.event_phone);
$("#event_email").val(objEvent.event_email);

if ((objEvent.event_status === "1")){
	$("#event_status").prop('checked',true);
	$("#activate_yesno").html("Yes");
}
else
{
	$("#event_status").prop('checked',false);
	$("#activate_yesno").html("No");
}

_event_short_name=objEvent.event_short_name;
_event_long_name=objEvent.event_name;
_event_date=objEvent.event_date;
_event_start_time=objEvent.event_start_time.substring(0,5);
_event_end_time=objEvent.event_end_time.substring(0,5);
_event_location=objEvent.event_location;
_event_address=objEvent.event_address;
_event_city=objEvent.event_city;
_event_state=objEvent.event_state;
_event_zip=objEvent.event_zip;
_event_contact=objEvent.event_contact;
_event_phone=objEvent.event_phone;
_event_email=objEvent.event_email;
_event_status=objEvent.event_status;

dfmt=_event_date.substring(5,7)+"/"+_event_date.substring(8,10)+"/"+_event_date.substring(0,4);

$("#datepicker").val(dfmt);


});
	
}


function event_role_volunteers(){
query="view/event_role_volunteers.html";
$.get(query, function(data){
	$("#content").html(data);
});
}


function event_roles_ready(){
event_role_reset();
      $("#event_role_title").val(_event_role_title);
     $("#event_role_description").val(_event_role_description);
     $("#event_role_qualifications").val(_event_role_qualifications);
    $("event_role_qty").val(_event_role_qty);
	$("#event_roles_event_name").html(_event_long_name);
	ret=min_looper("event_role_pre_mins");
	$("#event_role_pre_mins").html(ret);
	ret=min_looper("event_role_post_mins");
	$("#event_role_post_mins").html(ret);
	query=_model_header+"action=event_get_roles&event_id="+_event_id;
	$.get(query,function (data){
	htm=create_dropdown("Choose Role","event_role",data);
	$("#evt_role_lst").html(htm);
	$("#lst_event_role").val(-1);
	$("#btn_event_role_volunteers").addClass("ui-helper-hidden");
	});
	$("#event_role_qty").spinner({
		min: 0,
   		 max: 100,
   		 spin: function(event, ui) {
        _event_role_qty=$(this).val();
        console.log('evtroleqty=',_event_role_qty);
		}
	}).val(1);
	
	}

function event_roles(){
	query="view/event_roles.html";
	$.get(query, function(data){
		$("#content").html(data);
	});
}

function event_edit_ready(){
fillin_event_info();
set_form_validate($("#frm_edit"));
/*
$('#event_status').click(function() {
   _event_status=($(this).is(':checked')?1:0);
   	});
   	*/   	
}

function xx(val){
	return escape(val);
}

function event_update(){

var objEvent=new Object();
objEvent.event_id=_event_id;
objEvent.event_short_name=_event_short_name;
objEvent.event_long_name=_event_long_name;
objEvent.event_date=_event_date;
objEvent.event_start_time=_event_start_time;
objEvent.event_end_time=_event_end_time;
objEvent.event_location=_event_location;
objEvent.event_address=_event_address;
objEvent.event_city=_event_city;
objEvent.event_state=_event_state;
objEvent.event_zip=_event_zip;
objEvent.event_phone=_event_phone;
objEvent.event_email=_event_email;
objEvent.event_contact=_event_contact;
objEvent.event_status=_event_status;
query=_model_header+"action=event_update";
console.log(objEvent);
$.post(query,objEvent, function(data){
$("#btn_editevent_close").click();
});
}


function reset_events(){
_event_id="0";
_event_short_name="";
_event_long_name="";
_event_date="";
_event_start_time="12:15 PM";
_event_end_time="05:30 PM";
_event_short_name="";
_event_long_name="";
_event_location="";
_event_address="";
_event_city="";
_event_state="";
_event_zip="";
_event_phone="";
_event_email="";
_event_contact="";
_event_status=-1;

_event_context="0";
_event_copy_volunteers="true";
_event_role_id="0";
_event_template_id="";
_new_event_id="0";
_event_role_title="";
}



function evt_lst_change(evt){
_event_id=evt.value;
query=_model_header+"action=events_get_event&event_id="+_event_id;
$.get(query, function(data){
var objEvent=$.parseJSON(data);		
$("#event_short_name").val(objEvent.event_short_name);
$("#event_long_name").val(objEvent.event__name);
$("#_start_time").val(objEvent.event_start_time.substring(0,5));
$("#event_long_name").val(objEvent.event_name);
$("#_end_time").val(objEvent.event_end_time.substring(0,5));
$("#event_location").val(objEvent.event_location);
$("#event_address").val(objEvent.event_address);
$("#event_city").val(objEvent.event_city);
$("#event_state").val(objEvent.event_state);
$("#event_zip").val(objEvent.event_zip);
$("#event_contact").val(objEvent.event_contact);
$("#event_phone").val(objEvent.event_phone);
$("#event_email").val(objEvent.event_email);


_event_start_time=objEvent.event_start_time.substring(0,5);
_event_short_name=objEvent.event_short_name;
_event_long_name=objEvent.event_name;
_event_end_time=objEvent.event_end_time.substring(0,5);
_event_location=objEvent.event_location;
_event_city=objEvent.event_city;
_event_state=objEvent.event_state;
_event_zip=objEvent.event_zip;
_event_contact=objEvent.event_contact;
_event_phone=objEvent.event_phone;
_event_email=objEvent.event_email;
$("#copy_vol").removeClass("ui-helper-hidden");
});

	
}


function set_form_validate(f){
	
 f.validate({ 
        rules: { 
            event_short_name: {
               required: true,
                minlength:5,
                maxlength:20
            },
            event_long_name: {
            	required:true,
            	minlength:5,
            	maxlength:50
            },
            event_location: {
            	required:true,
            	minlength:2,
            	maxlength:30
            },
            event_city: {
            	required:true,
            	minlength:2,
            	maxlength:30
            },
            event_state: {
               	required:true,
				state:true
			  },
			  event_contact:{
			  	maxlength:30
			  },
			  event_phone:{
			  	phoneUS:true
			  },
			  event_email:{
			  	email:true
			  },
			  datepicker:{
			  	required:true,
			  	dte:true},
			  _start_time:{
					required:true,
					tim:true},
			_end_time:{
					required:true,
					tim:true},
			event_zip:{
					required:true
					}
			   }, 
        messages: { 
    		event_short_name:{ 
				required:"Requires 5-20 characters",
				minlength:"Must be at least 5 characters",
				maxlength:"Must be less than 20 characters" 
           },
             event_long_name:{
				required:"Requires 10-50 characters",
				minlength:"Must be at least 5 characters",
				maxlength:"Must be less than 50 characters"
            },
            event_location:{
				required:"Requires 2-30 characters",
				minlength:"Must be at least 2 characters",
				maxlength:"Must be less than 30 characters"
            },
              event_address:{
				required:"Requires 0-50 characters",
				minlength:"Must be at least 0 characters",
				maxlength:"Must be less than 50 characters"
            },
            event_city:{
				required:"Requires 2-30 characters",
				minlength:"Must be at least 2 characters",
				maxlength:"Must be less than 30 characters"
            }, 
            event_contact:{
            	maxlength:"Must be no more than 30 characters"
            },
            event_zip:{
            	required:"Please enter zip code"
            	}
            
          	} 
	});
	
$.validator.addMethod("dte", function(dte,element){
	return (! (dte.match("Choose Date")));
},"Please choose a date!");

$.validator.addMethod("tim", function(tim,element){
	return (! (tim == -1));
},"Please choose a Time!");


$.validator.addMethod("state", function (state, element) {
  return this.optional(element) || state.match(/^(A[LKSZRAEP]|C[AOT]|D[EC]|F[LM]|G[ANU]|HI|I[ADLN]|K[SY]|LA|M[ADEHINOPST]|N[CDEHJMVY]|O[HKR]|P[ARW]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$/);
}, "Please specify a valid state");

	
$('#event_state').keyup(function() {
        this.value = this.value.toUpperCase();
    });

$.validator.setDefaults({
            submitHandler: function() { alert("submited!!!"); }
        });

}

function newevent_ready(){
reset_events();

query=_model_header+"action=events_get_templates&event_owner="+_user_id;
$.get(query, function(data){
lst=create_dropdown("Choose Event Template","evt_lst",data);
$("#lstEvents").html(lst);
ret=time_looper("start_time");
$("#start_time").html(ret);
ret=time_looper("end_time");
$("#end_time").html(ret);
$("#datepicker").datepicker(
{
 onSelect:function(dateText){
 _event_date=dateText.substring(6,10)+"-"+dateText.substring(0,2)+"-"+dateText.substring(3,5);
 }
});
});
set_form_validate($("#frm1"));
}


function set_mins(a,b){
if(a==="event_role_pre_mins"){
_event_role_pre_mins=b;	
	}
else{
	_event_role_post_mins=b;
}

}


function set_time(a,b){
if(a==="start_time"){
_event_start_time=b;	
	}
else{
	_event_end_time=b;
}

}


function event_insert(){
	// check to be sure it isnt in the past

var a =new Object();
a.event_id=_event_id;
a.event_short_name=_event_short_name;
a.event_long_name=_event_long_name;
a.event_date=_event_date;
a.event_start_time=_event_start_time;
a.event_end_time=_event_end_time
a.event_location=_event_location;
a.event_address=_event_address;
a.event_city=_event_city;
a.event_state=_event_state;
a.event_zip=_event_zip;
a.event_contact=_event_contact;
a.event_phone=_event_phone;
a.event_owner=_user_id;
a.event_email=_event_email;
a.event_copy_volunteers=1; //(_event_copy_volunteers==="true")?1:0;
a.event_status=_event_status;

query_i=_model_header+"action=event_insert";
$.post(query_i,a,function(data){

	_event_id=data;
	
	query_x="view/editevent.html";
	$.get(query_x,function(data2){
	$("#content").html(data2);
	});

  });
  
}



function get_roles(){
	query2=_model_header+"action=volunteers_get_roles&event_id="+_event_id;
	$.get(query2, function (data){
	$("#volunteerroles").html(create_dropdown("Choose Role","event_roles",data));	
	});
	
return true;
}




function event_roles_change(evt){
_event_role_id=evt.value;

$.get("view/volunteer.html", function(data){
		$("#volunteerdetail").html(data);
});
	
}



function showEvent(calEvent){
query=_model_header+"action=index_event&event_id="+calEvent.url;
_event_id=calEvent.url;
//query_alt="view/dialog.htmx";
if (_event_id == -1){
query_alt="view/newevent.html";
     	$.get(query_alt,function(data){
		$("#content").html(data);
		});
     }
else {
	$.get(query,function(data){
	var objEvent=$.parseJSON(data);
	_event_name=objEvent.event_name;
	_event_date=objEvent.event_date;
	_event_start_time=objEvent.event_start_time;
	_event_end_time=objEvent.event_end_time;
	_event_location=objEvent.event_location;
	_event_city=objEvent.event_city;
	_event_state=objEvent.event_state;
	_event_owner=objEvent.event_owner;
	if (objEvent.event_owner ==_user_id){
		query_alt="view/editevent.html";
		$.get(query_alt,function(data){
		$("#content").html(data);
		});
		}
		else {
		query_alt="view/dialog.html";		
		$.get(query_alt,function(data){
		$("#content").html(data);
		});
	}
});


}
return false;
}



function get_calendar(){
var d = new Date();
var n = d.toLocaleDateString(); 

var begdate=new Date(d);
begdate.setDate(begdate.getDate() +2);
var n2=begdate.toLocaleDateString();

begdate.setDate(begdate.getDate() +3);
var n3=begdate.toLocaleDateString();

var nmo=new Date();
nmo.setDate(d.getDate()+30);
var nd=nmo.toLocaleDateString();
//

		$("#calendar").fullCalendar({
			editable: true,
			timezone:'local',
			eventLimit: true, // allow "more" link when too many events
			eventClick: function(calEvent, jsEvent, view) {
			jsEvent.preventDefault();
		// $(this).css('border-color', 'red');
			if (_user_id>0){
			showEvent(calEvent);	
			}
			else
			{
			alert('Please log into Facebook to access the calendar');
			}
    		},
		eventSources:[_model_header+"action=index_events&user_id="+_user_id,_model_header+"action=index_new_events&user_status="+xx(_user_status),
		_model_header+"action=admin_events&user_id="+_user_id]
		});

		}

/*
function get_area(city_id){
query=_model_header+"action=index_areas&city_id="+city_id;
$.get(query,function(data){
htm=create_dropdown("Choose Area","area",data);
$("#choose_area").html(htm);
});
$("#choose_area").change(function(){
	citnam=$("#choose_city").find("option:selected").text();
	eid=$(this).find("option:selected").val();
	enam=$(this).find("option:selected").text();
	alert('Get '+citnam +' Calendar for '+eid+' '+enam);
});
}


function get_cities(){
query=_model_header+"action=index_cities";
$.get(query,function(data){
htm=create_dropdown("Choose City","City",data);
$("#choose_city").html(htm);
$("#choose_city").change(function(){
//alert($(this).find("option:selected").val());
get_area($(this).find("option:selected").val());
});

});


}



function getStatusQuery(url){
statusquery=_model_header+'action=index_status&email='+encodeURI(document.getElementById('emailid').innerHTML+'&event_id='+url);
$.get(statusquery,function(data)
 		{
		var objStatus=$.parseJSON(data);
		console.log(objStatus.status);
		k=objStatus.status;
		console.log("k is ",k);
		if (k=="1"){s="Volunteer"} else {s="Admin"};
		_event_context=s;
		$($("button", $("#dialog").parent())[1]).text(s);
			
		}) ;	
};
*/
