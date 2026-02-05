const db = require("../src/config/db");
const fs = require("fs");

async function findFKs() {
    console.log("🔍 Searching for Foreign Keys involved in ID columns...");
    const sql = `
        SELECT 
            TABLE_NAME, 
            COLUMN_NAME, 
            CONSTRAINT_NAME, 
            REFERENCED_TABLE_NAME, 
            REFERENCED_COLUMN_NAME
        FROM 
            INFORMATION_SCHEMA.KEY_COLUMN_USAGE
        WHERE 
            REFERENCED_TABLE_SCHEMA = 'ltht_thucphamsach' 
            AND REFERENCED_TABLE_NAME IS NOT NULL
    `;

    try {
        const [rows] = await db.promise().query(sql);
        let output = "📋 Found Foreign Keys:\n";
        rows.forEach(r => {
            output += `- ${r.TABLE_NAME}.${r.COLUMN_NAME} REFERENCES ${r.REFERENCED_TABLE_NAME}.${r.REFERENCED_COLUMN_NAME} (Constraint: ${r.CONSTRAINT_NAME})\n`;
        });
        fs.writeFileSync("fk_list.txt", output);
        console.log("✅ Full list saved to fk_list.txt");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
findFKs();
