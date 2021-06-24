const fs = require("fs");
const path = require("path");

const content = `// GENERATED FILE, DO NOT MODIFY
const fs = require("fs");
module.exports = ({ configure }) => configure(
    ...(fs.readdirSync(__dirname)
        .filter(x => x !== "index.js")
        .filter(x => !x.endsWith(".standalone.js"))
        .filter(x => !x.endsWith(".test.js"))
        .map(x => require(\`./\${x}\`))
    )
);
`;

module.exports = (name, moduleRoot, overwrite) => {
    let currentPath = moduleRoot;

    for(const directory of name.split('/')) {
        currentPath = path.join(currentPath, directory);
        if(!fs.existsSync(currentPath))
            fs.mkdirSync(currentPath, { recursive: true });

        const indexFile = path.join(currentPath, "index.js");
        if(fs.existsSync(indexFile)) {
            const fileContent = fs.readFileSync(indexFile, 'utf-8');
            if(fileContent.trim() !== content.trim()) {
                if(overwrite > 0) 
                    fs.writeFileSync(indexFile, content);
                else {
                    console.warn(`Contents of file '${indexFile}' was modified. Module might not work.`);
                    console.warn(`To overwrite file, use --overwrite 1.`);
                }
            }
        }
        else {
            fs.writeFileSync(indexFile, content);
        }
    }
}
