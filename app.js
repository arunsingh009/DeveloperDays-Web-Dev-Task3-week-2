require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.DB);

const itemSchema = {
    name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Add your First Item",
});

const d = [item1];

app.get("/", function(req, res) {
    Item.find({}, function(err, f) {
        if (f.length === 0) {
            Item.insertMany(d, function(er) {
                if (er) {
                    console.log(er);
                } else {
                    console.log("Added Add your First Item");
                }
            });
            res.redirect("/");
        } else {
            res.render("list", { newListItems: f });
        }
    });
});

app.post("/add", function(req, res) {
    const itemName = req.body.n;
    const item = new Item({
        name: itemName,
    });
    item.save();
    res.redirect("/");
});

app.post("/delete", function(req, res) {
    const check = req.body.checkbox;
    Item.findByIdAndRemove(check, function(err) {
        if (!err) {
            console.log("Successfully deleted");
            res.redirect("/");
        }
    });
});

app.post("/deleteAll", function(req, res) {
    Item.deleteMany({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Deleted all");
        }
    });
    res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function() {
    console.log("Server has started successfully");
});