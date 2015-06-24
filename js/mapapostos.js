/**
 * Created by vitorarins on 22/06/15.
 */
$(function(){
    var Posto = Backbone.Model.extend({
        urlRoot: 'http://localhost:8080/CadastroPostos-war/webresources/cadastro/postos/',
        idAttribute: 'idPosto'
    });

    var PostoCollection = Backbone.Collection.extend({
        model: Posto,
        url: 'http://localhost:8080/CadastroPostos-war/webresources/cadastro/postos/'
    })

    var Postos = new PostoCollection;

    var PostoView = Backbone.View.extend({

        tagName: "div",

        template: _.template($('#posto-template').html()),

        initialize: function() {
            this.listenTo(this.model, 'change', this.render());
            this.listenTo(this.model, 'destroy', this.remove);
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    var map_canvas = document.getElementById('map_canvas');

    var map_options = {
        center: new google.maps.LatLng(-27.6002733,-48.5179394),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map(map_canvas, map_options);

    google.maps.event.addListenerOnce(map, 'idle', function() {
        google.maps.event.trigger(map, 'resize');
    });

    var AppView = Backbone.View.extend({

        el: $("#postosapp"),

        initialize: function() {

            this.listenTo(Postos, 'add', this.addOne);
            this.listenTo(Postos, 'reset', this.addAll);
            this.listenTo(Postos, 'all', this.render);

            this.main = $('#main');

            Postos.fetch();
        },

        render: function() {

            if (Postos.length) {
                this.main.show();
            } else {
                this.main.hide();
            }
        },

        addOne: function(posto) {
            var view = new PostoView({model: posto});

            var latLng = new google.maps.LatLng(posto.get('latitude'), posto.get('longitude'));

            var infoWindow = new google.maps.InfoWindow({content: view.render().el});

            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: 'icons/map_icon.png',
                infowindow: infoWindow,
                title: posto.get('nome')
            });

            google.maps.event.addListener(marker, 'click', function() {
                this.infowindow.open(map,this);
            });
        },

        addAll: function() {
            Postos.each(this.addOne, this);
        }
    });

    var App = new AppView();
    App.addAll();
});