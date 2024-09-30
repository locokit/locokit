# Changelog

## 0.0.17

* migrate from Histoire to Storybook
* update PrimeVue
* update palette color
* update for buttons

## 0.0.16

* fix translation issues for login component
* fix background layout issue on the height

## 0.0.15

Add vee-validate rules :
* dateValid
* reference
* snakeCase

## 0.0.14

Fix translation keys of components

## 0.0.13

Translation i18n general improvement: use of a specific `locokit` root key.

- update of `vee-validate` key translation path to to be
  compatible with new `locokit` root.
- update all translation keys with the new `locokit` root.

## 0.0.12

Shift to PrimeVue 4 Release Candidate 3 !

Removal of unstyled primevue as it's not yet implemented.

**Components**

- SignInForm
  - add `:deep` styles for password component (width and icon styling)

## 0.0.11 (unpublished)

Error when publishing

## 0.0.10

**Components**

- FormGeneric
  - better margin

## 0.0.9

**Components**

- ButtonWithStatus
  - reset the `status` data after 5sec, all the time

## 0.0.8

Remove useless files from package content

## 0.0.7

**Components**

- SignInForm
  - set the `invalid` prop of inputs with the `errorMessage` instead of using `p-invalid` class

**Layouts**

- background
  - expose it through LayoutBackground

## 0.0.6

**Components**

- ButtonWithStatus
  - add `primary` and `secondary` props to have 2 presets
  - add new stories
- SignInForm
  - set the submit button as a `primary` one

**Layouts**

- background
  - with props for displaying logo and image
  - with slot available for displaying element in the center of the layout
  - with a text displayed in the bottom-right corner
