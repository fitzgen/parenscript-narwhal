ParenScript for Narwhal
=======================

ParenScript is a small Lispy language that compiles to JavaScript. It tries to
be as one-to-one with JS as possible and preserves variable names and whitespace
when compiling so that debugging is easier. This is the integration of
ParenScript module for Narwhal which provides a REPL for Parenscript and some
simple helpers like "compileFile".

As of commit d9860869e014ae85e2ac0833268d38b6ee584f4a it assumes both that the
Common Lisp implementation you are using is SBCL and that you already have
ParenScript installed and require-able. There are also still issues with
requiring the module, but the REPL works like a charm.

Installation
============

This is for installing on Ubuntu (and probably other Debian systems). If you can
tell me the equivalent steps for other distros and OS's, feel free to tell me.

Install SBCL:

    sudo apt-get install sbcl
    touch ~/.sbclrc

Add this to your .sbclrc file:

    (require :asdf)

Open SBCL and install ParenScript:

    sbcl

    * (require :asdf-install)
    T
    * (asdf-install:install :parenscript)

Answer the questions ASDF-INSTALL will ask you about where to install, etc...

Go to the path that contains your Narwhal packages and add ParenScript:

    cd path/to/your/narwhal/packages
    git clone git://github.com/fitzgen/parenscript-narwhal.git parenscript

Restart bash:

    exec bash

Open up the ParenScript REPL:

    pscript

You should see a shell something like this:

    ps> (print "Hello World")
    ...
    ...
    Hello World

    ps> 

Congratulations!