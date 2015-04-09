<?php
/*Change to your local path.. I have included include.php example in this folder */
require_once('../../include/include.php');
$_lf="\r\n";

try {
if (isset($_REQUEST['action'])){
$db=mysqli_connect($_server,$_user,$_pwd);
mysqli_select_db($db,$_db);

switch ($_REQUEST['action']){
		
	case 'get_event_roles_mobile':
	//first check for volunteer already in 
if ($_REQUEST['flag']==1){
	
	$query=	"SELECT events.*, event_roles.*, vw_event_roles.vols  FROM `vw_event_roles` inner join events on vw_event_roles.event_id=events.event_id  
inner join event_roles on vw_event_roles.event_role_id=event_roles.event_role_id 
inner join vw_volunteer_roles on event_roles.event_role_id=vw_volunteer_roles.event_role_id and volunteer_id=".$_REQUEST['volunteer_id']." where event_roles.event_id=".$_REQUEST['event_id'];
}
	else
	{
	$query=	"SELECT events.*, event_roles.*, vw_event_roles.vols  FROM `vw_event_roles` inner join events on vw_event_roles.event_id=events.event_id  
inner join event_roles on vw_event_roles.event_role_id=event_roles.event_role_id where event_roles.event_id=".$_REQUEST['event_id'];
	}

	$result=mysqli_query($db,$query);
	$carr=array();
	while($row = mysqli_fetch_array($result)) {
	$carr[]=$row;
	}
	
	echo json_encode($carr);
	mysqli_close($db);
	break;
		

	case 'get_events':
	$query="SELECT * FROM `events` WHERE event_date =".$_REQUEST['event_date']."  ORDER BY event_start_time ";
	
	$result=mysqli_query($db,$query);
	$carr=array();
	while($row = mysqli_fetch_array($result)) {
		
 	$carr[]=$row;
	}
	echo json_encode($carr);
	mysqli_close($db);
	break;

	
	case 'get_event_dates':
	$query="SELECT events.*,0 as event_count,0 as need, 0 as flag from events where event_date>concat(CURDATE( ),' 00:00:00') order by event_date,event_start_time";
	$result=mysqli_query($db,$query);
	$carr=array();
	while($row = mysqli_fetch_array($result)) {
		
	$query2="SELECT count(*) event_count FROM events where event_date='".$row['event_date']."'";
	$result2=mysqli_query($db,$query2);
	$row2=mysqli_fetch_assoc($result2);
	$row['event_count']=$row2['event_count'];
		
	$query2="select event_roles.event_id, sum(event_role_qty)-count(volunteer_id) need from event_roles 
	left outer join event_role_volunteers on event_roles.event_role_id=event_role_volunteers.event_role_id
	where event_roles.event_id=".$row['event_id']." group by event_roles.event_id";
	$result2=mysqli_query($db,$query2);
	$row2=mysqli_fetch_assoc($result2);
	$row['need']=$row2['need'];
	
	$query2="SELECT case when ifnull(event_id,0) >0 then 1 else 0 end flag FROM  event_role_volunteers 
 	where event_id=".$row['event_id']." and volunteer_id=".$_REQUEST['user_id'];
	$result2=mysqli_query($db,$query2);
	$row2=mysqli_fetch_assoc($result2);
	$row['flag']=$row2['flag'];
	
	
	$carr[]=$row;
	}
	echo json_encode($carr);
	mysqli_close($db);
	break;

case 'volunteer_role_delete':
$query="delete from event_role_volunteers where event_role_id=".$_REQUEST['event_role_id']." and volunteer_id=".$_REQUEST['volunteer_id'];
$result=mysqli_query($db,$query);
$query2="select event_name,event_date,event_role_title from event_roles inner join
 events on  event_roles.event_id=events.event_id where 
 event_roles.event_role_id=".$_REQUEST['event_role_id'];
 $result2=mysqli_query($db,$query2);
 $role_row=mysqli_fetch_assoc($result2);
 
$query3="select * from users where user_id=".$_REQUEST['volunteer_id'] ;
 $result3=mysqli_query($db,$query3);
 $row=mysqli_fetch_assoc($result3);
 


 $message="To ".$row['user_name'].":".$_lf.
 "You have succesfully cancelled your volunteer role for ".$role_row['event_name'].$_lf.
 "Role:".$role_row['event_role_title'].$_lf;
 
    $message=$message.$_lf."Sincerely,".$_lf.
  "The Serve For All Network";

$to=$row['user_email'];
$headers = "MIME-Version: 1.0".$_lf.
"Content-type: text/plain; charset=iso-8859-1".$_lf.
"From: Serveforall Network <admin@serveforall.net>".$_lf.
"Reply-To: Serveforall <admin@serveforall.net>".$_lf.
"X-Mailer: PHP/".phpversion();

mail($to,"Serve for All Network Volunteer Notice",$message,$headers);  



echo "You have successfully cancelled your volunteer role ".$role_row['event_role_title']."\n".
" for ".$role_row['event_name'];
mysqli_close($db);
break;
	
case 'volunteers_insert':
$query="select ifnull(max(event_role_seq),0)+1 as event_role_seq from event_role_volunteers where event_role_id=".$_REQUEST['event_role_id'];
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
$event_role_seq=$row['event_role_seq']; 

$query="insert into event_role_volunteers (event_id,event_role_id, event_role_seq, volunteer_id) values(".$_REQUEST['event_id'].",".$_REQUEST['event_role_id'].",".$event_role_seq.",".$_REQUEST['volunteer_id'].")";
$result=mysqli_query($db,$query);

$lf="\r\n";



 $message="To ".$_REQUEST['volunteer_name'].":".$lf.
 "Thank you for Volunteering!".$lf.
 "You are scheduled for ".$_REQUEST['event_name'] .$lf.
 "Date: ".$_REQUEST['date'].$lf.
 "Start Time:".$_REQUEST['starttime'].$lf.
 "End Time:".$_REQUEST['endtime'].$lf.
 "Location: ".$_REQUEST['location'].$lf.
 "Address: ".$_REQUEST['address'].$lf.
 "City: ".$_REQUEST['city'].$lf.
 "State:".$_REQUEST['state'].$lf.
 "Role:".$_REQUEST['role_title'].$lf;
 if($_REQUEST['pre_mins']>0){
 $message=$message."Please arrive ".$_REQUEST['pre_mins']." mins prior to start.".$lf;	
 }

if ($_REQUEST['post_mins']>0){
 	$message=$message."Please expect to stay ".$_REQUEST['post_mins']." mins after event is over.".$lf;
}
    $message=$message.$lf."Sincerely,".$lf.
  "The Serve For All Network";

$to=$_REQUEST['volunteer_email'];
$headers = "MIME-Version: 1.0".$lf.
"Content-type: text/plain; charset=iso-8859-1".$lf.
"From: Serveforall Network <admin@serveforall.net>".$lf.
"Reply-To: Serveforall <admin@serveforall.net>".$lf.
"X-Mailer: PHP/".phpversion();
mail($to,"Serve for All Network Volunteer Notice",$message,$headers);  


echo $message;
mysqli_close($db);
break;




case "admin_request":
 $message="To ".$_REQUEST['user_name'].":\r\n Thank you for applying for Admin Rights.\r\n".
 "We will get back to you as soon as possible \r\n".
  "Sincerely,\r\n".
  "The Serve For All Network";

mail($_REQUEST['user_name']."<".$_REQUEST['email'].">","Serve for All Network Admin Request",$message,'From: Serve For All Network Admin<admin@serveforall.net>');  
mail("admin@serveforall.net","Request Admin","Email = ".$_REQUEST['email']." user_name= ".$_REQUEST['user_name']);
echo ("Sent\r\nBecause the reply is automated, please check your ''junk'' email folder for responses\r\nThank you!");
mysqli_close($db);
break;
	
case 'mail_me':
$lf="\r\n";

$headers = "MIME-Version: 1.0".$lf.
"Content-type: text/plain; charset=iso-8859-1".$lf.
"From: Serveforall Network <admin@serveforall.net>".$lf.
"Reply-To: Serveforall <admin@serveforall.net>".$lf.
"X-Mailer: PHP/".phpversion();

 $message="To John:\r\n Thank you for applying for Admin Rights.\r\n".
 "We will get back to you as soon as possible \r\n".
  "Sincerely,\r\n".
  "The Serve For All Network";
mail('johnflem@hotmail.com',"Serve for All Network Admin Request",$message,$headers);  
echo 'Done';
mysqli_close($db);
break;
	

case "event_role_volunteers_add":
$query="select user_id from users where user_email=".s($_REQUEST['email']);
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
if ($row== NULL){
$name=split("@",$_REQUEST['email']);
$query="insert into users (user_name, user_email,user_role, user_status) values(".
s($name[0]).",".
s($_REQUEST['email']).",".
"'Volunteer',0)";
mysqli_query($db,$query);
$query="select user_id from users where user_email=".s($_REQUEST['email']);
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
}
$user_id=$row['user_id'];
$query="insert into event_role_volunteers(event_id,event_role_id,event_role_seq,volunteer_id) values(".
$_REQUEST['event_id'].",".
$_REQUEST['event_role_id'].",".
$_REQUEST['event_role_seq'].",".
$user_id.")";
mysqli_query($db,$query);
$new_row_id=mysqli_insert_id($db);
echo $new_row_id;
mysqli_close($db);
break;



case "event_role_volunteers_clean":
$query="delete from event_role_volunteers where event_role_id=".$_REQUEST['event_role_id'];
$result=mysqli_query($db,$query);	
echo -1;
mysqli_close($db);
break;

		

case "event_role_volunteers":
$query="select event_role_seq, volunteer_id,user_name,user_email from event_role_volunteers inner join users on volunteer_id=user_id where event_role_id=".$_REQUEST['event_role_id'];
$result=mysqli_query($db,$query);
$carr=array();
while($row = mysqli_fetch_array($result)) {
 $carr[]=$row;
}
echo json_encode($carr);
mysqli_close($db);
break;



case "event_role_update":
if($_REQUEST['event_role_id']<=0){
$query="insert into event_roles 
(
event_id,
event_role_title,
event_role_description,
event_role_qualifications,
event_role_pre_mins,
event_role_post_mins,
event_role_qty) values(".
$_REQUEST['event_id'].",".
s($_REQUEST['event_role_title']).",".
s($_REQUEST['event_role_description']).",".
s($_REQUEST['event_role_qualifications']).",".
$_REQUEST['event_role_pre_mins'].",".
$_REQUEST['event_role_post_mins'].",".
$_REQUEST['event_role_qty'].")";
}
else 
{
$query="update event_roles set event_role_title=".s($_REQUEST['event_role_title']).",".
"event_role_description=".s($_REQUEST['event_role_description']).",".
"event_role_qualifications=".s($_REQUEST['event_role_qualifications']).",".
"event_role_pre_mins=".$_REQUEST['event_role_pre_mins'].",".
"event_role_post_mins=".$_REQUEST['event_role_post_mins'].",".
"event_role_qty=".$_REQUEST['event_role_qty']." where event_role_id=".
$_REQUEST['event_role_id'];
}
$result=mysqli_query($db,$query);
if($_REQUEST['event_role_id']<=0){
$new_role_id=mysqli_insert_id($db);
echo $new_role_id;
}
else 
{
	echo $role_id;
	}
mysqli_close($db);
break;

	
case "event_get_role":
$query="select  
event_role_id,
event_role_title,
event_role_description,
event_role_qualifications,
ifnull(event_role_pre_mins,0) event_role_pre_mins,
ifnull(event_role_post_mins,0) event_role_post_mins,
ifnull(event_role_qty,0) event_role_qty,
event_role_status
from event_roles where event_role_id=".$_REQUEST['event_role_id'];	
$result=mysqli_query($db,$query);
$row = mysqli_fetch_array($result);
echo json_encode($row);
mysqli_close($db);
break;

	
case "event_get_roles":
$query="select -1 id,'New' value union select event_role_id id, event_role_title value  from event_roles where event_id=".$_REQUEST['event_id'];
$result=mysqli_query($db,$query);
$carr=array();
while($row = mysqli_fetch_array($result)) {
 $carr[]=$row;
}
echo json_encode($carr);
mysqli_close($db);
break;

	
case "event_role_volunteer_insert":
$query="insert into event_role_volunteers (event_id, event_role_id, volunteer_id) values(".
$_REQUEST['EVENT_ID'].",".$_REQUEST['EVENT_ROLE_ID'].",".$_REQUEST['volunteer_id'].")";
mysqli_query($db,$query);
$new_volunteer_role_id=mysqli_insert_id($db);
echo $new_volunteer_role_id;
mysqli_close($db);
break;


case "event_role_insert":
$query="insert into event_roles(`event_id`, `event_role_title`, `event_role_description`, `event_role_qualifications`, `event_role_pre_mins`, `event_role_post_mins`, `event_role_qty`, `event_role_status`) VALUES(".
$_REQUEST['EVENT_ID'].",".
s($_REQUEST['event_role_title']).",".
s($_REQUEST['event_role_description']).",".
s($_REQUEST['event_role_qualifications']).",".
s($_REQUEST['event_role_pre_mins']).",".
s($_REQUEST['event_role_post_mins']).",".
$_REQUEST['event_role_qty'].",".
$_REQUEST['event_role_status'].")";
mysqli_query($db,$query);
$new_role_id=mysqli_insert_id($db);
echo $new_role_id;
mysqli_close($db);
break;
		

case "event_insert":
$query="insert into events(
event_short_name,
event_name,
event_date,
event_start_time,
event_end_time,
event_location,
event_address,
event_city,
event_state,
event_zip,
event_contact,
event_phone,
event_owner,
event_email,
event_status) values(".
s($_REQUEST['event_short_name']).",".
s($_REQUEST['event_long_name']).",".
s($_REQUEST['event_date']).",".
s($_REQUEST['event_start_time']).",".
s($_REQUEST['event_end_time']).",".
s($_REQUEST['event_location']).",".
s($_REQUEST['event_address']).",".
s($_REQUEST['event_city']).",".
s($_REQUEST['event_state']).",".
s($_REQUEST['event_zip']).",".
s($_REQUEST['event_contact']).",".
s($_REQUEST['event_phone']).",".
$_REQUEST['event_owner'].",".
s($_REQUEST['event_email']).",".
$_REQUEST['event_status'].")";
mysqli_query($db,$query);
$new_event_id= mysqli_insert_id($db);
if ($_REQUEST['event_id'] >0){
$query="select `event_role_id`, `event_id`, `event_role_title`, `event_role_description`, `event_role_qualifications`, `event_role_pre_mins`, `event_role_post_mins`, `event_role_qty`, `event_role_status` from event_roles where event_id=".$_REQUEST['event_id'];
$result=mysqli_query($db,$query);
while($row = mysqli_fetch_array($result)) {
$query2="insert into event_roles(`event_id`, `event_role_title`, `event_role_description`, `event_role_qualifications`, `event_role_pre_mins`, `event_role_post_mins`, `event_role_qty`, `event_role_status`) VALUES(".
$new_event_id.",".
s($row['event_role_title']).",".
s($row['event_role_description']).",".
s($row['event_role_qualifications']).",".
s($row['event_role_pre_mins']).",".
s($row['event_role_post_mins']).",".
$row['event_role_qty'].",".
$row['event_role_status'].")";
mysqli_query($db,$query2);
$new_role_id=mysqli_insert_id($db);
$query3="select volunteer_id from event_role_volunteers where event_role_id=".$row['event_role_id'];
$result3=mysqli_query($db,$query3);
	while ($row3=mysqli_fetch_array($result3)){
			$query4="insert into event_role_volunteers (event_id, event_role_id, volunteer_id) values(".
			$new_event_id.",".$new_role_id.",".$row3['volunteer_id'].")";
			$result4=mysqli_query($db,$query4);			
	}
}

}
//here add in loops for roles and volunteers
echo $new_event_id;
mysqli_close($db);
break;

		
case "event_update":
$query="update events set
 event_short_name=".s($_REQUEST['event_short_name']).",".
"event_name=".s($_REQUEST['event_long_name']).",".
"event_date=".s($_REQUEST['event_date']).",".
"event_start_time=".s($_REQUEST['event_start_time']).",".
"event_end_time=".s($_REQUEST['event_end_time']).",".
"event_location=".s($_REQUEST['event_location']).",".
"event_address=".s($_REQUEST['event_address']).",".
"event_city=".s($_REQUEST['event_city']).",".
"event_state=".s($_REQUEST['event_state']).",".
"event_zip=".s($_REQUEST['event_zip']).",".
"event_contact=".s($_REQUEST['event_contact']).",".
"event_phone=".s($_REQUEST['event_phone']).",".
"event_email=".s($_REQUEST['event_email']).",".
"event_status=".$_REQUEST['event_status']." where event_id=".$_REQUEST['event_id'];
mysqli_query($db,$query);
echo "1";
mysqli_close($db);
break;


case "events_get_event":
$query="select 
event_short_name,
event_name,
event_date,
event_start_time,
event_end_time,
event_location,
event_address,
event_city,
event_state,
event_zip,
event_contact,
event_phone,
event_owner,
event_email,
event_status from events where event_id=".$_REQUEST['event_id'];
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
echo json_encode($row);
mysqli_close($db);
break;


case "events_get_templates":
$query="select max(event_id) id, event_short_name value  from events where event_owner=".$_REQUEST['event_owner']." group by event_short_name
order by value";
$result=mysqli_query($db,$query);
$carr=array();
while($row = mysqli_fetch_array($result)) {
 $carr[]=$row;
}
echo json_encode($carr);
mysqli_close($db);
break;


	
case 'volunteers_get_role_id_need':
$query="select max(event_role_qty)-count(event_role_volunteer_id) need from event_roles left join event_role_volunteers on event_roles.event_role_id=event_role_volunteers.event_role_id
where event_roles.event_role_id=".$_REQUEST['event_role_id']. 
" group by event_roles.event_role_id";
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
echo json_encode($row);
mysqli_close($db);
break;
	
case 'volunteers_get_role':
$query="select  event_roles.event_role_id,event_role_title,event_role_description,event_role_qualifications,event_role_pre_mins,event_role_post_mins
from event_roles  where event_roles.event_role_id=".$_REQUEST['event_role_id'];
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
echo json_encode($row);
mysqli_close($db);
break;


case 'volunteers_get_roles':
$query="select  event_roles.event_role_id id,event_role_title value 
from event_roles left join event_role_volunteers on 
event_roles.event_role_id=event_role_volunteers.event_role_id where event_roles.event_id=".$_REQUEST['event_id']." group by
event_roles.event_role_id,event_role_title 
having count(volunteer_id) < max(event_role_qty)";
$result=mysqli_query($db,$query);
$carr=array();
while($row = mysqli_fetch_array($result)) {
 $carr[]=$row;
}
echo json_encode($carr);
mysqli_close($db);
break;


case 'index_volunteer_need_count':
$query="select count(event_roles.event_role_id) need from event_roles left join event_role_volunteers on event_roles.event_role_id=event_role_volunteers.event_role_id
where event_role_volunteer_id is null
and event_roles.event_id=".$_REQUEST['event_id'];
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
echo json_encode($row);
mysqli_close ($db);
break;


case 'index_status':
$query="select case when ifnull(user_id,0) = 0 then 0 else 1 end  status  from events left join users on events.event_owner = users.user_id and users.user_email='".$_REQUEST['email']."' and event_id=1" ; 
$result=mysqli_query($db,$query);
$row=mysqli_fetch_array($result);
echo json_encode($row);
mysqli_close($db);
break;




case 'index_cities':

$result=mysqli_query($db,'SELECT city_id id,city_name value FROM cities ORDER BY city_name');
$carr=array();

while($city = mysqli_fetch_array( $result )) {
 $carr[]=$city;
}
 
echo json_encode($carr);
mysqli_close($db);
break;



case 'index_event':
$query="SELECT event_id,event_name ,event_date,event_start_time,event_end_time,event_location,event_city,event_state,event_contact,event_phone,event_email,event_owner from events where event_id=".$_REQUEST['event_id'] ;

$result=mysqli_query($db,$query);
$crow=mysqli_fetch_array($result);
echo json_encode($crow);
mysqli_close($db);
break;



case 'index_new_events':
if ($_REQUEST['user_status']=== "Admin"){
$query="select short_title  title, url, color, concat(year(NOW()),'-',lpad(month(NOW()),2,'0'),'-01 00:00') start 
from newevents
union select short_title,url,color,concat( year(adddate(NOW(),31)),'-', lpad((month(NOW())mod 12)+1,2,'0'),'-01 00:00') from newevents
union select short_title,url,color, concat( year(adddate(NOW(),62)),'-', lpad((((month(NOW())mod 12)+2) mod 12),2,'0'),'-01 00:00') from newevents 
union select short_title,url,color, concat( year(adddate(NOW(),91)),'-', lpad(((month(NOW())mod 12)+3) mod 12,2,'0'),'-01 00:00') from newevents";
}
else
{
$query="select '' title, -1, color, '2010-01-01' start from newevents where 0=-1";
}
$result=mysqli_query($db,$query);
$carr=array();
while($area = mysqli_fetch_array( $result )) {
 $carr[]=$area;
}
echo json_encode($carr);
mysqli_close($db);
break;


case 'index_areas':
$query='SELECT area_id id,area_name value FROM areas  where city_id='.$_REQUEST['city_id'].' ORDER BY area_name';
$result=mysqli_query($db,$query);
$carr=array();
while($area = mysqli_fetch_array( $result )) {
 $carr[]=$area;
}
echo json_encode($carr);
mysqli_close($db);
break;

case 'admin_events':
$query="SELECT event_short_name title,event_id url,'ccaa00' as color, 'white' as textColor, Concat(date_add(event_date, INTERVAL 1 DAY),' ',event_start_time) start from events where event_date>subdate(now(),1)  and event_owner=".$_REQUEST['user_id'] ;
$result=mysqli_query($db,$query);
$carr=array();
while($area = mysqli_fetch_array( $result )) {
 $carr[]=$area;
}
echo json_encode($carr);
mysqli_close($db);
break;


case 'index_events':
$query="SELECT event_short_name title,event_id url,'powderblue' as color,'black' as textColor,Concat(date_add(event_date, INTERVAL 1 DAY),' ',event_start_time) start from events where event_date>concat(CURDATE( ),' 00:00:00') and event_status >0 and event_owner<>".$_REQUEST['user_id'];
$result=mysqli_query($db,$query);
$carr=array();
while($area = mysqli_fetch_array( $result )) {
 $carr[]=$area;
}
echo json_encode($carr);
mysqli_close($db);
break;

case 'get_user':
$query="select user_id from users where user_email=".s($_REQUEST['email']);
$result=mysqli_query($db,$query);
$crow=mysqli_fetch_array($result);
if ($crow!=NULL){
	$query="update users set user_name=".s($_REQUEST['user_name'])." where user_id=".$crow['user_id'];
	mysqli_query($db,$query);
}
else
{
$query="insert into users (user_name,user_email,user_role,user_status) values(".s($_REQUEST['user_name']).",".s($_REQUEST['email']).",'Volunteer',0)";
mysqli_query($db,$query);
}

$query="select user_id,user_role status from users where user_email=".s($_REQUEST['email']);
$result=mysqli_query($db,$query);
$crow=mysqli_fetch_array($result);
echo json_encode($crow);
mysqli_close($db);
break;


case 'test':
$tm=$_REQUEST['time'];
echo "time is ".$tm."\n";
echo strtotime($tm)."\n";
echo date("H:i", strtotime($tm));
	mysqli_close($db);
	break;


default:
echo $_REQUEST['action'] .' Unknown ';
}
}
else
{
	echo 'No Action!';
}
}
catch (Exception $e){
	echo ' Unknown ';
	}


function s($in){
	return "'".$in."'";
}

?>