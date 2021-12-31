# Formula

Formula columns can be used to automatically compute a value based on some constants
and on the values of other fields of the record.

Here is a description of how to use them in your application.

## Basis

A formula may consist of the following elements:

### Strings

A string must be enclosed in double quotes:

```
"My first formula"
```

### Numbers

Integers and floats are allowed. Note that the decimal separator is the dot:

```
-10.2
```

### Field names

Only fields of the current table are allowed.

The field name must be wrapped in curly braces and must be prefixed by `COLUMN.`

For instance:
```
COLUMN.{Name}
```

Not all the fields types can't be used in a formula.

For now, the following types are supported:
- Boolean
- Integer
- Float
- Single line text
- Long text
- Date
- Date and time
- Single select
- User (the user name)
- User group (the group name)
- URL
- Link to another table

You can also reference a *Lookedup field* if the type of the related field is specified in the previous list.

### Functions

A function performs an operation and always returns a single value.
It can also accept parameters which can be either a string, a number, a field reference or another function.

Functions are divided into four main categories:
- DATE
- LOGIC
- NUMERIC
- TEXT

The name of a function must be prefixed by its category, the two being separated by a dot. Then, if there are any, the parameters must be specified between brackets and separated by commas.

For instance:
```
TEXT.CONCAT("TASK: | COLUMN.{Name})
```

The previous formula contains the `CONCAT` function of the `TEXT` category and takes two parameters. The first one is a constant string whereas the second one references the `Name` field (string field). 

To help you write your formulas, autocompletion is provided, listing the different functions with their associated documentation. Moreover, the purpose, the parameters and the return type of each function will be described in the next section.


## Function documentation

### Date functions

| Function      | Description
| :---        |    :----   |
| DATEADD | DATEADD(date: date, number: int, unit: string) → date |
|       | Returns the date corresponding to the date a specified number of units ('year', 'month', 'day', 'hour', 'minute' or 'second') before or after the original one. |
| DAY   | DAY(date: date) → number | 
|    | Returns a number corresponding to the day in the month of the specified date. | 
| DAYS |  DAYS(date1: date, date2: date) → number |
|   |  Returns the number of days between two dates. |
| EARLIER |  EARLIER(date1: date, date2: date): Boolean |
|   |  Returns true is the first date is earlier than the second one, else returns false. |
| EQUAL |  Returns true if the dates are equal, else returns false. |
|   |  Returns true if the dates are equal, else returns false. |
| EOMONTH |  EOMONTH(date: date, count: number) → date |
|   |  Returns the date of the last day of the month a specified number of months before or after the original date. |
| HOUR |  HOUR(date: date) → number |
|   |  Returns a number corresponding to the hour of the specified date. |
| LATER |  ISAFTER(date1: date, date2: date): Boolean |
|   |  Returns true is the first date is later than the second one, else returns false. |
| MINUTE |  MINUTE(date: date) → number |
|   |  Returns a number corresponding to the minutes of the specified date. |
| MONTH |  MONTH(date: date) → number |
|  |  Returns a number corresponding to the month of the specified date. |
| MONTHS |  MONTHS(date1: date, date2: date) → number |
|  |  Returns the number of months between two dates. |
| SECOND |  SECOND(date: date) → number |
|  |  Returns a number corresponding to the seconds of the specified date. |
| WEEKDAY |  WEEKDAY(date: date, [start: number]) → number |
|  |  Returns a number corresponding to the day in the week of the specified date. |
| WEEKNUM |  WEEKNUM(date: date, [start: number]) → number |
|  |  Returns a number corresponding to the week number in the year of the specified date. |
| YEAR |  YEAR(date: date) → number |
|  |  Returns a number corresponding to the year of the specified date. |
| YEARS |  YEARS(date1: date, date2: date) → number |
|  |  Returns the number of years between two dates. |

### Logic functions

| Function      | Description
| :---        |    :----   |
| AND | AND(condition1: Boolean, [condition2: Boolean, …]) → Boolean |
|  | Returns true if all conditions are true, else returns false. |
| FALSE | FALSE() → Boolean |
|  | Returns the false logical value. |
| IF | IF(condition: Boolean, result1: any, result2: any) |
|  | Returns the first result if the condition is true, else the second one. |
| IFS | IFS(condition1: Boolean, result1: any, [condition2: Boolean, result2: any, ...]) |
|  | Returns the result associated to the first true condition. |
| NOT | NOT(condition: Boolean) → Boolean |
|  | Returns false if the condition is true, else returns true. |
| OR | OR(condition1: Boolean, [condition2: Boolean, …]) → Boolean |
|  | Returns true if at least one parameter is true, else returns false. |
| SWITCH | SWITCH(comparativeValue: any, case1: any, value1: Boolean, [case2: any, value2: Boolean, …, default: any]) |
|  | Returns the result associated to the first case which is equal to the comparative value, or returns the default result. |
| TRUE | TRUE() → Boolean |
|  | Returns the true logical value. |

### Numeric functions

