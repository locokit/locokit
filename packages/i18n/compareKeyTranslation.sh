#!/bin/bash

fileTranslationFR="./fr.json"
fileTranslationEN="./en.json"

# For each file we retrieve all keys (nested included) then all key is flatten
getAllNestedKeyFlatten="[leaf_paths as \$path | {\"key\": \$path | join(\".\"), \"value\": getpath(\$path)}] | from_entries | keys_unsorted"

keysFR=$(jq "$getAllNestedKeyFlatten" $fileTranslationFR)
lengthKeysFR=$(jq "$keysFR | length" $fileTranslationFR)
echo "For file ${fileTranslationFR}: Total = ${lengthKeysFR}"

keysEN=$(jq "$getAllNestedKeyFlatten" $fileTranslationEN)
lengthKeysEN=$(jq "$keysEN | length" $fileTranslationEN)
echo "For file ${fileTranslationEN}: Total = ${lengthKeysEN}"

# Compare file
echo
if [[ lengthKeysFR -ne lengthKeysEN ]]; then
  echo "Diff between file"
  diff --color -s <(jq "$getAllNestedKeyFlatten" $fileTranslationFR) <(jq "$getAllNestedKeyFlatten" $fileTranslationEN)
else
  echo "No missing translations"
fi
