(function (window, undefined) {

    var document = window.document;
    var location = window.location;
    var _htmlTags = new Array('a', 'aside', 'blockquote', 'body', 'br', 'button', 'caption', 'cite', 'div', 'fieldset', 'footer', 'form', 'header', 'i', 'iframe', 'img', 'input', 'label', 'li', 'marquee', 'nav', 'ol', 'option', 'p', 'script', 'section', 'span', 'table', 'td', 'th', 'tr', 'textarea', 'title', 'ui', 'var', 'video');

    //------------------------------------------------------------------------------
    // web Engine
    // Create Web Framework
    //------------------------------------------------------------------------------
    var web = function (data) {
        this.data = data;
        this.init();
        this.spotlight = true;
        this.create_click();
        this.create_wait();
        this.create_paste();
        this.createPreloader()
        this.createFormEditPassword();        
        this.initListener();
        this.instancesModal;
        this.instancesTapTarget;
        //yClock(this.getElement('y_time'));
        this.setClock(this.getElement('time-header'));
        window.yData = data;
        this.showModuleCallback(document.getElementById('btn-module-home'))
    };
    web.prototype.setClock = function(selector){
        var that = this;
        let t=this.getTime();
        selector.innerHTML=t;
        setTimeout(function(){
            that.setClock(selector);
        }, 500);
        
    }
    web.prototype.getTime = function(){
        var n=new Date();
        var h=preZero(n.getHours());
        var m=preZero(n.getMinutes());
        function preZero(i){
            var r=i<10?"0"+i:i;
            return r;
        }
        return (h+":"+m);
    }
    web.prototype.create_paste = function () {
        var paste = this.createNode('textarea', 'y_paste', document.body);
        paste.style.position = 'absolute';
        paste.style.left = '-1000px';
        paste.style.top = '-1000px';
        document.designMode = 'off';
    };
    web.prototype.create_click = function () {
        var click = this.createNode('y_click', document.body);
        click.style.display = 'none';
        click.className = '_yClick';
        document.body.onclick = function (ev) {
            var isIE = document.all;
            var p = [];
            if (ev) {
                var x = isIE ? (ev.clientX + document.body.scrollLeft) : ev.pageX;
                var y = isIE ? (ev.clientY + document.body.scrollTop) : ev.pageY;
                click.style.left = x + 'px';
                click.style.top = y + 'px';
                click.style.display = '';
                setTimeout(function () { click.style.display = 'none'; }, 200);
            }
        };
    };
    web.prototype.create_wait = function () {
        var wait = this.createNode('y-progress-bar', document.body);
        wait.innerHTML = 'please wait...';
        wait.style.display = 'none';
    };
    web.prototype.createPreloader = function(){
        yM.preloaderCircular({
            parent: 'body',
            id: 'ajax-preloader'
        })
        const obj = document.getElementById('ajax-preloader')
        obj.style.display = 'none' 
        obj.style.position = 'fixed'
        obj.style.top = '50%'
        obj.style.left = '50%'
        obj.style.marginTop = '-25px'
        obj.style.marginLeft = '-25px'
    }
    web.prototype.init = function () {
        var loaderWrapper = this.createNode('loader-wrapper', document.body);
        var loader = this.createNode('loader', loaderWrapper);
        var loaderLeft = this.createNode(loaderWrapper);
        loaderLeft.className = 'loader-section section-left';
        var loaderRight = this.createNode(loaderWrapper);
        loaderRight.className = 'loader-section section-right';
        this.createHeader();
        this.createMain();
        this.createFooter();        
        this.addNotification("<i class='material-icons tiny left'>verified_user</i><span>Login</span>", data.username + " is logged in", false, false);
        this.createNotificationBadge();
    };
    web.prototype.createSearch = function (parent) {
        // - Search
        var inputField = this.createNode('menubar_input_field', parent);
        inputField.className = 'navbar-fixed input-field gradient-45deg-red-pink yellow-text text-lighten-3';
        // -Search - Input
        var inputSearch = this.createNode('input', 'menubar_terminal', inputField);
        inputSearch.type = 'search';
        inputSearch.required = true;

        // Label Search
        var labelSearch = this.createNode('label', inputField);
        labelSearch.className = 'label-icon yellow-text text-lighten-3';
        labelSearch.setAttribute('for', 'menubar_terminal');
        // Icon Search 
        var iLabelSearch = this.createNode('i', labelSearch);
        iLabelSearch.className = 'material-icons search position-icons';
        iLabelSearch.innerHTML = 'search';
        // -Icon Close - Label
        var iconClose = this.createNode('a', 'close_search', inputField);
        iconClose.className = 'material-icons closed position-icons btn-flat';
        iconClose.innerHTML = 'close';
        //this.getElement('menubar_input_field').style.visibility='hidden';
        inputField.style.display = 'none';
    }
    web.prototype.createHeader = function () {
        const headerPage = this.createNode('header', 'header', document.body);
        headerPage.className = 'page-topbar';
        const navbarFixed = this.createNode(headerPage);
        navbarFixed.className = 'navbar-fixed';

        const navColor = this.createNode('nav', 'navColor', navbarFixed);
        navColor.className = 'nav-color gradient-45deg-blue-grey-darken';
        const navHeader = this.createNode('nav-header', navColor);
        navHeader.className = 'nav-wrapper';
        const ulLeft = this.createNode('ul', 'ulLeft', navHeader);
        ulLeft.className = 'left';
        const ulRight = this.createNode('ul', 'ulRight', navHeader);
        ulRight.className = 'right';
        const centerHeader = this.createNode('ul', 'centerHeader', navHeader);
        centerHeader.className = 'center';

        // Left
        // - btn-side-nav
        var iconMenu = this.createNavItem('btn-side-nav', 'low_priority', ulLeft);
        iconMenu.iNode.className += ' light-blue-text text-lighten-5 button-menu-utama-default';
        _('li-btn-side-nav').show();

        // - Home
        var iconHome = this.createNavItem('btn-home', 'home', ulLeft);
        iconHome.iNode.className += ' light-blue-text text-lighten-5';
        _('li-btn-home').show();
        
        // Search Icon
        var iconSearch = this.createNavItem('btn-search', 'search', ulLeft);
        iconSearch.iNode.className += ' yellow-text text-lighten-3';

        let userTitle = this.createNode('li', 'title-user', ulLeft);
        userTitle.innerHTML = data.username;
        userTitle.style.display = "none";        

        let timeHeader = this.createNode('li', 'time-header', ulLeft);
        timeHeader.innerHTML = "";
        timeHeader.style.display = "none";

        var moduleTitle = this.createNode('li', 'title-module', centerHeader);
        moduleTitle.innerHTML = "Home";
        moduleTitle.className = 'title_modul_expand';

        this.createSearch(headerPage);
        _('li-btn-search').hide();
        // Right        

        // - Notification
        var iconNotification = this.createNavItem('btn-notification', 'notifications_none', ulRight);
        iconNotification.iNode.className += ' dropdown-right white-text';
        var attrDataTargetNotification = document.createAttribute("data-target");
        attrDataTargetNotification.value = "notification-dropdown";
        var attrBelowOriginNotification = document.createAttribute("data-beloworigin");
        attrBelowOriginNotification.value = "true";
        iconNotification.aNode.setAttributeNode(attrDataTargetNotification);
        iconNotification.aNode.setAttributeNode(attrBelowOriginNotification);

        var ulNotification = this.createNode('ul', 'notification-dropdown', navHeader);
        ulNotification.className = 'dropdown-content dropdown-custom';

        // - User
        var userMenu = this.createNavItem('btn-user-menu', 'settings_applications', ulRight);
        userMenu.iNode.className += ' dropdown-right white-text';
        var attrDataTargetUser = document.createAttribute("data-target");
        attrDataTargetUser.value = "user-dropdown";
        var attrBelowOriginUser = document.createAttribute("data-beloworigin");
        attrBelowOriginUser.value = "true";
        userMenu.aNode.setAttributeNode(attrDataTargetUser);
        userMenu.aNode.setAttributeNode(attrBelowOriginUser);
         
        var ulUser = this.createNode('ul', 'user-dropdown', navHeader);
        ulUser.className = 'dropdown-content dropdown-custom';
          
        // - Username Header Right
        var iconUserName = this.createDropdownItem('menubar_UserName_button', 'person', ulUser);
        var buttonUserName = this.createNode('UserName_setting', iconUserName.aNode);
        buttonUserName.innerHTML = data.username;    
        // - Fullscreen
        var iconFullscreen = this.createDropdownItem('btn-fullscreen', 'settings_overscan', ulUser);
        var buttonFullscreen = this.createNode('fullscreen_setting', iconFullscreen.aNode);
        buttonFullscreen.innerHTML = 'Fullscreen Mode';    
        // theme setting
        var iconUserItem6 = this.createDropdownItem('user-theme-setting', 'palette', ulUser);            
        var buttonThemeSetting = this.createNode('menubar_theme_setting', iconUserItem6.aNode);
        buttonThemeSetting.innerHTML = 'Theme Setting';  
        var attrHrefTheme = document.createAttribute("href");
        attrHrefTheme.value = "#test_modal_euy";
        iconUserItem6.aNode.setAttributeNode(attrHrefTheme);  
        iconUserItem6.aNode.className += ' waves-effect waves-light modal-trigger'; 
        // Support setting
        var iconSupportItem6 = this.createDropdownItem('Support-Support-setting', 'help', ulUser);            
        var buttonSupportSetting = this.createNode('menubar_Support_setting', iconSupportItem6.aNode);
        buttonSupportSetting.innerHTML = 'Support Apps';  
        var attrHrefSupport = document.createAttribute("href");
        attrHrefSupport.value = "http://itsupport.ptsenopati.com/open.php";
        iconSupportItem6.aNode.setAttributeNode(attrHrefSupport);  
        iconSupportItem6.aNode.className += ' waves-effect waves-light modal-trigger'; 
        // Change Password
        var iconUserItem2 = this.createDropdownItem('user-change-password', 'lock', ulUser);                
        var buttonChangePassword = this.createNode('y_user_menu', iconUserItem2.aNode);
        buttonChangePassword.innerHTML = 'Change Password';
        var attrHrefChangePassword = document.createAttribute("href");
        attrHrefChangePassword.value = "#modal-form-change-password";
        iconUserItem2.aNode.setAttributeNode(attrHrefChangePassword);
        iconUserItem2.aNode.className += ' waves-effect waves-light modal-trigger';        
        // Logout
        var iconUserItem5 = this.createDropdownItem('btn-logout', 'exit_to_app', ulUser);                
        let buttonLogout = this.createNode('menubar_logout_button', iconUserItem5.aNode);
        buttonLogout.className += ' red-text text-lighten-3';
        buttonLogout.innerHTML = 'Logout';
    };
    web.prototype.createMain = function () {
        var mainPage = this.createNode('main', document.body);
        mainPage.className = 'main-full grey lighten-5 zzz';

        var sidebar = this.createNode('aside', 'side-nav', mainPage);
        sidebar.className = 'nav-collapsible nav-collapsed gradient-90deg-blue-grey-darken white-text';

        var sideNavCollapsible = this.createNode('ul', 'side-nav-collapsible', sidebar);
        sideNavCollapsible.className = "collapsible collapsible-side-nav panel_sidebar";

        this.addSidebarItem(sideNavCollapsible, data.modules);

        $('.side-nav-body').attr('data-collapsible', 'accordion');

        var moduleSection = this.createNode('section', 'module-section', mainPage);
        moduleSection.className = 'content-expanded';
    };
    web.prototype.addSidebarListGroup = function (parent, title, icon, child) {
        var h = title === null ? yHtml(child) : yHtml([
            {
                element: 'li', class: 'side-nav-group no-padding', content: yHtml([
                    {
                        element: 'a', class: 'side-nav-header sidebar_item collapsible-header waves-effect waves-cyan bold', content: yHtml([
                            { element: 'i', class: 'material-icons', content: icon },
                            { element: 'span', content: title }
                        ])
                    },
                    {
                        element: 'div', class: 'side-nav-body collapsible-body blue-grey darken-3', content: yHtml(
                            { element: 'ul', content: yHtml(child) }
                        )
                    }
                ])
            }
        ]);
        parent.innerHTML += h;
    }
    web.prototype.addSidebarItem = function (parent, modules) {
        var lastModuleGroup = '';
        let moduleIcon = '';
        let groupIcon = '';
        var c = [];
        for (var i in modules) {
            if (i == 0) {
                moduleIcon = typeof modules[i].module_icon != 'undefined' ? modules[i].module_icon : 'folder_open';
                groupIcon = typeof modules[i].group_icon != 'undefined' ? modules[i].group_icon : 'folder_open';
            }
            moduleGroup = typeof modules[i].group != 'undefined' ? modules[i].group : false;
            if (lastModuleGroup != '' && lastModuleGroup != moduleGroup) {
                this.addSidebarListGroup(parent, lastModuleGroup, groupIcon, c);
                c = [];
                moduleIcon = typeof modules[i].module_icon != 'undefined' ? modules[i].module_icon : 'folder_open';
                groupIcon = typeof modules[i].group_icon != 'undefined' ? modules[i].group_icon : 'folder_open';
            }

            moduleName = typeof modules[i].name != 'undefined' ? modules[i].name : false;
            moduleLabel = typeof modules[i].label != 'undefined' ? modules[i].label : false;
            moduleIcon = typeof modules[i].module_icon != 'undefined' ? modules[i].module_icon : false;
            c.push({
                element: 'li', class: 'btn-module', id: 'btn-module-' + moduleName, mod: moduleName, ico: moduleIcon, lab: moduleLabel, content: yHtml([
                    {
                        element: 'a', class: 'side-nav-item waves-effect waves-light', content: yHtml([
                            { element: 'i', class: 'material-icons', content: modules[i].module_icon },
                            { element: 'span', content: moduleLabel }
                        ])
                    }
                ])
            });
            lastModuleGroup = moduleGroup;
        }
        this.addSidebarListGroup(parent, lastModuleGroup, groupIcon, c);
    }
    web.prototype.initSidebar = function () {
        var elems = document.querySelectorAll('.collapsible');
        var instances = M.Collapsible.init(elems, {
            accordion: false
        });
        $(document).off('click', '.collapsible');
        $(document).off('click', '.collapsible', function () {
            setTimeout(function () {
                instances.open();
            }, 100);
        });

    };
    web.prototype.createFooter = function () {
        var footerPage = this.createNode('footer', document.body);
        footerPage.className = 'page-footer footer-fixed gradient-45deg-indigo-blue';
        var footerText = this.createNode('div', 'center', footerPage);
        footerText.className = 'col s12 center';
        footerText.innerHTML = data.footer;


    };
    web.prototype.html = function (id, h) {
        // Alias of innerHTML
        if (typeof (id) !== 'undefined' && this.getElement(id) !== 'null') {
            this.getElement(id).innerHTML = h;
        }
    };
    web.prototype.getElement = function (param) {
        var result;
        if (typeof param === 'string') {
            var type = param.substring(0, 1);
            var name = param.substring(1);
            switch (type) {
                case '#':
                    result = document.getElementById(name);
                    break;
                case '.':
                    result = document.getElementsByClassName(name);
                    result.__isClass = result !== null ? true : false;
                    break;
                default:
                    result = document.getElementById(param);
                    break;
            }
        } else if (typeof param === 'object') {
            result = param;
        } else {
            result = window;
        }
        return result;
    };
    web.prototype.createNode = function (a, b, c) {
        // _createNode(parent element) => <div></div>
        // _createNode(id, parent element) => <div id='id'></div>
        // _createNode(tag, parent element) => <tag></tag>
        // _createNode(tag, id, parent element) => <tag id='id'></tag> 

        var tag, id, parent;
        var with_id = true;
        if (typeof c === 'undefined') {
            if (typeof b === 'undefined') {
                tag = 'div';
                parent = a;
                with_id = false;
            }
            else {
                if (_htmlTags.includes(a)) {
                    tag = a;
                    parent = b;
                    with_id = false;
                }
                else {
                    tag = 'div';
                    id = a;
                    parent = b;
                }
            }
        }
        else {
            tag = a;
            id = b;
            parent = c;
        }
        var element = document.createElement(tag);
        if (with_id) { element.id = id; }
        parent.appendChild(element);
        return element;
    };
    web.prototype.createNavItem = function (id, icon, parent) {
        var res = {};
        list = this.createListItem('a', id, parent);
        list.aNode.className = 'btn-nav-item waves-effect waves-light btn-floating';
        var iNode = this.createNode('i', 'i-' + id, list.aNode);
        iNode.className = 'material-icons';
        iNode.innerHTML = icon;
        res.lNode = list.lNode;
        res.aNode = list.aNode;
        res.iNode = iNode;
        return res;
    };
    web.prototype.createDropdownItem = function (id, icon, parent) {
        var res = {};
        list = this.createListItem('a', id, parent);
        list.aNode.className = 'dropdown-custom-size';
        var iNode = this.createNode('i', list.aNode);
        iNode.className = 'material-icons';
        iNode.innerHTML = icon;
        res.lNode = list.lNode;
        res.aNode = list.aNode;
        res.iNode = iNode;
        return res;
    };
    web.prototype.createNotificationBadge = function (){
        $('#li-btn-notification').append(
            yM.div({
                id: 'notification-badge',
                class: 'notification-badge',
                content: '0'
            }
        ));
        this.hideNotificationBadge();
    }
    web.prototype.showNotificationBadge = function (val){
        val = typeof val !== 'undefined' ? val: parseInt($('#notification-badge').text()) + 1;

        $('#notification-badge').text(val);
        $('#notification-badge').show();
    }
    web.prototype.hideNotificationBadge = function (){
        $('#notification-badge').text('0');
        $('#notification-badge').hide();
    }
    web.prototype.addNotification = function (title, message, toast, pulse, time) {
        toast = typeof (toast) !== 'undefined' ? toast : true;
        pulse = typeof (pulse) !== 'undefined' ? pulse : true;
        time = typeof (time) !== 'undefined' ? time : yGetTimeStamp();

        var c = yHtml([
            {
                element: 'li', class: 'card', content: yHtml([
                    {
                        element: 'div', class: 'card-content', content: yHtml([
                            { element: 'p', class: 'card-title', content: title },
                            { element: 'p', class: 'timestamp', content: time },
                            { element: 'p', content: message }
                        ])
                    }
                ])
            }
        ]);
        $('#notification-dropdown').prepend(c);
        if (pulse) {
            this.getElement('btn-notification').classList.add('pulse')
        }
        if (toast) {
            M.toast({ html: message, classes: 'rounded' });
            setTimeout(function () {
                M.Toast.dismissAll();
            }, 2000);
        }
        this.showNotificationBadge();
    };
    web.prototype.createNotification = function (id, icon, parent) {
        var res = {};
        list = this.createListItem('a', id, parent);
        list.aNode.className = 'waves-effect waves-light btn-flat modal-trigger';
        var iNode = this.createNode('i', list.aNode);
        iNode.className = 'material-icons';
        iNode.innerHTML = icon;
        res.lNode = list.lNode;
        res.aNode = list.aNode;
        res.iNode = iNode;
        return res;
    };
    web.prototype.initListener = function () {
        const that = this;
       
        // Variable search
        var searchInput = this.getElement('menubar_terminal');
        var searchField = this.getElement('menubar_input_field');
        var searchButton = this.getElement('btn-search');
        
        this.listenerModuleSection()
        this.listenerSideNavButton()   
        this.listenerHomeButton()
        this.listenerFullscreenButton()
        this.listenerNotificationButton()
        this.listenerLogoutButton()
        this.listenerModuleButton()
        
        // Button Search
        $('#btn-search').click(function () {
            if (searchField.style.display == 'block') {
                searchField.style.display = 'none';
                searchInput.value = '';
                that.showModuleIcon(data.modules);
            }
            else {
                searchField.style.display = 'block';
                searchInput.focus();
            };
        });

        // Button Close Search
        $('#close_search').click(function () {
            searchField.style.display = 'none';
            searchInput.value = '';
        })

        // Button User
        $(document).on('click', '#menubar_user_info', function () {
            if ($('.y_user_menu').css('display') == 'block') {
                $('.y_user_menu').hide();
                that.spotlight = true;
            }
            else {
                $('.y_user_menu').show();
                that.spotlight = false;
            }
        });

        var elemsModal = document.querySelectorAll('.modal');
        this.instancesModal = M.Modal.init(elemsModal, {});
        var elemsTapTarget = document.querySelectorAll('.tap-target');
        this.instancesTapTarget = M.TapTarget.init(elemsTapTarget, {});
    }
    web.prototype.listenerModuleSection = function(){
        _('#side-nav').on('click', '.side-nav-item', () => {
            this.toggleModuleSection()
        })
    }
    web.prototype.listenerSideNavButton = function(){
        _('#header').on('click', 'btn-side-nav', () => {
            this.toggleSideNav()
        })
    }
    web.prototype.listenerHomeButton = function() {
        _('#header').on('click', 'btn-home', () => {
            this.showModuleCallback(document.getElementById('btn-module-home'))
        })
    }
    web.prototype.listenerNotificationButton = function(){
        _('#header').on('click', 'btn-notification', () => {
            this.getElement('btn-notification').classList.remove('pulse')
            this.hideNotificationBadge();
        })
    }
    web.prototype.listenerFullscreenButton = function(){
        _('#header').on('click', 'btn-fullscreen', () => {
            this.toggleFullScreen()
        })
    }
    web.prototype.listenerLogoutButton = function(){
        const url_logout = 'C_home/logout';
        const moduleSection = this.getElement('module-section');
        _('#header').on('click', 'btn-logout', () => {
            moduleSection.innerHTML = ''
            window.location = url_logout
        })
    }
    web.prototype.listenerModuleButton = function () {
        const that = this
        _('#side-nav').on('click', '.btn-module', function(e) {
            e.preventDefault()
            M.Toast.dismissAll()
            const withAlert = that.isFormFilled()
            if (withAlert) {
                that.showAlertExitModule(this)
            }
            else {
                that.showModuleCallback(this)
                // that.toggleSideNav()
            }
        })
    }
    web.prototype.toggleModuleSection = function(){
        $("#side-nav").removeClass('nav-expanded')
        $("#side-nav").addClass('nav-collapsed')

        $("#i-btn-side-nav").removeClass('button-menu-utama')
        $("#i-btn-side-nav").addClass('button-menu-utama-default')
        _('li-btn-home').show();
    }
    web.prototype.toggleSideNav = function(){
        const sideNav = this.getElement("side-nav")
        const moduleSection = this.getElement("module-section")
        const iSideNavButton = this.getElement("i-btn-side-nav")
        const navItemMenu = this.getElement('i-btn-side-nav')
        sideNav.classList.toggle('nav-expanded')
        sideNav.classList.toggle('nav-collapsed')
        sideNav.classList.toggle('title_modul_expand')
        sideNav.classList.toggle('title_modul_collapse')
        moduleSection.classList.toggle('content-expanded')
        moduleSection.classList.toggle('content-expanded')
        iSideNavButton.classList.toggle('button-menu-utama')
        iSideNavButton.classList.toggle('button-menu-utama-default')
        navItemMenu.innerText = navItemMenu.innerText == 'low_priority' ? 'low_priority' : 'low_priority'
        _('#li-btn-home').toggle()
        
    }
    web.prototype.serializeForm = function(formModule){
        var serialized = [];
        if(typeof formModule !== 'undefined' && formModule !== null  && typeof formModule.elements !== 'undefined'){
            for (var i = 0; i < formModule.elements.length; i++) {
                var field = formModule.elements[i];
                if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue;
                if (field.type === 'select-multiple') {
                    for (var n = 0; n < field.options.length; n++) {
                        if (!field.options[n].selected) continue;
                        serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.options[n].value));
                    }
                }
                else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                    serialized.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
                }
            }
            return serialized.join('&');
        }
    }
    web.prototype.hasClass = function(element, selector){
        let className = " " + selector + " "
        if ( (" " + element.className + " " ).replace(/[\t\r\n\f]/g, " ").indexOf(className) >= 0 ){ return true }
        else return false
    }
    web.prototype.isFormFilled = function(){
        let formModule = document.querySelector('.form-module');
        if(typeof formModule !== 'undefined' && formModule !== null  && typeof formModule.elements !== 'undefined'){
            for (var i = 0; i < formModule.elements.length; i++) {
                var field = formModule.elements[i];
                if(this.hasClass(field, 'ignore-filled')) continue;
                if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button' || field.type === 'select-one' || field.className === 'select-dropdown dropdown-trigger' || field.type === 'hidden' || field.type === 'search') continue;
                if (field.type === 'select-multiple') {
                    for (var n = 0; n < field.options.length; n++) {
                        if (!field.options[n].selected) continue;
                        if(field.options[n].value) {
                            return true;
                        }
                    }
                }
                else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                    if(field.value != ''){
                        return true
                    }
                }
            }
        }
        return false;
    }
    web.prototype.guid = function(){  
        let r = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
        return (r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r());
    }
    web.prototype.showAlertExitModule = function(selector){
        const that = this
        const toastExitModule = 
            yM.span({
                class: 'span-toast',
                content: "Data belum disubmit, anda yakin untuk keluar dari modul ini ?"
            }) + 
            yM.buttonFlat({
                id: 'btn-cancel-exit-module',
                class: 'toast-action',
                content: 'Tidak'
            }) +
            yM.buttonFlat({
                id : 'btn-confirm-exit-module',
                class: 'toast-action',
                content: 'Iya'
            })
        
        const instanceToast = M.toast({
            html: toastExitModule,
            displayLength: 20000
        })
        $('#btn-confirm-exit-module').focus()
        
        $($('#btn-confirm-exit-module').parent()).off('drag')
        
        //console.log(instanceToast)
        $('body').off('click', '#btn-cancel-exit-module')
        $('body').on('click', '#btn-cancel-exit-module', function (e) {
            e.preventDefault()
            instanceToast.dismiss()
        });
        $('body').off('click', '#btn-confirm-exit-module')
        $('body').on('click', '#btn-confirm-exit-module', function (e) {
            e.preventDefault()
            instanceToast.options.completeCallback = () => {
                that.showModuleCallback(selector)
            }
            instanceToast.dismiss()
            // that.toggleSideNav()
        });
    }
    web.prototype.showModuleCallback = function(selector){
        const modName = $(selector).attr('mod')
        const modLabel = $(selector).attr('lab')
        $('.btn-module').removeClass('active')
        $(selector).addClass('active')
        $('#title-module').html(modLabel)
        if (modName != 'home') {
            window.yData.moduleOption = {}
            this.createModule(modName);
        }
        else {
            this.createDashboard();
        }
    }
    web.prototype.hideModuleIcon = function (module_list) {
        for (var i in module_list) {
            var mod = module_list[i];
            var name = mod.name;
            if (name != 'home') {
                var button = this.getElement('wrapper_button_module_' + name);
                button.style.display = 'none';
            }
        }
    };
    web.prototype.showModuleIcon = function (module_list) {
        for (var i in module_list) {
            var mod = module_list[i];
            var name = mod.name;
            if (name != 'home') {
                var button = this.getElement('wrapper_button_module_' + name);
                button.style.display = 'block';
            }
        }
    };
    web.prototype.sortModuleIcon = function (param, module_list) {
        var result = [];
        var index = 0;
        if (param !== '') {
            for (var i in module_list) {
                var mod = module_list[i];
                var label = mod.label;
                if (name != 'home') {
                    var similar = false;
                    var a = param.toLowerCase();
                    var b = label.toLowerCase();
                    if (a.length < b.length) {
                        b = b.substring(0, a.length);
                    }
                    if (a == b) { similar = true; }
                    c = label.toLowerCase().split(' ');
                    for (var j in c) {
                        b = c[j];
                        if (a.length < b.length) b = b.substring(0, a.length);
                        if (a == b) similar = true;
                    }
                    if (similar) {
                        result[index] = module_list[i];
                        index++;
                    }
                }
            }
        }
        else {
            result = module_list;
        }
        return result;
    };
    web.prototype.hideButtonSearch = function () {
        _('menubar_input_field').hide();
        searchInput.value = '';
        that.hideModuleIcon(data.modules);
    };
    web.prototype.createDashboard = function () {
        var that = this;
        var dashboard = this.data.dashboard;
        var url_button = 'C_dashboard_' + dashboard + '/index';
        var success = function (h) {
            if (typeof h.secure !== 'undefined' && h.secure !== '' && typeof h.secure.dashboard !== 'undefined' && h.secure.dashboard !== '' && typeof h.secure.access !== 'undefined' && h.secure.access === true && h.secure.login !== 'undefined' && h.secure.login === true) {
                var moduleSection = that.getElement('module-section');
                var modulePanel = yHtml({ element: 'div', id: 'module-panel', class: 'wrapper', content: '' });
                var script = document.createElement('script');
                script.setAttribute('src', window.location.origin + '/js/dashboard/v.' + dashboard + '.js');
                script.type = "text/javascript";
                moduleSection.innerHTML = modulePanel;
                moduleSection.appendChild(script);
                moduleSection.style.display = 'block';
            }
            else {
                window.location = 'C_login';
            }
        };
        var complete = function (){};
        var error = function (){};
        var jsonError = function (e) {
            window.location = 'C_login';
        };
        getAjax(url_button, '', success, complete, error, jsonError);
    };
    web.prototype.createModule = function (mod_name) {
        var that = this;
        var url_button = 'C_' + mod_name + '/index';
        // const trigger = document.getElementById('btn-module-'+mod_name)
        // const modIcon = trigger.getAttribute('ico')
        // const modLabel = trigger.getAttribute('lab')
        var success = function (h) {
            if (typeof h.secure !== 'undefined' && h.secure !== '' && typeof h.secure.module !== 'undefined' && h.secure.module !== '' && typeof h.secure.access !== 'undefined' && h.secure.access === true && h.secure.login !== 'undefined' && h.secure.login === true) {
                window.yData.module = mod_name;
                // window.yData.icon = modIcon;
                // window.yData.label = modLabel;
                var moduleSection = that.getElement('module-section');
                var modulePanel = yHtml({ element: 'div', id: 'module-panel', class: 'wrapper', content: '' });
                var script = document.createElement('script');
                script.setAttribute('src', window.location.origin + '/js/modules/v.' + h.secure.module + '.js');
                script.type = "text/javascript";
                moduleSection.innerHTML = modulePanel;
                moduleSection.appendChild(script);
                moduleSection.style.display = 'block';
            }
            else {
                window.location = 'C_login';
            }
        };
        var complete = function () { };
        var error = function () { };
        var jsonError = function (e) {
            window.location = 'C_login';
        };
        getAjax(url_button, '', success, complete, error, jsonError);
    };
    web.prototype.createFormEditPassword = function () {
        var that = this;
        let username = typeof this.data.username !== 'undefined' ? this.data.username : '';

        var h = yM.modalForm({
            id: 'modal-form-change-password',
            form: { id: 'form-change-password' },
            title: 'Change Password',
            field: [
                { label: 'Username', class: 'col s12', isHide: true, input: { id: 'input-username', name: 'u', autocomplete: "username", } },
                { label: 'Old Password', class: 'col s12', input: { id: 'input-current-password', name: 'c', autocomplete: "current-password", class: 'validate input-change-password', type: 'password' } },
                { label: 'New Password', class: 'col s12', input: { id: 'input-new-password', name: 'n', autocomplete: "new-password", class: 'validate input-change-password', type: 'password' } },
                { label: 'New Password Confirmation', class: 'col s12', input: { id: 'input-new-password-confirmation', name: 'f', autocomplete: "new-password", class: 'validate input-change-password', type: 'password' } },
            ],
            button: [
                { id: 'cancel-new-password', class: 'modal-close waves-effect waves-green btn-flat', content: 'Cancel' },
                { id: 'submit-new-password', class: 'modal-close waves-effect waves-green btn-flat', content: 'Submit' }
            ]
        })
        document.body.innerHTML += h;
        $('#input-current-password').focus();
        $(document).off('click', '#submit-new-password');
        $(document).on('click', '#submit-new-password', function (event) {
            event.preventDefault();
            target = 'C_home/call_change_password';
            var parameter = $('#form-change-password').serialize();
            var callback = function (status) {
                var title = yHtml({ element: 'i', class: 'material-icons tiny left', content: 'person' });
                title += yHtml({ element: 'span', content: 'Password' });
                y_show_ajax_result(status, false, title);
                $('.input-change-password').val('');
            };
            postAjax(target, parameter, callback);
        });
    };    
    web.prototype.session_check = function () {
        var callback = function (result) {
            var session;
            if (result) { session = result; }
            y_wait_hide();
            if (!session) {
                window.location = 'C_home/logout';
            }
            else {
                return true;
            }
        };
        getAjaxText('C_home/get', '', callback);
    };
    web.prototype.gradArray = new Array(
        'gradient-45deg-amber-amber white-text',
        'gradient-45deg-indigo-purple white-text',
        'gradient-45deg-brown-brown	 white-text',
        'gradient-45deg-red-pink white-text',
        'gradient-45deg-light-blue-cyan white-text',
        'gradient-45deg-light-blue-teal blue-text text-darken-4',
        'gradient-45deg-green-teal white-text',
        'gradient-45deg-purple-amber white-text',
        'gradient-45deg-light-blue-indigo blue-text text-darken-4',
        'gradient-45deg-orange-deep-orange yellow-text text-darken-4',
        'gradient-45deg-light-green-amber teal-text text-darken-4',
        'gradient-45deg-purple-pink red-text text-darken-4'
    );
    web.prototype.toggleFullScreen = function () {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (document.documentElement.requestFullScreen) {
                document.documentElement.requestFullScreen();
            } else if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            } else if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
    }
    web.prototype.createListItem = function (a, b, c) {
        // listItem(parent) => <li><div></div></li>
        // listItem(id, parent) => <li><<div id='id'></div></li>
        // listItem(tag, parent) => <li><tag></tag></li>
        // listItem(tag, id, parent) => <li><tag id='id'></tag></li>
        var res = {}
        var item = false;
        var list = false;
        if (typeof c === 'undefined') {
            if (typeof b === 'undefined') {
                list = this.createNode('li', a);
                item = this.createNode(list);
            }
            else {
                list = this.createNode('li', b);
                item = this.createNode(a, list);
            }
        }
        else {
            list = this.createNode('li', 'li-' + b, c);
            item = this.createNode(a, b, list);
        }
        res.aNode = item;
        res.lNode = list;
        return res;
    };
    if (typeof window === 'object' && typeof window.document === 'object') {
        window.yWeb = web;
    }
})(window);
