import { render } from "ejs";
import express from "express";
import mongoose, { Schema } from "mongoose";
import _ from 'lodash';
import bodyParser from "body-parser";
import nodeNotifier from "node-notifier";
import session from 'express-session';

const app = express();
const port = 2000;

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/CriminalRecord").then(() => console.log("connected to todoDB database"));

const userSchema = {
    name: String,
    email: String,
    password: String,
    gender: String,
    age: Number
};

const User = mongoose.model("Clients", userSchema);

app.get("/", (req, res) => {
    res.render("home.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.get("/login-page", (req, res) => {
    res.render("login.ejs");
});

app.get("/aboutUs", (req, res) => {
    res.render("about.ejs");
});

app.get("/efile", (req, res) => {
    res.render("efile.ejs");
});

app.post("/register", (req,res) => {
    const user_name = _.upperCase(req.body.input_name);
    const user_email = req.body.input_email;
    const user_password = req.body.input_password;
    const user_gender = req.body.input_gender;
    const user_age = req.body.input_age;

    const user = new User({
        name: user_name,
        email: user_email,
        password: user_password,
        gender: user_gender,
        age: user_age
    });

    User.find({email: user_email}).then(result => {
        if(result.length === 0){
            if(user_name.length!=0 && user_email.length!=0 && user_password.length!=0)
            user.save().then(() => {
                nodeNotifier.notify('registration successful!');
                res.redirect("/");
            })
            else{
                nodeNotifier.notify('fill all the options!');
                res.redirect("/register");
            }
        } else {
            nodeNotifier.notify('already registerd!');
            res.redirect("/");
        }
    });
});



app.get("/login", (req, res) => {
    const login_mail = req.query.loginId;
    const login_pass = req.query.loginPassword;

    User.findOne({ email: login_mail, password: login_pass })
        .then(user => {
            if (user) {
                req.session.userLoggedIn = true;
                Case.find({ email: user.email })
                    .then(caseDetails => {
                        if (caseDetails.length > 0) {
                            req.session.user = { email: user.email, name: user.name, age: user.age };
                            req.session.cases = caseDetails;
                            res.redirect('/dashboard');
                        } else {
                            nodeNotifier.notify('No case filed yet!');
                            res.redirect('/');
                        }
                    })
                    .catch(error => {
                        console.error("Error finding case details:", error);
                        res.status(500).send("Internal Server Error");
                    });
            } else {
                nodeNotifier.notify('Invalid credentials!');
                res.redirect('/');
            }
        })
        .catch(error => {
            console.error("Error finding user:", error);
            res.status(500).send("Internal Server Error");
        });
});


app.get("/dashboard", (req, res) => {
    const user = req.session.user;
    const cases = req.session.cases;

    if (user && cases) {
        res.render('dashboard', { email: user.email, name: user.name, age: user.age, cases: cases });
    } else {
        res.status(400).send('You have files 0 cases');
    }
});


app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            res.status(500).send("Internal Server Error");
        } else {
            nodeNotifier.notify('Logged Out!');
            res.redirect('/');
        }
    });
});


app.delete('/deleteCase/:index', async (req, res) => {
    const { index } = req.params;

    try {
        await Case.findOneAndRemove({ index: parseInt(index) });
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

const caseSchema = new mongoose.Schema({
    case_number: Number,
    name: String,
    email: String,
    subject: String,
    age: Number,
    description: String
});

const Case = mongoose.model("Case", caseSchema);

let lastCaseNumber = 100;

Case.findOne({}, {}, { sort: { 'case_number': -1 } }, function(err, lastCase) {
    if (lastCase) {
        lastCaseNumber = lastCase.case_number;
    }
});


app.post("/filecase", (req, res) => {
    if (!req.session.user || !req.session.user.email) {
        nodeNotifier.notify('User is not logged In!');
        res.redirect('/login-page');
    }

    const userEmail = req.session.user.email;
    const userName = req.session.user.name;
    const userAge = req.session.user.age;

    const clientName = _.upperCase(req.body.name_);
    const clientEmail = userEmail;

    const clientSubject = req.body.subject_;
    const clientAge = userAge;
    const clientDescription = req.body.description_;

    lastCaseNumber++;

    const client = new Case({
        case_number: lastCaseNumber,
        name: userName,
        email: clientEmail,
        subject: clientSubject,
        age: userAge,
        description: clientDescription
    });

    client.save().then(() => {
        nodeNotifier.notify('Case filed!');
        res.redirect("/dashboard");
    }).catch(error => {
        console.error("Error filing case:", error);
        res.status(500).send("Internal Server Error");
    });
});



app.get('/search', async (req, res) => {
    const caseNumber = req.query.caseNumber;

    try {
        const foundCase = await Case.findOne({ case_number: caseNumber });

        if (foundCase) {
            res.send(`
            <style>
                .case-details {
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
                    margin: 20px auto;
                    max-width: 600px;
                }

                .case-details h2 {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 15px;
                }

                .case-details p {
                    font-size: 16px;
                    margin-bottom: 10px;
                }

                .case-details strong {
                    font-weight: bold;
                }
            </style>
            <div class="case-details">
                <h2>Case Details</h2>
                <p><strong>Case Number:</strong> ${foundCase.case_number}</p>
                <p><strong>Name:</strong> ${foundCase.name}</p>
                <p><strong>Email:</strong> ${foundCase.email}</p>
                <p><strong>Subject:</strong> ${foundCase.subject}</p>
                <p><strong>Age:</strong> ${foundCase.age}</p>
                <p><strong>Description:</strong> ${foundCase.description}</p>
            </div>
        `);
        } else {
            res.send('Case not found');
        }
    } catch (err) {
        console.error('Error searching case:', err);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
