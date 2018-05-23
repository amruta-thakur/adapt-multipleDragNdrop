define(function(require) {
    var Utils = require('components/adapt-multipleDragNdrop/js/utils/utils');
    var QuestionView = require('coreViews/questionView');
    var Adapt = require('coreJS/adapt');
    var FillInTheBlank = Utils.extend({
        
        // should be used instead of preRender
        setupQuestion: function() {
            var items = this.model.get("_items");
            var droppables,draggables;
            //this.listenTo(Adapt, 'device:changed', this.deviceHasChanged, this);
            this.setupRandomisationForDraggables();
            _.each(items, function(item,index){
                droppables = item.suffix;
                draggables = item.dragItems;
                this.model.set("_droppableItems",droppables);
                this.model.set("_draggableItems",draggables);
            },this);

            if(this.model.get("_shouldScale")) {
                this.listenTo(Adapt, 'device:resize', this.resizeItems, 200);
            }
            Utils.prototype.setupQuestionItemIndexes.apply(this,arguments);
            Utils.prototype.restoreUserAnswers.apply(this,arguments);
        },

        setupRandomisationForDraggables:function(){
            var items = this.model.get("_items");
            if (this.model.get('_isRandom') && this.model.get('_isEnabled')) {
                 _.each(items, function(item,index){
                    item.dragItems = _.shuffle(item.dragItems);
                 });
            }
        },

        getDropedItemIdForCoordinate: function(top, left) {
            var defaultWidth = this.model.get('_defaultWidth');
            var defaultHeight = this.model.get('_defaultHeight');
            var droppedItemId;

            _.each(this.$('.droppable-item'), function(item, index) {
                var $item =$(item);
                var itemTop = $item.offset().top;
                var itemLeft = $item.offset().left;
                var itemBottom = itemTop + defaultHeight;
                var itemRight = itemLeft + defaultWidth;

                if ((top > itemTop && top < itemBottom) && (left > itemLeft && left < itemRight)) {
                    droppedItemId = $item.attr('data-id');
                }
            });
            return droppedItemId;
        },

        putDraggableItem: function(currentDragedItemId, droppableItemId) {
            if (!this.model.get('_isEnabled') || !currentDragedItemId || !droppableItemId) {
                return false;
            }
            var $currentDropContainer = this.$('[data-id=' + droppableItemId + ']');
            var $currentDragedItem = this.$('[data-id=' + currentDragedItemId + ']');
            var $currentDragedItemContainer = $currentDragedItem.parent('div');

            if($currentDragedItemContainer.length != 1){
                $currentDragedItemContainer = $currentDragedItem.closest('div');
            }
            var $existingDragItem = $currentDropContainer.find('.draggable-item');
            var existingDragItemId = $existingDragItem.attr('data-id');

            if (currentDragedItemId == existingDragItemId) return;

            var currentDropIndex = $currentDropContainer.attr('index');
            var currentDragIndex = $currentDragedItemContainer.attr('index');
            var droppableItems = this.model.get('_droppableItems');

            if ($existingDragItem.length > 0) {
                if ($currentDragedItemContainer.hasClass('draggable-item-wrapper')) {
                    $currentDragedItemContainer.append($existingDragItem);
                    delete droppableItems[currentDropIndex]['_selectedItemId'];
                } else if ($currentDragedItemContainer.hasClass('droppable-item')) {
                    $currentDragedItemContainer.append($existingDragItem);
                    droppableItems[currentDragIndex]._selectedItemId = existingDragItemId;
                }
            } else if ($currentDragedItemContainer.hasClass('droppable-item')) {
                $currentDragedItemContainer.append(droppableItems[currentDragIndex].body);
                delete droppableItems[currentDragIndex]['_selectedItemId'];
            }
            $currentDropContainer.prepend($currentDragedItem);
            droppableItems[currentDropIndex]._selectedItemId = currentDragedItemId;
            $currentDropContainer.siblings('.fillInTheBlank-textbox-alignment').css('top', '0px');
        },

        setdroppableItems: function(droppableContainerIndex, draggableItemId) {
            var $droppableItemContainer = this.$('.droppable-item').eq(droppableContainerIndex);
            var $draggableItem = this.$('.draggable-item[data-id=' + draggableItemId + ']');
            var $existingDragItem = $droppableItemContainer.find('.draggable-item');
            if ($existingDragItem.length > 0) {
                $draggableItem.parent('div').append($existingDragItem);
            }
            $droppableItemContainer.prepend($draggableItem);
        },

        resizeItems: function() {
            //var totalItems = this.model.get('_draggableItems').length;
            var draggableItemWidth = this.$('.fillInTheBlank-item-container.droppable-item-container').width();
            var draggableItemHeight = this.$('.fillInTheBlank-draggable-item.draggable-item').height();
            var droppableItemHeight = this.$('.fillInTheBlank-container.droppable-container').height();
            var width = this.$('.'+this.model.get('_dragAndDropType')+'-inner').width();
            var scale = width /(draggableItemWidth+20);
            //var scale = 0.8;
            console.log(draggableItemWidth,width+3,scale);
            if(scale > 1) {
                scale = 1;
            }
            var $dragContainers = this.$('.draggable-container, .droppable-container');
            $dragContainers.css({
                '-ms-transform': 'scale(' + scale + ')',
                '-moz-transform': 'scale(' + scale + ')',
                '-webkit-transform': 'scale(' + scale + ') !important',
                '-webkit-transform-style': 'preserve-3d',
                '-webkit-transform': 'scale3d(' + scale + ',' + scale + ',' + scale + ')',
                'transform': 'scale(' + scale + ')',
                '-ms-transform-origin': '0 0',
                '-moz-transform-origin': '0 0',
                '-webkit-transform-origin': '0 0',
                'transform-origin': '0 0'
            });
            this.$('.fillInTheBlank-container.draggable-container').height((draggableItemHeight * scale)*2);
            this.$('.fillInTheBlank-container.droppable-container').height((droppableItemHeight * scale));
            this.$('.'+this.model.get('_dragAndDropType')+'-widget').width(draggableItemWidth);
            this.scale = scale;
        },
        
        showMarking: function() {
            _.each(this.model.get('_droppableItems'), function(item, i) {
                var $item = this.$('.droppable-item').eq(i);
                $item.addClass(item._isCorrect ? '1 correct' : '2 incorrect');
            }, this);
        },

        deviceHasChanged:function(){
            var suffix,$prefix;
            if (Adapt.device.screenSize == 'small') {
                _.each(this.model.get('_items'),function(item){
                    suffix = item.suffix;
                    _.each(suffix,function(s){
                        //console.log(s.id);
                        console.log(this.$("#"+s.id));
                        this.$("#"+s.id).after('<br>');
                        //$prefix.prepend('<br>');
                        //console.log(this.$("#"+s.id));
                    },this);

                },this);
            }
        }
    });
   
    Adapt.register("fillInTheBlank", FillInTheBlank);
    return FillInTheBlank;
});
