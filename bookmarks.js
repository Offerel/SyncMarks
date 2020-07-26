$(document).ready(function() {
	var menu = document.querySelector('.menu');
	var bookmarks = document.querySelectorAll('.file').forEach(bookmark => bookmark.addEventListener('contextmenu',onContextMenu,false));

	if (/Mobi|Android/i.test(navigator.userAgent)) {
		var ffolder = [];
		$('.ffolder').on('change', function() {
			if (this.checked) {
				ffolder.push(this.value);
			} else {
				ffolder.splice(ffolder.indexOf(this.value), 1);
				location.reload();
			}
			
			var actFolder = "f_"+ffolder[ffolder.length-1];
			
			if(actFolder != 'f_undefined') {
				$('.actFolder').removeClass('actFolder');
				$('#'+actFolder+' li').addClass('actFolder');
				$('.mainFolder > label').css('z-index',0);
				$('#'+actFolder).addClass('actFolder mainFolder');
				$('.mainFolder').addClass('actFolder');
				$('li:not(.actFolder)').hide();
			}
		});
	}

	document.querySelectorAll('.tablinks').forEach(tab => tab.addEventListener('click',openMessages, false));
	document.querySelectorAll('.fa-trash-o').forEach(message => message.addEventListener('click',delMessage, false));
	document.querySelector('#cnoti').addEventListener('change',eNoti,false);

	if(sessionStorage.getItem('gNoti') != 1) getNotifications();
});
 
$(document).keydown(function(e) {
	if(e.keyCode == 27) {
		$('.mbmdialog').hide();
		$('.mmenu').hide();
	}
});

$("#mngcform li div.clientname input[type='text']").on("focus", function () {
   $(this).select();
});

$("#save").on("click",function(){        
    $.ajax({
        url: document.location.href,
		type: "POST",
        data: {
            madd: true,
            folder: $('#folder').val(),
            url: $('#url').val(),
        },
        success: function(r){
			$('.mmenu').hide();
			$("#bookmarks").html(r);
			$('#bmarkadd').hide();
		}
    });  
    return false;
});

$("#mlogout").on("click",function(){        
    $.ajax({
        url: document.location.href,
		type: "POST",
        data: {
            logout: true,
        },
		statusCode: {
			401: function() {
				$('body').html("Successfully logged out...");
			}
		}
    });  
    return false;
});

$("#userSelect").on("change",function(){
	if($(this).val() > 0) {
		$('#nuser').val($("#userSelect option:selected").text());
		checkuform();
		$('#muadd').val('Edit User');
		$('#mudel').removeAttr('disabled','disabled');
	}
});

$("#npwd").on("input",function(){
	checkuform();
});

$("#nuser").on("input",function(){
	checkuform();
});

$("#userLevel").on("change",function(){
	checkuform();
});

