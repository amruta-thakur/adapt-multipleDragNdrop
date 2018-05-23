define(function(require) {
    var QuestionView = require('coreViews/questionView'),
        Adapt = require('coreJS/adapt'),
        SortableLib = require('components/adapt-multipleDragNdrop/js/utils/sortable');
    var SentenceOrdering = QuestionView.extend({
        events: {
            //"click .buttons-action": "onSubmit"
        },
        setupQuestion: function() {
            this.listenTo(Adapt, 'device:resize', this.resizeItems, 200);
            this.restoreUserAnswers();
            this.setupRandomisation();
        },
        setupRandomisation: function() {
            if (this.model.get('_isRandom') && !this.model.get("_isSubmitted")) {
                this.model.set("_shuffleItems", _.shuffle(this.model.get("_items")));
            } else {
                this.model.set("_shuffleItems", this.model.get("_items"));
            }
        },
        // used just like postRender is for presentational components
        onQuestionRendered: function() {
            this.model.set('_sortableItems', this.$('#sortable').html());
            this.setReadyStatus();
            if (this.model.get("_isSubmitted")) {
                this.disableQuestion();
                this.showMarking();
                this.model.set({
                    '_userAnswerListElement': this.$('#sortable').html()
                });

            }
            this.sortSentenceInitialize();
            this.setHeight();
            this.resizeItems();
        },

        sortSentenceInitialize: function(event) {
            var self = this;
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            this.$("#sortable").sortable().on('sortable:activate', function(event, ui) {
                $(ui.item).css({
                    'z-index': '1000'
                });
            }).on('sortable:deactivate', function(event, ui) {
                $(ui.item).css({
                    'z-index': '0'
                });
                self.setDefaultHeight();
            }).on('sortable:change', function(event, ui) {
                $("li.placeholder").css('height', ui.item.height() + 'px');
            });
        },
        setDefaultHeight: function() {
            //set default height
            var sentenceOrderingContainers = this.$('.questionTitle ,.sentenceSequence');
            sentenceOrderingContainers.css({
                'height': 'auto'
            });
            this.setHeight();
        },
        setHeight: function() {
            var prefix = this.$('.questionTitle'),
                sentence = this.$('.sentenceSequence'),
                prefixHeight,
                sentenceHeight;
            for (var i = 0, length = prefix.length; i < length; i++) {
                prefixHeight = prefix.eq(i).height();
                sentenceHeight = sentence.eq(i).height();
                if (!(prefixHeight === sentenceHeight)) {
                    if (prefixHeight > sentenceHeight) {
                        sentence.eq(i).css({
                            'height': prefixHeight
                        });
                    } else {
                        prefix.eq(i).css({
                            'height': sentenceHeight
                        });
                    }
                }
            }
        },
        resizeItems: function() {
            if (this.model.get("_shouldScale")) {
                var $el = this.$("#innerWrapper"),
                    elHeight = $el.outerHeight(),
                    elWidth = $el.outerWidth(),
                    $wrapper = this.$('#scaleableWrapper');

                function doResize(event, ui) {
                    var scale, heightFactor;
                    scale = Math.min(
                        ui.size.width / elWidth,
                        ui.size.height / elHeight
                    );
                    if (scale > 1) {
                        scale = 1;
                    }
                    $el.css({
                        '-ms-transform': 'scale(' + scale + ')',
                        '-moz-transform': 'scale(' + scale + ')',
                        '-webkit-transform': 'scale(' + scale + ')',
                        '-webkit-transform-style': 'preserve-3d',
                        '-webkit-transform': 'scale3d(' + scale + ',' + scale + ',' + scale + ')',
                        'transform': 'scale(' + scale + ')'
                    }).attr('zoom', scale);
                    $el.height(this.$('.sentence-container').height() * scale);
                }
                var starterData = {
                    size: {
                        width: $wrapper.width(),
                        height: $wrapper.height()
                    }
                };
                doResize(null, starterData);
            } else {
                this.setDefaultHeight();
            }
        },
        disableQuestion: function() {
            this.$("#sortable").sortable({
                disabled: true
            });
        },
        enableQuestion: function() {
            this.$("#sortable").sortable({
                disabled: false
            });
        },
        canSubmit: function() {
            return true;
        },
        onSubmitted: function() {
            var numberOfIncorrectAnswers = this.model.get('_numberOfIncorrectAnswers');
            var attemptsLeft = this.model.get('_attemptsLeft');
            if (attemptsLeft !== 0 && numberOfIncorrectAnswers > 0)
                this.$('.sentenceSequence').addClass('incorrect-resettable');
        },
        storeUserAnswer: function() {
            var listElements = this.$(".sentenceSequence"),
                userAnswer = [],
                _droppableItems = [],
                isCorrect = false;
            _.each(listElements, function(item, index) {
                userAnswer.push(parseInt(item.id));
            }, this);
            this.model.set({
                '_userAnswerListElement': listElements,
                '_userAnswer': userAnswer
            });
        },

        setScore: function() {
            var questionWeight = this.model.get("_questionWeight");
            var answeredCorrectly = this.model.get('_isCorrect');
            var score = answeredCorrectly ? questionWeight : 0;
            this.model.set('_score', score);
        },

        getUserAnswer: function() {
            var items = _.sortBy(this.model.get("_items"), 'id');
            return _.map(this.model.get('_userAnswer'), function(id, index) {
                return _.contains(items[index].position, id);
            }.bind(this));
        },
        isCorrect: function() {
            var userAnswer = this.getUserAnswer(),
                items = this.model.get("_items"),
                numberOfCorrectAnswers = 0,
                numberOfIncorrectAnswers = 0,
                isItemOnCorrectPlace = [];
            _.each(userAnswer, function(isCorrect, index) {
                if (isCorrect) {
                    numberOfCorrectAnswers++;
                    isItemOnCorrectPlace.push(true);
                } else {
                    numberOfIncorrectAnswers++;
                    isItemOnCorrectPlace.push(false);
                }
            }, this);
            this.model.set('isItemOnCorrectPlace', isItemOnCorrectPlace);
            this.model.set('_numberOfCorrectAnswers', numberOfCorrectAnswers);
            this.model.set('_numberOfIncorrectAnswers', numberOfIncorrectAnswers);
            // Check if correct answers matches correct items and there are no incorrect selections
            var answeredCorrectly = (numberOfCorrectAnswers === items.length) && (numberOfIncorrectAnswers === 0);
            return answeredCorrectly;
        },

        showCorrectAnswer: function() {
            var listElements = [],
                cloneElement = this.$("#sortable li").clone();
            cloneElement.sort(function(firstEle, secondEle) {
                return parseInt(firstEle.id) - parseInt(secondEle.id);
            }).each(function() {
                listElements.push(this)
            });
            this.$('#sortable').html(listElements);
        },

        hideCorrectAnswer: function() {
            this.$('#sortable').html(this.model.get('_userAnswerListElement'));
        },

        showMarking: function() {
            var listElements = this.getUserAnswer();
            var $state = this.$('.sentenceSequence .sentenceOrdering-item-state').removeClass('correct incorrect');
            _.each(listElements, function(item, index) {
                var $item = $state.eq(index);
                $item.addClass(item ? 'correct' : 'incorrect');
            }, this);
        },

        resetQuestion: function() {
            this.model.set('_userAnswer', []);
            this.$('#sortable').html(this.model.get('_sortableItems'));
        },

        restoreUserAnswers: function() {
            if (!this.model.get("_isSubmitted")) return;
            var userAnswer = this.model.get("_userAnswer");
            var itemArray = [];
            var items = _.sortBy(this.model.get("_items"));
            _.each(userAnswer, function(item, index) {
                itemArray.push(items[item - 1]);
            }, this);
            this.model.set("_items", itemArray);
            this.setQuestionAsSubmitted();
            this.markQuestion();
            this.setScore();
            this.setupFeedback();
        },

        /**
         * used by adapt-contrib-spoor to get the user's answers in the format required by the cmi.interactions.n.student_response data field
         * returns the user's answers as a string in the format "1,5,2"
         */
        getResponse: function() {
            return this.model.get('_userAnswer').join(',');
        },

        /**
         * used by adapt-contrib-spoor to get the type of this question in the format required by the cmi.interactions.n.type data field
         */
        getResponseType: function() {
            return "fill-in";
        }
    });
    Adapt.register("sentenceOrdering", SentenceOrdering);
    return SentenceOrdering;
});