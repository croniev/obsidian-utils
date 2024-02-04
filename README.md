# obsidian-utils
This is a more or less specifically tailored plugin for functions that I find to be useful in obsidian. There are multiple functionalities:  
- **Parse Dates**
- **Number References**

## Parse Dates
This command helps create inline metadata containing the dates put into a `<span>` element of the darakah/obsidian-timelines plugin.
Not sure why anyone else would have use for this.

### Usage
When you have an object like `<span class='ob-timelines' data-date='xxxx-01-01-00' data-end='xxxx-01-01-00' data-type='range' data-class='geschi1'></span>` execute the command.
This will add two metadata lines in between `>` and `</span>`, the sort of `Start:: xxxx` and `Ende:: xxxx`.
#### Variations
If the data class starts with `person` the added lines will say `Geburtsdatum:: ` and `Tod:: `.
If the data class starts with `geschi` or is `periode` the lines will say `Start:: ` and `Ende:: `.
Only the year will be added after the `:: `.
All of this can be changed and extended very easily.  

### Display
In order to also see the content of the span block (i.e. the added lines) you need to enable this function by adding
```
.ob-timelines {
  display: inline-block !important;
}
```
to the `obsidian.css` file in the snippets folder. 

## Number References
This family of commands helps to keep track of a number and quickly insert, increment and decrement it.  
You can set the formatting for how the number should be added.  
### Usage / Commands
- Set Number: Input a number to activate the number tracker or something else (or nothing) to deactivate it.  
- Increase / Decrease Number: Makes the number go up / down by certain amount.
- Add Number Reference: Insert the number with formatting at the cursor position.
