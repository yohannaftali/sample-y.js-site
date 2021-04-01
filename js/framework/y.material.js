(function (window, undefined) {
    var document = window.document;
    var location = window.location;
    var Material = function () { }

    // Base Function
    Material.prototype.o = function (p) {
        p = typeof (p) !== 'undefined' ? p : {};
        if(typeof p.overrideClass !== 'undefined'){
            p.class =  p.overrideClass;
            delete p.overrideClass;
        }
        if (typeof (p) !== 'object') {  let content = p; p = { content: content }   }
        return p;
    }

    Material.prototype.m = function (p) {
        // mandatory element and content
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'div';
        if (typeof (p.addClass) !== 'undefined') {
            p.class = typeof (p.class) !== 'undefined' ? p.class : '';
            p.class += typeof (p.addClass) !== 'undefined' ? ' ' + p.addClass : '';
        }
        // Handle listener
        var c = typeof (p.onClick) !== 'undefined' ? p.onClick : false;
        var m = typeof (p.module) !== 'undefined' ? p.module : false;
        if (c || m) {
            // Give id for listener
            p.id = typeof (p.id) !== 'undefined' ? p.id : 'obj-material-' + this.guid();
            if (c) {
                $('body').on('click', '#' + p.id, p.onClick);
                delete p.onClick;
            }
            if (m) {
                $('body').on('click', '#' + p.id, function () {
                    $('#button-module-' + m).click();
                });
            }
        }
        var helperClass = {
            isActive: 'active',
            isDisable: 'disabled',
            isDisabled: 'disabled',
            isReadonly: 'readonly',
            isBig: 'big',
            isSmall: 'small',
            isCircle: 'circle',
            isHoverable: 'hoverable',
            isTruncate: 'truncate',
            isHide: 'hide',
            isLeftAlign: 'left-align',
            isRightAlign: 'right-align',
            isCenterAlign: 'center-align',
            isVerticalAlign: 'valign-wrapper',
            isBrowserDefault: 'browser-default',
            isLeft: 'left',
            isRight: 'right',
            isHideOnSmallOnly: 'hide-on-small-only',
            isHideOnMedOnly: 'hide-on-med-only',
            isHideOnMedAndDown: 'hide-on-med-and-down',
            isHideOnMedAndUp: 'hide-on-med-and-up',
            isHideOnLargeOnly: 'hide-on-large-only',
            isShowOnSmall: 'show-on-small',
            isShowOnMedium: 'show-on-medium',
            isShowOnLarge: 'show-on-Large',
            isShowOnMediumAndUp: 'show-on-medium-and-up',
            isShowOnMediumAndDown: 'show-on-medium-and-down',
            isPrefix: 'prefix',
            isPulse: 'pulse',
            isScaledIn: 'scale-transition',
            isScaledOut: 'scale-transition scale-out'
        }
        for (var i in helperClass) {
            if (typeof p[i] !== 'undefined') {
                p.class += p[i] ? ' ' + helperClass[i] : '';
                delete p[i];
            }
        }
        if (typeof (p.zDepth) !== 'undefined' && p.zDepth > 0 && p.zDepth <= 5) {
            p.class += ' z-depth-' + p.zDepth;
            delete p.zDepth;
        }
        var parent = typeof (p.parent) !== 'undefined' ? p.parent : false;
        if (parent) {
            delete p.parent;
        }
        var h = yHtml(p);
        if (parent) { $(parent).append(h); }
        return h;
    }
    Material.prototype.c = function (p, cl) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? cl + ' ' + p.class : cl;
        return this.m(p);
    }
    Material.prototype.e = function (p, el) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : el;
        return this.m(p);
    }

	Material.prototype.setInputValue = function (selector, value) {
        value = typeof (value) !== 'undefined' && value !== '' ? value : '';
        $(selector).val(value)
        if($(selector).is("select")){
            $(selector).change();
            $(selector).siblings('input.select-dropdown.dropdown-trigger').val(value);
            $(selector).siblings('input.select-dropdown.dropdown-trigger').change();
        }
        if($(selector).is(':checkbox'))
        {
            if(typeof value !== "boolean"){
                if(typeof value === 'string' && value.toLowerCase() === 'true'){
                    value = true    
                }
                if(typeof value === 'string' && value.toLowerCase() === 'false'){
                    value = false    
                }
                if(typeof variable !== 'boolean'){
                    value = parseInt(value) > 0 ? true : false
                }   
            }
            $(selector).prop("checked", value)
            if(!value){
                $(selector).removeAttr('checked')
            }
            else{
                $(selector).attr('checked', 'checked')
            }
        }
		if (value !== '') {
			$(selector).siblings('label').addClass('active');
		}
		else {
			$(selector).siblings('label').removeClass('active');
        }
	};
	Material.prototype.setTextValue = function (selector, value) {
		if (typeof (value) !== 'undefined' && value !== '') {
			$(selector).text(value);
			$(selector).siblings('label').addClass('active');
		}
		else {
			$(selector).text('');
			$(selector).siblings('label').removeClass('active');
		}
	};

    Material.prototype.guid = function () {
        let r = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
        return (r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r());
    }

    // Html Element
    Material.prototype.div = function (p) { return this.e(p, 'div'); }
    Material.prototype.i = function (p) { return this.e(p, 'i'); }
    Material.prototype.nav = function (p) { return this.e(p, 'nav'); }
    Material.prototype.divider = function (p) { return this.e(p, 'divider'); }
    Material.prototype.form = function (p) { return this.e(p, 'form'); }
    Material.prototype.section = function (p) { return this.e(p, 'section'); }
    Material.prototype.aside = function (p) { return this.e(p, 'aside'); }
    Material.prototype.ul = function (p) { return this.e(p, 'ul'); }
    Material.prototype.li = function (p) { return this.e(p, 'li'); }
    Material.prototype.h1 = function (p) { return this.e(p, 'h1'); }
    Material.prototype.h2 = function (p) { return this.e(p, 'h2'); }
    Material.prototype.h3 = function (p) { return this.e(p, 'h3'); }
    Material.prototype.h4 = function (p) { return this.e(p, 'h4'); }
    Material.prototype.h5 = function (p) { return this.e(p, 'h5'); }
    Material.prototype.h6 = function (p) { return this.e(p, 'h6'); }
    Material.prototype.blockquote = function (p) { return this.e(p, 'blockquote'); }
    Material.prototype.p = function (p) { return this.e(p, 'p'); }
    Material.prototype.table = function (p) { return this.e(p, 'table'); }
    Material.prototype.caption = function (p) { return this.e(p, 'caption'); }
    Material.prototype.thead = function (p) { return this.e(p, 'thead'); }
    Material.prototype.tbody = function (p) { return this.e(p, 'tbody'); }
    Material.prototype.tfoot = function (p) { return this.e(p, 'tfoot'); }
    Material.prototype.tr = function (p) { return this.e(p, 'tr'); }
    Material.prototype.th = function (p) { return this.e(p, 'th'); }
    Material.prototype.td = function (p) { return this.e(p, 'td'); }
    Material.prototype.textarea = function (p) { return this.e(p, 'textarea'); }
    Material.prototype.span = function (p) { return this.e(p, 'span'); }
    Material.prototype.canvas = function (p) { return this.e(p, 'canvas'); }
    
    // Class
    Material.prototype.row = function (p) { return this.c(p, 'row'); }
    Material.prototype.col = function (p) { return this.c(p, 'col'); }
    Material.prototype.modal = function (p) { return this.c(p, 'modal'); }
    Material.prototype.modalContent = function (p) { return this.c(p, 'modal-content'); }
    Material.prototype.modalFooter = function (p) { return this.c(p, 'modal-footer'); }
    Material.prototype.flowText = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'p';
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' flow-text' : 'flow-text';
        return this.m(p);
    }
    Material.prototype.tabs = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'ul';
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' tabs' : 'tabs';
        return this.m(p);
    }
    Material.prototype.tab = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'li';
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' tab' : 'tab';
        return this.m(p);
    }

    // Input
    Material.prototype.input = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'input';
        p.type = typeof (p.type) !== 'undefined' ? p.type : 'text';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }
    Material.prototype.label = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'label';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }
    Material.prototype.inputCheckbox = function(p){
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'label';
        p.class = typeof (p.class) !== 'undefined' ? 'label-checkbox ' + p.class : 'label-chekcbox';
    
        // Checkbox
        let pCheckbox = {}
        if(typeof p.checkbox !== 'undefined'){
            pCheckbox = p.checkbox;
            delete p.checkbox;
        }
        // Checkbox - id
        if (typeof p.idCheckbox !== 'undefined') {
            pCheckbox.id = p.idCheckbox;
            delete p.idCheckbox;
        }
        if (typeof pCheckbox.id === 'undefined' && typeof p.id !== 'undefined') {
            pCheckbox.id = p.id;
            delete p.id;
        }
        pCheckbox.id = typeof (pCheckbox.id) !== 'undefined' ? pCheckbox.id : 'checkbox-' + this.guid();
        // Checkbox - name
        if (typeof p.nameCheckbox !== 'undefined') {
            pCheckbox.name = p.nameCheckbox;
            delete p.nameCheckbox;
        }
        if (typeof pCheckbox.name === 'undefined' && typeof p.name !== 'undefined') {
            pCheckbox.name = p.name;
            delete p.name;
        }
        if (typeof p.addClassCheckbox !== 'undefined') {
            pCheckbox.addClass = p.addClassCheckbox;
            delete p.addClassCheckbox;
        }
        let checkbox = this.checkbox(pCheckbox);

        // Span
        var span = '';
        if (typeof (p.span) !== 'undefined') {
            span = this.span(p.span);
            delete p.span;
        }
        if (typeof (p.label) !== 'undefined') {
            span = this.span(p.label);
            delete p.label;
        }

        p.content = checkbox + span;
        return this.m(p);
    }
    Material.prototype.checkbox = function(p){
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'input';
        p.type = typeof (p.type) !== 'undefined' ? p.type : 'checkbox';
        p.class = typeof (p.class) !== 'undefined' ? p.class : 'filled-in';
        p.checked = typeof (p.checked) !== 'undefined' ? p.checked : 'checked';
        return this.m(p);
    }
    Material.prototype.inputRadio = function(p){
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'label';
        p.class = typeof (p.class) !== 'undefined' ? 'label-radio ' + p.class : 'label-radio';
        let guid = this.guid();
        // Radio
        let pRadio = {}
        if(typeof p.checkbox !== 'undefined'){
            pRadio = p.radio;
            delete p.radio;
        }

        // Radio - value
        if (typeof p.valueRadio !== 'undefined') {
            pRadio.value = p.valueRadio;
            delete p.valueRadio;
        }
        if (typeof pRadio.value === 'undefined' && typeof p.value !== 'undefined') {
            pRadio.value = p.value;
            delete p.value;
        }
        pRadio.value = typeof (pRadio.value) !== 'undefined' ? pRadio.value : 'value-radio-' + guid;

        // Radio - id
        if (typeof p.idRadio !== 'undefined') {
            pRadio.id = p.idRadio;
            delete p.idRadio;
        }
        if (typeof pRadio.id === 'undefined' && typeof p.id !== 'undefined') {
            pRadio.id = p.id;
            delete p.id;
        }
        pRadio.id = typeof (pRadio.id) !== 'undefined' ? pRadio.id : 'radio-' + guid

        // Radio - name
        if (typeof p.nameRadio !== 'undefined') {
            pRadio.name = p.nameRadio;
            delete p.nameCheckbox;
        }
        if (typeof pRadio.name === 'undefined' && typeof p.name !== 'undefined') {
            pRadio.name = p.name;
            delete p.name;
        }
    
        if (typeof p.addClassRadio !== 'undefined') {
            pRadio.addClass = p.addClassRadio;
            delete p.addClassRadio;
        }
        let radioElement = this.radio(pRadio);

        // Span
        var span = '';
        if (typeof (p.span) !== 'undefined') {
            span = this.span(p.span);
            delete p.span;
        }
        if (typeof (p.label) !== 'undefined') {
            span = this.span(p.label);
            delete p.label;
        }

        p.content = radioElement + span;
        return this.m(p);
    }
    Material.prototype.radio = function(p){
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'input';
        p.type = typeof (p.type) !== 'undefined' ? p.type : 'radio';
        return this.m(p);
    }
    Material.prototype.characterCounter = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? 'character-counter ' + p.class : 'character-counter';
        p.style = typeof (p.style) !== 'undefined' ? p.style : 'float: right; min-height: 18px; font-size: 12px;';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }
    Material.prototype.helperText = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? 'helper-text ' + p.class : 'helper-text';
        p['data-error'] = typeof (p['data-error']) !== 'undefined' ? p['data-error'] : 'wrong';
        p['data-success'] = typeof (p['data-success']) !== 'undefined' ? p['data-success'] : 'right';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }
    Material.prototype.inputFieldSelect=function(p){
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'div';
        p.class = typeof (p.class) !== 'undefined' ? 'input-field ' + p.class : 'input-field';
    
        // Select
        var pSelect = {}
        if(typeof p.select !== 'undefined'){
        pSelect = p.select;
        delete p.select;
        }
        // Select - id
        if (typeof p.idSelect !== 'undefined') {
            pSelect.id = p.idSelect;
            delete p.idSelect;
        }
        if (typeof pSelect.id === 'undefined' && typeof p.id !== 'undefined') {
             pSelect.id = p.id;
            delete p.id;
        }
        pSelect.id = typeof (pSelect.id) !== 'undefined' ? pSelect.id : 'select-' + this.guid();
        // Select - name
        if (typeof p.nameSelect !== 'undefined') {
            pSelect.name = p.nameSelect;
            delete p.nameSelect;
        }
        if (typeof pSelect.name === 'undefined' && typeof p.name !== 'undefined') {
            pSelect.name = p.name;
            delete p.name;
        }
        if (typeof p.addClassSelect !== 'undefined') {
            pSelect.addClass = p.addClassSelect;
            delete p.addClassSelect;
        }
        var select = this.select(pSelect);

        // Icon
        var pIcon = false;
        if(typeof(p.icon) !== 'undefined' && p.icon && p.icon !== ''){
            pIcon = {
                content: p.icon,
                class: 'material-icons prefix'
            }
            delete p.icon;
        }
        var icon = '';
        if(pIcon){
            icon = this.icon(pIcon);
        }

        // Label
        var pLabel = {}
        if(typeof p.label !== 'undefined'){
            if(typeof p.label !=='string'){
                pLabel = p.label;
            }
            else{
                pLabel.content = typeof (p.label) !== 'undefined' ? p.label : '';
            }
            delete p.label;
        }
        pLabel.for = typeof pLabel.for !== 'undefined' ? pLabel.for : pSelect.id;
        if (typeof p.idLabel !== 'undefined') {
            pLabel.id = p.idLabel;
            delete p.idLabel;
        }
        if (typeof p.classLabel !== 'undefined') {
            pLabel.class = p.classLabel;
            delete p.classLabel
        }
        if (typeof p.addClassLabel !== 'undefined') {
            pLabel.class = p.addClassLabel;
            delete p.addClassLabel
        }
        var label = this.label(pLabel);

        // Character Counter
        var characterCounter = '';
        if (typeof (p.characterCounter) !== 'undefined') {
            characterCounter = this.characterCounter(p.characterCounter);
            delete p.characterCounter;
        }
        if (typeof (p.span) !== 'undefined') {
            characterCounter = this.characterCounter(p.span);
            delete p.span;
        }

        // Helper Text
        var helperText = '';
        if (typeof (p.helperText) !== 'undefined') {
            helperText = this.helperText(p.helperText);
            delete p.helperText;
        }

        p.content = icon + select + label + helperText + characterCounter;
        return this.m(p);
    }
    Material.prototype.select=function(p){
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'select';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }
    Material.prototype.option=function(p){
        p = this.o(p);
        p.element = typeof p.element !== 'undefined' ? p.element : 'option';
        if(typeof p.label !== 'undefined'){
            p.content = p.label
            delete p.label;
        }
        p.value = typeof p.value !== 'undefined' ? p.value : p.content;
        return this.m(p);
    }
    Material.prototype.inputField = function (p) {
        // Parameter
        // id, idInput, name, nameInput, type, refer to input
        //  icon, placeholder, class
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? 'input-field ' + p.class : 'input-field';

        // Input
        var pInput = {}
        if(typeof p.input !== 'undefined'){
            pInput = p.input;
            delete p.input;
        }
        // Input - id
        if (typeof p.idInput !== 'undefined') {
            pInput.id = p.idInput;
            delete p.idInput;
        }
        if (typeof pInput.id === 'undefined' && typeof p.id !== 'undefined') {
            pInput.id = p.id;
            delete p.id;
        }
        pInput.id = typeof (pInput.id) !== 'undefined' ? pInput.id : 'input-' + this.guid();
        // Input - name
        if (typeof p.nameInput !== 'undefined') {
            pInput.name = p.nameInput;
            delete p.nameInput;
        }
        if (typeof pInput.name === 'undefined' && typeof p.name !== 'undefined') {
            pInput.name = p.name;
            delete p.name;
        }
        // Input - type
        if (typeof p.typeInput !== 'undefined') {
            pInput.type = p.typeInput;
            delete p.typeInput;
        }
        if (typeof pInput.type === 'undefined' && typeof p.type !== 'undefined') {
            pInput.type = p.type;
            delete p.type;
        }
        if (typeof p.classInput !== 'undefined') {
            pInput.class = p.classInput;
            delete p.classInput;
        }
        if (typeof p.addClassInput !== 'undefined') {
            pInput.addClass = p.addClassInput;
            delete p.addClassInput;
        }
        if (typeof p.placeholder !== 'undefined') {
            pInput.placeholder = p.placeholder;
            delete p.placeholder;
        }
        pInput.type = typeof (pInput.type) !== 'undefined' ? pInput.type : 'text';
        var input = this.input(pInput);

        // Icon
        var pIcon = false;
        if(typeof(p.icon) !== 'undefined' && p.icon && p.icon !== ''){
            pIcon = {
                content: p.icon,
                class: 'material-icons prefix'
            }
            delete p.icon;
        }
        var icon = '';
        if(pIcon){
            icon = this.icon(pIcon);
        }

        // Label
        var pLabel = {}
        if(typeof p.label !== 'undefined'){
            if(typeof p.label !=='string'){
                pLabel = p.label;
            }
            else{
                pLabel.content = typeof (p.label) !== 'undefined' ? p.label : '';
            }
            delete p.label;
        }    
        pLabel.for = typeof pLabel.for !== 'undefined' ? pLabel.for : pInput.id;
        if (typeof p.idLabel !== 'undefined') {
            pLabel.id = p.idLabel;
            delete p.idLabel;
        }
        if (typeof p.classLabel !== 'undefined') {
            pLabel.class = p.classLabel;
            delete p.classLabel
        }
        if (typeof p.addClassLabel !== 'undefined') {
            pLabel.class = p.addClassLabel;
            delete p.addClassLabel
        }
        var label = this.label(pLabel);
        
        // HelperText
        var helperText = '';
        if (typeof (p.helperText) !== 'undefined') {
            helperText = this.helperText(p.helperText);
            delete p.helperText;
        }

        // Character Counter
        var characterCounter = '';
        if (typeof (p.characterCounter) !== 'undefined') {
            characterCounter = this.characterCounter(p.characterCounter);
            delete p.characterCounter;
        }
        if (typeof (p.span) !== 'undefined') {
            characterCounter = this.characterCounter(p.span);
            delete p.span;
        }

        p.content = icon + input + label + helperText + characterCounter;
        return this.m(p);
    }

    // Collection
    Material.prototype.collection = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'ul';
        p.class = typeof (p.class) !== 'undefined' ? 'collection ' + p.class : 'collection';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        var collectionHeader = ''
        if (typeof (p.collectionHeader) !== 'undefined') {
            collectionHeader = this.collectionHeader(p.collectionHeader);
            p.class += ' with-header';
        }
        var collectionItem = ''
        if (typeof (p.collectionItem) !== 'undefined') {
            for (var i in p.collectionItem) {
                let item = typeof p.collectionItem && typeof p.collectionItem[i] !== 'undefined' ? p.collectionItem[i] : '';
                let data = undefined
                if(typeof p.collectionData !== 'undefined'){
                    data = typeof p.collectionData && typeof p.collectionData[i] !== 'undefined' ? p.collectionData[i] : undefined;
                }
                let type = undefined
                if(typeof p.collectionType !== 'undefined'){
                    type = typeof p.collectionType && typeof p.collectionType[i] !== 'undefined' ? p.collectionType[i] : undefined;
                }
                
                
                if (typeof p.collectionBadge !== 'undefined' && typeof p.collectionBadge[i] !== 'undefined' && p.collectionBadge[i] !== '') {
                    badge = this.span({
                        class: 'badge collection-item-badge',
                        content: p.collectionBadge[i]
                    })
    
                    if(typeof item === 'string'){
                        item = {
                            content : item,
                            after: badge
                        }
                    }
                    else if(typeof item === 'object') {
                        item.span = badge
                    }
                    if(typeof data !== 'undefined'){
                        item.data = data
                    }
                    if(typeof type !== 'undefined'){
                        item.type = type
                    }
                }
                
                collectionItem += this.collectionItem(item);
                let collectionBadge = '';
                
                p.content += collectionBadge
                
            }
            if (typeof (p.collectionBadge) !== 'undefined') {
                delete p.collectionBadge;
            }
        }
        p.content = collectionHeader + collectionItem;
        return this.m(p);
    }
    Material.prototype.collectionHeader = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'li';
        p.class = typeof (p.class) !== 'undefined' ? 'collection-header ' + p.class : 'collection-header';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }
    Material.prototype.collectionItem = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'li';
        p.class = typeof (p.class) !== 'undefined' ? 'collection-item ' + p.class : 'collection-item';
        p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }

    // Buttons and Icons
    Material.prototype.buttonGen = function (p, t) {
        p = this.o(p);
        t = typeof(t) !== 'undefined' ? t : 'btn'
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'button';
        p.class = typeof (p.class) !== 'undefined' ? t + ' ' + p.class : t + ' waves-effect waves-light';
        var icon = ''
        if (typeof p.icon !== 'undefined') {
            var pIcon = this.o(p.icon);
            if(t !== 'btn-floating'){
                pIcon.position = typeof pIcon.position !== 'undefined' ? pIcon.position : 'left';
            }
            icon = yM.icon(pIcon);
            delete p.icon;
        }
        p.content = typeof (p.content) !== 'undefined' ? p.content + icon : icon;
        return this.m(p);
    }
    Material.prototype.a = function (p) {
        p = this.o(p);
        
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'a';
        if(typeof p.label !== 'undefined'){
            p.content = p.label;
            delete p.label;
        }
        p.content = typeof (p.content) !== 'undefined' ? p.content : typeof (p.href) !== 'undefined' ? p.href: '';
        return this.buttonGen(p, 'btn');
    }
    Material.prototype.button = function (p) { return this.buttonGen(p); }
    Material.prototype.buttonFlat = function (p) { return this.buttonGen(p, 'btn-flat'); } 
    Material.prototype.buttonLarge = function (p) { return this.buttonGen(p, 'btn-large'); }
    Material.prototype.buttonSmall = function (p) { return this.buttonGen(p, 'btn-small'); }
    Material.prototype.buttonFloating = function (p) { return this.buttonGen(p, 'btn-floating'); }
    Material.prototype.icon = function (p) {
        p = this.o(p);
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'i';
        p.class = typeof (p.class) !== 'undefined' ? p.class : 'material-icons';
        if (typeof p.position !== 'undefined') {
            p.class += ' ' + p.position
            delete p.position
        }
        //p.content = typeof (p.content) !== 'undefined' ? p.content : '';
        return this.m(p);
    }

    // Media
    Material.prototype.image = function (p) {
        p = this.o(p);
        p.src = typeof (p.src) !== 'undefined' ? p.src : '';
        if (typeof p.content !== 'undefined') {
            if (p.src === '') {
                p.src = p.content;
            }
            delete p.content;
        }
        p.class = typeof (p.class) !== 'undefined' ? 'responsive-img ' + p.class : 'responsive-img';
        return this.m(p);
    }
    Material.prototype.imageCircle = function (p) {
        p = this.o(p);
        p.src = typeof (p.src) !== 'undefined' ? p.src : '';
        if (typeof p.content !== 'undefined') {
            if (p.src === '') {
                p.src = p.content;
            }
            delete p.content;
        }
        p.class = typeof (p.class) !== 'undefined' ? 'circle responsive-img ' + p.class : 'circle responsive-img';
        return this.m(p);
    }
    Material.prototype.materialBoxed = function (p) {
        p = this.o(p);
        p.src = typeof (p.src) !== 'undefined' ? p.src : '';
        if (typeof p.content !== 'undefined') {
            if (p.src === '') {
                p.src = p.content;
            }
            delete p.content;
        }
        p.class = typeof (p.class) !== 'undefined' ? 'materialboxed ' + p.class : 'materialboxed';

        return this.m(p);
    }
    Material.prototype.source = function (p) {
        p = this.o(p);
        p.src = typeof (p.src) !== 'undefined' ? p.src : '';
        if (typeof p.content !== 'undefined') {
            if (p.src === '') {
                p.src = p.content;
            }
            delete p.content;
        }
        p.type = typeof (p.type) !== 'undefined' ? p.type : 'video/mp4';
        p.element = typeof (p.element) !== 'undefined' ? p.element : 'source';
        return this.m(p);
    }
    Material.prototype.video = function (p) {
        p = this.o(p);
        source = '';
        if (typeof p.src !== 'undefined') {
            source = p.src;
            delete p.src;
        }
        if (typeof p.content !== 'undefined') {
            if (source === '') {
                source = p.content;
            }
            delete p.content;
        }
        p.class = typeof (p.class) !== 'undefined' ? 'responsive-video ' + p.class : 'responsive-video';
        p.content = this.source(source);
        return this.m(p);
    }

    // Preloader
    Material.prototype.preloader = function (p) {
        p = this.o(p);
        var res = ''
        if (typeof p.type !== 'undefined') {
            var type = p.type;
            delete p.type;
            switch (type) {
                case 'linear':
                    res = this.preloaderLinear(p);
                    break
                case 'circular':
                default:
                    res = this.preloaderCircular(p);
                    break
            }
        }
        return res;
    }
    Material.prototype.preloaderLinear = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' progress' : 'progress';
        pChild = {};
        if (typeof p.isDeterminate !== 'undefined') {
            if (p.isDeterminate) {
                pChild.class = 'determinate'
            }
            else {
                pChild.class = 'indeterminate'
            }
            delete p.isDeterminate;
        }
        if (typeof p.isIndeterminate !== 'undefined') {
            if (p.isIndeterminate) {
                pChild.class = 'indeterminate'
            }
            else {
                pChild.class = 'determinate'
            }
            delete p.isIndeterminate;
        }
        if (typeof p.progress !== 'undefined') {
            pChild.class = 'determinate'
            if (typeof p.progress === 'string') pChild.style = 'width: ' + p.progress;
            if (typeof p.progress === 'number') pChild.style = 'width: ' + p.progress * 100 + '%';
            delete p.progress;
        }
        if (typeof (pChild.class) === 'undefined') {
            pChild.class = 'determinate'
            pChild.style = 'width: 0%';
        }
        p.content = this.m(pChild);
        return this.m(p);
    }
    Material.prototype.preloaderCircular = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' preloader-wrapper' : 'preloader-wrapper';
        p.isActive = typeof (p.isActive) !== 'undefined' ? p.isActive : true;
        var color = 'blue';
        if (typeof p.color !== 'undefined') {
            color = p.color
            delete p.color;
        }
        p.content = this.preloaderCircularLayer({
            color: color,
            content: this.circleClipper({
                isLeft: true,
                content: this.circle()
            }) +
                this.gapPatch({
                    content: this.circle()
                }) +
                this.circleClipper({
                    isRight: true,
                    content: this.circle()
                })
        });
        return this.m(p);
    }
    Material.prototype.preloaderCircularLayer = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' spinner-layer' : 'spinner-layer';
        if (typeof p.color !== 'undefined') {
            p.class += ' spinner-' + p.color + '-only';
            delete p.color;
        }
        p.content = this.m(p);
        return this.m(p);
    }
    Material.prototype.circleClipper = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' circle-clipper' : 'circle-clipper';
        return this.m(p);
    }
    Material.prototype.circle = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' circle' : 'circle';
        return this.m(p);
    }
    Material.prototype.gapPatch = function (p) {
        p = this.o(p);
        p.class = typeof (p.class) !== 'undefined' ? p.class + ' gap-patch' : 'gap-patch';
        return this.m(p);
    }
    Material.prototype.modalForm = function(p){
        p = this.o(p);
        let pForm = {};
        if(typeof p.form !== 'undefined'){
            pForm = p.form
            delete p.form;
        }
        pForm.content = typeof pForm.content !== 'undefined' ? pForm.content : '';
        if(typeof p.title !== 'undefined'){
            pForm.content += this.h5(p.title);
            delete p.title;
        }
        
        if(typeof p.field !== 'undefined'){
            let fieldContent = '';
            if(Array.isArray(p.field)){
                for(let i in p.field){
                    fieldContent += this.row( this.inputField(p.field[i]) );
                }
            }
            else{
                fieldContent = this.row( this.inputField(p.field) );
            }
            pForm.content += this.div(fieldContent);
            delete p.field;
        }
        let footer = '';
        if(typeof p.button !== 'undefined'){
            let footerContent = '';
            if(Array.isArray(p.button)){
                for(let i in p.button){
                    footerContent+=this.buttonFlat(p.button[i]);
                }
            }
            else{
                footerContent=this.buttonFlat(p.button);
            }
            footer = this.modalFooter(footerContent);
            delete p.button;
        }
        p.content = this.modalContent(this.form(pForm)) + footer;
        p.class = typeof (p.class) !== 'undefined' ? 'modal ' + p.class : 'modal';
        return this.m(p);
    }
    Material.prototype.infoBox = function (options) {
        var that = this;
        options = typeof (options) !== 'undefined' ? options : {};
        var width = typeof (options.width) !== 'undefined' ? options.width : '3' ;
        var parent = typeof (options.parent) !== 'undefined' ? options.parent : false;
        var onClick = typeof (options.onClick) !== 'undefined' ? options.onClick : false;
        var moduleTarget = typeof (options.module) !== 'undefined' ? options.module : false;
        var title = typeof (options.title) !== 'undefined' ? options.title : '';
        var value = typeof (options.value) !== 'undefined' ? options.value : '';
        var wrapper = {};
        wrapper.element = typeof (options.element) !== 'undefined' ? options.element : 'div';
        wrapper.id = typeof (options.id) !== 'undefined' ? options.id : 'info-box-wrapper-' + this.guid();
        width = 'col s12 m6 l' + width;
        wrapper.class = typeof (options.class) !== 'undefined' ? options.class : width;
        href = typeof (options.href) !== 'undefined' ? options.href : undefined;
        addClass = typeof (options.addClass) !== 'undefined' ? options.addClass : '';
        var icon = typeof (options.icon) !== 'undefined' ? options.icon : 'info_outline';
        var iconColor = typeof (options.iconColor) !== 'undefined' ? options.iconColor : 'white';
        var iconBgColor = typeof (options.iconBgColor) !== 'undefined' ? options.iconBgColor : 'blue';

        const boxContent = yHtml([
            {
                element: 'span', class: 'info-box-icon ' + iconBgColor, content: yHtml(
                    { element: 'i', class: 'medium material-icons ' + iconBgColor + ' ' + iconColor + '-text', content: icon }
                )
            },
            {
                element: 'div', class: 'info-box-content', content: yHtml([
                    { element: 'div', class: 'info-box-title', content: title },
                    { element: 'div', class: 'info-box-value', content: value }
                ])
            }
        ])
        const boxObj = {
            element: 'a', class: 'info-box hoverable '+ addClass+ ' ', content: boxContent
        }
        if(typeof href !== 'undefined') {
            boxObj.href = href
        }
        wrapper.content = yHtml(boxObj);

        var h = yHtml(wrapper);
        if (parent) {
            $(parent).append(h);
        }
        if (onClick) {
            $('#main').off('click', '#' + wrapper.id)
            $('#main').on('click', '#' + wrapper.id, onClick)
        }
        if (moduleTarget) {
            $('#main').off('click', '#' + wrapper.id)
            $('#main').on('click', '#' + wrapper.id, function () {
                $('#btn-module-' + moduleTarget).click()
            });
        }
        return h;
    }
    
    Material.prototype.infoBox2 = function (options) {
        var that = this;
        options = typeof (options) !== 'undefined' ? options : {};
        var parent = typeof (options.parent) !== 'undefined' ? options.parent : false;
        var onClick = typeof (options.onClick) !== 'undefined' ? options.onClick : false;
        var moduleTarget = typeof (options.module) !== 'undefined' ? options.module : false;
        var title = typeof (options.title) !== 'undefined' ? options.title : '';
        var value = typeof (options.value) !== 'undefined' ? options.value : '';
        var wrapper = {};
        wrapper.element = typeof (options.element) !== 'undefined' ? options.element : 'div';
        wrapper.id = typeof (options.id) !== 'undefined' ? options.id : 'info-box-wrapper-' + this.guid();
        wrapper.class = typeof (options.class) !== 'undefined' ? options.class : 'col s12 m6 l2';
        var icon = typeof (options.icon) !== 'undefined' ? options.icon : 'info_outline';
        var iconColor = typeof (options.iconColor) !== 'undefined' ? options.iconColor : 'white';
        var iconBgColor = typeof (options.iconBgColor) !== 'undefined' ? options.iconBgColor : 'blue';

        wrapper.content = yHtml(
            {
                element: 'a', class: 'info-box-2 hoverable', content: yHtml([
                    {
                        element: 'div', class: 'info-box-content-2', content: yHtml([
                            { element: 'div', class: 'info-box-title', content: title },
                            { element: 'div', class: 'info-box-value', content: value }
                        ])
                    },
                    {
                        element: 'span', class: 'info-box-icon-2 ' + iconBgColor, content: yHtml(
                            { element: 'i', class: 'medium material-icons ' + iconBgColor + ' ' + iconColor + '-text', content: icon }
                        )
                    }
                ])
            }
        );

        var h = yHtml(wrapper);
        if (parent) {
            $(parent).append(h);
        }
        if (onClick) {
            $('body').on('click', '#' + wrapper.id, onClick);
        }
        if (moduleTarget) {
            $('body').on('click', '#' + wrapper.id, function () {
                $('#button-module-' + moduleTarget).click();
            });
        }
        return h;
    }

    if (typeof window === 'object' && typeof window.document === 'object') {
        window.yMaterial = new Material();
        window.yM = yMaterial;
    }
})(window);
