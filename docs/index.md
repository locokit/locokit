---
title: LCK Home page
author: Mathieu DARTIGUES
description: Home page of the Low-Code Kit platform
---

# LocoKit Documentation

Welcome on the LocoKit Documentation.

LocoKit mean "Low-Code Kit". We name it also LCK.

We want to build a portal that help user build easily a database,
and an app on top of it, without coding too much. "Low code".

This portal is here to explain what is LCK platform,
and how it works under the hood.

## So, what exactly is LCK ?

**Technically**, LCK platform is a NodeJS + FeathersJS + VueJS powered platform.

**Functionnaly**, LCK platform is a web platform allowing users to :
* create database (with tables, related tables, ...), like a mini AirTable app
* grant access to this data, according users permissions (via group)
* visualize data, through a hierarchy of chapter / page / container / block, like a mini CMS
* process data, with a minimum viable orchestrator

What we hear by *"Low-Code"* is the fact that you'll need, sometimes, to write some code,
helping the platform to better understand what you exactly want / need.

For example, that will be necessary
when you'll write formulas for computed columns,
allowing you to compute data "automagically".

Or when automating some processes with the orchestrator.

## How can I get it ?

The LCK platform is compose of several packages :

* backend
  * several docker images (the API based on Feathers, the db based on PostGreSQL, ...)
* frontend
  * the generic build is archived
  * for a custom build, you'll need to enhance visuals from the build, or the theme
* client library (node + browser)
  * based on the FeathersJS client
  * includes the typings of the platform (User, Group, Permission, Workspace, ...)
  * and several methods already wired to the backend for starting more quickly
  * not available at this time

## How can I use it ?

The best way to use it, for now, is to write a `docker-compose.yml` file.

You could specify two containers, based on a `lck-backend` image for the first one,
and on a nginx image for the second one.

You'll have to put the front archive available for the nginx container.

## How can I understand how this platform work, and what can I really do with it ?

You're in the right place !

You can follow the several pages to understand how the platform is made,
and what you can do with it.

Understand : 
* storage
* visualization
* permissions
* orchestration

Use it :
* create a workspace
* create a database (tables, columns, rows)
* create groups
* create chapters / pages / containers / blocks
* affect permissions

Advanced usage
* formulas in data