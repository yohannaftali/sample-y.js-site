(function (window, undefined) {
    var document = window.document;
    var location = window.location;

    //----------------------------------------------------------------------------------------------------------------------
    // Dashboard
    //----------------------------------------------------------------------------------------------------------------------
    var Dashboard = function (param) {
        useParam(this, param);
        if (typeof param.dashboard !== 'undefined') {
            this.name = typeof param.name !== 'undefined' ? param.name : 'form_' + param.dashboard;
            this.query_url = typeof param.query_url !== 'undefined' ? param.query_url : 'C_dashboard_' + param.dashboard + '/';
        }
        this.modulePanel = $('#module-panel');
        this.content;
        this.containerId = 'dashboard-content-' + this.name;
        this.dashboard = '#dashboard-content-' + this.name;
        this.data = {};
        this.init();
    }
    Dashboard.prototype.init = function () {
        var that = this;
        const callbackDashboard = typeof this.callback !== 'undefined' && typeof this.callback === 'function' ? this.callback : function(){}
        var callback = function (data) {
            that.data = data;
            that.createDashboardContent()
            // that.writeTitle()
            callbackDashboard(data);
        }
        getAjax(this.query_url + 'get', '', callback);
    };
    Dashboard.prototype.createDashboardContent = function () {
        var h = yHtml({
            element: 'div', class: 'dashboard-scroll', content: yHtml(
                { element: 'div', id: this.containerId, class: 'dashboard-content', content: '' }
            )
        });
        this.modulePanel.append(h);
        this.content = $('#' + this.containerId);
    };
    Dashboard.prototype.writeTitle = function () {
        var that = this;
        var title = this.title;
        // var h = yHtml({ element: 'div', class: 'row', content: yHtml({ element: 'div', class: 'container', content: yHtml({ element: 'h5', content: that.title }) }) });
        var h = yHtml({ element: 'div' });
        this.content.append(h);
    };
    Dashboard.prototype.row = function (options) {
        return yMaterial.row(options);
    }
    Dashboard.prototype.col = function (options) {
        return yMaterial.col(options);
    }
    Dashboard.prototype.guid = function () {
        let r = function () { return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1); };
        return (r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() + r());
    }
    Dashboard.prototype.infoBox = function (options) {
        return yMaterial.infoBox(options);
    }
    Dashboard.prototype.infoBox2 = function (options) {
        return yMaterial.infoBox2(options);
    }
    Dashboard.prototype.val = function (res, name, def) {
        res = typeof (res) !== 'undefined' ? res : false;
        name = typeof (name) !== 'undefined' ? name : false;
        def = typeof (def) !== 'undefined' ? def : '';
        return typeof (res[name]) !== 'undefined' ? res[name] : def;
    }
    if (typeof window === 'object' && typeof window.document === 'object') {
        window.yDashboard = Dashboard;
    }
})(window);
