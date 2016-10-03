var generators = require('yeoman-generator'),
    _ = require('lodash');

module.exports = generators.Base.extend({
    // The name `constructor` is important here
    constructor: function() {
        // Calling the super constructor is important so our generator is correctly set up
        generators.Base.apply(this, arguments);
        this.argument('appname', { type: String, required: false, defaults : this.appname + 'App' });
    },
    prompting: {

        prompt1: function() {
            return this.prompt([{
                type: 'input',
                name: 'model',
                message: 'Quel est le nom de votre model ?'
            }, {
                type: 'input',
                name: 'folder',
                message: 'Dans quel dossier ?',
                default: 'client/app'
            }]).then(function(answers) {
                this.answers = answers;
            }.bind(this));
        }
    },

    writing: function() {
        var Model = _.upperFirst(this.answers.model);
        var options = {
            app_name: this.appname,
            model: this.answers.model,
            apiUrl: '/api/' + this.answers.model + 's',
            Model: Model,
            folder: this.answers.folder,
            app_name: this.appname
        };

        this.fs.copyTpl(
            this.templatePath('resource.js'),
            this.destinationPath(this.answers.folder + '/' + this.answers.model + '.resource.js'), options
        );
    }

});
