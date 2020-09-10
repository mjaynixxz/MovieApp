const bcrypt = require('bcrypt');

async function run () {
    const salt = await bcrypt.genSalt();
    const hashed = await bcrypt.hash('123456', salt);
    console.log(hashed);
}

run();