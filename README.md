ITMap : maps for your IT servers and applications
=================================================

This repo is in early **beta**, which means stuff may break and it's not ready for production regarding stability and security concernes.

This project aims at building maps for each application I host at work so that I can visualize informations and dependencies easily.


Installation
------------

For now, this repo is not a JS lib but more a demo application. You don't have anything special to do, just clone the repo and serve the "public/" directory if you're not planning to use it on your local machine.

Development Environment
-----------------------

For now I use CoffeeScript with the NodeJS runtime on my development machine. As I'm not a JS guru, I'll provide installation steps only for this platform, on Ubuntu 11.04.

    sudo apt-get update
    sudo apt-get install git curl build-essential openssl libssl-dev
    git clone https://github.com/joyent/node.git && cd node
    ./configure && make && sudo make install
    curl http://npmjs.org/install.sh | sudo sh
    sudo npm install -g coffee-script


References
----------

* http://www.khelll.com/blog/coffeescript/installing-coffeescript-on-ubuntu/
* http://peepcode.com/products/coffeescript
