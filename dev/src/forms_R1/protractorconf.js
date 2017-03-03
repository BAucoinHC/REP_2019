// An example configuration file.
exports.config = {
    seleniumAddress: 'http://127.0.0.1:4444/wd/hub',

    specs: [

        'app/spec/e2e/tests/company/*.js',
      /*  'app/spec/e2e/tests/activity/!*.js',
      *  'app/spec/e2e/tests/dossier/*.js',
      * */
    ],

    multiCapabilities: [
        {
            'browserName': 'chrome',
            'platform': 'ANY',
            'version': 'ANY',
            'chromeOptions': {
                // Get rid of --ignore-certificate yellow warning
                args: ['--no-sandbox', '--test-type=browser'],
                // Set download path and avoid prompting for download even though
                // this is already the default on Chrome but for completeness
                prefs: {
                    'download': {
                        'prompt_for_download': false,
                        'default_directory': '/e2e/downloads/'
                    }
                }
            }
        }
    ],
    rootElement: '#app-root',

    plugins: [{


        chromeA11YDevTools: {
            treatWarningsAsFailures: true,
            auditConfiguration: {
                auditRulesToRun: [
                    'pageWithoutTitle',
                    'controlsWithoutLabel',
                    'requiredAriaAttributeMissing',
                    'unfocusableElementsWithOnClick',
                    'mainRoleOnInappropriateElement',
                    'badAriaRole'
                    /*'lowContrastElements'*/
                    /*  'badAriaAttributeValue', outer hmyml error*/
                    /* 'nonExistentAriaLabelledbyElement' test causes collectIDRefs Errors*/
                  /*  'focusableElementNotVisibleAndNotAriaHidden' get outerHtml error*/
                ],
                auditRulesToSkip: []
            }
        },
        axe: true,
        package: 'protractor-accessibility-plugin'
    }],


    jasmineDefaultOpts: {
        defaultTimeoutInterval: 120000
    }



//addressData:require('./app/spec/e2e/test-data/address.json')

};