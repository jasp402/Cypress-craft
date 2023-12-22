const report    = require('multiple-cucumber-html-reporter');
const fs        = require('fs');
const path      = require('path');

function generateReport(options) {
    return new Promise((resolve, reject) => {
        try {
            report.generate(options);
            resolve('Report generated');
        } catch (error) {
            reject(error);
        }
    });
}

async function main() {
    try {
        const result = await generateReport({
            jsonDir   : './cypress/logs/',
            reportPath: './cypress/reports/',
            useCDN    : true,
            displayDuration:true,
            displayReportTime:true,
            plainDescription:true,
            metadata  : {
                browser : {
                    name   : 'chrome',
                    version: '60',
                },
                device  : 'Local test machine',
                platform: {
                    name   : 'ubuntu',
                    version: '16.04',
                },
            },
            customData: {
                title: 'Run info',
                data: [
                    {label: 'Project', value: `<strong>${process.env.JOB_NAME}</strong>`},
                    {
                        label: 'Cycle',
                        value: `<a href="https://jenkins-qa.culqi.xyz/job/${process.env.JOB_NAME}/${process.env.CYPRESS_BUILD_ID}">#${process.env.CYPRESS_BUILD_ID}</a>`
                    },
                    {
                        label: 'Execution Start Time',
                        value: new Date(metadata['STAR_TIME']).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                    },
                    {
                        label: 'Execution End Time',
                        value: new Date(metadata['END_TIME']).toISOString().replace(/T/, ' ').replace(/\..+/, ''),
                    },
                    {   label: 'Duration',
                        value: metadata['DURATION']
                    },
                ],
            },
        });

        console.log(result); // Report generated

        if (result === 'Report generated') {
            await screenshotPage();
        }
    } catch (error) {
        console.error('Error generating report:', error);
    }
}

main();
