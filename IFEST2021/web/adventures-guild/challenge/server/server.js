const express = require("express");
const path = require('path');
const cookieParser = require('cookie-parser');
const rateLimit = require("express-rate-limit");
const Database = require('./database');
const puppeteer = require('puppeteer');
const uuid = require('uuid');

const db = new Database('../guild.db');

const browser_options = {
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-background-networking',
        '--disable-default-apps',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-sync',
        '--disable-translate',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-first-run',
        '--safebrowsing-disable-auto-update'
    ]
};


const PORT = process.env.PORT || 1337;

const lim = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 25,
    message: "There's too much commisions!, Katheryne is too tired!. Try again after 5 minutes!",
});

const app = express();
app.use(express.json({
    type: ["application/json", "application/csp-report"]
}));

app.use(cookieParser());

app.get('/', async (req, res) => {
    var cookie = req.cookies.FLAG;
    if (cookie === undefined) {            
        res.cookie('FLAG', "IFEST2021{FAKE_FLAG}", { maxAge: 900000, httpOnly: true });
        console.log('cookie created successfully');
    }
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/open-commission', async (req, res) => {
    var { id, subject, content } = req.body;
    id = id || uuid.v4();
    if (typeof req.body !== "object") return res.status(400).send("Something went wrong!");
    try {
        await db.addCommission({$id: id, $subject: subject, $content: content, $cspViolations: 0, $completed: 0});
        res.status(200);
        res.json({id: id});
    } catch (e) {
        console.log(e)
        res.status(500);
        res.json({error: 1});        
    }
});

app.get('/commission/:id', async (req, res) => {        
    try {
        await db.getCommissionID(req.params.id)
            .then(comm => {
                if (comm) {                    
                    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${comm.subject || "Untitled"}</title></head><body>${comm.content || ""}</body></html>`;
                    res.set("Content-Security-Policy", `child-src 'none'; font-src 'none'; frame-src 'none'; img-src 'none'; manifest-src 'none'; media-src 'none'; object-src 'none'; prefetch-src 'none'; script-src 'report-sample'; style-src 'report-sample'; worker-src 'none'; report-uri /report-csp?id=${req.params.id}`);
                    res.type("html");
                    res.send(html);
                }else{
                    res.status(404);
                    res.json({error: true})
                }
            }).catch((e) => {
                console.log(e)
                res.status(500);
				res.json({error: true});
			});        
    } catch (e) {
        res.status(500);
        res.json({error: true});
    }
});

app.post('/submit-commission', lim, async (req, res) => {
    try {
        if (typeof req.body !== "object" || typeof req.body.id !== "string") return res.status(400).send("Something went wrong!");
        const FLAG = process.env.FLAG || "";
        const browser = await puppeteer.launch(browser_options);
        const context = await (await browser).createIncognitoBrowserContext();
        const page = await context.newPage();
        await page.setCookie({
            name: "flag",
            value: FLAG,
            domain: "localhost"
        });
        await page.goto(`http://localhost:${PORT}/commission/` + encodeURIComponent(req.body.id), {waitUntil: "networkidle0", timeout: 3000});
        await page.close();
        await context.close();
        
        await db.updateComission({$cspViolations: 0, $completed: 1});

        res.json({completed: true});
    } catch (e) {
        console.log(e)
        res.status(500);
        res.json({ error: true });        
    }
});

app.post('/report-csp', async (req, res) => {
    try {
        if (!req.query || typeof req.query.id !== "string") return res.status(400).send("something went wrong");
        if (typeof req.body !== "object" || typeof req.body["csp-report"] !== "object") return res.status(400).send("something went wrong");
        await db.updateComission({$cspViolations: 1, $completed: 1, $id: req.query.id});  
        res.json({completed: true});
    } catch (e) {
        console.log(e)
        res.status(500);
        res.json({ error: true });        
    }
});

(async () => {
    await db.connect();    
    await db.migrate();
    app.use(express.static(path.join(__dirname, '../public')));
    app.listen(PORT, err => {
        if (err) {
          console.error(err);
        }{
          console.log(`App listen to port: ${PORT}`);
        }
    });    
})();
