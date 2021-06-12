const File = require('./models/file');
const fs = require('fs');
const connectDb = require('./config/db')
connectDb();

async function fetchData() {
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const files = File.find({ createdAt: { $lt : pastDate }});
    if(files.length) {
        for(const file of files) {
            try {
                fs.unlinkSync(file.path);
                await file.remove();
                console.log(`successfully deleted ${file.fileName}`);
            } catch(err) {
                console.log(`Error while deleting file ${err}`);
            }
        }
    }
    console.log('Job done!');
}

fetchData().then(() => {
    process.exit();
});