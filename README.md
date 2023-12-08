# obsidian-timelines-parse-dates
This is a very specifically tailored plugin for obsidian that helps create inline metadata containing the dates put into a `<span>` element of the darakah/obsidian-timelines plugin.
Not sure why anyone else would have use for this.
Command: Parse Dates

## Usage
When you have an object like `<span class='ob-timelines' data-date='xxxx-01-01-00' data-end='xxxx-01-01-00' data-type='range' data-class='geschi1'></span>` execute the command.
This will add two metadata lines in between `>` and `</span>`, the sort of `Start:: xxxx` and `Ende:: xxxx`.
### Variations
If the data class starts with `person` the added lines will say `Geburtsdatum:: ` and `Tod:: `.
If the data class starts with `geschi` or is `periode` the lines will say `Start:: ` and `Ende:: `.
Only the year will be added after the `:: `.
All of this can be changed and extended very easily.  

## Important
In order to also see the content of the span block (i.e. the added lines) you need to enable this function by adding
```
.ob-timelines {
  display: inline-block !important;
}
```
to the `obsidian.css` file in the snippets folder. 
