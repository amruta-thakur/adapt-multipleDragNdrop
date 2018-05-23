# adapt-multipleDragNdrop
A basic drag and drop question component.
    1. wordSentenceOrdering
    2. fillInTheBlanks
    3. textPictureMatching
    4. sentenceOrdering

[Visit the **multipleDragNdrop** wiki](https://github.com/yny-edtech/adapt-multipleDragNdrop) for more information about its functionality and for explanations of key properties.

## Installation

* If **multipleDragNdrop** has been uninstalled from the Adapt framework, it may be reinstalled.
With the [Adapt CLI](https://github.com/adaptlearning/adapt-cli) installed, run the following from the command line:
    `adapt install adapt-multipleDragNdrop`

    Alternatively, this component can also be installed by adding the following line of code to the *adapt.json* file:  
        `"adapt-multipleDragNdrop": "*"`  
    Then running the command:  
        `adapt install`  
    (This second method will reinstall all plug-ins listed in *adapt.json*.)  

## Usage

This component can be used as part of an assessment.

## Settings overview

A complete example of this components settings can be found in the [example.json](https://github.com/yny-edtech/adapt-multipleDragNdrop/blob/master/example.json) file. A description of the core settings can be found at: [Core model attributes](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes)

### Attributes

Further settings for this component are:

**_component** (string): This value must be: multipleDragNdrop.

**_classes** (string): CSS class name to be applied to multipleDragNdrop's containing div. The class must be predefined in one of the Less files. Separate multiple classes with a space.

**_layout** (string): This defines the horizontal position of the component in the block. Acceptable values are full, left or right.

**instruction** (string): This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.

**_attempts** (integer): This specifies the number of times a learner is allowed to submit an answer. The default is 1.

**_shouldDisplayAttempts** (boolean): Determines whether or not the text set in remainingAttemptText and remainingAttemptsText will be displayed. These two attributes are part of the core buttons attribute group. The default is false.

**_isRandom** (boolean): Setting this value to true will cause the _items to appear in a random order each time the component is loaded. The default is false.

**_questionWeight** (number): A number which reflects the significance of the question in relation to the other questions in the course. This number is used in calculations of the final score reported to the LMS.

**_itemWeight** (number): A number which reflects the significance of the word/item question in relation to the other questions in the course. This number is used in calculations of the final score reported to the LMS.

**_canShowModelAnswer** (boolean): Setting this to false prevents the _showCorrectAnswer button from being displayed. The default is true.

**_canShowMarking** (boolean): Setting this to false prevents ticks and crosses being displayed on question completion. The default is true.

**_recordInteraction** (boolean) Determines whether or not the learner's answers will be recorded to the LMS via cmi.interactions. Default is true. For further information, see the entry for _shouldRecordInteractions in the README for adapt-contrib-spoor.

**_defaultWidth** (number): Default width of an item.

**_defaultHeight** (number): Default height of an item.

**_shouldScale** (boolean): Select 'true' to scale container based on number of draggable items it contains.

**_dragAndDropType** (string) :select the dragAndDropType from the following, please select the type as it is from the below list,

1. wordSentenceOrdering
2. fillInTheBlanks
3. textPictureMatching
4. sentenceOrdering

#wordSentenceOrdering

**_sentence** (string): sentence that will be divided into the words and the words need to be dragged into the correct order to form a correct sentence.

#fillInTheBlanks

**_items** (object): This element of the settings contains the  items.

>**prefix** (object): These are the prefix of fill in the blanks for every new sentence.

>**suffix** (object): These are the suffix of fill in the blanks for every new sentence which include both prefix and suffix.

>>**p** (string): These are the prefix of single sentence.

>>**id** (string): These are the id of drop area or blanks.

>>**s** (string): These are the prefix of single sentence.

>>**correctItemId** (string): These are the id of correct drag id.

>**dragItems** (object): These are the drag items.

>>**id** (string): These are the id of drag items.

>>**text** (string): These are the text of drag items.

#textPictureMatching

**_columns** (number): number of draggable or droppable items to be shown in a row.

**_defaultImageHeight** (number): Default image height.

**_defaultTextHeight** (number): Default text height.

**_draggableItems** (object): This element of the settings contains the draggable items.

>**id** (string): Draggable Item Id naming convention (ex. drag-01).

>**body** (string): Draggable item body text.

**_droppableItems** (object): This element of the settings contains the droppable items.

>**id** (string): Droppable Item Id naming convention (ex. drop-01).

>**body** (string): Droppable item body text.

>**correctItemId** (string): This should match up with the correct Draggable item to go in the drop area (ex. enter 'drag-01' if correct).

>**_graphic** (object): An optional image which is displayed to the item body. It contains values for **src** and **alt**.

>>**src** (string): File name (including path) of the image. Path should be relative to the *src* folder (e.g., *course/en/images/c-45-1.jpg*).

>>**alt** (string): This text becomes the image’s `alt` attribute.

#sentenceOrdering

**_items** (object): This element of the settings contains the  items.

>**id** (string): Sortable Item Id naming convention.

>**questionSentence** (object): This object of the settings contains the prefix(Question text) to sentence.

>>**title** (string): question text(prefix) for sentence ordering.

>**answerSentence** (object): This object of the settings contains the text to sentence.

>>**name** (string): sentence text for sentence ordering.

>**position** (array): Correct position(place) of sentence eg([1]) or multiple correct position of sentence ex([1,5]).

**_feedback** (object): If the Tutor extension is enabled, these various texts will be displayed depending on the submitted answer. _feedback contains values for three types of answers: correct, _incorrect, and _partlyCorrect. Some attributes are optional. If they are not supplied, the default that is noted below will be used.

**correct** (string): Text that will be displayed when the submitted answer is correct.

**_incorrect** (object): Texts that will be displayed when the submitted answer is incorrect. It contains values that are displayed under differing conditions: final and notFinal.

**final** (string): Text that will be displayed when the submitted answer is incorrect and no more attempts are permitted.

**notFinal** (string): Text that will be displayed when the submitted answer is incorrect while more attempts are permitted. This is optional—if you do not supply it, the _incorrect.final feedback will be shown instead.
_partlyCorrect (object): Texts that will be displayed when the submitted answer is partially correct. It contains values that are displayed under differing conditions: final and notFinal.

**final** (string): Text that will be displayed when the submitted answer is partly correct and no more attempts are permitted. This is optional—if you do not supply it, the _incorrect.final feedback will be shown instead.

**notFinal** (string): Text that will be displayed when the submitted answer is partly correct while more attempts are permitted. This is optional—if you do not supply it, the _incorrect.notFinal feedback will be shown instead.

## Limitations

To be completed

##Browser spec

This component has been tested to the standard Adapt browser specification.
