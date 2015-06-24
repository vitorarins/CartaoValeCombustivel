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
            this.$("#postos-list").append(view.render().el);
        },

        addAll: function() {
            Postos.each(this.addOne, this);
        }
    });

    var App = new AppView();
    App.addAll();
});