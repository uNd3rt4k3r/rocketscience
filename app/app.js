(function() {
    var AppComponent = ng
        .Component({
            selector: 'my-app',
            templateUrl: 'views/main.html'
        })
        .Class({
            constructor: function () { }
        });


    document.addEventListener('DOMContentLoaded', function() {
        ng.bootstrap(AppComponent);
    });
})();
