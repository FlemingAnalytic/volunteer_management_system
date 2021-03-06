  // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response.status);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();
     
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please authorize the use of serveforall.net' +
        'to log in to this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      document.getElementById('status').innerHTML = 'Not logged in' ;
       
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

  window.fbAsyncInit = function() {
  FB.init({
    appId      : '',//your  Facebook app id here!
    cookie     : true,  // enable cookies to allow the server to access 
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.1' // use version 2.1
  });

  // Now that we've initialized the JavaScript SDK, we call 
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });

  };

  // Load the SDK asynchronously
  (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));



  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  function testAPI() {
	var width = $(document).width();
   	mobile = 800;
    console.log('Welcome! Now Fetching your information.... ');
    FB.api('/me', function(response) {
        document.getElementById('status').innerHTML ="";
        _user_name=response.name;
        _user_email=response.email;
     console.log("user_name "+_user_name);
     console.log("user email "+_user_email);
     $.get(_model_header+"action=get_user&email="+_user_email+"&user_name="+_user_name, function(data)
       {
       	         console.log(data);
       	         objUser=$.parseJSON(data);
       	      	_user_id=objUser.user_id;
       	      	_user_status=objUser.status;
       	      	console.log("user_status is ",_user_status)
                console.log("user Id ",_user_id);
     			$("#status").html("Thank you for logging in, "+response.name +". You are a"+(_user_status=="Admin"?"n Administrator":" Volunteer To post events on this site,  <button id=bnt_req_admin onclick=adm_request();>Request Admin Rights</button>"));  
  	$("#fb").addClass("ui-helper-hidden");
  	$("#fb").hide();
  	
     if (width < mobile)
    {
        $('head').append('<script src="	http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.js" />');
        $('head').append('<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile-1.4.5.min.css">');
        $('head').find('.desktop').remove();
        $("#raised_hands").hide();
        
	index_controller_mobile();
    }
	else{
	index_controller();}
	});
      console.log('Successful login for: ' + response.name);
       });
       
  }
