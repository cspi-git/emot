(async()=>{
    "use strict";

    // Dependencies
    const simpleAES256 = require("simple-aes-256")
    const { ArgumentParser } = require("argparse")
    const asciiTable = require("ascii-table")
    const request = require("request-async")
    const hqc = require("hqc")
    const fs = require("fs")

    // Variables
    const emot = {
        serverURL: "http://localhost:8080/"
    }
    
    const adminKey = fs.readFileSync("./key.txt", "utf8")
    const parser = new ArgumentParser()
    var args;
    
    // Startup
    var serverPK = await request(`${emot.serverURL}pk`)
    serverPK = Uint8Array.from(JSON.parse(serverPK.body).data.split(",").map(x=>parseInt(x,10)))
    
    const { cyphertext, secret } = await hqc.encrypt(serverPK)

    // Main
    parser.add_argument("-l", "--list", { help: "List all emails.", nargs: "?", const: 1 })
    parser.add_argument("-a", "--add", { help: "Add an email." })
    parser.add_argument("-d", "--delete", { help: "Delete an email." })
    
    args = parser.parse_args()
    
    if(args.list){
        const table = new asciiTable()
        var response = await request.post(`${emot.serverURL}list`, {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ cyphertext: cyphertext.toString(), data: simpleAES256.encrypt(secret, JSON.stringify({ adminKey: adminKey })).toString("hex") })
        })
    
        response = JSON.parse(response.body)
        response.data = JSON.parse(simpleAES256.decrypt(secret, Buffer.from(response.data, "hex")).toString())

        if(!response.data.length) return console.log("No emails found.")
        table.setHeading("Index", "Email", "Breaches Found", "Created Date")

        for( const email in response.data ) table.addRow(email, response.data[email].email, response.data[email].breaches.length, response.data[email].createdDate)
    
        console.log(table.render())
    }else if(args.add){
        var response = await request.post(`${emot.serverURL}add`, {
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ cyphertext: cyphertext.toString(), data: simpleAES256.encrypt(secret, JSON.stringify({ adminKey: adminKey, email: args.add })).toString("hex") })
        })

        response = JSON.parse(response.body)
        response.data ? console.log("Email successfully added.") : console.log("Email already exists/Invalid email.")
    }else if(args.delete){
        var response = await request(`${emot.serverURL}delete`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({ cyphertext: cyphertext.toString(), data: simpleAES256.encrypt(secret, JSON.stringify({ adminKey: adminKey, email: args.delete })).toString("hex") })
        })

        response = JSON.parse(response.body)
        response.data ?console.log("Email successfully deleted.") : console.log("Email does not exists/Invalid email.")
    }else{
        console.log("Please use at least 1 argument.")
    }
})()