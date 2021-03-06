/*
 * adapt-multipleDragNDrop
 * License - http://github.com/amruta-thakur
 * Maintainers - Chetan Hajare(chetan.hajare@exultcorp.com), Amruta Thakur(amruta.thakur@newgen-ent.com),Nayan Khedkar(nayan.khedkar@newgen-ent.com),Sarveshwar Gavhane(sarveshwar.gavhane@newgen-ent.com)
 */

define([
        'coreJS/adapt',
        'coreViews/questionView',
        'components/adapt-multipleDragNdrop/js/fillInTheBlank',
        'components/adapt-multipleDragNdrop/js/textPictureMatching',
        'components/adapt-multipleDragNdrop/js/sentenceOrdering',
        'components/adapt-multipleDragNdrop/js/wordSentenceOrdering'
    ], function(Adapt, QuestionView, Fib, Tpm, So, Wso) {

        var dndObject;
        var MultipleDragNdrop = QuestionView.extend({

            // should be used instead of preRender
            setupQuestion: function() {
                var dragAndDropType = this.model.get('_dragAndDropType');

                switch (dragAndDropType) {
                    case "fillInTheBlank":
                        if (!Adapt.componentStore.fillInTheBlank) throw "Fib not included in build";
                        var FillInTheBlank = Adapt.componentStore.fillInTheBlank;
                        var tempModel = this.model;
                        tempModel.set('_component', 'fillInTheBlank');
                        dndObject = new FillInTheBlank({
                            model: tempModel
                        });
                        break;
                    case "textPictureMatching":
                        if (!Adapt.componentStore.textPictureMatching) throw "TextPictureMatching not included in build";
                        var TextPictureMatching = Adapt.componentStore.textPictureMatching;
                        var tempModel = this.model;
                        tempModel.set('_component', 'textPictureMatching');
                        dndObject = new TextPictureMatching({
                            model: tempModel
                        });
                        break;
                    case "sentenceOrdering":
                        if (!Adapt.componentStore.sentenceOrdering) throw "SentenceOrdering not included in build";
                        var SentenceOrdering = Adapt.componentStore.sentenceOrdering;
                        var tempModel = this.model;
                        tempModel.set('_component', 'sentenceOrdering');
                        dndObject = new SentenceOrdering({
                            model: tempModel
                        });
                        break;
                    case "wordSentenceOrdering":
                        if (!Adapt.componentStore.wordSentenceOrdering) throw "WordSentenceOrdering not included in build";
                        var WordSentenceOrdering = Adapt.componentStore.wordSentenceOrdering;
                        var tempModel = this.model;
                        tempModel.set('_component', 'wordSentenceOrdering');
                        dndObject = new WordSentenceOrdering({
                            model: tempModel
                        });
                        break;
                    default:
                        alert("Please enter valid drag and drop type");
                }
                var $container = $(".component-container", $("." + this.model.get("_parentId")));
                $container.append(dndObject.$el);
                Adapt.trigger('device:resize');
                _.defer(_.bind(function() {
                    this.remove();
                }, this));
            }
        });

        Adapt.register("multipleDragNdrop", MultipleDragNdrop);

        return MultipleDragNdrop;

    });