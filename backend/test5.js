const sequelize = require("./config/sequelize.js");
async function run() {
    const res = await sequelize.query(`SELECT column_name, data_type, numeric_precision, numeric_scale, is_nullable, column_default FROM information_schema.columns WHERE table_name = 'Food'`);
    console.log(res[0].filter(c => c.column_name === 'Price' || c.column_name === 'DiscountPrice'));
    process.exit(0);
}
run();