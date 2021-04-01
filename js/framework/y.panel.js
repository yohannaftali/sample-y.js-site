//----------------------------------------------------------------------------------------------------------------------
// Panel Framework
// 2019.10.02
//----------------------------------------------------------------------------------------------------------------------
(function (window, undefined) {
	var document = window.document;
	var location = window.location;

	/* Panel Object */
	var panel = function (param) {
		this.object = param;
		this.master = false;
		this.detail_header = false;
		this.detail = false;
		this.history_header = false;
		this.history = false;
		this.instancesTooltip;
		this.instancesDate;
		this.instancesTime;
		// Select
		this.instancesMasterSelect = [];
		this.instancesSelect = [];
		this.selectList = [];
		this.selectController = [];
		this.resSelect = [];

		// Select Filter 
		this.instancesMasterSelectFilter = [];
		this.instancesSelectFilter = [];
		this.selectFilterList = [];
		this.selectFilterController = [];
		this.resSelectFilter = [];

		this.collapsibleMaster;
		this.collapsibleDetail;
		this.collapsibleHistory;
		this.masterTable = [];
		this.writePanel(param);
		this.formatDate = typeof param.formatDate !== 'undefined' ? param.formatDate : 'dd/mm/yyyy';
		this.formatTime = 'hh:ii';
		this.queryUrl;
		this.modeSelect = 'materialize';
		this.withToolbar = true;
		this.listenerWindowResize()
		this.set_default_panel_height = function () { };
		this.lastValueSelect = false
	};

	/////////////////////////////////////////////////////////////////////////////////////
	// Write Panel
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.writePanel = function (param) {
		var h = yHtml([
			this.panelToolbar(),
			{
				element: 'div',
				id: 'module-content',
				class: '',
				content: yHtml([{
					element: 'div',
					class: 'content-wrapper',
					content: yHtml({
						element: 'form',
						id: param.name,
						class: 'form-module'
					})
				}])
			}
		]);
		$('#module-panel').append(h);
		switch (param.panelType) {
			case 'm':
				this.write_m(param);
				break;
			case 'md':
				this.write_md(param);
				break;
			case 'mdh':
				this.write_mdh(param);
				break;
		}
	};
	panel.prototype.panelToolbar = function () {
		var p = 'panel-y-toolbar';
		var submitButton = this.button({
			label: 'Submit',
			id: 'button-submit',
			icon: 'send',
			label: 'Submit',
			iconPosition: 'right',
			addClass: 'button-submit'
		})
		var object = {
			element: 'nav',
			id: 'module-toolbar',
			class: p,
			content: yHtml([{
				element: 'ul',
				id: 'toolbar-module-left',
				class: 'left',
				content: ''
			},
			{
				element: 'ul',
				id: 'toolbar-module-right',
				class: 'right',
				content: yHtml({ element: 'li', content: yHtml(submitButton) })
			}
			])
		};
		return object;
	};
	panel.prototype.write_m = function (param) {
		var selector = param.active_form;
		var ml = param.panel_master_label;
		this.master = '.panel_y_master_data';
		var h = yHtml(
			this.cardPanel('master', ml, 'no table')
		);
		$(selector).append(h);

		this.collapsibleMaster = this.collapsibleListener('.panel_y_master');

	};
	panel.prototype.write_md = function (param) {
		var selector = param.active_form;
		var ml = param.panel_master_label;
		var dl = param.panel_detail_label;
		this.master = '.panel_y_master_data';
		this.detail_header = '.panel_y_detail_table_header';
		this.detail = '.panel_y_detail_table_data';
		var h = yHtml([
			this.cardPanel('master', ml, 'no table'),
			this.cardPanel('detail', dl)
		]);
		$(selector).append(h);
		this.collapsibleMaster = this.collapsibleListener('.panel_y_master');
		this.collapsibleDetail = this.collapsibleListener('.panel_y_detail');
		this.listenerStickyTable('detail');
	};
	panel.prototype.write_mdh = function (param) {
		var selector = param.active_form;
		var ml = param.panel_master_label;
		var dl = param.panel_detail_label;
		var hl = param.panel_history_label;
		this.master = '.panel_y_master_data';
		this.detail_header = '.panel_y_detail_table_header';
		this.detail = '.panel_y_detail_table_data';
		this.history_header = '.panel_y_history_table_header';
		this.history = '.panel_y_history_table_data';
		var h = yHtml([
			this.cardPanel('master', ml, 'no table'),
			this.cardPanel('detail', dl),
			this.cardPanel('history', hl)
		]);
		$(selector).append(h);
		this.collapsibleMaster = this.collapsibleListener('.panel_y_master');
		this.collapsibleDetail = this.collapsibleListener('.panel_y_detail');
		this.collapsibleHistory = this.collapsibleListener('.panel_y_history');
		this.listenerStickyTable('detail');
	};
	panel.prototype.cardPanel = function (type, content, option) {
		content = typeof (content) != 'undefined' ? content : '';
		var p = 'panel_y_';
		var tbl = '_table';
		var hdr = '_header';
		var dta = '_data';
		var cardTitle = {
			element: 'div',
			class: 'collapsible-header panel-title gradient-45deg-blue-grey-darken light-blue-text text-lighten-5 panel-title-' + type,
			content: content,
			['data-target']: 'panel-y-' + type
		};
		var cardContent;
		var panelRecordInfo = {
			element: 'div',
			class: 'panel-record-info panel-record-info-' + type
		};
		if (typeof option != 'undefined' && option == 'no table') {
			cardContent = {
				element: 'div',
				class: p + type + dta
			};
		} else {
			cardContent = {
				element: 'table',
				class: p + type + tbl + ' highlight striped responsive-table',
				content: yHtml([{
					element: 'thead',
					class: '',
					content: yM.tr({
						element: 'tr',
						class: p + type + tbl + hdr
					})
				},
				{
					element: 'tbody',
					class: p + type + tbl + dta
				},
				])
			};
		}
		var style = 'display: none;'
		if (type !== 'master') {
			style = 'display: block;'
		}
		let cardBody = {};
		if (type == 'master') {
			let buttonSubmit = yM.buttonFloating({
				parent: '.panel-title-master',
				isSmall: 'true',
				id: 'button-submit',
				icon: 'send',
				class: 'button-submit'
			});
			cardBody = {
				element: 'div',
				class: 'collapsible-body no-padding panel-y-body',
				style: style,
				content: yHtml(cardContent)
			};
		}
		else {
			cardBody = {
				element: 'div',
				class: 'collapsible-body no-padding panel-y-body',
				style: style,
				content: yHtml([cardContent, panelRecordInfo])
			};
		}

		var child = yHtml([cardTitle, cardBody]);
		let classLi = '';
		if (type !== 'master') {
			classLi = 'active';
		}
		var object = {
			element: 'ul',
			id: 'panel-y-' + type,
			class: p + type + ' card collapsible collapsible-panel',
			content: yHtml({
				element: 'li',
				class: classLi,
				content: child
			})
		};
		return object;
	};

	/////////////////////////////////////////////////////////////////////////////////////
	// Write Master
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.writeMaster = function (param, parent) {
		var that = this;
		parent = typeof parent !== 'undefined' ? parent : this.master
		var multiparam = [];
		var h = [];
		var useDate = false;
		var useTime = false;
		var rowClass = [];
		rowClass[0] = false;
		let masterSelect = [];
		let masterButtonSelect = [];
		for (var i in param) {
			let p = param[i];
			let row = 0;
			let isDisabled = this.isParam(p, 'is_disabled')
			let isReadonly = this.isParam(p, 'is_readonly')
			let collapsible = this.isParam(p, 'collapsible')
			if (typeof p.row !== 'undefined') {
				row = typeof p.row !== 'object' ? p.row - 1 : (p.row.no) - 1;
				if (typeof rowClass[row] === 'undefined') {
					rowClass[row] = false;
				}
				if (!rowClass[row]) {
					rowClass[row] = typeof p.row !== 'object' ? false : p.row.class;
				}
			}
			if (typeof h[row] === 'undefined') {
				h[row] = '';
			}
			let name = typeof p.name !== 'undefined' ? p.name : '';
			let addClass = typeof p.addClass !== 'undefined' ? p.addClass : '';
			let addClassLabel = typeof p.addClassLabel !== 'undefined' ? p.addClassLabel : '';
			if (this.isParam(p, 'table')) {
				this.masterTable.push(name);
				let clColTable = 'table-master col ';
				clColTable += typeof p.col !== 'undefined' ? p.col : 's12 m12 x12 xl12';
				let tableContent = '';
				if (typeof p.content !== 'undefined') {
					headerButton = typeof p.headerButton !== 'undefined' ? p.headerButton : false;
					tableContent = this.generateTableMaster(name, p.content, p.label, headerButton, collapsible);
				}
				h[row] += yM.col({
					class: clColTable,
					content: tableContent
				});
				if (typeof this.object[name] === 'undefined') {
					this.object[name] = '.panel_y_' + name + '_table_data';
				}
				if (typeof this.object.field[name] === 'undefined') {
					this.object.field[name] = [];
					this.object.field[name] = p.content;
				}
			}
			else if (this.isParam(p, 'select')) {
				let clField = 'input-field input-field-master col ';
				clField += typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3';
				let classInput = 'input-select input-master-select ' + addClass;
				let selectContent = '';
				var pIcon = false;
				if (typeof p.icon !== 'undefined') {
					pIcon = p.icon;
				}
				if (typeof p.option !== 'undefined') {
					for (var j in p.option) {
						selectContent += yM.option(p.option[j])
					}
				}
				masterSelect.push(p.name);
				if (typeof p.label !== 'undefined') {
					if (typeof p.label === 'string') {
						p.label = {
							content: p.label,
							class: 'active'
						}
					}
					else if (typeof p.label === 'object') {
						p, label.addClass = 'active'
					}
				}
				h[row] += yM.inputFieldSelect({
					class: clField,
					icon: pIcon,
					select: {
						id: 'input_' + name,
						name: name,
						content: selectContent,
						class: classInput,
						addClass: addClass,
						tag: addClass
					},
					label: p.label,
					span: p.span
				})
			}
			else if (this.isParam(p, 'button_select')) {
				let clField = 'input-field input-field-master col ';
				clField += typeof p.col !== 'undefined' ? p.col : 's12';
				let classInput = 'input-button-select input-master-button-select ' + addClass;
				let buttonSelectContent = '';
				var pIcon = false;
				if (typeof p.icon !== 'undefined') {
					pIcon = p.icon;
				}
				if (typeof p.option !== 'undefined') {
					for (var j in p.option) {
						selectContent += yM.option(p.option[j])
					}
				}
				masterButtonSelect.push(p.name)
				if (typeof p.label !== 'undefined') {
					if (typeof p.label === 'string') {
						p.label = {
							content: p.label,
							class: 'active'
						}
					}
					else if (typeof p.label === 'object') {
						p, label.addClass = 'active'
					}
				}
				h[row] += yM.row({
					class: clField,
					icon: pIcon,
					id: 'row-button-select-' + name,
					name: name,
					content: buttonSelectContent,
					class: classInput,
					addClass: addClass,
					tag: addClass,
					label: p.label,
					span: p.span
				})
				h[row] += yM.inputFieldSelect({
					class: 'hide',
					select: {
						id: 'input_' + name,
						name: name,
						content: '',
						class: classInput,
					}
				})
			}
			else if (this.isParam(p, 'checkbox')) {
				p.label = typeof p.label !== 'undefined' ? p.label : '';
				p.value = typeof p.value !== 'undefined' ? p.value : '';
				let pInputCheckbox = {
					id: 'input_' + name,
					label: p.label,
					value: p.value,
					addClass: addClass
				}
				let colClass = typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3'
				h[row] += yM.col({
					class: colClass,
					content: yM.inputCheckbox(pInputCheckbox)
				})
			}
			else if (this.isParam(p, 'radio')) {
				p.label = typeof p.label !== 'undefined' ? p.label : '';
				p.value = typeof p.value !== 'undefined' ? p.value : '';
				let pInputRadio = {
					id: 'input_' + name + '-' + p.value,
					name: name,
					label: p.label,
					value: p.value,
					addClass: addClass
				}
				let colClass = typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3'
				h[row] += yM.col({
					class: colClass,
					content: yM.inputRadio(pInputRadio)
				})
			}
			else if (this.isParam(p, 'labelRadio')) {
				p.label = typeof p.label !== 'undefined' ? p.label : '';
				let colClass = typeof p.col !== 'undefined' ? p.col : 's3 m4 x2 xl1'
				h[row] += yM.col({
					class: colClass,
					addClass: addClass,
					content: yM.label({
						class: 'label_form label-radio',
						content: p.label
					})
				})
			}
			else if (this.isParam(p, 'html')) {
				p.code = typeof p.code !== 'undefined' ? p.code : '';
				h[row] += p.code
			}
			else if (this.isParam(p, 'button')) {
				p.icon = typeof p.icon !== 'undefined' ? p.icon : '';
				p.label = typeof p.label !== 'undefined' ? p.label : '';
				p.name = typeof p.name !== 'undefined' ? p.name : '';
				p.type = typeof p.type !== 'undefined' ? p.type : 'btn';
				p.class = typeof p.class !== 'undefined' ? p.class + ' left' : ' left';
				colClass = typeof p.col !== 'undefined' ? p.col : 's1'
				let pButton = {
					id: 'button-master-' + name,
					type: p.type,
					class: p.class,
					icon: p.icon,
					content: p.label
				};
				if (typeof p['data-tooltip'] !== 'undefined') {
					pButton['data-tooltip'] = p['data-tooltip'];
					let dataPosition = typeof p['data-position'] !== 'undefined' ? p['data-position'] : 'right';
					pButton['data-position'] = dataPosition
				}
				h[row] += yM.col({
					class: colClass,
					content: yM.button(pButton)
				})
			}
			else {
				let classInput = 'input_text input_master_text autocomplete' + ' ' + addClass;
				let clSpan = 'blue-text text-lighten-3 character-counter ';
				var isDatePicker = false;
				var isTimePicker = false;
				let isRightAlign = this.isParam(p, 'right_align');
				if (isRightAlign) {
					classInput += ' right-align';
				}
				if (typeof p.type !== 'undefined') {
					switch (p.type) {
						case 'date':
							useDate = true;
							isDatePicker = true;
							classInput += ' datepicker input_master_text';
							break;
						case 'time':
							useTime = true;
							isTimePicker = true;
							classInput += ' timepicker input_master_text';
							break;
					}
				}
				if (typeof p.span !== 'undefined' && typeof p.span === 'object') {
					clSpan = typeof p.span.class !== 'undefined' ? clSpan + ' ' + p.span.class : clSpan;
					p.span.class = clSpan;
				} else if (typeof p.span === 'string') {
					let contentSpan = p.span;
					p.span = {
						content: contentSpan,
						class: clSpan
					}
				} else if (isDatePicker) {
					p.span = {
						content: this.formatDate,
						class: clSpan
					}
				} else if (isTimePicker) {
					p.span = {
						content: this.formatTime,
						class: clSpan
					}
				}
				// Multi Param
				if (this.isParam(p, 'multiparam')) {
					let r = this.inputMultiParam(p, name, classInput, clSpan, isDatePicker, isTimePicker);
					h[row] += typeof r.h !== 'undefined' ? r.h : '';
					if (typeof r.h !== 'undefined') {
						multiparam.push(r.m);
					}
				}
				// Main Field
				else if (this.isParam(p, 'is_main')) {
					classInput += ' browser-default title-document' + addClass;
					yM.inputField({
						parent: '.panel-title-master',
						class: 'browser-default input-field-title-document',
						input: { id: 'input_' + name, class: classInput, content: '', name: name },
						label: '',
						icon: 'folder_open'
					})
				}
				// Single param
				else {
					let clField = 'input-field input-field-master col ';
					clField += typeof p.col !== 'undefined' ? p.col : 's12 m12 x6 xl3';
					if (isRightAlign) {
						clField += ' right-align';
					}
					let label_info_content = '';
					if (typeof p.label_info !== 'undefined' && (p.label_info === true || p.label_info === 'yes')) {
						// label : label
						label_info_content = typeof p.content !== 'undefined' ? p.content : '';
						h[row] += yM.col({
							class: clField,
							content: yM.label({
								class: 'label_form ' + addClass,
								content: p.label
							}) +
								yM.div({
									id: 'label_info_' + name,
									class: 'label_form label_info ',
									content: label_info_content
								})
						})
					} else if (typeof p.label_only !== 'undefined' && (p.label_only === true || p.label_only === 'yes')) {
						// label
						h[row] += yM.div({
							class: clField,
							content: yM.label({
								class: 'label_form',
								content: p.label
							})
						});
					} else if (typeof p.hidden !== 'undefined' && p.hidden === true) {
						// input type=hidden
						h[row] += yM.input({
							type: 'hidden',
							tabindex: '-1',
							id: 'input_' + name,
							name: name,
							class: classInput
						});
					} else {
						// label : input
						var pIcon = false;
						if (typeof p.icon !== 'undefined') {
							pIcon = p.icon;
						}
						let input = {
							type: 'text',
							id: 'input_' + name,
							name: name,
							class: classInput
						}
						if (typeof p.textarea !== 'undefined') {
							input.element = 'textarea'
							if (typeof (p.textarea.rows) !== 'undefined') {
								input.rows = p.textarea.rows

							}
							input.class = "materialize-textarea " + addClass
						}
						if (isDisabled) {
							input['disabled'] = true
						}
						if (isReadonly) {
							input['readonly'] = true
						}
						if (typeof p.maxlength !== 'undefined') {
							input.maxlength = p.maxlength
						}
						h[row] += yM.inputField({
							class: clField,
							icon: pIcon,
							input: input,
							label: p.label,
							span: p.span
						})
					}
				}
			}
		}
		let masterContent = '';
		for (var i in h) {
			if (rowClass[i]) {
				masterContent += yM.row({
					class: rowClass[i],
					content: h[i]
				});
			}
			else {
				masterContent += yM.row(h[i]);
			}
		}
		const htmlResult = yM.div({
			parent: parent,
			class: 'panel_master_content container',
			content: masterContent
		});
		if (multiparam.length > 0) {
			for (var i in multiparam) {
				let id = multiparam[i].id;
				let name = multiparam[i].name;
				let label = multiparam[i].label;
				let ac = multiparam[i].ac;
				let selector = multiparam[i].selector;
				that.createMultiSelectModal(id, name, label, ac);
				that.listenerMultiSelect(id, name, ac, selector);
				let elem = document.querySelectorAll('#' + id);
				M.Modal.init(elem, {});
			}
		}
		if (useTime) {
			var elems = document.querySelectorAll('.timepicker');
			M.Timepicker.init(elems, {
				defaultTime: 'now',
				twelveHour: false,
				vibrate: true
			});
		}
		if (useDate) {
			var options = {
				format: this.formatDate,
				defaultDate: 'now',
				autoClose: true
			};
			var elems = document.querySelectorAll('.datepicker');
			M.Datepicker.init(elems, options);
		}
		for (let i in masterSelect) {
			this.updateSelectItem(masterSelect[i], '', undefined)
		}
		for (let i in masterButtonSelect) {
			this.updateButtonSelectItem(masterButtonSelect[i], '', undefined)
		}
		return htmlResult
	};

	panel.prototype.updateSelectItem = function (nameSelect, param, callback) {
		let that = this
		let elem = document.getElementById('input_' + nameSelect);
		callback = typeof callback !== 'undefined' ? callback : function () { }
		let onSuccess = function (res) {
			elem.innerHTML = ''
			if (typeof res !== 'undefined' && res.length > 0) {
				let optionSelect = '';
				for (var j in res) {
					optionSelect += yM.option(res[j]);
				}
				elem.innerHTML += optionSelect;
			}
		}
		let onComplete = function () {
			if (that.modeSelect === 'materialize') {
				if (typeof that.instancesMasterSelect[nameSelect] !== 'undefined') {
					that.instancesMasterSelect[nameSelect].destroy()
				}
				that.instancesMasterSelect[nameSelect] = M.FormSelect.init(elem, {
					dropdownOptions: {
						onOpenStart: function () {
							const val = $(elem).val()
							$(elem).attr('last', val)
						}
					}
				});
				let tag = $('#input_' + nameSelect).attr('tag')
				let sibl = $('#input_' + nameSelect).siblings('input')
				$('#input_' + nameSelect).siblings('input').addClass(tag)
			}
			else {
				$('#input_' + nameSelect).select2();
			}
			callback()
		}
		getAjax(this.queryUrl + 'call_' + nameSelect + '_select', param, onSuccess, onComplete);
	}

	panel.prototype.updateButtonSelectItem = function (name, param, callback) {
		const that = this
		const elem = document.getElementById('row-button-select-' + name)
		const selectElem = document.getElementById('input_' + name)
		callback = typeof callback !== 'undefined' ? callback : function () { }
		let onSuccess = function (res) {
			elem.innerHTML = ''
			if (typeof res !== 'undefined' && res.length > 0) {
				let h = '';
				let optionSelect = '';
				for (let i in res) {
					const item = res[i]
					const value = typeof item.value !== 'undefined' ? item.value : ''
					const label = typeof item.label !== 'undefined' ? item.label : ''
					const icon = typeof item.icon !== 'undefined' ? item.icon : 'check'
					h += yM.buttonLarge(
						{
							id: 'btn-select-item-' + name + '-' + i,
							class: 'btn-select-item hoverable',
							data: value,
							icon: icon,
							content: label

						}
					)
					$('#row-button-select-' + name).on('click', '#btn-select-item-' + name + '-' + i, function (e) {
						e.preventDefault()
					})
					optionSelect += yM.option(item)
				}
				elem.innerHTML += h
				selectElem.innerHTML += optionSelect
			}
		}
		let onComplete = function () {
			callback()
		}
		getAjax(this.queryUrl + 'call_' + name + '_select', param, onSuccess, onComplete);
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Table Component on Panel Master
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.generateTableMaster = function (name, param, label, headerButton, collapsible) {
		headerButton = typeof headerButton !== 'undefined' ? headerButton : false;
		let tableButton = '';
		if (headerButton) {
			if (typeof headerButton === 'object' && Array.isArray(headerButton) && headerButton.length > 0) {
				for (let i in headerButton) {
					headerButton[i].addClass = 'right'
					tableButton += yM.button(headerButton[i])
				}
			}
			else if (typeof headerButton === 'object') {
				tableButton = yM.button(headerButton)
			}
			else {
				tableButton = yM.button({ content: headerButton })
			}
		}
		let collapsibleButton = typeof collapsible !== 'undefined' && collapsible ? yM.span({
			class: 'button-collapsible-trigger waves-effect waves-light ' + 'collapsible-trigger-panel_y_' + name,
			data: name,
			style: 'position:absolute; right:10px; cursor: pointer; user-select: none; -webkit-user-select: none;',
			content: yM.icon('indeterminate_check_box')
		}) : '';
		let caption = typeof label !== 'undefined' && label ? yM.caption({
			class: 'table-caption',
			content: label + collapsibleButton,
			style: 'width:100%;'
		}) : '';
		let tableHeader = this.generateTableHeader(name, param);
		let sumHeader = this.generateTableHeaderSum(param);
		let tableFilter = this.generateTableFilter(param, name);
		let sumFooter = this.generateTableFooterSum(param);
		let contentHeader = '';
		if (headerButton) {
			let colspan = typeof param.length !== 'undefined' ? param.length : false;
			if (colspan) { contentHeader += yM.tr(yM.th({ colspan: colspan, content: tableButton })) } else { contentHeader += yM.tr(yM.th({ content: tableButton })) }
		}
		if (tableFilter) { contentHeader += tableFilter }
		if (sumHeader) { contentHeader += sumHeader }
		contentHeader += yM.tr({
			element: 'tr',
			class: 'panel_y_' + name + '_table_header',
			content: tableHeader
		})
		let head = yM.thead({
			content: yM.tr({
				element: 'tr',
				class: 'panel_y_' + name + '_table_header',
				content: contentHeader
			})
		});
		let body = yM.tbody({ class: 'panel_y_' + name + '_table_data' });
		let footer = '';
		if (sumFooter) { footer = yM.tfoot(yM.tr(sumFooter)); }
		let result = yM.table({
			class: 'table-panel highlight striped responsive-table panel_y_' + name + '_table',
			content: caption + head + body + footer
		}) + yM.div({ class: 'panel-after-table', content: yM.div({ class: 'panel-record-info panel-record-info-' + name }) });
		return result;
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Input Multi Param Component on Panel Master
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.inputMultiParam = function (p, name, classInput, clSpan, useDate, useTime) {
		let clField = 'input-field col ';
		clField += typeof p.col !== 'undefined' ? p.col : 's6';
		let start = name + '_start';
		let end = name + '_end';
		let idMultiSelect = 'modal-multi-select-' + this.guid();
		let contentFrom = [
			{ element: 'input', type: 'text', id: start, name: start, class: classInput },
			{ element: 'span', class: 'helper-text', content: 'from' },
			{ element: 'label', for: start, content: p.label },
		];
		let contentTo = [
			{ element: 'input', type: 'text', id: end, name: end, class: classInput },
			{ element: 'span', class: 'helper-text', content: 'to' },
			{ element: 'label', for: end, content: '' },
		];
		let objStyle = 'float: right; min-height: 18px; font-size: 12px;'
		let objFrom = { element: 'span', class: clSpan, style: objStyle, content: this.formatDate };
		let objTo = { element: 'span', class: clSpan, style: objStyle, content: this.formatDate };
		if (useDate) {
			objFrom.content = this.formatDate
			objTo.content = this.formatDate
		}
		if (useTime) {
			objFrom.content = this.formatTime
			objTo.content = this.formatTime
		}
		if (typeof p.span !== 'undefined') {
			objFrom.content = yM.span(p.span)
			objTo.content = yM.span(p.span)
		}
		contentFrom.push(objFrom)
		contentTo.push(objTo);

		let wrapper = yM.row({
			class: 'wrapper-input-field-multi-select',
			content: yM.div({ class: clField, content: yHtml(contentFrom) }) + yM.div({ class: clField, content: yHtml(contentTo) })
		})
		let buttonModal = yM.buttonFlat({
			class: 'light-blue darken-1 white-text modal-trigger waves-effect waves-blue btn-multi-select',
			['data-target']: idMultiSelect,
			content: yM.icon('playlist_add')
		});

		let h = yM.row({
			content: yM.col({
				class: 's12',
				content: wrapper + buttonModal
			})
		});
		let m = {
			id: idMultiSelect,
			label: p.label,
			name: name,
			ac: p.ac,
			selector: start
		};
		return {
			h: h,
			m: m
		}
	}
	panel.prototype.listenerMultiSelect = function (id, name, ac, selector) {
		var that = this;
		var yms = 'y_multi_select_';
		var input_position;
		var select = true;
		var exclude = false;
		$('#y_select_panel_' + id).off('focusin', '.last_input');
		$('#y_select_panel_' + id).on('focusin', '.last_input', function () {
			$(this).removeClass('last_input');
			var row = $(this).attr('row');
			var new_row = parseInt(row) + 1;
			var type = 'select';
			that.addMultiSelectInput('#y_' + type + '_panel_' + id, type, name, new_row, ac, true);
		});
		$('#y_exclude_panel_' + id).off('focusin', '.last_input');
		$('#y_exclude_panel_' + id).on('focusin', '.last_input', function () {
			$(this).removeClass('last_input');
			var row = $(this).attr('row');
			var new_row = parseInt(row) + 1;
			var type = 'exclude';
			that.addMultiSelectInput('#y_' + type + '_panel_' + id, type, name, new_row, ac, true);
		});
		$('#y_exclude_panel_' + id).hide();
		var ms = $('#' + id);
		input_position = ms.find('input[type=text]').filter(':visible:first').attr('id');
		var p_select = $('#y_select_panel_' + id);
		var p_exclude = $('#y_exclude_panel_' + id);
		this.command(ms, '.' + yms + 'single_search', function (object) {
			var selector = $(object).siblings('.input_master_text');
			that.showTableSelection(ac, selector);
		});
		var cl_ob = yms + 'option_button';
		var cl_obs = yms + 'option_button_selected';
		this.command(ms, '.button-multi-select-exclude', function () {
			select = false;
			exclude = true;
			$('.select_input_' + id).val('');
			yM.setInputValue('#' + selector, '');
			p_select.hide();
			$('#' + yms + 'button_select' + id).removeClass('active');
			p_exclude.show();
			$('#' + yms + 'button_exclude' + id).addClass('active');
		});
		this.command(ms, '.button-multi-select-include', function () {
			select = true;
			exclude = false;
			$('.exclude_input_' + id).val('');
			yM.setInputValue('#' + selector, '');
			p_select.show();
			$('#' + yms + 'button_select' + id).addClass('active');
			p_exclude.hide();
			$('#' + yms + 'button_exclude' + id).removeClass('active');
		});
		this.command(ms, '#button_select_' + id, function () {
			if (select === true) {
				yM.setInputValue('#' + selector, 'selected list')
			} else {
				$('#' + selector).val('excluded list');
			}
			$('#' + id).hide();
		});
		this.command(ms, '#button_clear_' + id, function () {
			yM.setInputValue('#' + selector, '');
			ms.find('textarea[type=text]').val('');
		});
		ms.off('paste', '.textarea_single');
		ms.on('paste', '.textarea_single', function () {
			that.handlePasteSelection(this, name, ac);
		});
		ms.off('focusin', '.input_master_text');
		ms.on('focusin', '.input_master_text', function () {
			var this_id = $(this).attr('id');
			$('#button_paste_' + yms + 'box_' + name).attr('row', this_id);
		});
	}
	panel.prototype.listInput = function (type, name, row, ac, last) {
		var yms = 'y_multi_select_';
		var cl_input = 'input_multi_select textarea_single input_master_text';
		var class_cell = cl_input + ' input_' + yms + 'box_' + name;
		if (typeof last != 'undefined' && last === true) {
			class_cell += ' last_input';
		}
		return yM.tr({
			class: yms + 'text_row',
			content: yM.td({
				content: yM.div({
					class: yms + 'highlight_text', content: (parseInt(row) + 1)
				})
			}) +
				yM.td(yM.textarea({
					rows: 1,
					type: 'text',
					row: row,
					id: name + '_' + row,
					name: name + '[' + row + ']',
					class: class_cell + ' ' + type + '_input_' + yms + 'box_' + name
				})) +
				yM.td({
					content: yM.buttonFlat({
						class: yms + 'single_search search_button_26 search_button_' + name,
						row: ac,
						icon: 'search',
						content: ''

					})
				})
		});
	};
	panel.prototype.addMultiSelectInput = function (wrapper, type, name, row, ac, last) {
		var html = this.listInput(type, name, row, ac, last);
		$(wrapper).append(html);
	};
	panel.prototype.createMultiSelectModal = function (id, name, label, ac) {
		var that = this;
		var yms = 'y_multi_select_';
		var textSelect = '';
		var textExclude = '';
		for (var j = 0; j < 10; j++) {
			var last = false;
			if (j == 9) {
				last = true;
			}
			textSelect += this.listInput('select', 'select_' + name, j, ac, last);
			textExclude += this.listInput('exclude', 'exclude_' + name, j, ac, last);
		}
		var h = yM.modal({
			parent: '#module-content',
			id: id,
			content: yM.modalContent({
				class: 'y_multi_select',
				id: id + '_panel',
				content: yM.h4({
					class: 'panel-title gradient-45deg-blue-grey-darken white-text panel_expanded',
					isCenterAlign: true,
					content: label
				}) +
					yM.row({
						class: yms + 'toolbar_row',
						content: yM.button({
							id: 'button_select_' + id,
							icon: 'receipt',
							class: 'light-blue darken-1 modal-close',
							content: 'Select'
						}) +
							yM.button({
								id: 'button_clear_' + id,
								icon: 'clear',
								class: 'light-blue darken-1',
								content: 'Clear'
							})
					}) +
					yM.row({
						class: yms + 'option_row',
						content: yM.tabs({
							content: yM.tab({
								id: yms + 'button_select' + id,
								class: 'button-multi-select button-multi-select-include active col s6',
								content: 'Include Values',
								icon: 'thumb_up'
							}) +
								yM.tab({
									id: yms + 'button_exclude' + id,
									class: 'button-multi-select button-multi-select-exclude col s6',
									content: 'Exclude Values',
									icon: 'thumb_down'
								})
						})
					}) +
					yM.table({
						id: 'y_select_panel_' + id,
						class: yms + 'panel ' + yms + 'panel_select',
						content: yM.tbody(textSelect)
					}) +
					yM.table({
						id: 'y_exclude_panel_' + id,
						class: yms + 'panel ' + yms + 'panel_exclude',
						content: yM.tbody(textExclude)
					})
			}) +
				yM.modalFooter({
					content: yM.buttonFlat({
						class: 'modal-close waves-effect waves-green',
						content: 'Close'
					})
				})
		});
	};
	panel.prototype.handlePasteSelection = function (obj, name, ac) {
		obj = $(obj);
		var that = this;
		setTimeout(function () {
			var name = obj.attr('name');
			var name_array = name.split('[');
			var input_name = name_array[0];
			var start_index = parseInt(name_array[1].replace(']', ''));
			var parent = obj.parent().parent();
			var pid = '#' + $(parent).attr('id');
			var i;
			var last_row = parseInt($(parent).find('.last_input').attr('row'));
			if (!isNaN(start_index)) {
				var paste_value = '';
				var rows = '';
				paste_value = obj.val();
				paste_value = paste_value.replace(/[\s\r\n]+$/, '');
				rows = paste_value.split('\n');
				var no_of_rows = rows.length;
				obj.val('');
				if (no_of_rows > ((last_row - start_index) + 1)) {
					var required = no_of_rows - ((last_row - start_index) + 1);
					var new_last_index = (last_row + required);
					for (i = last_row; i < new_last_index; i++) {
						var type = 'select';
						that.addMultiSelectInput(pid, type, input_name, (parseInt(i) + 1), ac, false);
					}
					$('#' + input_name + '_' + last_row).removeClass('last_input');
					$('#' + input_name + '_' + new_last_index).addClass('last_input');
				}
				var this_name;
				for (i = 0; i < no_of_rows; i++) {
					let thisIndex = parseInt(start_index) + i;
					this_name = input_name + '[' + thisIndex + ']';
					var is_last = $('textarea[name="' + this_name + '"]').attr('col');
					$('textarea[name="' + this_name + '"]').val(rows[i]);
				}
				$('textarea[name="' + this_name + '"]').focus();
			}
		}, 0);
	};
	panel.prototype.writeTableSelectionData = function (data) {
		var yms = 'y_multi_select_';
		var row = 0;
		var data_rows = '';
		for (var i in data) {
			if (data[i].data !== null) {
				data_rows += yM.tr({
					class: yms + 'table_data_row',
					content: yM.td({
						class: yms + 'highlight_text',
						content: (row + 1)
					}) +
						yM.td({
							class: yms + 'cell_data',
							content: data[i].data
						}) +
						yM.td({
							content: yM.input({
								type: 'checkbox',
								class: yms + 'table_checkbox'
							})
						})
				})
				row++;
			}
		}
		$('.' + yms + 'table_data').html(data_rows);
	};
	panel.prototype.showTableSelection = function (ac_url, input_object) {
		let that = this;

		let callback = function (data) {
			var yms = 'y_multi_select_';
			var row = 0;
			id = yms + 'table-id-' + that.guid();
			var h = yHtml([{
				element: 'div',
				class: 'y_transparent_outer',
				id: id,
				content: yHtml([{
					element: 'div',
					class: yms + 'table',
					content: yHtml([{
						element: 'div',
						class: 'panel-title gradient-45deg-blue-grey-darken white-text panel_expanded ',
						content: 'select'
					},
					{
						element: 'div',
						class: yms + 'toolbar_row',
						content: yHtml([
							that.object_button('select', 'select', 'checked'),
							that.object_button('filter', 'filter', 'checked')
						])
					},
					{
						element: 'div',
						class: yms + 'filter_row',
						content: yHtml([{
							element: 'div',
							class: yms + 'highlight_text',
							content: yHtml([
								that.object_button('filter', 'filter', '', 'no label')
							])
						},
						{
							element: 'input',
							type: 'text',
							class: 'input_multi_select input_multi_select_param_filter input_text autocomplete'
						},
						{
							element: 'input',
							type: 'checkbox',
							class: yms + 'table_checkbox_header'
						}
						])
					},
					{
						element: 'div',
						class: yms + 'table_data'
					}
					])
				}])
			}]);
			$(that.master).append(h);
			that.writeTableSelectionData(data);
			$('#' + id).off('click', '.y_multi_select_cell_data');
			$('#' + id).on('click', '.y_multi_select_cell_data', function () {
				var data = $(this).text();
				input_object.val(data);
				$('#' + id).remove();
			});
			$('#' + id).off('click', '#button_select_checked');
			$('#' + id).on('click', '#button_select_checked', function () {
				var i = 0;
				var data_select = [];
				$('.y_multi_select_table_checkbox').each(function () {
					var state = $(this).prop('checked');
					if (state === true) {
						data_select[i] = $(this).siblings('.y_multi_select_cell_data').text();
						i++;
					}
				});
				var next = input_object;
				for (var j in data_select) {
					next.val(data_select[j]);
					parent = next.parent();
					next_parent = parent.next('.y_multi_select_text_row');
					next = next_parent.children('.input_text');
				}
				$('#' + id).remove();
			});
			$('#' + id).off('change', '.y_multi_select_table_checkbox_header');
			$('#' + id).on('change', '.y_multi_select_table_checkbox_header', function () {
				var state = $(this).prop('checked');
				$('#' + id).find('.y_multi_select_table_checkbox').each(function () {
					$(this).click();
					var chils_state = $(this).prop('checked');
					if (chils_state != state) {
						$(this).click();
					}
				});
			});
			$('#' + id).off('click', '#button_filter_checked');
			$('#' + id).on('click', '#button_filter_checked', function () {
				var filter_param = $('.input_multi_select_param_filter').val();
				var callback = function (this_data) {
					that.writeTableSelectionData(this_data);
				};
				getAjax(ac_url + '?term=' + filter_param + '&limit=0', '', callback);

			});
		};
		getAjax(ac_url, '', callback);
	};

	/////////////////////////////////////////////////////////////////////////////////////
	// Write Header of Table
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.writeHeader = function (func) {
		let selector = func + '_header';
		let fields = typeof this.object.field[func] !== 'undefined' ? this.object.field[func] : false;
		$(this.object[selector]).html('');
		let tableHeader = this.generateTableHeader(func, fields);
		$(this.object[selector]).append(tableHeader);
		let sumHeader = this.generateTableHeaderSum(fields);
		if (sumHeader) {
			$(this.object[selector]).parent().prepend(sumHeader);
		}
		let tableFilter = this.generateTableFilter(fields, func);
		if (tableFilter) {
			$(this.object[selector]).parent().prepend(tableFilter);
			yM.li(yM.buttonFloating({
				icon: {
					class: 'fas fa-filter fa-xs'
				},
				class: 'btn-small btn-filter btn-filter-' + func + ' waves-effect waves-light',
				parent: '.panel-title-' + func
			}))
			yM.li(yM.buttonFloating({
				icon: {
					class: 'fas fa-sync fa-xs'
				},
				class: 'btn-small btn-filter-clear btn-filter-clear-' + func + ' waves-effect waves-light',
				parent: '.panel-title-' + func
			}))
			this.initSelect(func + '-filter', undefined, () => { })
		}
		let sumFooter = this.generateTableFooterSum(fields);
		if (sumFooter) {
			$(this.object[selector]).parent().parent().append(yM.tfoot(sumFooter));
		}
		this.enableTableResize(func);

	};
	panel.prototype.generateTableHeader = function (name, fields) {
		if (fields) {
			let h = '';
			let lastFields = fields.length - 1;
			let lastColumnSelector = false;
			let columnSelector = this.columnSelector();
			for (var i in fields) {
				if (i == lastFields) {
					columnSelector = '';
				}
				var classHeader = 'th-label label_header label_header_' + name + ' ';
				var item = typeof fields[i] !== 'undefined' ? fields[i] : false;
				if (item) {
					if (typeof item.type !== 'undefined') {
						switch (item.type) {
							case 'date':
								classHeader += ' label_header_type_date ';
								break;
							case 'time':
								classHeader += ' label_header_type_time ';
								break;
						}
					}
					classHeader += ' label_header_' + name + '_' + item.name;
					if (this.isParam(item, 'multicolumn')) {
						let object_i = false;
						if (name === 'detail' || 'history') {
							object_i = typeof this.object.data[name][0][item.name] !== 'undefined' ? this.object.data[name][0][item.name] : false;
						}
						var fieldChild = object_i ? this.getMultiColumnField(object_i) : false;
						var noCol = fieldChild ? fieldChild.length : 0;
						for (var j = 0; j < noCol; j++) {
							h += yM.th({
								col: fieldChild,
								class: classHeader,
								content: fieldChild[j] + columnSelector
							});
						}
					}
					else if (this.isParam(item, 'buttonRemove')) {
						h += yM.th({
							class: classHeader + ' th-fix',
							content: yM.button({
								class: 'btn-floating btn-td btn-remove-row-header red btn-remove-row-header-' + item.name,
								icon: 'check',
								data: name,
								col: item.name
							})
						});
					}
					else if (this.isParam(item, 'input') || this.isParam(item, 'checkbox')) {
						if (this.isParam(item, 'hidden')) {
							h += yM.th({
								class: 'hide'
							});
						}
						else if (this.isParam(item, 'checkbox') && this.isParam(item, 'no_title')) {
							// checkbox
							h += yM.th({
								class: classHeader,
								content: yM.label({
									content: yM.input({
										type: 'checkbox',
										class: classHeader + 'filled-in input_tick input_tick_header_' + item.name
									}),
									after: yM.span()
								}) + columnSelector
							});
						}
						else {
							h += yM.th({
								col: item.name,
								class: classHeader,
								content: item.label + columnSelector
							});
						}
					}
					else if (this.isParam(item, 'textarea')) {
						if (this.isParam(item, 'hidden')) {
							h += yM.th({
								class: 'hide'
							});
						} else if (this.isParam(item, 'checkbox')) {
							h += yM.th(
								yM.label({
									content: yM.input({
										type: 'checkbox',
										class: 'filled-in input_tick input_tick_header_' + item.name
									}),
									after: yM.span({
										element: 'span',
										content: ''
									})
								}) + columnSelector
							)
						} else {
							h += yM.th({
								col: item.name,
								class: classHeader,
								content: item.label + columnSelector
							})
						}
					} else if (this.isParam(item, 'checkbox_with_hidden_input')) {
						h += yM.th(
							yM.input({
								col: item.name,
								type: 'checkbox',
								class: 'input_tick input_tick_header_' + item.name
							}) + columnSelector
						);
					} else if (this.isParam(item, 'hidden')) {
						h += yM.th({
							class: 'hide'
						});
					} else {
						// General Header
						h += yM.th({
							col: item.name,
							class: classHeader,
							content: item.label + columnSelector
						});
						if (this.isParam(item, 'checkbox') && this.isParam(item, 'no_title')) {
							h += yM.th(
								yM.label(
									yM.input({
										type: 'checkbox',
										class: 'filled-in input_tick input_tick_header_' + item.name
									}) +
									yM.span()
								) + columnSelector
							);
						}
						if (typeof item.edit !== 'undefined') {
							if (item.edit === true || item.edit === 'yes') {
								h += yM.th({
									col: item.name,
									class: classHeader,
									content: '_/ ' + item.label + columnSelector
								});
							} else {
								h += yM.th({
									col: item.name,
									class: classHeader,
									content: item.label + columnSelector
								});
							}
						}
					}
				}
			}

			return h;
		}
	};
	panel.prototype.generateTableHeaderSum = function (fields) {
		let result = false;
		if (typeof fields !== 'undefined' && fields) {
			let withSum = false;
			for (var i in fields) {
				var item = typeof fields[i] !== 'undefined' ? fields[i] : false;
				if (item && this.isParam(item, 'sum_header')) {
					withSum = true;
				}
			}
			if (withSum) {
				let h = '';
				for (var i in fields) {
					var item = typeof fields[i] !== 'undefined' ? fields[i] : false;
					if (item) {
						if (this.isParam(item, 'hidden')) {
							h += yM.td({
								class: 'hide'
							});
						} else {
							h += yM.td({
								data: item.name,
								class: "header-sum header-sum-" + item.name,
								data: item.name,
								content: ''
							})
						}
					}
				}
				result = yM.tr(h);
			}
		}
		return result;
	}
	panel.prototype.generateTableFooterSum = function (fields) {
		let result = false;
		if (typeof fields !== 'undefined' && fields) {
			let withSum = false;
			for (var i in fields) {
				var item = typeof fields[i] !== 'undefined' ? fields[i] : false;
				if (item && this.isParam(item, 'sum_footer')) {
					withSum = true;
				}
			}
			if (withSum) {
				let h = '';
				for (var i in fields) {
					var item = typeof fields[i] !== 'undefined' ? fields[i] : false;
					if (item) {
						if (this.isParam(item, 'hidden')) {
							h += yM.td({
								class: 'hide'
							});
						} else {
							h += yM.td({
								data: item.name,
								class: "footer-sum footer-sum-" + item.name,
								data: item.name,
								content: ''
							})
						}
					}
				}
				result = yM.tr(h);
			}
		}
		return result;
	}
	panel.prototype.generateTableFilter = function (fields, func) {
		let result = false;
		func = typeof func !== 'undefined' ? func : false;
		if (typeof fields !== 'undefined' && fields) {
			let withFilter = false;
			let withFilterSelect = false;
			for (var i in fields) {
				var item = typeof fields[i] !== 'undefined' ? fields[i] : false;
				if (item && this.isParam(item, 'filter')) {
					withFilter = true;
				}
				if (item && this.isParam(item, 'filterSelect')) {
					withFilterSelect = true;
				}
			}
			if (withFilter || withFilterSelect) {
				let h = '';
				const funcFilter = func + '-filter'
				if (typeof this.selectList[funcFilter] === 'undefined') {
					this.selectList[funcFilter] = [];
				}
				if (typeof this.selectController[funcFilter] === 'undefined') {
					this.selectController[funcFilter] = [];
				}
				for (var i in fields) {
					var item = typeof fields[i] !== 'undefined' ? fields[i] : false;
					if (item) {
						const serialize = typeof item.serialize != 'undefined' ? item.serialize : true
						const serializeClass = serialize ? '' : ' unserialize'
						if (this.isParam(item, 'hidden')) {
							h += yM.td({
								class: 'hide'
							});
						} else {
							let hChild = ''
							if (this.isParam(item, 'filter')) {
								classInput = func ? 'input-filter input-filter-' + func : 'input-filter';
								hChild = yM.input({
									data: item.name,
									id: item.name + '-filter',
									name: item.name + '-filter',
									class: classInput + serializeClass,
									type: 'search',
									content: ''
								});
							}
							else if (this.isParam(item, 'filterSelect')) {
								// Filter with select
								const nameFilter = item.name + '-filter'
								const nameFilter_ = item.name + '_filter'
								classInput = func ? 'input-filter input-filter-select input_' + funcFilter + 'input_' + nameFilter + ' input-filter-' + func + ' input-filter-select-' + func + ' input_' + nameFilter : 'input-filter';
								let selectContent = '';
								if (typeof item.option !== 'undefined') {
									for (let j in item.option) {
										selectContent += yM.option(item.option[j])
									}
								}
								if (!this.selectList[funcFilter].includes(nameFilter)) {
									this.selectList[funcFilter].push(nameFilter);
								}
								if (typeof item.controller !== 'undefined') {
									this.selectController[funcFilter][nameFilter] = item.controller
								}
								hChild = yM.inputFieldSelect({
									addClass: 'input-field-filter-select input-field-filter-' + func,
									select: {
										data: item.name,
										id: nameFilter,
										name: nameFilter,
										content: selectContent,
										row: 'filter',
										['data-init']: '',
										class: classInput + serializeClass
									}
								});
							}
							else {
								classInput = func ? 'input-filter-readonly input-filter-readonly-' + func : 'input-filter-readonly';
								hChild = yM.input({
									data: item.name,
									id: item.name + '-filter',
									name: item.name + '-filter',
									class: classInput + serializeClass,
									readonly: true
								});
							}
							h += yM.th({
								data: item.name,
								class: "y-filter y-filter-" + item.name,
								data: item.name,
								content: hChild
							})
						}
					}
				}
				result = yM.tr({
					class: 'row-y-filter row-y-filter-' + func,
					content: h
				});
			}
		}
		return result;
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Write Table Data
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.writeTableData = function (func, data) {
		if (typeof data !== 'undefined') {
			for (var i in data) {
				this.writeRow(i, func, data[i]);
			}
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Write Row
	// Called by writeTableData()
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.writeRow = function (row, func, data, option) {
		row = typeof row !== 'undefined' ? row : 0
		func = typeof func !== 'undefined' ? func : 'd'
		option = typeof option !== 'undefined' ? option : ''
		switch (func) {
			case 'm':
				func = 'master';
				break;
			case 'd':
				func = 'detail';
				break;
			case 'h':
				func = 'history';
				break;
		}
		if (typeof this.selectList[func] === 'undefined') {
			this.selectList[func] = []
		}
		if (typeof this.selectController[func] === 'undefined') {
			this.selectController[func] = []
		}
		let child_text = '';
		let useDate = false;
		let useTime = false;
		const classTr = 'panel_input_row_with_sidebar panel_input_row_' + func + ' panel_input_row_' + func + '_clickable';
		for (let col in this.object.field[func]) {
			var item = this.object.field[func][col];
			item.label = typeof item.label !== 'undefined' ? item.label : '';
			var field_class = item.name + ' ';
			var cl_class = field_class
			const serialize = typeof item.serialize !== 'undefined' ? item.serialize : true;
			const serializeClass = serialize ? '' : ' unserialize'
			var cell = typeof data[item.name] !== 'undefined' ? data[item.name] : ''
			//const patternMatchScript = /(?<=<script>)(.*?)(?=<)/g
			const patternMatchScript = /(<script>)(.*?)(?=<)/g
			cell = patternMatchScript.test(cell) ? 'script injection detected' : cell
			if (typeof item.type !== 'undefined') {
				switch (item.type) {
					case 'date':
						useDate = true;
						break
					case 'time':
						useTime = true;
						break
				}
			}
			if (typeof item.format !== 'undefined') {
				switch (item.format) {
					case 'currency':
						cell = !isNaN(cell) ? y_format_currency(Math.round(cell * 100) / 100, 'Rp') : cell;
						cl_class = field_class;
						break;
					case 'currency_no_symbol':
						cell = !isNaN(cell) ? cell = y_format_currency(Math.round(cell * 100) / 100, '') : cell;
						cl_class = field_class;
						break;
					case 'number_with_thousand_separator':
						cell = !isNaN(cell) ? y_format_currency(Math.round(cell * 100) / 100, '') : cell;
						cl_class = field_class;
						break;
					case 'number':
						cell = !isNaN(cell) ? y_format_currency(Math.round(cell * 100) / 100, '') : cell;
						cl_class = field_class;
						break;
					case 'long_date_indonesia':
						cell = y_format_long_date_id(cell);
						cl_class = field_class;
						break;
					case 'medium_datetime':
						cell = y_datetime_convert(cell, 'datetime_sql_to_medium_datetime');
						break;
					case 'medium_date':
						cell = y_datetime_convert(cell, 'datetime_sql_to_medium_date');
						break;
				}
			}

			// {input:'yes'} ...
			if (this.isParam(item, 'input')) {
				child_text += this.writeCellInput(row, func, item, 'input', cell);
			}
			else if (this.isParam(item, 'checkbox')) {
				child_text += this.writeCellInput(row, func, item, 'checkbox', cell);
			}
			// {textarea:'yes'} ...
			else if (this.isParam(item, 'textarea')) {
				child_text += this.writeCellInput(row, func, item, 'textarea', cell);
			}
			// {select: true}
			else if (this.isParam(item, 'select')) {
				let classInput = 'input-select input-' + func + '-select';
				let selectContent = ''
				const useContent = typeof item.useContent !== 'undefined' ? item.useContent : true
				if (typeof item.option !== 'undefined') {
					for (let j in item.option) {
						selectContent += yM.option(item.option[j])
					}
				}
				if (!this.selectList[func].includes(item.name)) {
					this.selectList[func].push(item.name);
				}
				if (typeof item.controller !== 'undefined') {
					this.selectController[func][item.name] = item.controller
				}
				let classSelect = classInput + ' input_' + item.name;
				if (this.modeSelect !== 'materialize') {
					classSelect += ' browser-default';
				}
				let childObject = {
					class: 'td-input-select',
					content: yM.inputFieldSelect({
						select: {
							data: item.name,
							id: item.name + '-' + row,
							name: item.name + '[' + row + ']',
							content: selectContent,
							row: row,
							['use-content']: useContent,
							['data-init']: cell,
							class: classSelect
						}
					})
				}

				if (typeof item.controller !== 'undefined') {
					childObject.controller = item.controller
				}
				child_text += yM.td(childObject)
			}
			// {checkbox_with_hidden_input:'yes'}
			else if (this.isParam(item, 'checkbox_with_hidden_input hide')) {
				child_text += yHtml([{
					element: 'td',
					class: 'td-input-checkbox',
					content: yHtml([{
						element: 'label',
						content: yHtml([{
							element: 'input',
							type: 'checkbox',
							class: 'filled-in input_tick input_tick_' + item.name + serializeClass,
							name: 'tick_' + item.name + '[' + row + ']'
						},
						{
							element: 'span',
							content: ''
						}
						])
					},
					{
						element: 'input',
						type: 'hidden',
						class: item.name + serializeClass,
						name: item.name + '[' + row + ']',
						value: cell
					}
					])
				}]);
			}
			// {button:'yes'}
			else if (this.isParam(item, 'button')) {
				const icon = typeof item.icon !== 'undefined' ? item.icon : 'check'
				let buttonContent = typeof (item.content) !== 'undefined' ? item.content : yM.button({
					class: 'btn-floating waves-effect waves-light center btn-td btn-td-' + func + '-' + item.name + ' btn-td-' + func,
					icon: icon,
					data: func,
					style: 'display: block; margin: auto !important; width: 100%;',
					col: item.name,
					row: row,
					value: cell
				})
				child_text += yM.td(buttonContent);
			}
			// {button_remove:'yes'}
			else if (this.isParam(item, 'buttonRemove')) {
				child_text += yM.td({
					class: 'td-button-remove',
					content: yM.button({
						class: 'btn-floating waves-effect waves-light btn-td btn-remove-row red btn-remove-row-' + item.name + ' btn-remove-row-' + func,
						icon: 'delete',
						data: func,
						col: item.name
					})
				});
			}
			// {button_print:'yes'}
			else if (this.isParam(item, 'button_print')) {
				child_text += yHtml([{
					element: 'td',
					class: 'button_print_row_40 ' + item.name,
					content: item.label
				}]);
			}
			// {button_detail:'yes'}
			else if (this.isParam(item, 'button_detail')) {
				child_text += yHtml([{
					element: 'td',
					class: 'button_detail_row_40 ' + item.name,
					content: item.label
				}]);
			} else if (this.isParam(item, 'multicolumn')) {
				var object_i = typeof this.object.data[func][0][item.name] !== 'undefined' ? this.object.data[func][0][item.name] : false;
				var fields = object_i ? this.getMultiColumnField(object_i) : false;
				var noCol = fields ? fields.length : 0;
				for (var j = 0; j < noCol; j++) {
					cell_j = typeof cell[fields[j]] !== 'undefined' ? cell[fields[j]] : '';
					child_text += yHtml([{
						element: 'td',
						class: cl_class,
						content: cell_j
					}]);
				}
			}
			// {hidden:'yes'}
			else if (this.isParam(item, 'hidden')) {
				child_text += yM.td({
					class: 'td-input-hidden hide',
					content: yM.input({
						type: 'hidden',
						tabindex: '-1',
						row: row,
						class: 'input_' + item.name + serializeClass,
						name: item.name + '[' + row + ']',
						value: cell
					})
				})
			}
			else {
				// label
				let isSumHeader = this.isParam(item, 'sum_header');
				let isSumFooter = this.isParam(item, 'sum_footer');
				if (isSumHeader) {
					cl_class += ' sum-item sum-header-item sum-header-item-' + item.name;
				}
				if (isSumFooter) {
					cl_class += ' sum-item sum-footer-item sum-footer-item-' + item.name;
				}
				let isRightAlign = this.isParam(item, 'right_align');
				if (isRightAlign) {
					cl_class += ' right-align';
				}
				if (!this.isParam(item, 'key')) {
					// Handle Long Word
					if (cell && cell !== '' && cell.length > 12) {
						let breakCell = cell.split(/\//)
						if (breakCell.length > 1) {
							let newCell = '';
							for (let cidx in breakCell) {
								newCell += cidx == 0 ? breakCell[cidx] : "/<wbr>" + breakCell[cidx]
							}
							cell = newCell
						}
						else {
							let breakCellSpace = cell.split(" ")
							let newCell = ''
							for (let i in breakCellSpace) {
								wordCell = breakCellSpace[i]
								if (wordCell.length > 12) {
									wordCell = wordCell.replace(/(.{10})/g, "$&" + "<wbr>")
								}
								newCell += i == 0 ? wordCell : ' ' + wordCell
							}
							cell = newCell
						}
					}
					child_text += yM.td({
						class: cl_class + ' td-label',
						content: cell,
						data: item.name
					});
				}
				// {key:'yes'}
				else {
					child_text += yM.td({
						class: 'td-input-hidden hide',
						content: yM.input({
							type: 'hidden',
							tabindex: '-1',
							class: 'cl_key_' + item.name + serializeClass,
							name: 'key_' + item.name + '[' + row + ']',
							value: cell
						})
					})
				}
			}
		}
		let h
		switch (option) {
			case 'draggable':
				h = yHtml([{
					element: 'tr',
					row: row,
					draggable: 'true',
					class: classTr,
					content: child_text
				}]);
				break;
			case 'hidden':
				h = yHtml([{
					element: 'tr',
					row: row,
					hidden: 'true',
					class: classTr,
					content: child_text
				}]);
				break;
			default:
				h = yHtml([{
					element: 'tr',
					row: row,
					class: classTr,
					content: child_text
				}]);
				break;
		}
		const result = $(h)
		$(this.object[func]).append(result)

		if (useDate) {
			const elems = document.querySelectorAll('.datepicker')
			const options = {
				format: this.formatDate,
				defaultDate: 'now',
				autoClose: true
			}
			M.Datepicker.init(elems, options)
		}

		if (useTime) {
			const elems = document.querySelectorAll('.timepicker')
			const options = {
				format: this.formatTime,
				defaultTime: 'now',
				twelveHour: false,
				vibrate: true,
				autoClose: true
			}
			M.Timepicker.init(elems, options)
		}
		return result
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Create Cell
	// Called by writeRow()
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.writeCellInput = function (row, func, item, element, cell) {
		var html = '';
		var buttonHtml = ' ';
		element = typeof element !== 'undefined' ? element : 'input';
		if (typeof item !== 'undefined' && this.isParam(item, element)) {
			let isSumHeader = this.isParam(item, 'sum_header');
			let isSumFooter = this.isParam(item, 'sum_footer');
			var isHidden = this.isParam(item, 'hidden');
			var isCheckBox = this.isParam(item, 'checkbox');
			var isReadonly = this.isParam(item, 'readonly');
			var isRightAlign = this.isParam(item, 'right_align');
			const maxlength = typeof item.maxlength !== 'undefined' ? item.maxlength : false
			var pclass = 'input_text input-table-cell input_' + func + '_text ' + element + '_single input_' + item.name + ' autocomplete';
			if (isSumHeader) {
				pclass += ' sum-item sum-header-item sum-header-item-' + item.name;
			}
			if (isSumFooter) {
				pclass += ' sum-item sum-footer-item sum-footer-item-' + item.name;
			}
			var pname = item.name + '[' + row + ']';
			var pId = item.name + '-' + row;
			var tdClass = 'td-';
			var yObjType = {
				element: element,
				class: pclass,
				name: pname,
				id: pId,
				value: cell,
				data: item.name,
				row: row
			};
			if (isRightAlign) {
				yObjType.class += ' right-align';
			}
			if (element === 'input' || element === 'textarea') {
				yObjType.content = cell;
			}
			if (isHidden) {
				yObjType.class = 'cl_key_' + item.name;
				yObjType.type = 'hidden';
				yObjType.tabindex = '-1';
				html += yHtml([yObjType]);
				tdClass += 'input-hidden hide';
			}
			if (maxlength) {
				yObjType.maxlength = maxlength
			}
			if (element == 'checkbox' || isCheckBox) {
				let idCB = 'checkbox-' + item.name + '-' + this.guid();
				var yObjCB = {
					element: 'input',
					type: 'checkbox',
					id: idCB,
					class: 'filled-in input_tick input_tick_' + item.name,
					name: 'tick_' + pname
				};
				if (cell == true || cell == 'true') {
					yObjCB.checked = 'checked';
				}
				var htmlCBContent = yM.input(yObjCB) + yM.span('');
				html += yM.label(htmlCBContent);
				tdClass += 'input-checkbox';
			}

			else if ((element === 'input' || element === 'textarea') && !isHidden) {
				yObjType.type = 'text';
				tdClass += 'input-text';
				if (isReadonly) {
					yObjType.readonly = true;
				}
				if (typeof item.type !== 'undefined') {
					switch (item.type) {
						case 'date':
							yObjType.class += ' input_type_date datepicker';
							yObjButton = {
								element: 'div',
								class: '_yFL buttonDatePicker',
								content: ''
							};
							buttonHtml = yHtml([yObjButton]);
							break;
						case 'time':
							yObjType.class += ' input_type_time timepicker';
							yObjButton = {
								element: 'div',
								class: '_yFL buttonTimePicker',
								content: ''
							};
							buttonHtml = yHtml([yObjButton]);
							break;
						case 'currency':
							yObjType.style = 'text-align: right';
							break;
					}
				}
				html += yHtml({
					element: 'div',
					class: 'input-field',
					content: yHtml(yObjType)
				});
			} else {
				html += yHtml([yObjType]);
			}
		}
		html += buttonHtml
		return yM.td({
			class: tdClass,
			content: html
		});
	};

	/////////////////////////////////////////////////////////////////////////////////////
	// Button Component
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.addButton = function (options) {
		var parent = typeof (options.parent) !== 'undefined' ? options.parent : '#toolbar-module-left';
		var button = this.button(options);
		yM.li({
			parent: parent,
			content: yHtml(button)
		});
		this.tooltipListener();
		return button.id;
	}
	panel.prototype.create_button = function (model, label, id) {
		model = typeof model !== 'undefined' ? model : 'submit';
		label = typeof label !== 'undefined' ? label : 'button';
		id = typeof id !== 'undefined' ? id : '';
		var toolbarModuleLeft = $('#toolbar-module-left');
		var button = this.object_button(model, label, id);
		toolbarModuleLeft.append(yHtml({
			element: 'li',
			content: yHtml([button])
		}));
		return '#button_' + model + '_' + id;
	};
	panel.prototype.create_button_file = function (model, label, id, accept, parent) {
		this.createButtonFile(model, label, id, accept, parent)
	}
	panel.prototype.createButtonFile = function (model, label, id, accept, parent) {
		parent = elvis(parent, '#toolbar-module-left')
		id = typeof id !== 'undefined' ? id : this.guid()
		accept = typeof accept !== 'undefined' && accept != '' ? accept : false
		var elmParent = $(parent);
		var buttonTrigger = this.object_button(model, label, id);
		elmParent.append(yHtml({
			element: 'li',
			content: yHtml([buttonTrigger])
		}))
		let buttonFile = { element: 'input', type: 'file', style: 'display:none', id: 'button_file_' + model + '_' + id }
		if (accept) {
			buttonFile.accept = accept
		}
		elmParent.append(yHtml({
			element: 'li',
			content: yHtml([buttonFile])
		}));
		var bObjFile = document.getElementById('button_file_' + model + '_' + id);
		var bObjTrigger = document.getElementById('button_' + model + '_' + id);
		bObjTrigger.addEventListener("click", function () {
			bObjFile.click();
		});
		return '#button_file_' + model + '_' + id;
	};
	panel.prototype.button = function (options) {
		var options = this.buttonOptions(options);
		var basicClassButton = 'btn waves-effect waves-light light-blue darken-1 white-text ' + options.type;
		basicClassButton = options.showTooltip ? basicClassButton + ' tooltipped button-tooltip' : basicClassButton;
		var classButton = typeof (options.class) !== 'undefined' ? basicClassButton + ' ' + options.class : basicClassButton;
		var classButton = typeof (options.addClass) !== 'undefined' ? classButton + ' ' + options.addClass : classButton;
		var materialIcon = {
			element: 'i',
			class: 'material-icons ' + options.iconPosition,
			content: options.icon
		};
		var content = [materialIcon, {
			element: 'span',
			class: '',
			content: options.label
		}];
		var button = {
			element: 'a',
			id: options.id,
			class: classButton,
			content: yHtml(content)
		};
		button['data-position'] = options.tooltipPosition;
		button['data-tooltip'] = options.tooltip;
		if (typeof options['data-target'] !== 'undefined') {
			button['data-target'] = options['data-target'];
		}
		if (typeof options.href !== 'undefined') {
			button.href = options.href;
		}
		return button;
	};
	panel.prototype.buttonOptions = function (options) {
		options.label = typeof (options.label) !== 'undefined' ? options.label : '';
		options.icon = typeof (options.icon) !== 'undefined' ? options.icon : 'radio_button_checked';
		options.type = typeof (options.type) !== 'undefined' ? options.type : 'btn-small';
		options.iconPosition = typeof (options.iconPosition) !== 'undefined' ? options.iconPosition : 'left';
		options.showTooltip = typeof (options.showTooltip) !== 'undefined' ? options.showTooltip : true;
		options.tooltip = typeof (options.tooltip) !== 'undefined' ? options.tooltip : options.label;
		options.tooltipPosition = typeof (options.tooltipPosition) !== 'undefined' ? options.tooltipPosition : 'bottom';
		options.id = typeof (options.id) !== 'undefined' ? options.id : 'btn-' + this.guid();
		return options;
	}
	panel.prototype.object_button = function (model, label, id, option, type) {
		type = typeof type !== 'undefined' ? type : 'rectangle';
		var cl_bt = 'button_' + type;
		var cl_txt = cl_bt + '_text';
		var iconModel = model;
		switch (model) {
			case 'new':
				iconModel = 'create_new_folder'
				break;
			case 'open':
				iconModel = 'folder_open'
				break;
			case 'clone':
				iconModel = 'content_copy'
				break;
			case 'submit':
				iconModel = 'check'
				break;
			case 'download':
				iconModel = 'save'
				break;
		}
		if (typeof id === 'undefined') {
			id = 'button-' + this.guid();
		}
		if (typeof label === 'undefined') {
			label = model;
		}
		var object_image = {
			element: 'i',
			class: 'material-icons left',
			content: iconModel
		};
		var button;
		var button_content;
		if (typeof option != 'undefined') {
			if (option == 'no label') {
				button = object_image;
			}
			if (option == 'no background') {
				button_content = yHtml([object_image, {
					element: 'div',
					class: cl_txt,
					content: label
				}]);
				button = {
					element: 'a',
					id: 'button_' + model + '_' + id,
					class: 'waves-effect waves-light btn-flat tooltipped ' + cl_bt,
					content: button_content
				};
			}
		} else {
			button_content = yHtml([object_image]);
			button = {
				element: 'a',
				id: 'button_' + model + '_' + id,
				class: 'waves-effect waves-light btn-small tooltipped light-blue darken-1 ' + cl_bt,
				content: button_content + ' ' + label
			};
		}
		button['data-position'] = 'top';
		button['data-tooltip'] = label;
		return button;
	};

	/////////////////////////////////////////////////////////////////////////////////////
	// Select Component
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.initSelect = function (func, callback, callbackAfterInitSelect, forceRewrite) {
		const that = this;
		forceRewrite = typeof forceRewrite !== 'undefined' ? forceRewrite : false
		callback = typeof callback !== 'undefined' ? callback : function () { }
		callbackAfterInitSelect = typeof callbackAfterInitSelect !== 'undefined' ? callbackAfterInitSelect : function () { }
		this.instancesSelect[func] = typeof this.instancesSelect[func] !== 'undefined' ? this.instancesSelect[func] : []
		this.resSelect[func] = typeof this.resSelect[func] !== 'undefined' ? this.resSelect[func] : []
		const initFormSelect = function (func, nameSelect) {
			$('.input_' + nameSelect).each(function () {
				const obj = this
				that.instancesSelect[func][nameSelect] = []
				if ($(this).siblings('span').eq(0).length == 0) {
					if (that.modeSelect === 'materialize') {
						const row = $(this).attr('row')
						that.instancesSelect[func][nameSelect][row] = M.FormSelect.init(this, {
							dropdownOptions: {
								onOpenStart: function () {
									const val = $(obj).val()
									$(obj).attr('last', val)
								}
							}
						})
					}
					else {
						// include Select2 framework if use select2 options
						$(this).select2()
					}
				}
			})
			callbackAfterInitSelect()
		}
		const writeSelectOption = function (func, nameSelect) {
			const resSelect = typeof that.resSelect[func][nameSelect] !== 'undefined' ? that.resSelect[func][nameSelect] : false
			if (resSelect) {
				const res = JSON.parse(JSON.stringify(resSelect))
				$('select.input-' + func + '-select.input_' + nameSelect).each(function () {
					const thisRes = cloneObject(res)
					let selected = $(this).attr('data-init')
					const useContent = $(this).attr('use-content')
					if(useContent){
						const selObject = thisRes.find(obj => {
							const content = typeof obj.content !== 'undefined' ? obj.content : obj.label
							return content === selected
						})
						selected = typeof selObject !== 'undefined' && selObject.value !== 'undefined' ? selObject.value : selected
					}
					if (forceRewrite) {
						$(this).html('')
					}
					if (forceRewrite || $(this).parent('.input-field').length > 0) {
						let optionSelect = ''
						for (let i in thisRes) {
							const val = typeof thisRes[i].value !== 'undefined' ? thisRes[i].value : typeof thisRes[i].content !== 'undefined' ? thisRes[i].content : thisRes[i];
							if (val === selected) {
								thisRes[i].selected = true
							}
							optionSelect += yM.option(thisRes[i])
						}
						$(this).append(optionSelect)
					}
				})
				initFormSelect(func, nameSelect)
			}
		}
		if (typeof this.selectList[func] !== 'undefined' && this.selectList[func].length > 0) {
			for (let i in this.selectList[func]) {
				const nameSelect = this.selectList[func][i];
				this.instancesSelect[func][nameSelect] = [];
				let url = typeof this.selectController[func][nameSelect] !== 'undefined' ? this.selectController[func][nameSelect] : this.queryUrl + 'call_' + nameSelect + '_select';
				url = url.replace(/-/g, "_");
				if (typeof this.resSelect[func][nameSelect] === 'undefined' || forceRewrite) {
					this.resSelect[func][nameSelect] = false;
					const onSuccess = function (res) {
						if (typeof res !== 'undefined' && res.length > 0) {
							that.resSelect[func][nameSelect] = res
							writeSelectOption(func, nameSelect)
						}
					}
					const onComplete = function () {
						if (!that.resSelect[func][nameSelect]) {
							initFormSelect(func, nameSelect)
						}
						callback()
					}
					if (url) {
						getAjax(url, '', onSuccess, onComplete)
					}
					else {
						onComplete();
					}
				}
				else {
					writeSelectOption(func, nameSelect);
					callback()
				}
			}
		}
	}
	panel.prototype.rePopulateSelect = function (func, row, option) {
		typeof option !== 'undefined' ? option : undefined
		if (typeof this.selectList[func] !== 'undefined' && this.selectList[func].length > 0) {
			for (let i in this.selectList[func]) {
				const nameSelect = this.selectList[func][i];
				let optionSelect = '';
				const id = '#' + nameSelect + '-' + row;
				if (typeof this.resSelect[func] !== 'undefined' && typeof this.resSelect[func][nameSelect] !== 'undefined') {
					const res = this.resSelect[func][nameSelect];
					for (let i in res) {
						optionSelect += yM.option(res[i]);
					}
					$(id).append(optionSelect);
					if (this.modeSelect === 'materialize') {
						const elem = document.querySelector(id);
						this.instancesSelect[func][nameSelect][row] = M.FormSelect.init(elem, {
							dropdownOptions: {
								onOpenStart: function () {
									const val = $(elem).val()
									$(elem).attr('last', val)
								}
							}
						})
					}
					else {
						$(id).select2();
					}
				}
			}
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Toolbar Feature
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.showToolbar = function () {
		$('#module-toolbar').show()
		$('#module-content').removeClass('no-toolbar')
		this.withToolbar = true
	}
	panel.prototype.hideToolbar = function () {
		$('#module-toolbar').hide()
		$('#module-content').addClass('no-toolbar')
		this.withToolbar = false
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Collapsible Feature
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.collapsibleListener = function (selector) {
		var elems = document.querySelectorAll(selector);
		//return M.Collapsible.init(elems, {})[0];
	};

	/////////////////////////////////////////////////////////////////////////////////////
	// Title Document Feature
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.useTitleDocument = function () {
		$('.input-field-title-document>input').on('click', function (e) {
			e.stopImmediatePropagation();
		});
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Tooltip for Button Feature
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.tooltipListener = function () {
		var elems = document.querySelectorAll('.tooltipped');
		this.instancesTooltip = M.Tooltip.init(elems, {});
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Hover Table Feature
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.tableHoverListener = function () {
		$('body').on("mouseover", 'td', function () {
			var td = $(this);
			td.closest('table').find('th').eq(td.index()).addClass('hover');
		}).on("mouseout", 'td', function () {
			$('th').removeClass("hover");
		});
	};

	/////////////////////////////////////////////////////////////////////////////////////
	// Table Resize Feature
	// Require columnSelector after cell
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.enableTableResize = function (func) {
		let table = document.querySelector('.panel_y_' + func + '_table');
		if (table !== null) {
			let startPageX, curCol, nxtCol, curColWidth, nxtColWidth;
			let wrapper = $('body');
			wrapper.off('mousedown', '.column-selector-trigger');
			wrapper.on('mousedown', '.column-selector-trigger', function (event) {
				e = event || window.event;
				let isStickyHeader = $(this).parent().parent().hasClass('stick-header')
				let startDrag = function (event) {
					e = event || window.event;
					if (curCol !== 'undefined') {
						let curPageX = getPageX(e)
						if (curPageX) {
							var diffX = curPageX - startPageX;
							if (typeof nxtCol !== 'undefined') {
								let newNxtColWidth = nxtColWidth - (diffX)
								let newCurColWidth = (curColWidth + diffX)
								if (newNxtColWidth >= 0 && newCurColWidth >= 0) {
									nxtCol.style.width = (newNxtColWidth) + 'px'
									curCol.style.width = (newCurColWidth) + 'px'
									if (isStickyHeader) {

										let curColAttr = curCol !== null ? curCol.getAttribute("col") : null
										let curColAll = curColAttr !== null ? document.querySelectorAll("td." + curColAttr) : null
										let nxtColAttr = nxtCol !== null ? nxtCol.getAttribute("col") : null
										let nxtColAll = nxtColAttr !== null ? document.querySelectorAll("td." + nxtColAttr) : null

										curColAll.forEach(item => { item.style.width = (newCurColWidth) + 'px' })
										nxtColAll.forEach(item => { item.style.width = (newNxtColWidth) + 'px' })
										let isCurMin = false
										let isNxtMin = false
										if (typeof (curColAll[0]) !== 'undefined') {
											isCurMin = curColAll[0].offsetWidth > 0 && curColAll[0].offsetWidth > newCurColWidth
										}
										if (typeof (nxtColAll[0]) !== 'undefined') {
											isNxtMin = nxtColAll[0].offsetWidth > 0 && nxtColAll[0].offsetWidth > newNxtColWidth
										}
										if (isCurMin || isNxtMin) {
											nxtCol.style.width = (nxtColWidth) + 'px'
											curCol.style.width = (curColWidth) + 'px'
											curColAll.forEach(item => { item.style.width = (curColWidth) + 'px' })
											nxtColAll.forEach(item => { item.style.width = (nxtColWidth) + 'px' })
										}
										else {
											nxtColWidth = newNxtColWidth
											curColWidth = newCurColWidth
											startPageX = curPageX
										}

									}
								}
							}
						}
					}
				}
				let endDrag = function (event) {
					wrapper.unbind("mousemove", startDrag);
					wrapper.unbind("mouseup", endDrag);
					wrapper.css("-webkit-user-select", "text");
					document.body.style.cursor = 'default';
					document.onselectstart = function () { return true; };
				}
				let getPageX = function (event) {
					e = event || window.event;
					var isIE = document.all;
					let x = false;
					if (e) {
						x = isIE ? (e.clientX + document.body.scrollLeft) : e.pageX;
					}
					return x;
				}
				curCol = e.target.parentElement;
				nxtCol = curCol !== null ? curCol.nextElementSibling : null;
				if (nxtCol !== null && !nxtCol.classList.contains("th-fix")) {
					startPageX = getPageX(e);
					if (startPageX) {
						curColWidth = curCol.offsetWidth
						nxtColWidth = nxtCol.offsetWidth
						wrapper.bind("mousemove", startDrag)
						wrapper.bind("mouseup", endDrag)
						wrapper.css("-webkit-user-select", "none")
						document.onselectstart = function () { return false }
					}
				}
			});
			wrapper.off('dblclick', '.column-selector-trigger');
			wrapper.on('dblclick', '.column-selector-trigger', function (event) {
				e = event || window.event
				curCol = e.target.parentElement
				$(curCol).siblings('th').not("tr.stick-header>th").css('width', '')
				$(this).parent().parent().parent().siblings('tbody').children('tr').children('td').css('width', '')
			})
		}
		if (window.innerWidth <= 993) {
			$('.column-selector').css('background-color', '#78909c')
		}
	};
	panel.prototype.listenerWindowResize = function () {
		$(window).resize(function () {
			if (window.innerWidth <= 993) {
				$('.th-label').each(function () {
					this.style.removeProperty('width')
				})
				$('.column-selector').css('background-color', '#78909c')
			}
			else {
				$('.column-selector').css('background-color', 'azure')
			}
		});
	}
	panel.prototype.columnSelector = function () {
		let res = yM.div({ class: 'column-selector-transparent column-selector-trigger' }) +
			yM.div({ class: 'column-selector column-selector-trigger' });
		return res;
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Sticky Header Table Feature
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.listenerStickyTable = function (func) {
		let that = this;
		$('#module-content').scroll(function () {
			that.handleStickyTable(func);
		});
		$(window).resize(function () {
			that.handleStickyTable(func);
		});
	}
	panel.prototype.handleStickyTable = function (func) {
		let that = this
		let offset = $('.panel_y_' + func + '_table_data').offset()
		let windowWidth = $(window).width()
		let headerHeight = $('#header').outerHeight()
		let toolbarHeight = $('#module-toolbar').outerHeight()
		let thHeight = $('th.label_header_' + func).outerHeight()
		let titleHeight = $('.panel-title-' + func).outerHeight()
		let space = thHeight - titleHeight
		let topPanelOffset = this.withToolbar ? headerHeight + thHeight + toolbarHeight : headerHeight + thHeight
		if (typeof offset !== 'undefined' && typeof offset.top !== 'undefined' && offset.top !== 0 && windowWidth > 992) {
			let height = $('.panel_y_' + func + '_table_data').outerHeight()
			let bottom = height + offset.top
			if (offset.top <= (topPanelOffset - space) && bottom > topPanelOffset) {
				$('.panel_y_' + func + '_table_header').addClass('stick-header')
				that.recalculateStickyHeader(func);
			}
			else {
				$('.panel_y_' + func + '_table_header').removeClass('stick-header')
				$('.panel_y_' + func + '_table_data>tr>td').css('width', '')
			}
		}
	}
	panel.prototype.recalculateStickyHeader = function (func) {
		let tableWidth = $('.panel_y_' + func + '_table').width();
		$('.panel_y_' + func + '_table_header').width(tableWidth);
		if (this.object.field[func] !== 'undefined' && tableWidth > 0) {
			for (var i in this.object.field[func]) {
				let col = parseInt(i) + 1;
				let colWidth = $('.panel_y_' + func + '_table_data>tr:nth-child(1)').children('td:nth-child(' + col + ')').width();
				if (colWidth > 0) {
					$('.panel_y_' + func + '_table_header>th:nth-child(' + col + ')').width(colWidth);
				}
			}
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////
	// Common Helper Function
	/////////////////////////////////////////////////////////////////////////////////////
	panel.prototype.command = function (wrapper, selector, callback) {
		wrapper.off('click', selector);
		wrapper.on('click', selector, function (event) {
			event = event || window.event;
			event.preventDefault();
			callback(this);
		});
	};
	panel.prototype.guid = function () {
		let r = function () {
			return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
		};
		return (r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r());
	}
	panel.prototype.htmlInputText = function (pclass, pname, value) {
		return yHtml([{
			element: 'input',
			type: 'text',
			class: pclass,
			name: pname,
			value: value
		}]);
	};
	panel.prototype.isParam = function (item, param) {
		var result = typeof item[param] !== 'undefined' && (item[param] === 'yes' || item[param] === true) ? true : false;
		return result;
	};
	panel.prototype.getMultiColumnField = function (object) {
		var result = [];
		var i = 0;
		for (var field in object) {
			if (object.hasOwnProperty(field)) {
				result[i] = field;
				i++;
			}
		}
		return result;
	};
	if (typeof window === 'object' && typeof window.document === 'object') {
		window.Y_Framework = panel;
		window.YPanel = panel;
	}
})(window);
