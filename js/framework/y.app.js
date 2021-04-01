(function (window, undefined) {
	var document = window.document;
	var location = window.location;
	//------------------------------------------------------------------------------
	// y Engine
	// Foundation for Application
	//------------------------------------------------------------------------------
	var y = function (selector) {
		this.selector = false;
		this.dummy = false;
		return new y.prototype.init(selector);
	};
	var _eventHandlers = {};
	var readyHandle = function (callback) {
		if (document.readyState === 'complete') {
			callback();
		}
		else {
			var completed = _completed(callback);
			y(document).on('DOMContentLoaded', completed);
			y(window).on('load', completed);
		}
	};
	var _htmlAttr = new Array('accept', 'action', 'alt', 'autocomplete', 'background', 'bind', 'cell', 'cells', 'checked', 'class', 'col', 'cols', 'colspan', 'controller', 'data', 'data-init', 'data-collapsible', 'data-target', 'data-tooltip', 'data-position', 'dir', 'disabled', 'display', 'draggable', 'dropzone', 'enctype', 'for', 'group', 'height', 'hidden', 'href', 'ico', 'id', 'lab', 'lang', 'label', 'last', 'max', 'maxlength', 'min', 'mod', 'name', 'next', 'onclick', 'parent', 'pattern', 'prev', 'progress', 'readonly', 'tag', 'type', 'row', 'rows', 'rowspan', 'sign', 'selected', 'src', 'step', 'spellcheck', 'style', 'tabindex', 'title', 'translate', 'use-content','value', 'width');
	var _completed = function (callback) {
		y(document).off('DOMContentLoaded', _completed);
		y(window).off('load', _completed);
		callback();
	};
	var getElement = function (param) {
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
	var _createEvent = function (node, event, handler, capture) {
		if (typeof handler !== 'undefined') {
			_eventHandlers[node] = typeof _eventHandlers[node] !== 'undefined' ? _eventHandlers[node] : {};
			_eventHandlers[node][event] = typeof _eventHandlers[node][event] !== 'undefined' ? _eventHandlers[node][event] : [];
			_eventHandlers[node][event].push({ 'handler': handler, 'capture': capture });
			if (node.addEventListener) {
				node.addEventListener(event, handler, capture);
			}
			else if (node.attachEvent) {
				node.attachEvent('on' + event, handler);
			}
			else {
				selector['on' + event] = handler;
			}
			return true;
		}
		return false;
	};
	var _delegationFunction = function (parent, children, handler) {
		var delegation_function = function (e) {
			e = e ? e : event;
			var element = e.srcElement ? e.srcElement : e.target ? e.target : false
			if (typeof children.length === 'undefined') {
				applyHandler(parent, children, handler, e, element)
			}
			else {
				for (let i = 0, l = children.length; i < l; i++) {
					const child = children[i]
					applyHandler(parent, child, handler, e, element)
				}
			}
		};
		return delegation_function;
	};
	const applyHandler = function (parent, child, handler, e, element) {
		while (element && element != child) {
			if (element == parent) break;
			if (element.ParentNode != document) element = element.parentNode;
		}
		if (element == child) handler.call(element, e)
	}
	var _removeEvent = function (node, event, handler, capture) {
		var this_handler;
		if (_eventHandlers[node]) {
			if (_eventHandlers[node][event]) {
				for (var i in _eventHandlers[node][event]) {
					var handler_array = _eventHandlers[node][event][i];
					if ((handler_array.handler.toString() == handler.toString()) && handler_array.capture.toString() == capture.toString()) {
						this_handler = handler_array.handler;
					}
				}
			}
		}
		if (typeof handler === 'function') {
			capture = typeof capture !== 'undefined' ? capture : false;
			if (node.removeEventListener) {
				node.removeEventListener(event, this_handler, capture);
			}
			else if (node.detachEvent) {
				node.detachEvent('on' + event, this_handler);
			}
			else {
				node['on' + event] = null;
			}
			return true;
		}
		return false;
	};
	var _removeAllEvents = function (node, event) {
		if (node in _eventHandlers) {
			var handlers = _eventHandlers[node];
			if (event in handlers) {
				var eventHandler = handlers[event];
				for (var i = eventHandler.length; i--;) {
					var handler = eventHandler[i][0];
					var capture = eventHandler[i][1];
					_removeEvent(node, event, handler, capture);
				}
			}
			return true;
		}
		return false;
	};
	var y_print_html = function (html) {
		var name = 'y_print_frame';
		if (typeof window.y_print_frame !== 'undefined') {
			delete window.y_print_frame;
		}
		else {
			var print_frame = document.createElement('iframe');
			var clear = function () {
				setTimeout(function () {
					print_frame.parentNode.removeChild(print_frame);
				}, 1);
			};
			print_frame.name = name;
			print_frame.id = name + '_id';
			print_frame.style.display = 'none';
			print_frame.style.width = '1px';
			print_frame.style.height = '1px';
			print_frame.style.position = 'absolute';
			print_frame.style.left = '-999px';
			document.body.appendChild(print_frame);
			var frame = window.frames[name];
			var doc = frame.document;
			doc.open();
			doc.write('<!DOCTYPE HTML>');
			h = yHtml([
				{
					element: 'html', content: yHtml([
						{ element: 'head', content: yHtml([{ element: 'title' }]) },
						{ element: 'body', content: html }
					])
				}
			]);
			doc.write(h);
			doc.close();
			clear();
			frame.focus();
			frame.print();
			frame.close();
		}
	};

	//------------------------------------------------------------------------------
	// yHtml Engine
	// Transform object to html code
	//------------------------------------------------------------------------------
	var _getCode = function (p) {
		var attr = _htmlAttr
		var e = p.element;
		var a = '<' + e + ' ';
		var b = '>';
		var c = '</' + e + b;
		var d = ' />';
		var s = '';
		var t = '';
		var tb = '';
		var ta = '';
		var u = 'undefined';
		var h = function (x, y) { return x + '="' + y + '" '; };
		let v = function (x, y) { return typeof (x[y]) !== u ? x[y] : '' };
		let w = function (x, y) { return x !== '' ? x : y };
		t = v(p, 'content');
		t = w(t, v(p, 'rel'));
		t = w(t, v(p, 'rev'));
		t = w(t, v(p, 'href'));
		if (typeof p.before != u) { tb = p.before; }
		if (typeof p.after != u) { ta = p.after; }
		for (var i in attr) {
			if (typeof p[attr[i]] !== u) {
				s += h(attr[i], p[attr[i]]);
			}
		}
		if (typeof p.style_width != u) {
			s += 'style="width:' + p.style_width + '"';
		}
		if (typeof p.style_height != u) {
			s += 'style="height:' + p.style_height + '"';
		}
		if (!(e == 'input' || e == 'img' || e == 'link')) {
			return a + s + b + tb + t + ta + c;
		} else {
			return a + s + d;
		}
	};
	var _htmlCode = function (p) {
		var r = '';
		if (Array.isArray(p)) {
			for (var i in p) {
				r += _getCode(p[i]);
			}
		}
		else {
			r = _getCode(p);
		}
		return r;
	};

	//------------------------------------------------------------------------------
	// yStyle Engine
	// Give selector style
	//------------------------------------------------------------------------------
	var _style = function (selector, param, value) {
		value = typeof value !== 'undefined' && value !== 'undefined' ? value : '';
		var element = getElement(selector);
		if (typeof element !== 'undefined' && element !== 'undefined' && element !== null && typeof element === 'object') {
			if (value !== '') {
				if (typeof element.__isClass !== 'undefined' && element.__isClass === true) {
					for (var i = 0; i < element.length; i++) {
						element[i].style[param] = value;
					}
				}
				else { element.style[param] = value; }
				return true;
			}
			else {
				if (typeof element.__isClass !== 'undefined' && element.__isClass === true) {
					if (typeof element[0] !== 'undefined' && typeof element[0].style !== 'undefined' && typeof element[0].style[param] !== 'undefined') {
						return element[0].style[param];
					}
					else {
						return false;
					}
				}
				else {
					if (typeof element.style !== 'undefined' && typeof element.style[param] !== 'undefined') {
						return element.style[param];
					}
					else {
						return false;
					}
				}
			}
		}
		else return false;
	};
	y.prototype = {
		init: function (selector) {
			if (selector) {
				this.selector = getElement(selector);
			}
			else {
				this.selector = document;
			}
			return this;
		},
		on: function (a, b, c) {
			var parent, child, node, event, handler;
			event = a;
			if (typeof c === 'undefined') {
				// y(selector).on(event,handler)
				handler = b;
				node = this.selector;
			}
			else {
				handler = c;
				if (parent == document) {
					// y().off(event,node,handler)
					node = b;
				}
				else {
					// y(parent).on(event,child,handler)
					node = parent = this.selector;
					child = b;
				}
			}
			if (typeof parent === 'object') {
				if (typeof child !== 'object') {
					child = getElement(child);
				}
				parent_handler = _delegationFunction(parent, child, handler);
				handler = parent_handler;
			}
			if (typeof node !== 'object') {
				node = getElement(node);
			}
			if (typeof handler === 'function') {
				_createEvent(node, event, handler, false);
			}
			return this;
		},
		off: function (a, b, c) {
			var parent, child, node, event, handler;
			event = a;
			if (typeof c !== 'undefined') {
				handler = c;
				if (parent == document) {
					// y().off(event,node,handler)
					node = b;
				}
				else {
					// y(parent).off(event,child,handler)
					parent = this.selector;
					child = b;
				}
			}
			else {
				if (typeof b !== 'undefined') {
					if (typeof b === 'function') {
						// y(node).off(event,handler)
						node = this.selector;
						handler = b;
					}
					else {
						// y(parent).off(event,child)
						parent = this.selector;
						child = b;
					}
				}
				else {
					// y(node).off(event)
					node = this.selector;
				}
			}
			if (typeof parent === 'object') {
				node = parent;
				if (typeof child !== 'object') {
					child = getElement(child);
				}
				parent_handler = _delegationFunction(parent, child, handler);
				handler = parent_handler;
			}
			if (typeof node !== 'object') {
				node = getElement(node);
			}
			if (typeof handler === 'function') {
				_removeEvent(node, event, handler, false);
			}
			else {
				_removeAllEvents(node, type);
			}
			return this;
		},
		click: function (fn) {
			selector = this.selector;
			this.on('click', selector, fn);
			return this;
		},
		show: function () {
			this.selector.style.display = 'block';
			return this;
		},
		hide: function () {
			this.selector.style.display = 'none';
			return this;
		},
		toggle: function () {
			if (window.getComputedStyle(this.selector).display === 'block') {
				this.selector.style.display = 'none';
				return this;
			}
			this.selector.style.display = 'block';
			return this;
		},
		remove: function () {
			this.selector.parentNode.removeChild(this.selector);
			return this;
		},
		val: function (a) {
			if (typeof a !== 'undefined') {
				this.selector.value = a;
				return this.selector;
			}
			return this.selector.value;
		},
		parent: function () {
			return this.selector.parentNode;
		},
		attr: function (a, b) {
			// setAttribute a=attribute, b=value
			if (typeof b !== 'undefined') {
				this.selector.setAttribute(a, b);
				return this.selector;
			}
			return this.selector.getAttribute(a);
		},
		ready: function (fn) {
			readyHandle(fn);
			return this;
		}
	};
	y.prototype.init.prototype = y.prototype;
	//y.fn.init.prototype = y.fn;


	var style = function () {
		this.file = document.createElement('style');
		this.file.type = 'text/css';
		this.file.innerHTML = '';
	};
	style.prototype.responsive = function (callback) {
		var res;
		var css = this;
		window.onresize = function () {
			if (res) {
				clearTimeout(res);
			}
			res = setTimeout(function () {
				callback(css);
			}, 100);
		};
	};
	style.prototype.swing = function (p) {
		return 0.5 - Math.cos(p * Math.PI) / 2;
	};
	style.prototype.linear = function (p) {
		return p;
	};
	style.prototype.animate = function (selector, param, value, time, option) {
		time = typeof time !== 'undefined' ? time : 1000;
		option = typeof option !== 'undefined' ? option : '';
		time = parseInt(time);
		var interval_time = 13;
		var section = parseInt(time / interval_time);
		if (section < 1) { section = 1; }
		var current_value = this.style(selector, param);

		var px = value.substr(value.length - 2);

		var is_px = false;
		var start = current_value;
		var end = value;
		if (px == 'px') {
			is_px = true;
			start = parseFloat(current_value.substr(0, current_value.length - 2));
			end = parseFloat(value.substr(0, value.length - 2));
		}
		var temp = start;
		var step = (end - start) / section;
		var diff = end - start;
		var data = [];
		for (var i = 0; i < section; i++) {
			var p = (i + 1) / section;
			switch (option) {
				case '':
					data[i] = start + (this.swing(p) * diff);
					break;
				case 'linear':
					data[i] = start + (this.linear(p) * diff);
					break;
			}
			if (is_px) { data[i] = parseInt(data[i]) + 'px'; }
		}
		if (data[section - 1] != value) {
			data[section - 1] = value;
		}
		var element = this.get_element(selector);
		if (element != 'null' && typeof element === 'object') {
			if (value !== '') {
				i = 0;
				var animate;
				if (typeof element.__isClass !== 'undefined' && element.__isClass === true) {
					animate = setInterval(function () {
						for (var i = 0; i < element.length; i++) {
							element[i].style[param] = data[i];
						}
						i++;
					}, interval_time);
				}
				else {
					animate = setInterval(function () { element.style[param] = data[i]; i++; }, interval_time);
				}
			}
		}
	};
	style.prototype.set_width = function (selector, width) {
		this.style(selector, 'width', css.px(width));
	};
	style.prototype.get_element = getElement;
	style.prototype.style = _style;
	style.prototype.add = function (param) {
		var text = '';
		for (var i in param) {
			p = param[i];
			var is_name = (typeof p.name != 'undefined');
			var is_class = (typeof p.class != 'undefined');
			var is_id = (typeof p.id != 'undefined');
			if ((!(is_name && is_class && is_id)) && (is_name || is_class || is_id)) {
				if (is_class) { text += '.' + p.class + '{'; }
				if (is_id) { text += '#' + p.id + '{'; }
				if (is_name) { text += p.name + '{'; }
				for (var f in p) {
					if (p.hasOwnProperty(f)) {
						if (!(f == 'name' || f == 'class' || f == 'id')) {
							var _f = f.replace("_", "-");
							var _p = p[f];
							text += (_f + ':' + _p + ';');
						}
					}
				}
				text += '}';
			}
		}
		this.file.innerHTML += text;
	};
	style.prototype.create = function () {
		document.getElementsByTagName('head')[0].appendChild(this.file);
	};
	style.prototype.px = function (num) {
		return typeof num !== 'undefined' ? num + 'px' : 'px';
	};
	style.prototype.wpx = function (num) {
		return { width: num + 'px' };
	};
	style.prototype.url_image = function (folder, image, param) {
		param = typeof param !== 'undefined' ? param : '';
		var url = 'url("../images/' + folder + '/' + image + '") ' + param;
		return url;
	};
	style.prototype.copy = function (object) {
		return JSON.parse(JSON.stringify(object));
	};
	style.prototype.id = function (id_name) {
		var result = { id: id_name };
		return result;
	};
	style.prototype.class = function (cl_name) {
		var result = { class: cl_name };
		return result;
	};
	style.prototype.bg = function (folder, image, param) {
		param = typeof param !== 'undefined' ? param : '';
		var result = { background: this.url_image(folder, image, param) };
		return result;
	};
	style.prototype.use = function (cl_name, object) {
		var result = this.copy(object);
		result.class = cl_name;
		return result;
	};
	style.prototype.merge = function (object_1, object_2) {
		var result;
		if (object_1 instanceof Array) {
			for (var i in object_1) {
				if (i === 0) {
					result = JSON.parse(JSON.stringify(object_1[i]));
				}
				else {
					result = JSON.parse((JSON.stringify(result) + JSON.stringify(object_1[i])).replace('}{', ','));
				}
			}
		}
		else {
			result = JSON.parse((JSON.stringify(object_1) + JSON.stringify(object_2)).replace('}{', ','));
		}
		return result;
	};
	style.prototype.get_width = function () {
		var width = 0;
		if (typeof (window.innerWidth) == 'number') {
			width = window.innerWidth;
		}
		else if (document.documentElement && document.documentElement.clientWidth) {
			width = document.documentElement.clientWidth;
		}
		else if (document.body && document.body.clientWidth) {
			width = document.body.clientWidth;
		}
		return width;
	};
	style.prototype.get_scroll_width = function () {
		var scrollDiv = document.createElement("div");
		scrollDiv.className = "scrollbar-measure";
		document.body.appendChild(scrollDiv);
		var width = scrollDiv.offsetWidth - scrollDiv.clientWidth;
		document.body.removeChild(scrollDiv);
		return width;
	};
	style.prototype.get_height = function () {
		var height = 0;
		if (typeof (window.innerHeight) == 'number') {
			height = window.innerHeight;
		} else if (document.documentElement && document.documentElement.clientHeight) {
			height = document.documentElement.clientHeight;
		} else if (document.body && document.body.clientHeight) {
			height = document.body.clientHeight;
		}
		return height;
	};
	style.prototype.requestFullScreen = function () {
		if (fullScreenApi.supportsFullScreen) {
			if (!fullScreenApi.isFullScreen()) {
				fullScreenApi.requestFullScreen(document.body);
			}
		}
	};
	function showPreloader() { document.getElementById('ajax-preloader').style.display = 'block' }
	function hidePreloader() { document.getElementById('ajax-preloader').style.display = 'none' }
	function y_handle_paste(obj) {
		setTimeout(function () { y_get_paste_value(obj); }, 10);
	}
	function y_get_paste_value(obj) {
		var paste_value = _(obj).val();
		_(obj).val('');
		var name = _(obj).attr('name');
		var arr = typeof name !== 'undefined' ? name.split('[') : [];
		if (typeof arr[0] !== 'undefined' && typeof arr[1] !== 'undefined') {
			var start_index = parseInt(arr[1].replace(']', ''));
			if (!isNaN(start_index)) {
				var rows = paste_value.split('\n');
				var no_of_rows = rows.length;
				var this_name;
				for (i = 0; i < no_of_rows; i++) {
					this_name = arr[0] + '[' + (start_index + i) + ']';
					$('textarea[name="' + this_name + '"]').focus();
					$('textarea[name="' + this_name + '"]').val(rows[i]);
				}
			}
		}
		return false;
	}
	function y_grid_paste(obj, paste_value) {
		var name = $(obj).attr('name');
		var arr = typeof name !== 'undefined' ? name.split('[') : [];
		if (typeof arr[0] !== 'undefined' && typeof arr[1] !== 'undefined') {
			var start_index = parseInt(arr[1].replace(']', ''));
			if (!isNaN(start_index)) {
				var rows = paste_value.split('\n');
				var no_of_rows = rows.length;
				var this_name;
				for (i = 0; i < no_of_rows; i++) {
					this_name = arr[0] + '[' + (start_index + i) + ']';
					$('textarea[name="' + this_name + '"]').focus();
					$('textarea[name="' + this_name + '"]').val(rows[i]);
				}
			}
		}
		return false;
	}
	function yClock(selector) {
		var t = yGetTime(); selector.innerHTML = t; setTimeout(function () { yClock(selector); }, 500);
	}
	function y_pre_zero(i) {
		var r = i < 10 ? "0" + i : i;
		return r;
	}
	function yGetDate() {
		var n = new Date();
		var yyyy = n.getFullYear();
		var mm = y_pre_zero(n.getMonth() + 1);
		var dd = y_pre_zero(n.getDate());
		return (yyyy + "-" + mm + "-" + dd);
	}
	function yGetTime() {
		var n = new Date();
		var h = y_pre_zero(n.getHours());
		var m = y_pre_zero(n.getMinutes());
		var s = y_pre_zero(n.getSeconds());
		return (h + ":" + m + ":" + s);
	}
	function yGetTimeStamp() {
		var t = yGetTime();
		var d = yGetDate();
		return d + ' ' + t;
	}
	
	var getAjax = function (url, data, success, complete, error, jsonError, wait_hide, timeout) {
		wait_hide = typeof wait_hide !== 'undefined' ? wait_hide : false;
		if (typeof url !== 'undefined' && url !== '') {
			if (!wait_hide) { showPreloader(); }
			success = typeof success !== 'undefined' ? success : function () { };
			success = typeof success !== 'function' ? function () { } : success;
			complete = typeof complete !== 'undefined' ? complete : function () { };
			complete = typeof complete !== 'function' ? function () { } : complete;
			error = typeof error !== 'undefined' ? error : function () { };
			error = typeof error !== 'function' ? function () { } : error;
			jsonError = typeof jsonError !== 'undefined' ? jsonError : function (e) { console.log('controller: ' + url); console.log(e); };
			data = (typeof data !== 'undefined') && (data !== '') ? '?' + data : '';
			timeout = typeof timeout !== 'undefined' ? timeout : 0;
			var ajax = new XMLHttpRequest();
			ajax.open('GET', url + data, true); // true = asynchronous
			ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4) {
					if (ajax.status >= 200 && (ajax.status < 300 || ajax.status === 304)) {
						var res;
						try {
							res = JSON.parse(ajax.responseText);
							success(res);
						} catch (e) {
							jsonError(e);
						}
					}
					else {
						console.log('controller: ' + url);
						error(ajax.status);
					}
					if (!wait_hide) { hidePreloader(); }
					complete();
				}
			};
			ajax.timeout = timeout;
			try {
				ajax.send(null);
				return (ajax.status >= 200 && (ajax.status < 300 || ajax.status === 304));
			}
			catch (e) {
				console.log('controller: ' + url);
				console.log(e);
				return false;
			}
		}
		else {
			return false;
		}
	}

	const promiseGet = function (url, data) {
		if (typeof url !== 'undefined' && url !== '') {
			data = typeof data !== 'undefined' && data !== '' ? '?' + data : ''
			return new Promise( (resolve, reject) => {
				const ajax = new XMLHttpRequest()
				ajax.open('GET', url + data, true) // true = asynchronous
				ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest")
				ajax.onreadystatechange = function () {
					if (ajax.readyState == 4) {
						if (ajax.status >= 200 && (ajax.status < 300 || ajax.status === 304)) {
							try {
								const res = JSON.parse(ajax.responseText);
								resolve(res)
							} catch (e) {
								console.log('Error: failed parsing json from controller: ' + url)
								reject(Error(e))
							}
						}
						else {
							console.log('Error: no response from controller: ' + url)
							reject(Error(ajax.status))
						}
						hidePreloader()
					}
				}
				try {
					showPreloader()
					ajax.send(null)
				}
				catch (e) {
					console.log('Error: timeout request from controller: ' + url)
					reject(Error(e))
				}
			})
			
		}
		else {
			reject(Error('Error: undefined url'))
		}
	};
	var getAjaxText = function (url, data, success, complete, error) {
		if (typeof url !== 'undefined' && url !== '') {
			showPreloader();
			success = typeof success !== 'undefined' ? success : function () { };
			success = typeof success !== 'function' ? function () { } : success;
			complete = typeof complete !== 'undefined' ? complete : function () { };
			complete = typeof complete !== 'function' ? function () { } : complete;
			error = typeof error !== 'undefined' ? error : function () { };
			error = typeof error !== 'function' ? function () { } : error;
			data = (typeof data !== 'undefined') && (data !== '') ? '?' + data : '';
			var ajax = new XMLHttpRequest();
			ajax.open('GET', url + data, true); // true = asynchronous
			ajax.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			ajax.send(null);
			ajax.onreadystatechange = function () {
				if (ajax.readyState == 4) {
					if ((ajax.status == 200) || (ajax.status == 304)) {
						res = ajax.responseText;
						success(res);
					}
					else {
						error(ajax.status);
					}
					hidePreloader();
					complete();
					return;
				}
			};
		}
		else {
			return;
		}
	};
	var postAjax = function (url, data, success, complete, error, jsonError) {
		showPreloader();
		success = typeof success !== 'undefined' ? success : function () { };
		success = typeof success !== 'function' ? function () { } : success;
		complete = typeof complete !== 'undefined' ? complete : function () { };
		complete = typeof complete !== 'function' ? function () { } : complete;
		error = typeof error !== 'undefined' ? error : function () { };
		error = typeof error !== 'function' ? function () { } : error;
		jsonError = typeof jsonError !== 'undefined' ? jsonError : function (e) { console.log(e); };
		var ajax = new XMLHttpRequest();
		ajax.open('POST', url, true);
		ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		ajax.send(data);
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				if ((ajax.status == 200) || (ajax.status == 304)) {
					var res;
					try {
						res = JSON.parse(ajax.responseText);
						success(res);
					} catch (e) {
						jsonError(e);
					}
				}
				else {
					error(ajax.status);
				}
				hidePreloader();
				complete();
			}
		};
	};
	var postAjaxMultipart = function (url, data, success, complete, error, jsonError) {
		showPreloader();
		success = typeof success !== 'undefined' ? success : function () { };
		success = typeof success !== 'function' ? function () { } : success;
		complete = typeof complete !== 'undefined' ? complete : function () { };
		complete = typeof complete !== 'function' ? function () { } : complete;
		error = typeof error !== 'undefined' ? error : function () { };
		error = typeof error !== 'function' ? function () { } : error;
		jsonError = typeof jsonError !== 'undefined' ? jsonError : function (e) { console.log(e); };
		var ajax = new XMLHttpRequest();
		ajax.open('POST', url, true);
		ajax.send(data);
		ajax.onreadystatechange = function () {
			if (ajax.readyState == 4) {
				if ((ajax.status == 200) || (ajax.status == 304)) {
					var res;
					try {
						res = JSON.parse(ajax.responseText);
						success(res);
					} catch (e) {
						jsonError(e);
					}
				}
				else {
					error(ajax.status);
				}
				hidePreloader();
				complete();
			}
		};
	};
	var fileAjax = function (url, formData, success, complete, error, jsonError) {
		showPreloader();
		success = typeof success !== 'undefined' ? success : function () { };
		success = typeof success !== 'function' ? function () { } : success;
		complete = typeof complete !== 'undefined' ? complete : function () { };
		complete = typeof complete !== 'function' ? function () { } : complete;
		error = typeof error !== 'undefined' ? error : function () { };
		error = typeof error !== 'function' ? function () { } : error;
		jsonError = typeof jsonError !== 'undefined' ? jsonError : function (e) { console.log(e); };
		var ajax = new XMLHttpRequest();
		ajax.open('POST', url, true);
		ajax.send(formData);
		ajax.onreadystatechange = function () {
			if (ajax.readyState === 4) {
				if ((ajax.status === 200) || (ajax.status === 0)) {
					var res;
					try {
						res = JSON.parse(ajax.responseText);
						success(res);
					} catch (e) {
						jsonError(e);
					}
				}
				else {
					error();
				}
				hidePreloader();
				complete();
			}
		};
	};
	function y_post_action(form, target, object, with_print) {
		with_print = typeof with_print !== 'undefined' ? with_print : false;
		$(form).submit(function (event) {
			event.preventDefault();
			var r = confirm('Are you sure want to save?');
			if (r === true) {
				var data_form = $(form + ' :not(.input-filter):not(.input-filter-readonly):not(.unserialize)').serialize();
				var callback = function (status) {
					y_show_ajax_result(status, with_print);
					if (object) { object.reset(form); }
				};
				postAjax(target, data_form, callback);
			}
		});
	}
	function y_show_ajax_result(status, with_print, customTitle) {
		with_print = typeof with_print !== 'undefined' ? with_print : false;
		customTitle = typeof customTitle !== 'undefined' ? customTitle : false;
		if (status) {
			var t = yGetTime();
			var d = yGetDate();
			var title = '';
			var string = '';
			if (!customTitle) {
				if (typeof (window.yData.module) != 'undefined') {
					var icon = typeof (yData.icon) !== 'undefined' ? yData.icon : 'info_outline';
					var label = typeof (yData.label) !== 'undefined' ? yData.label : 'Information';
					title = yHtml({ element: 'i', class: 'material-icons tiny left', content: icon });
					title += yHtml({ element: 'span', content: label });
				}
			}
			else {
				title = customTitle;
			}
			for (var i in status) {
				string += status[i];
				if (i < (status.length - 1)) {
					string += '</br>'
				}
			}
			var time = d + ' ' + t;
			webApp.addNotification(title, string, true, true, time);
			if (with_print !== false) {
				y_print_html(string);
			}
		}
	}
	function prevent_key_enter(selector) {
		_(selector).on("keypress", function (e) {
			if (e.which == 13) { e.preventDefault(); }
			if (e.which == 96) { e.preventDefault(); _(selector).submit(); }
		});
	}
	function yClickPosition(ev) {
		var isIE = document.all;
		var p = [];
		if (ev) {
			p.x = isIE ? (ev.clientX + document.body.scrollLeft) : ev.pageX;
			p.y = isIE ? (ev.clientY + document.body.scrollTop) : ev.pageY;
		}
		return p;
	}
	function y_object_clone(object) {
		var object_copy = JSON.parse(JSON.stringify(object));
		return object_copy;
	}
	function y_message(title, text, id) {
		if (!id) id = 'y_message-' + (new Date()).getTime() + '-' + Math.floor((Math.random() * 100) + 1);
		$('.y_message_box').remove();
		var h = yHtml([
			{
				element: 'div', class: 'y_message_box', id: id, content: yHtml([
					{ element: 'div', class: 'panel_title', content: title },
					{ element: 'div', class: 'y_message_box_text', content: text }
				])
			}
		]);
		$('body').append(h);
		$('#' + id).off('click', '.panel_title');
		$('#' + id).on('click', '.panel_title', function () {
			$('#' + id).hide();
		});
	}
	y_command = function (wrapper, button_id, callback) {

		if (typeof callback !== 'undefined') {
			wrapper.off('click', button_id);
			wrapper.on('click', button_id, function (event) {
				event = event || window.event;
				event.preventDefault();
				callback(this);
			});
		}
		else if (typeof button_id !== 'undefined') {
			callback = button_id;
			button_id = wrapper;
			wrapper = $(document.body);
			y_command(wrapper, button_id, callback);
		}
		else if (typeof wrapper !== 'undefined' && typeof wrapper === 'object') {
			a = typeof wrapper.wrapper !== 'undefined' ? wrapper.wrapper : $(document.body);
			if (typeof wrapper.data !== 'undefined') {
				for (var i in wrapper.data) {
					if (typeof wrapper.data[i].button !== 'undefined' && typeof wrapper.data[i].callback !== 'undefined' && typeof wrapper.data[i].callback === 'function') {
						button_id = wrapper.data[i].button;
						callback = wrapper.data[i].callback;
						y_command(a, button_id, callback);
					}
				}
			}
		}
	};
	function y_valid_numeric(selector) {
		var format = new RegExp(/^\d+$/);
		var value = $.trim(selector.val());
		if (value === '' || !format.test(value)) {
			y_warning_invalid(selector);
		}
		else {
			y_reset_warning(selector);
		}
		return false;
	}

	/**
	 * Validate if value is date
	 * @param string id of element
	 * @return html
	 */
	function y_valid_input_date(selector) {

		var value = $.trim(selector.val());
		if (value === '') {
			y_warning_invalid(selector);
			return false;
		}
		else {
			if (y_valid_date(value) === false) {
				y_warning_invalid(selector);
				return false;
			}
			else {
				y_reset_warning(selector);
				return true;
			}
		}
	}
	function y_warning_invalid(selector) {
		selector.css('background-color', '#ff4444');
		selector.focus();
	}
	function y_reset_warning(selector) {
		selector.css('background-color', '#e9ffe8');
	}
	function y_valid_date(date) {
		var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
		if (matches === null) return false;
		var d = matches[2];
		var m = matches[1] - 1;
		var y = matches[3];
		var composedDate = new Date(y, m, d);
		return composedDate.getDate() == d &&
			composedDate.getMonth() == m &&
			composedDate.getFullYear() == y;
	}
	const is_integer = function (value) {
		if ((undefined === value) || (null === value)) {
			return false;
		}
		return value % 1 === 0;
	};
	const y_is_number = function (value) { return !isNaN(value - 0) && value !== null; };
	const yLog = function (message) { if (typeof console === 'object') { console.log(message); } }
	const useParam = function (object, param) {
		for (var field in param) { if (param.hasOwnProperty(field)) { object[field] = param[field]; } }
	}
	const elvis = function (a, b) {
		return typeof a !== 'undefined' ? a : typeof b !== 'undefined' ? b : false
	}
	const getCaret = function (el) { if (el.selectionStart) { return el.selectionStart; } else if (document.selection) { el.focus(); const r = document.selection.createRange(); if (r == null) { return 0; } const re = el.createTextRange(), rc = re.duplicate(); re.moveToBookmark(r.getBookmark()); rc.setEndPoint('EndToStart', re); return rc.text.length; } return 0; }
	const setCaret = function (el, pos) { if (el != null) { if (el.createTextRange) { const range = el.createTextRange(); range.move('character', pos); range.select(); } else { if (el.selectionStart) { el.focus(); el.setSelectionRange(pos, pos); } else { el.focus() } } } }
	if (typeof window === 'object' && typeof window.document === 'object') {
		window.y_html = _htmlCode;
		window.yHtml = _htmlCode;
		window._ = window.y = y;
		window.__ = y(document);
		window.yClock = yClock;
		window.yGetTimeStamp = yGetTimeStamp;
		window.showPreloader = showPreloader;
		window.hidePreloader = hidePreloader;
		window.y_wait_show = showPreloader;
		window.y_wait_hide = hidePreloader;
		window.y_handle_paste = y_handle_paste;
		window.y_grid_paste = y_grid_paste;
		window.y_post_action = y_post_action;
		window.y_show_ajax_result = y_show_ajax_result;
		window.prevent_key_enter = prevent_key_enter;
		window.y_object_clone = y_object_clone;
		window.cloneObject = y_object_clone;
		window.yLog = yLog;
		window.y_message = y_message;
		window.y_print_html = y_print_html;
		window.promiseGet = promiseGet;
		window.getAjax = getAjax;
		window.postAjax = postAjax;
		window.postAjaxMultipart = postAjaxMultipart;
		window.fileAjax = fileAjax;
		window.y_command = y_command;
		window.y_valid_numeric = y_valid_numeric;
		window.y_valid_input_date = y_valid_input_date;
		window.y_is_number = y_is_number;
		window.is_integer = is_integer;
		window.useParam = useParam;
		window.yClickPosition = yClickPosition;
		window.elvis = elvis
		window.getCaret = getCaret
		window.setCaret = setCaret
	}
})(window);
String.prototype.capitalize = function () {
	return this.charAt(0).toUpperCase() + this.slice(1);
};
