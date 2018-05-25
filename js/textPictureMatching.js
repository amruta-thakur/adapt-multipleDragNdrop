define([
    'coreJS/adapt',
    'coreViews/questionView',
    'components/adapt-multipleDragNdrop/js/utils/utils'
], function(Adapt, QuestionView, Utils) {
    var TextPictureMatching = Utils.extend({

        getDropedItemIdForCoordinate: function(top, left) {
            var defaultWidth = this.model.get('_currentWidth');
            var defaultHeight = this.model.get('_defaultHeight');
            var droppedItemId;

            _.each(this.$('.droppable-item-area '), function(item, index) {
                var $item = $(item);
                var itemTop = $item.parent().offset().top;
                var itemLeft = $item.offset().left;
                var itemBottom = itemTop + defaultHeight + defaultHeight;
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
            var $currentDragedItemContainer = $currentDragedItem.closest('div');
            var $existingDragItem = $currentDropContainer.find('.draggable-item');
            var existingDragItemId = $existingDragItem.attr('data-id');

            if (currentDragedItemId == existingDragItemId) return;

            var currentDropIndex = $currentDropContainer.attr('index');
            var currentDragIndex = $currentDragedItemContainer.attr('index');
            var droppableItems = this.model.get('_droppableItems');

            if ($existingDragItem.length > 0) {
                if ($currentDragedItemContainer.hasClass('draggable-item-wrapper')) {
                    $currentDragedItemContainer.html($existingDragItem);
                    delete droppableItems[currentDropIndex]['_selectedItemId'];
                } else if ($currentDragedItemContainer.hasClass('droppable-item-area')) {
                    $currentDragedItemContainer.html($existingDragItem);
                    droppableItems[currentDragIndex]._selectedItemId = existingDragItemId;
                }
            } else if ($currentDragedItemContainer.hasClass('droppable-item-area')) {
                $currentDragedItemContainer.html(droppableItems[currentDragIndex].body);
                delete droppableItems[currentDragIndex]['_selectedItemId'];
            }

            $currentDropContainer.html($currentDragedItem);
            droppableItems[currentDropIndex]._selectedItemId = currentDragedItemId;
        },
        showMarking: function() {
            _.each(this.model.get('_droppableItems'), function(item, i) {

                var $item = this.$('.droppable-item').eq(i);
                $item.addClass(item._isCorrect ? 'correct' : 'incorrect');

            }, this);
        },
        setdroppableItems: function(droppableContainerIndex, draggableItemId) {
            var $droppableItemContainer = this.$('.droppable-item-area').eq(droppableContainerIndex);
            var $draggableItem = this.$('.draggable-item[data-id=' + draggableItemId + ']');

            var $existingDragItem = $droppableItemContainer.find('.draggable-item');
            if ($existingDragItem.length > 0) {
                $draggableItem.closest('div').html($existingDragItem);
            }

            $droppableItemContainer.html($draggableItem);
        },

        resizeItems: function() {
            if (this.model.get("_shouldScale")) {
                var totalItems = this.model.get('_draggableItems').length;
                var draggableItemWidth = this.$('.droppable-item-container').outerWidth(true);
                var draggableItemHeight = this.$('.droppable-item-container').height();
                var width = this.$('.' + this.model.get('_dragAndDropType') + '-inner').width() / totalItems;
                var scale = width / draggableItemWidth;
                if (scale > 1) {
                    scale = 1;
                }

                var $dragContainers = this.$('.draggables-container, .droppables-container');
                $dragContainers.css({
                    '-ms-transform': 'scale(' + scale + ')',
                    '-moz-transform': 'scale(' + scale + ')',
                    '-webkit-transform': 'scale(' + scale + ')',
                    '-webkit-transform-style': 'preserve-3d',
                    '-webkit-transform': 'scale3d(' + scale + ',' + scale + ',' + scale + ')',
                    'transform': 'scale(' + scale + ')'
                });
                if (this.model.get('_isVertical'))
                    this.$('.textPictureMatching-widget').height($dragContainers.height() * scale);
                else
                    $dragContainers.height(draggableItemHeight * scale);
                this.$('.' + this.model.get('_dragAndDropType') + '-widget').width(draggableItemWidth * totalItems);
                this.scale = scale;
            }
        }
    });
    Adapt.register("textPictureMatching", TextPictureMatching);
    return TextPictureMatching;
});