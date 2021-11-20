const fs = require("fs");
const svgToMiniDataURI = require('mini-svg-data-uri');

const folderPath = 'icons-svg/'; //Does not work with sub directories

var filesNamesOriginal = [],
    filesNamesFilter = [],
    filesNamesWithoutExtension = [],
    filesContents = [];


async function defaultTask() {

    codeSvgs();
    createIconSheet();

    return true;
}

function codeSvgs() {

    filesNamesOriginal = fs.readdirSync(folderPath);

    //Filter only .svg files
    for (let index = 0; index < filesNamesOriginal.length; index++) {

        const element = filesNamesOriginal[index];

        if (element.search(".svg") >= 0) {
            filesNamesFilter.push(element);
        }

    }

    for (let index = 0; index < filesNamesFilter.length; index++) {
        const element = filesNamesFilter[index];

        //Remove file extension
        filesNamesWithoutExtension[index] = element.replace('.svg', '');

        //Read file content
        filesContents[index] = fs.readFileSync(folderPath + '/' + element, {
            encoding: 'utf-8'
        });

        //Code to use it correctly in css
        /* Automatically changes the icons from white to black. That serves to later use a class with filters, in case it is necessary to change the color */
        filesContents[index] = svgToMiniDataURI(filesContents[index]).replace("fill='white'", "fill='black'");
    }

}

function createIconSheet() {

    //Open :root
    let content = `:root {\n`;

    //Generate variables CSS
    for (let index = 0; index < filesNamesWithoutExtension.length; index++) {

        const element = filesNamesWithoutExtension[index];
        const contentSVG = filesContents[index];
        content = content + `\t--${element}: url("${contentSVG}");\n`;

    }

    //Close :root
    content = content + '}';

    //Base style for icon
    content = content + `
.icon {
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    width: 22px;
    height: 22px;
    display: inline-block;
    transition: .3s all;
}\n`;

    //Generate icons class
    for (let index = 0; index < filesNamesWithoutExtension.length; index++) {
        const element = filesNamesWithoutExtension[index];

        content = content + `.${element}{ background-image: var(--${element}) };\n`;
    }

    fs.writeFileSync('icons-sheets.css', content);
    // console.log(content);
}

exports.default = defaultTask