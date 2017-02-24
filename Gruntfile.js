'use strict';

module.exports = function(grunt){

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {'dist/js/ng-only-intl-phone.js': ['src/ng-only-intl-phone.js']},
                options: {
                    browserifyOptions: {bundleExternal: false, standalone: 'ngIntlPhone'}
                }
            }
        },
        karma: {
            options: {configFile: 'test/karma.conf.js'},
            unit: {
                browsers: ['PhantomJS']
            },
            e2e: {
                browsers: ['Chrome']
            }
        },
        // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
        git_changelog: {
            default: {
                options: {
                    file: 'Changelog.md',
                    grep_commits: '^fix|^feat|^docs|^style|^refactor|^chore|^test|BREAKING',
                    repo_url: 'https://github.com/neonexus/ng-only-intl-phone',
                    branch_name: 'master'
                }
            }
        }
        // jscs: enable
    });

    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('git-changelog');
};
