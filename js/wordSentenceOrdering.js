define([
    'coreJS/adapt',
    'coreViews/questionView',
    'components/adapt-multipleDragNdrop/js/utils/utils'
], function(Adapt, QuestionView, Utils) {
    var WordSentenceOrdering = Utils.extend({

        // should be used instead of preRender
        setupQuestion: function() {

            this.model.set('_draggableItems', []);
            this.splitSentence();
            var droppableitems = [];

            for (var i = 0, j = this.model.get('_draggableItems').length; i < j; i++) {
                droppableitems.push({
                    'id': i,
                    'body': i + 1,
                    'correctItemId': 'drag-' + i
                });
            }
            if (this.model.get('_droppableItems') == undefined)
                this.model.set('_droppableItems', droppableitems);
            Utils.prototype.setupQuestion.apply(this, arguments);
        },

        splitSentence: function() {
            var draggableItems = [];
            var sentence = this.model.get('_sentence');
            var words = sentence.split(" ");
            words = this.isEmptyElement(words);

            for (var i = 0, j = words.length; i < j; i++) {
                draggableItems.push({
                    'id': 'drag-' + i,
                    'body': words[i]
                })
            }
            this.model.set('_draggableItems', draggableItems);
        },

        isEmptyElement: function(words) {
            var wordsAfterSpliting = [];

            for (var i = 0, j = words.length; i < j; i++) {
                words[i] === "" ? console.log("element is empty") : wordsAfterSpliting.push(words[i]);
            }
            return wordsAfterSpliting;
        },

        setupRandomisation: function() {
            if (this.model.get('_isRandom') && this.model.get('_isEnabled')) {
                this.model.set('_draggableItems', _.shuffle(this.model.get('_draggableItems')));
            }
        },

        showMarking: function() {
            _.each(this.model.get('_droppableItems'), function(item, i) {

                var $item = this.$('.droppable-item-container').eq(i);
                $item.addClass(item._isCorrect ? 'correct' : 'incorrect');

            }, this);
        },

        onSubmitted: function() {
            var numberOfIncorrectAnswers = this.model.get('_numberOfIncorrectAnswers');
            var attemptsLeft = this.model.get('_attemptsLeft');
            if (attemptsLeft !== 0 && numberOfIncorrectAnswers > 0) {
                this.$('.droppable-item-container').addClass('incorrect-resettable');
                this.$('.droppable-item-container').find('.wordSentenceOrdering-item').css('background-color', '#727272');
            }
        },

    });

    Adapt.register("wordSentenceOrdering", WordSentenceOrdering);
    return WordSentenceOrdering;
});