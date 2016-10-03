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
            }, {
                type: 'input',
                name: 'service',
                message: 'Quel est le nom du service associé à ce model ? (exemple nom_du_modelService)'
            }, {
                type: 'input',
                name: 'create_title',
                message: 'Nom du formulaire d\'ajout d\'un nouvel élément ? (Exemple : Nouveau nom_du_model)'
            }, {
                type: 'input',
                name: 'list_title',
                message: 'Nom de la liste d\'éléments ? (Exemple : Liste des nom_du_model)'
            }, {
                type: 'confirm',
                name: 'addFormInput',
                message: 'Voulez-vous définir les champs du formulaire d\'ajout ?'
            }]).then(function(answers) {
                this.answers = answers;
            }.bind(this));
        },
        promptCreateForm: function() {
            this.createFormInputs = [];
            var that = this;
            var done = this.async();
            var promtFormElt = function(cb) {
                that.prompt([{
                    type: 'input',
                    name: 'attribute',
                    message: 'Nom de l\'attribut du model ?'
                }, {
                    type: 'input',
                    name: 'label',
                    message: 'Nom du label de l\'input ?'
                }, {
                    type: 'confirm',
                    name: 'required',
                    message: 'Le champs est-t-il required ?'
                }, {
                    type: 'list',
                    name: 'type',
                    message: 'Type d\'input ?',
                    choices: [{
                        name: 'Text',
                        value: 'text'
                    }, {
                        name: 'Number',
                        value: 'select'
                    }, {
                        name: 'Email',
                        value: 'email'
                    }, {
                        name: 'Tel',
                        value: 'tel'
                    }, {
                        name: 'Checkbox',
                        value: 'checkbox'
                    }]
                }, {
                    type: 'confirm',
                    name: 'continueInputForm',
                    message: 'Voulez-vous définir un nouveau champs du formulaire d\'ajout ?'
                }]).then(cb);
            }

            var handleResult = function(answers) {
                that.createFormInputs.push({
                    attribute: answers.attribute,
                    label: answers.label,
                    required: answers.required,
                    type: answers.type
                });

                if (answers.continueInputForm) {
                    promtFormElt(handleResult);
                } else {
                    done();
                }
            }

            promtFormElt(handleResult);
        },
        /* Ask if user want to define edit form inputs */
        promptEditForm: function() {
            return this.prompt([{
                type: 'confirm',
                name: 'defineEditFormInputs',
                message: 'Voulez-vous définir les champs du formulaire d\'édition ?'
            }]).then(function(answers) {
                this.defineEditFormInputs = answers.defineEditFormInputs;
            }.bind(this));
        },
        /* Define edit form inputs */
        promptEditFormInputs: function() {
            this.editFormInputs = [];
            var that = this;
            var done = this.async();
            if (this.defineEditFormInputs) {

                var promtFormElt = function(cb) {
                    that.prompt([{
                        type: 'input',
                        name: 'attribute',
                        message: 'Nom de l\'attribut du model ?'
                    }, {
                        type: 'input',
                        name: 'label',
                        message: 'Nom du label de l\'input ?'
                    }, {
                        type: 'confirm',
                        name: 'required',
                        message: 'Le champs est-t-il required ?'
                    }, {
                        type: 'list',
                        name: 'type',
                        message: 'Type d\'input ?',
                        choices: [{
                            name: 'Text',
                            value: 'text'
                        }, {
                            name: 'Number',
                            value: 'select'
                        }, {
                            name: 'Email',
                            value: 'email'
                        }, {
                            name: 'Tel',
                            value: 'tel'
                        }, {
                            name: 'Checkbox',
                            value: 'checkbox'
                        }, {
                            name: 'Password',
                            value: 'password'
                        }]
                    }, {
                        type: 'confirm',
                        name: 'continueInputForm',
                        message: 'Voulez-vous définir un nouveau champs du formulaire d\'édition ?'
                    }]).then(cb);
                }

                var handleResult = function(answers) {
                    that.editFormInputs.push({
                        attribute: answers.attribute,
                        label: answers.label,
                        required: answers.required,
                        type: answers.type
                    });

                    if (answers.continueInputForm) {
                        promtFormElt(handleResult);
                    } else {
                        done();
                    }
                }

                promtFormElt(handleResult);
            } else {
                done();
            }
        }
    },

    writing: function() {
        var Model = _.upperFirst(this.answers.model);
        var options = {
            app_name: this.appname,
            model: this.answers.model,
            Model: Model,
            folder: this.answers.folder,
            list: this.answers.model + 'List',
            create_title: this.answers.create_title,
            list_title: this.answers.list_title,
            controllerName: 'Create' + Model + 'Controller',
            selectedName: 'selected' + Model,
            addMethod: 'add' + Model,
            deleteMethod: 'delete' + Model,
            serviceName: this.answers.service,
            createFormInputs: this.createFormInputs,
            editFormInputs: this.editFormInputs
        };

        this.fs.copyTpl(
            this.templatePath('list.html'),
            this.destinationPath(this.answers.folder + '/' + this.answers.model + '.html'), options
        );
        this.fs.copyTpl(
            this.templatePath('create.html'),
            this.destinationPath(this.answers.folder + '/' + this.answers.model + '.create.html'), options
        );
        this.fs.copyTpl(
            this.templatePath('controller.js'),
            this.destinationPath(this.answers.folder + '/' + this.answers.model + '.controller.js'), options
        );
    }

});
