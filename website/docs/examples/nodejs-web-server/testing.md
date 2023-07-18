---
sidebar_position: 3
title: Adding Testing
sidebar_class_name: sidebar_doc_incomplete
---

# Testing our App

One primary advantage of using TypeDI, and Dependency Injection
in general, is it greatly improves your ability to test individual
components in isolation, by providing them with different values and
implementations than would normally be present in your app.

For instance, consider the implementation of the HTTP server in
the previous example.  In testing, we may not want it to *actually*
create a HTTP server, though we *would* want it to ensure it creates
a HTTP server successfully.

:::note

For the examples below, we'll be making use of [Jest](https://jestjs.io/).
Tests are written in an easy-to-follow format.
:::



