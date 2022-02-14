# What is LocoKit ?

**LocoKit** is an **open source platform**
which provide **Database Management** as a spreadsheet
with an **App Builder**.

You can create your **database**
with a **spreadsheet-like UI**, that helps you define your data model,
and manage your data.

Based on your data, you can build a **dedicated app** with our **app builder**,
by assembling [blocks](concepts/block-types) (markdown, table, maps…).



We call that kind of tools **no-code** tools, or **low-code** tools.

The best example is [AirTable](https://airtable.com).
A tool that allows you to build **your** database, **your** tool.

They allow users to build app with a no-code / low-code tool.

:::warning LocoKit is still in early stages

**LocoKit** is still in its 0.x.x versions.

But, we think we have developed enough to share the code
and allow other to test it, use it, and adopt it.

We have deployed several instances of **LocoKit**
and we are learning from our customers
what is missing the most.

We know there are still issues regarding usability,
documentation or maybe performance.
We're working on that ! :muscle: 
You can help us by creating issues in our github repository.

Feel free to join us on [GitHub](https://github.com/locokit/locokit),
and add a :star: to make us happy ;-) .

Newcomers or contributors are really appreciated and welcome !
:::

## Technically, what is it ?

**Technically**, the **LocoKit** platform is a
[NodeJS](https://nodejs.org) + [FeathersJS](https://feathersjs.com) + [VueJS](https://vuejs.org) powered platform.

## Functionnaly, what is it ?

**Functionnaly**, the **LocoKit** platform is a web platform allowing users to :
* create database (with tables, related tables…), like a mini AirTable app
* grant access to this data, according users permissions (via group)
* visualize data, through a hierarchy of chapter / page / container / block, like a mini App
* process data, by trigerring webhooks

For now, LocoKit generate a meta model of your data,
and store all your data in a single table in the database, with `jsonb` fields.
We use a PostGreSQL database under the hood, with PostGIS enabled for geometry fields.


## LocoKit means... ?

**LocoKit** mean **Low-code Kit**.
Sometimes we name it **LCK**.

We want to create a tool
simple enough for "non IT" users,
allowing them managing their data and their app.
Without too much headaches. We hope.

This tool is *"Low-Code"* because you may have
to write some code (like formulas, advanced settings…),
or configure some parts of it (like webhook triggers)
helping the platform to better understand what you exactly want/need.

## Motivation, why we built LocoKit ?

The **LocoKit**'s adventure started in 2020.

At this time, we searched an **open source** tool
to build a information system for a customer.

We used **SeaTable**, but we understood lately
that **SeaTable** won't be really open sourced.

We had to find another solution.
After some searches, we didn't find a solution
able to manage a user-friendly spreadsheet, permissions at row levels,
malleable data and to use different interfaces to visualize data (Dataviz).

We decided to build it, make it reusable through other projects,
and finally free the code if it was ok for us.
That was the beginning of this adventure.

Our customer needed to be as autonomous as it could be,
and as our company name is **Autonomens**, that was making sense, wasn't it ?

