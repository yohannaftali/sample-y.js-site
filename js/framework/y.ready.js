$(document).ready(function(){
    window.webApp = new yWeb(data);
    
    M.AutoInit();

	const elemsTapTarget = document.querySelectorAll('.tap-target');
	window.instTapTarget = M.TapTarget.init(elemsTapTarget, {});

    // Dropdown
    const optionsDropdownRight = {
        inDuration: 300,
        outDuration: 225,
        constrainWidth: false,
        // hover: true,
        gutter: 0,
        belowOrigin: true,
        alignment: 'right',
        stopPropagation: false
    };
    const elemsDropdownNotification = document.getElementById('btn-notification');
    window.instDropdownNotification = M.Dropdown.init(elemsDropdownNotification, optionsDropdownRight);
    const elemsDropdownUser = document.getElementById('btn-user-menu');
    window.instDropdownUser = M.Dropdown.init(elemsDropdownUser, optionsDropdownRight);

    // Collapsible
    const elemsCollapsible = document.querySelectorAll('.collapsible-side-nav');
    const optionsCollapsible = {
        accordion: true
    };
    window.instCollapsible = M.Collapsible.init(elemsCollapsible, optionsCollapsible);
    
    $(document).off('click','.collapsible');
    $(document).off('click','.collapsible',function(){
        setTimeout(function() {
            window.instCollapsible.open();
        }, 100);
    });

    // Modal
    // var iconNotification=document.getElementById('menubar_notification_button');
    // var instNotificationIcon=M.Modal.init(iconNotification, {
    //     opacity: 0.5,
    //     inDuration: 250,
    //     outDuration: 250,
    //     preventScrolling: true,
    //     dismissible: true,
    //     startingTop: '4%',
    //     endingTop: '10%'
    // });
});