$("#hmenu").on("click",function(){
	$('#menu button').css('background-color', 'transparent');
	$('.mbmdialog').hide();
	if($('#mainmenu').css('display') == 'none') {
		$('.mmenu').hide();
		$('#mainmenu').show();
	}
	else {
		$('#mainmenu').hide();
	}
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$("#mngusers").on("click",function(){
	$('.mmenu').hide();
	$("#mnguform").show();
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$("#muser").on("click",function(){
	$('.mbmdialog').hide();
	$('.mmenu').hide();
	$("#userform").show();
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$('.mdcancel').on('click', function() {
	$('.mbmdialog').hide();
	$('.mmenu').hide();
});

$("#mpassword").on("click",function(){
	$('.mbmdialog').hide();
	$('.mmenu').hide();
	$("#passwordform").show();
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$("#pbullet").on("click",function(){
	$('.mbmdialog').hide();
	$('.mmenu').hide();
	$('#pbulletform').show();
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$("#nmessages").on("click",function(){
	$('.mbmdialog').hide();
	$('.mmenu').hide();
	$('#nmessagesform').show();
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$("#clientedt").on("click",function(){
	$('.mmenu').hide();
	$("#mngcform").show();
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$("#bexport").on("click",function(){
	$('.mmenu').hide();
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	if(dd<10) dd='0'+dd;
	if(mm<10) mm='0'+mm;
	today = dd+'-'+mm+'-'+yyyy;

	$.ajax({
        url: document.location.href,
		type: "POST",
        data: {
            export: 'html',
		},
		success: function(data) {
			var blob = new Blob([data], { type: 'text/html' });
			var link = document.createElement('a');
        	link.href = window.URL.createObjectURL(blob);
        	link.download = "bookmarks_" + today + ".html";
        	link.click();
		}
    });  
    return false;
});

$("#footer").on("click",function(){
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
	$('#bmarkadd').show();
	$('.mmenu').hide();
	url.focus();
	url.addEventListener('input', enableSave);
	document.querySelector('#bookmarks').addEventListener('click',hideMenu, false);
});

$("#mlog").on("click",function(){
	$('.mmenu').hide();
	if($('#logfile').css('visibility') === 'hidden') {
		$('#logfile').css('visibility','visible');
		$('#close').css('visibility','visible');
		$.ajax({
			url: document.location.href,
			type: "POST",
			data: {
				mlog: true,
			},
			success: function(r){
				 $("#logfile").html(r);
				moveEnd($('#logfile'));
			}
		});
	}
	else {
		$('#logfile').css('visibility','hidden');
		$('#close').css('visibility','hidden');
	}
});

$("#mclear").on("click",function(){
	if($('#logfile').css('visibility') === 'visible') {
		$('#logfile').css('visibility','hidden');
		$('#close').css('visibility','hidden');
		
		$.ajax({
			url: document.location.href,
			type: "POST",
			data: {
				mclear: true,
			},
			success: function(r){;
			}
		});
	}
});

$("#mclose").on("click",function(){
	if($('#logfile').css('visibility') === 'visible') {
		$('#logfile').css('visibility','hidden');
		$('#close').css('visibility','hidden');
	}
});

$("#mngcform li div.rename").on("click", function() {
	$.ajax({
        type: "POST",
        url: "index.php",
        data: {
            arename: true,
            cido: $(this)[0].parentElement.id,
			nname: $(this)[0].parentElement.children[0].children[0].value,
        },
        success: function(a) {
			response = JSON.parse(a);
			if(response = 1)
				location.reload(false);
			else
				console.log("Error renaming client");
        }
    });
});

$("#mngcform li div.remove").on("click", function() {
	$.ajax({
        type: "POST",
        url: "index.php",
        data: {
            adel: true,
            cido: $(this)[0].parentElement.id,
        },
        success: function(a) {
			response = JSON.parse(a);
			if(response = 1)
				location.reload(false);
			else
				console.log("Error removing client");
        }
    });
});

$("#mngcform li div.clientname input").on('mouseleave',function() {
	if($(this)[0].defaultValue != $(this)[0].value) {
		$("#"+$(this)[0].parentElement.parentElement.id+" div.clientname input").css("display","block");
		$("#"+$(this)[0].parentElement.parentElement.id+" div.rename").css("display","block");
		$("#"+$(this)[0].parentElement.parentElement.id+" div.remove").css("display","block");
	}
});

$('#edtitle').on('input', function() {
	$('#edsave').prop('disabled',false);
});

$('#edurl').on('input', function() {
	$('#edsave').prop('disabled',false);
});

$('#mvfolder').on('change', function() {
	$('#mvsave').prop('disabled',false);
});

$('#edsave').on('click', function(e) {
	e.preventDefault();
	$.ajax({
        url: document.location.href,
		type: "POST",
        data: {
            bmedt: true,
            title: $('#edtitle').val(),
            url: $('#edurl').val(),
			id: $('#edid').val(),
        },
        success: function(r){
			if(r == 1) {
				location.reload();
			}
			else {
				console.log("There was a problem changing that bookmark.");
			}
		}
    });  
    return false;
});

$('#mvsave').on('click', function(e) {
	e.preventDefault();
	$.ajax({
        url: document.location.href,
		type: "POST",
        data: {
            bmmv: true,
            title: $('#mvtitle').val(),
			folder: $('#mvfolder').val(),
			id: $('#mvid').val(),
        },
        success: function(r){
			if(r == 1) {
				location.reload();
			}
			else {
				console.log("There was a problem moving that bookmark.");
			}
		}
    });  
    return false;
});

jQuery.expr[':'].Contains = function(a, i, m) {
	return jQuery(a).text().toUpperCase()
		.indexOf(m[3].toUpperCase()) >= 0;
};

$('#menu input').keyup(function(e) {
	var sfilter = $(this).val();
	var allmarks = $('#bookmarks li.file');
	$('#bookmarks').html(allmarks);
	$('#bookmarks li.file:not(:Contains('+sfilter+'))').css("display","none");
	$('#bookmarks li.file:Contains('+sfilter+')').css("display","block");
	$('#bookmarks li.file:Contains('+sfilter+')').css("padding-left","20px");
	if((sfilter == "") || (e.keyCode == 27)) {
		$('#bookmarks').html($('#hmarks').html());
		$('#menu input').val('');
	}
});

$('#menu button').on('click', function() {
	if($('#menu button').html() == '\u00D7') {
		$('#menu input').blur();
		$('#menu button').html('\u2315')
		$('#menu button').css('background-color', 'transparent');
		$('#menu input').css('width', '0');
		$('#menu input').css('background-color', 'transparent');
		$('#menu input').css('border', '1px solid transparent');
		$('#mprofile').show();
		
	}
	else {
		$('#menu button').html('\u00D7');
		$('#menu button').css('background-color', '#05589D');
		$('#menu input').css('width', 'calc(100% - 100px)');
		$('#menu input').css('background-color', '#05589D');
		$('#mprofile').hide();
		$('#menu input').focus();
	}

	$('.mbmdialog').hide();
	$('.mmenu').hide();
});

function checkuform() {
	if($("#nuser").val().length > 0 && $("#npwd").val().length && $("#userLevel").val().length > 0) {
		$('#muadd').removeAttr('disabled','disabled');
		$('#mudel').removeAttr('disabled','disabled');
	}
	else {
		$('#muadd').attr('disabled','disabled');
		$('#mudel').attr('disabled','disabled');
	}
	
	if($("#userSelect").val().length < 1) {
		$('#mudel').attr('disabled','disabled');
	}
}

function moveEnd (content) {
	var char = 3000;
	content.focus();
	var sel = window.getSelection();
	sel.collapse(content.firstChild, char);
}

function delBookmark(id, title) {
	if(confirm("Would you like to delete \"" + title + "\"?")) {
		$.ajax({
			url: document.location.href,
			type: "POST",
			data: {
				mdel: true,
				id: id,
			},
			success: function(r){
				 $("#bookmarks").html(r);
				 var bookmarks = document.querySelectorAll('.file').forEach(bookmark => bookmark.addEventListener('contextmenu',onContextMenu,false));
			}
		});
	}
}

function enableSave() {
	var url = document.getElementById('url');
	var save = document.getElementById('save');

	if(url.value.length > 7) {
		save.disabled = false;
	}
	else {
		save.disabled = true;
	}
}

function showMenu(x, y){
	var minbot = $(window).height() - 120;
	if(y >= minbot) y = minbot;
    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.classList.add('show-menu');
}

function hideMenu(){
    menu.classList.remove('show-menu');
	$('.mmenu').hide();
	$('.mbmdialog').hide();
	document.querySelector('#bookmarks').removeEventListener('click',hideMenu, false);
}

function onContextMenu(e){
    e.preventDefault();
	$('.mbmdialog').hide();
	$('.mmenu').hide();
	$('#bmid').prop('value',e.srcElement.attributes.id.value);
	$('#bmid').prop('title',e.srcElement.attributes.title.value);
    showMenu(e.pageX, e.pageY);
	document.querySelector('#btnEdit').addEventListener('click', onClick, false);
	document.querySelector('#btnMove').addEventListener('click', onClick, false);
	document.querySelector('#btnDelete').addEventListener('click', onClick, false);
}

function onClick(e){
	var minleft = 155;
	var minbot = $(window).height() - 200;
	var xpos = e.pageX;
	var ypos = e.pageY;
	if(xpos <= minleft) xpos = minleft;
	if(ypos >= minbot) ypos = minbot;
	
	switch(this.id) {
		case 'btnEdit':
			$('#bmarkedt #edtitle').val($('#bmid').prop('title'));
			$('#bmarkedt #edurl').val($('#'+$('#bmid').prop('value')).attr('href'));
			$('#bmarkedt #edid').val($('#bmid').prop('value'));
			$('.mbmdialog').hide();
			$('.mmenu').hide();
			$("#bmarkedt").show();
			$("#bmarkedt").css('left',xpos);
			$("#bmarkedt").css('top',ypos);
			break;
		case 'btnMove':
			$('.mbmdialog').hide();
			$('.mmenu').hide();
			$("#bmamove").show();
			$('#bmamove #mvtitle').val($('#bmid').prop('title'));
			$('#bmamove #mvid').val($('#bmid').prop('value'));
			$("#bmamove").css('left',xpos);
			$("#bmamove").css('top',ypos);
			break;
		case 'btnDelete':
			delBookmark($('#bmid').prop('value'), $('#bmid').prop('title'))
			break;
		default:
			break;
	}

    hideMenu();
    document.removeEventListener('click', onClick);
}

function openMessages(element) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active", "");
	}

	document.getElementById(element.target.dataset['val']).style.display = "block";
	element.currentTarget.className += " active";
}

function delMessage(message) {
	$.ajax({
        url: document.location.href,
		type: "POST",
        data: {
            caction: 'rmessage',
            message: message.target.dataset['message'],
        },
        complete: function(r){
			if(r.responseText === "1") {
				$('.mmenu').hide();
				hideMenu();
				console.log("Notification removed.");
				location.reload();
			} else {
				alert("Error removing notification, please check server log");
			}
		}
    });
}

function eNoti(e) {
	var nval = e.target.checked;
	if(nval) {
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
			setOption("notifications",0);
		}
		else if (Notification.permission === "granted") {
			var notification = new Notification("Syncmarks", {
				body: "Notifications will be enabled for Syncmarks.",
				icon: './images/bookmarks192.png'
			});
			setOption("notifications",1);
		}
		else if (Notification.permission !== "denied") {
			Notification.requestPermission().then(function (permission) {
				if (permission === "granted") {
					var notification = new Notification("Syncmarks", {
						body: "Notifications will be enabled for Syncmarks.",
						icon: './images/bookmarks192.png'
					});
					setOption("notifications",1);
				}
			});
		}
	} else {
		setOption("notifications",0);
	}
}

function setOption(option,val) {
	$.ajax({
        url: document.location.href,
		type: "POST",
        data: {
            caction: 'soption',
			option: option,
			value: val
        },
        complete: function(r){
			if(r.responseText === "1") {
				console.log("Option saved.");
			} else {
				alert("Error saving option, please check server log");
			}
		}
    });
}

function rNot(noti) {
	$.ajax({
        url: document.location.href,
		type: "GET",
        data: "durl="+noti,
        complete: function(r){
			if(r.responseText == '1')
				console.log("Notification removed");
			else
				alert("Problem removing notification, please check server log.");
		}
    });
}

function show_noti(noti) {
	if (Notification.permission !== 'granted')
		Notification.requestPermission();
	else {
		let notification = new Notification(noti.title, {
			body: noti.url,
			icon: './images/bookmarks192.png',
			requireInteraction: true
		});
		
		notification.onclick = function() {
			window.open(noti.url);
			rNot(noti.nkey);
		};
	}
}

function getNotifications() {
	$.ajax({
        url: document.location.href,
		type: "GET",
        data: "gurls=1",
        complete: function(r){
			if(r.responseText) {
				let notifications = JSON.parse(r.responseText);
				if(notifications[0]['nOption'] == 1) {
					notifications.forEach(function(notification){
						show_noti(notification);
					});
				}
			}
		}
	});
	sessionStorage.setItem('gNoti', '1');
}