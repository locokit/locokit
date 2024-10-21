# Field types

## Conversion DB > LocoKit

DB Types are converted in LocoKit field types.

Main purpose : display and input

Some types are converted in a FIELD_TYPE.NATIVE
to explain we need to let the end user the choice.

Example given, if a pg_type is a `text[]`, 
we don't know if the `text` is a set of vocabulary term,
or free text.

The end user could decide, after, that it will become a `MULTI_SELECT`, 
by setting all the available choices.

At the display, we'll need to accept "other" values,
by representing them without formatting.

## Conversion LocoKit > JSON

## Conversion LocoKit > DB