| Function      | Description
| :---        |    :----   |
| ABS | ABS(n: number) → number |
|  | Returns the absolute value of the specified number. |
| AVERAGE | AVERAGE(nb1: number, [nb2: number, …]) → number |
|  | Returns the average of the specified numbers. |
| CEILING | CEILING(n: number) → number |
|  | Rounds up a number to the nearest integer if it is a float number, else returns the specified number if it is an integer. |
| DIVIDE | DIVIDE(n1: number, [n2: number, …]) → number |
|  | Returns the result of the division of the specified numbers. |
| E | E() → number |
|  | Returns the Euler number. |
| EQUAL | EQUAL(n1: number, n2: number, [..]) → Boolean |
|  | Returns true if the specified numbers are equal, else returns false. |
| FLOOR | FLOOR(n: number) → number |
|  | Rounds down a number to the nearest integer if it is a float number, else returns the specified number if it is an integer. |
| GREATER | GREATER(n1: number, n2: number, […]) → Boolean |
|  | Returns true if the first number is greater than the second one, else returns false. |
| GREATEREQ | GREATEREQ(n1: number, n2: number, […]) → Boolean |
|  | Returns true if the first number is greater than the second one or if the two numbers are equal, else returns false. |
| INT | INT(n: number) → number |
|  | Rounds the specified number to the nearest integer. |
| LESS | LESS(n1: number, n2: number, […]) → Boolean |
|  | Returns true if the first number is lower than the second one, else returns false. |
| LESSEQ | LESSEQ(n1: number, n2: number, […]) → Boolean |
|  | Returns true if the first number is lower than the second one or if the two numbers are equal, else returns false. |
| LOG | LOG(n: number, base: number) → number |
|  | Returns the result of the logarithm function applied to the number with the specified base. |
| MAX | MAX(nb1: number, [nb2: number...]) → number |
|  | Returns the largest number among the specified ones. |
| MIN | MIN(nb1: number, [nb2: number, …]) → number |
|  | Returns the smallest number among the specified ones. |
| MOD | MOD(n: number, divisor: number) → number |
|  | Returns the remainder from the division of two numbers. |
| PI | PI() → number |
|  | Returns the PI number. |
| PRODUCT | PRODUCT(n1: number, [n2: number, …]) → number |
|  | Returns the result of the product of numbers. |
| ROUND | ROUND(n: number, digits: number) → number |
|  | Rounds a number to a specified number of digits. |
| SIGN | SIGN(n: number) → number |
|  | Returns -1 if the specified number is negative, 0 if it is a zero number and 1 if it is positive. |
| SQRT | SQRT(n: number) → number |
|  | Returns the square root of the specified number. |
| SUBTRACT | SUBTRACT(n1: number, [n2: number, …]) → number |
|  | Returns the result of the subtraction of the specified numbers. |
| SUM | SUM(n1: number, [n2: number, …]) → number |
|  | Returns the result of the sum of the specified numbers. |
| UNEQUAL | UNEQUAL(n1: number, n2: number, […]) → Boolean |
|  | Returns true if the specified numbers aren't equal, else returns false. |

### Text functions

| Function      | Description
| :---        |    :----   |
| CONCAT | CONCAT(str1: string, [str2: string, …]) → string |
|  | Returns the concatenation of the specified texts. |
| EXACT | EXACT(str1: string, [str2: string, …]) → Boolean |
|  | Returns true if the specified texts are equal, else returns false. |
| FIND | FIND(searchedString: string, searchAreaString: string, [startPos: number]) → number |
|  | Returns the position of the first occurrence of the searched text inside the other text, or 0 if the searched text is not included in the other one. |
| LEFT | LEFT(str: string, count: number) → string |
|  | Returns the first characters of the text. |
| LEN | LEN(str: string) → number |
|  | Returns the length of the text. |
| LOWER | LOWER(str: string) → string |
|  | Returns a lowercase copy of the text |
| MID | MID(str: string, startPos: number, count: number) → string |
|  | Returns a specific number of characters from a given position of the specified text. |
| REPLACE | REPLACE(originalString: string, startPos: number, count: number, pattern: string) → string |
|  | Returns a copy of the original text in which a specific number of characters are replaced by a pattern from a given position. |
| REPT | REPT(str: string, n: number) → string |
|  | Returns a text containing a specific number of times the original text. |
| RIGHT | RIGHT(str: string, count number) → string |
|  | Returns the last characters of the text. |
| SUBSTITUTE | SUBSTITUTE(searchedString: string, originalString: string, newString: string, [occurrenceIndex: number]) →  string |
|  | Returns a copy of the original text in which a pattern is replaced by a newer one. |
| TEXTJOIN | TEXTJOIN(separator: string, str1: string, [str2: string, …]) → string |
|  | Returns the concatenation of the specified texts, separated by a given separator. |
| TRIM | TRIM(str: string) → string |
|  | Returns a copy of the original text without any spaces at the starting and the ending. |
| UPPER | UPPER(str: string) → string |
|  | Returns an uppercase copy of the text. |
