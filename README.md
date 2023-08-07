# Emot
Secure & lightweight emails breaches monitor.

## Installation
Github:
```
git clone https://github.com/cspi-git/emot
```

NpmJS:
```
npm i simple-aes-256 argparse ascii-table request-async hqc fs
```

## Usage
```
usage: index.js [-h] [-l [LIST]] [-a ADD] [-d DELETE]

optional arguments:
  -h, --help            show this help message and exit
  -l [LIST], --list [LIST]
                        List all emails.
  -a ADD, --add ADD     Add an email.
  -d DELETE, --delete DELETE
                        Delete an email.
```

## Note
Be sure to change the **serverURL** in index.js & the admin key in key.txt if necessary.

## License
MIT © CSPI